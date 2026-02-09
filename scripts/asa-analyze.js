#!/usr/bin/env node

/**
 * Apple Search Ads Analysis
 * Parses CSV export and generates performance insights
 */

const fs = require('fs');
const path = require('path');

// Parse the raw CSV data
const csvData = `"Start Date: 02 Feb 2026"
"End Date: 08 Feb 2026"
Currency: AUD
Time Zone: UTC
""

Campaign ID,Campaign Name,Start Date,End Date,Days Left in Campaign,Status,App Name,Country or Region,Ad Placement,Lifetime Budget,Daily Budget,Spend,Avg CPA (Total),Average CPT,Avg CPM,Avg Daily Spend,Impressions,Taps,Installs (Total),TTR,CR (Total),CR (Tap-Through),New Downloads (Total),Redownloads (Total),Installs (View-Through),Installs (Tap-Through),Avg CPA (Tap-Through),New Downloads (View-Through),Redownloads (View-Through),New Downloads (Tap-Through),Redownloads (Tap-Through),Pre-Orders Placed (Tap-Through),Pre-Orders Placed (View-Through),Pre-Orders Placed (Total)
"2143373069","AU - CourtLab - Launch Blitz","05 Feb 2026","N/A","","RUNNING","CourtLab Basketball Trainer","Australia","App Store Search Results","","1000.00","20.65","0.00","6.88","62.38","","331","3","0","0.0091","0.0","0.0","0","0","0","0","0.00","0","0","0","0","0","0","0"
"2143376794","Global - CourtLab - Launch Blitz","06 Feb 2026","N/A","","RUNNING","CourtLab Basketball Trainer","Canada, United Kingdom, New Zealand, United States","App Store Search Results","","1000.00","46.25","15.42","4.20","321.18","","144","11","3","0.0764","0.2727","0.2727","3","0","0","3","15.42","0","0","3","0","0","0","0"
"","","N/A","N/A","","","","N/A","N/A","","","66.90","22.30","4.78","140.84","","475","14","3","0.0295","0.2143","0.2143","3","0","0","3","22.30","0","0","3","0","0","0","0"`;

function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim());
  
  // Extract metadata
  const metadata = {
    startDate: lines[0].match(/"(.+?)"/)?.[1] || null,
    endDate: lines[1].match(/"(.+?)"/)?.[1] || null,
    currency: lines[2].match(/: (.+)/)?.[1] || 'AUD',
    timezone: lines[3].match(/: (.+)/)?.[1] || 'UTC',
  };
  
  // Find header row
  let headerIdx = lines.findIndex(l => l.includes('Campaign ID'));
  if (headerIdx === -1) return null;
  
  const headers = lines[headerIdx]
    .split(',')
    .map(h => h.replace(/^"|"$/g, '').trim());
  
  // Parse data rows
  const rows = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line === '""') continue;
    
    // Simple CSV parser for quoted fields
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.replace(/^"|"$/g, '').trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.replace(/^"|"$/g, '').trim());
    
    if (values[0]) { // Only add if has campaign ID
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] || '';
      });
      rows.push(row);
    }
  }
  
  return { metadata, headers, rows };
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-AU', { 
    style: 'currency', 
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function formatPercent(value) {
  return (parseFloat(value) * 100).toFixed(2) + '%';
}

async function main() {
  const data = parseCSV(csvData);
  
  if (!data || data.rows.length === 0) {
    console.error('❌ No campaign data found');
    process.exit(1);
  }
  
  const { metadata, rows } = data;
  
  console.log('\n📊 APPLE SEARCH ADS PERFORMANCE REPORT');
  console.log('=====================================\n');
  console.log(`Report Period: ${metadata.startDate} to ${metadata.endDate}`);
  console.log(`Currency: ${metadata.currency} | Timezone: ${metadata.timezone}\n`);
  
  // Calculate totals
  let totals = {
    spend: 0,
    impressions: 0,
    taps: 0,
    installs: 0,
    newDownloads: 0,
  };
  
  const campaigns = rows.map(row => {
    const spend = parseFloat(row.Spend) || 0;
    const impressions = parseInt(row.Impressions) || 0;
    const taps = parseInt(row.Taps) || 0;
    const installs = parseInt(row['Installs (Total)']) || 0;
    const newDownloads = parseInt(row['New Downloads (Total)']) || 0;
    
    totals.spend += spend;
    totals.impressions += impressions;
    totals.taps += taps;
    totals.installs += installs;
    totals.newDownloads += newDownloads;
    
    return {
      id: row['Campaign ID'],
      name: row['Campaign Name'],
      region: row['Country or Region'],
      status: row.Status,
      spend,
      impressions,
      taps,
      installs,
      newDownloads,
      ctr: impressions > 0 ? (taps / impressions) : 0,
      cpa: installs > 0 ? spend / installs : Infinity,
      cpt: taps > 0 ? spend / taps : 0,
      cpm: impressions > 0 ? (spend / impressions) * 1000 : 0,
      conversionRate: taps > 0 ? installs / taps : 0,
      ttRatio: impressions > 0 ? taps / impressions : 0,
    };
  });
  
  // Display totals
  console.log('📈 CAMPAIGN TOTALS\n');
  console.log(`  Total Spend:        ${formatCurrency(totals.spend)}`);
  console.log(`  Total Impressions:  ${totals.impressions.toLocaleString()}`);
  console.log(`  Total Taps:         ${totals.taps.toLocaleString()}`);
  console.log(`  Total Installs:     ${totals.installs.toLocaleString()}`);
  console.log(`  Total New DLs:      ${totals.newDownloads.toLocaleString()}\n`);
  
  // Calculate aggregate metrics
  const aggregateMetrics = {
    ctr: totals.impressions > 0 ? (totals.taps / totals.impressions) : 0,
    cpa: totals.installs > 0 ? totals.spend / totals.installs : Infinity,
    cpt: totals.taps > 0 ? totals.spend / totals.taps : 0,
    cpm: totals.impressions > 0 ? (totals.spend / totals.impressions) * 1000 : 0,
    conversionRate: totals.taps > 0 ? totals.installs / totals.taps : 0,
  };
  
  console.log('💹 AGGREGATE METRICS\n');
  console.log(`  CTR (Click-Through):    ${formatPercent(aggregateMetrics.ctr)}`);
  console.log(`  CPA (Cost Per Install): ${aggregateMetrics.cpa === Infinity ? 'N/A (no installs)' : formatCurrency(aggregateMetrics.cpa)}`);
  console.log(`  CPT (Cost Per Tap):     ${formatCurrency(aggregateMetrics.cpt)}`);
  console.log(`  CPM (Cost Per 1k):      ${formatCurrency(aggregateMetrics.cpm)}`);
  console.log(`  Conv. Rate (T→I):       ${formatPercent(aggregateMetrics.conversionRate)}\n`);
  
  // Per-campaign breakdown
  console.log('🎯 CAMPAIGN BREAKDOWN\n');
  
  campaigns.forEach((c, idx) => {
    console.log(`${idx + 1}. ${c.name}`);
    console.log(`   Region:     ${c.region}`);
    console.log(`   Status:     ${c.status}`);
    console.log(`   Spend:      ${formatCurrency(c.spend)}`);
    console.log(`   Impressions: ${c.impressions.toLocaleString()}`);
    console.log(`   Taps:       ${c.taps.toLocaleString()}`);
    console.log(`   Installs:   ${c.installs.toLocaleString()}`);
    console.log(`   CTR:        ${formatPercent(c.ctr)}`);
    console.log(`   CPT:        ${formatCurrency(c.cpt)}`);
    console.log(`   CPA:        ${c.cpa === Infinity ? 'N/A (no installs)' : formatCurrency(c.cpa)}`);
    console.log(`   Conv. Rate: ${formatPercent(c.conversionRate)}\n`);
  });
  
  // Insights
  console.log('🔍 KEY INSIGHTS\n');
  
  const auCampaign = campaigns.find(c => c.region.includes('Australia'));
  const globalCampaign = campaigns.find(c => c.region.includes('Canada'));
  
  if (auCampaign && globalCampaign) {
    console.log(`✓ AU Campaign Performance:`);
    console.log(`  - ${auCampaign.spend < globalCampaign.spend ? 'Lower spend' : 'Higher spend'} than Global (AU: ${formatCurrency(auCampaign.spend)} vs Global: ${formatCurrency(globalCampaign.spend)})`);
    console.log(`  - ${auCampaign.ctr > globalCampaign.ctr ? 'Better' : 'Lower'} CTR than Global (AU: ${formatPercent(auCampaign.ctr)} vs Global: ${formatPercent(globalCampaign.ctr)})`);
    console.log(`  - No installs yet (still early in campaign)\n`);
    
    console.log(`✓ Global Campaign Performance:`);
    console.log(`  - ${globalCampaign.installs} install${globalCampaign.installs !== 1 ? 's' : ''} achieved`);
    console.log(`  - CPA: ${formatCurrency(globalCampaign.cpa)} per install`);
    console.log(`  - CPT: ${formatCurrency(globalCampaign.cpt)} per tap`);
    console.log(`  - Higher CTR (${formatPercent(globalCampaign.ctr)}) → Better engagement\n`);
  }
  
  console.log(`⚡ Status:`);
  console.log(`  - Both campaigns RUNNING (started Feb 5-6)`);
  console.log(`  - Combined spend: ${formatCurrency(totals.spend)} against ${formatCurrency(2000)} daily budget`);
  console.log(`  - Early stage: Only ${totals.newDownloads} new downloads across both campaigns\n`);
  
  // Save JSON report
  const reportDir = path.join(__dirname, '..', 'reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const reportPath = path.join(reportDir, `asa-report-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    period: {
      startDate: metadata.startDate,
      endDate: metadata.endDate,
    },
    totals,
    aggregateMetrics: {
      ctr: aggregateMetrics.ctr.toFixed(4),
      cpa: aggregateMetrics.cpa === Infinity ? null : aggregateMetrics.cpa.toFixed(2),
      cpt: aggregateMetrics.cpt.toFixed(4),
      cpm: aggregateMetrics.cpm.toFixed(2),
      conversionRate: aggregateMetrics.conversionRate.toFixed(4),
    },
    campaigns: campaigns.map(c => ({
      name: c.name,
      region: c.region,
      spend: c.spend,
      impressions: c.impressions,
      taps: c.taps,
      installs: c.installs,
      metrics: {
        ctr: c.ctr.toFixed(4),
        cpt: c.cpt.toFixed(4),
        cpa: c.cpa === Infinity ? null : c.cpa.toFixed(2),
        conversionRate: c.conversionRate.toFixed(4),
      }
    }))
  }, null, 2));
  
  console.log(`✅ Detailed report saved to: ${reportPath}\n`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
