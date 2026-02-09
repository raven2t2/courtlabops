#!/usr/bin/env node

/**
 * Apple Search Ads Performance Report
 * Fetches campaign metrics from Apple Search Ads API v5
 * 
 * Requires environment variables:
 * - APPLE_SEARCHADS_CLIENT_ID
 * - APPLE_SEARCHADS_TEAM_ID
 * - APPLE_SEARCHADS_KEY_ID
 * - APPLE_SEARCHADS_ACCOUNT_ID
 * - APPLE_SEARCHADS_PRIVATE_KEY_PATH
 */

const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const path = require('path');

// Configuration
const config = {
  clientId: process.env.APPLE_SEARCHADS_CLIENT_ID,
  teamId: process.env.APPLE_SEARCHADS_TEAM_ID,
  keyId: process.env.APPLE_SEARCHADS_KEY_ID,
  accountId: process.env.APPLE_SEARCHADS_ACCOUNT_ID,
  privateKeyPath: process.env.APPLE_SEARCHADS_PRIVATE_KEY_PATH,
  apiHost: 'api.searchads.apple.com',
  apiVersion: 'v5',
};

// Validate config
const requiredEnvVars = ['clientId', 'teamId', 'keyId', 'accountId', 'privateKeyPath'];
const missing = requiredEnvVars.filter(key => !config[key]);
if (missing.length > 0) {
  console.error('❌ Missing environment variables:', missing.map(k => `APPLE_SEARCHADS_${k.toUpperCase()}`).join(', '));
  process.exit(1);
}

if (!fs.existsSync(config.privateKeyPath)) {
  console.error(`❌ Private key file not found: ${config.privateKeyPath}`);
  process.exit(1);
}

/**
 * Generate ES256 JWT for Apple Search Ads API authentication
 */
function generateJWT() {
  const privateKey = fs.readFileSync(config.privateKeyPath, 'utf-8');
  
  const header = Buffer.from(JSON.stringify({
    alg: 'ES256',
    typ: 'JWT',
    kid: config.keyId,
  })).toString('base64url');
  
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    iss: config.teamId,
    sub: config.clientId,
    aud: `https://${config.apiHost}`,
    exp: now + 600, // 10 minute expiration
    iat: now,
  })).toString('base64url');
  
  const message = header + '.' + payload;
  const signature = crypto
    .createSign('SHA256')
    .update(message)
    .sign({ key: privateKey, format: 'pem', type: 'pkcs8' }, 'base64url');
  
  return message + '.' + signature;
}

/**
 * Make HTTPS request to Apple Search Ads API
 */
function makeApiRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const jwt = generateJWT();
    
    const options = {
      hostname: config.apiHost,
      path,
      method,
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'X-Apple-Application-Instance': config.accountId,
        'Content-Type': 'application/json',
      },
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve(body);
          }
        } else if (res.statusCode === 401 || res.statusCode === 403) {
          reject(new Error(`Authentication failed: ${res.statusCode}`));
        } else if (res.statusCode === 503) {
          reject(new Error('Apple Search Ads API temporarily unavailable (503)'));
        } else {
          reject(new Error(`API error: ${res.statusCode} - ${body.substring(0, 200)}`));
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

/**
 * Format a number as currency
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

/**
 * Main script
 */
async function main() {
  try {
    console.log('📊 Apple Search Ads Report');
    console.log('===========================\n');
    console.log('Account:', config.accountId);
    console.log('API Version:', config.apiVersion);
    console.log('');
    
    // Fetch campaigns
    console.log('Fetching campaigns...');
    const campaignsPath = `/${config.apiVersion}/campaigns?orgId=${config.accountId}`;
    const campaignsData = await makeApiRequest(campaignsPath);
    
    if (!campaignsData.data || campaignsData.data.length === 0) {
      console.log('No campaigns found.');
      process.exit(0);
    }
    
    const campaigns = campaignsData.data;
    console.log(`✓ Found ${campaigns.length} campaign(s)\n`);
    
    // Fetch and aggregate metrics
    let totalCost = 0;
    let totalTaps = 0;
    let totalImpressions = 0;
    let campaignMetrics = [];
    
    for (const campaign of campaigns) {
      console.log(`  📱 ${campaign.name} (ID: ${campaign.id})`);
      
      try {
        // Get detailed campaign data with metrics
        const campaignPath = `/${config.apiVersion}/campaigns/${campaign.id}?orgId=${config.accountId}`;
        const campaignDetail = await makeApiRequest(campaignPath);
        
        // Calculate metrics if available
        let cost = 0;
        let taps = 0;
        let impressions = 0;
        
        if (campaignDetail.recentMetrics) {
          const metrics = campaignDetail.recentMetrics;
          cost = metrics.cost || 0;
          taps = metrics.taps || 0;
          impressions = metrics.impressions || 0;
        }
        
        totalCost += cost;
        totalTaps += taps;
        totalImpressions += impressions;
        
        campaignMetrics.push({
          name: campaign.name,
          id: campaign.id,
          cost,
          taps,
          impressions,
          ctr: impressions > 0 ? ((taps / impressions) * 100).toFixed(2) + '%' : 'N/A',
          cpc: taps > 0 ? formatCurrency(cost / taps) : 'N/A',
        });
        
      } catch (err) {
        console.log(`    ⚠️ Could not fetch details: ${err.message}`);
      }
    }
    
    // Display summary
    console.log('\n📈 Performance Summary');
    console.log('=====================');
    console.log(`Total Spend:      ${formatCurrency(totalCost)}`);
    console.log(`Total Taps:       ${totalTaps.toLocaleString()}`);
    console.log(`Total Impressions: ${totalImpressions.toLocaleString()}`);
    
    if (totalImpressions > 0) {
      console.log(`CTR:              ${((totalTaps / totalImpressions) * 100).toFixed(2)}%`);
    }
    if (totalTaps > 0) {
      console.log(`CPC:              ${formatCurrency(totalCost / totalTaps)}`);
    }
    
    // Display campaign details
    if (campaignMetrics.length > 0) {
      console.log('\n📊 Campaign Breakdown');
      console.log('=====================');
      campaignMetrics.forEach(m => {
        console.log(`\n${m.name}`);
        console.log(`  Cost:       ${formatCurrency(m.cost)}`);
        console.log(`  Taps:       ${m.taps.toLocaleString()}`);
        console.log(`  Impressions: ${m.impressions.toLocaleString()}`);
        console.log(`  CTR:        ${m.ctr}`);
        console.log(`  CPC:        ${m.cpc}`);
      });
    }
    
    // Save to file
    const reportPath = path.join(__dirname, '..', 'reports', `asa-report-${new Date().toISOString().split('T')[0]}.json`);
    const reportDir = path.dirname(reportPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      account: config.accountId,
      summary: {
        totalCost,
        totalTaps,
        totalImpressions,
        ctr: totalImpressions > 0 ? ((totalTaps / totalImpressions) * 100).toFixed(2) + '%' : 'N/A',
        cpc: totalTaps > 0 ? totalCost / totalTaps : 0,
      },
      campaigns: campaignMetrics,
    }, null, 2));
    
    console.log(`\n✅ Report saved to ${reportPath}`);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('Note: Apple Search Ads API may be temporarily unavailable.');
    process.exit(1);
  }
}

main();
