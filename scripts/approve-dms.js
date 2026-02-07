#!/usr/bin/env node
/**
 * CourtLab DM Approval Workflow
 * Review warm leads and approve DMs for sending
 * Run: node approve-dms.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = '/data/.openclaw/workspace/courtlab-crm';
const LEADS_DIR = path.join(WORKSPACE, 'social-leads');
const SENT_DIR = path.join(WORKSPACE, 'social-leads', 'sent');
const REJECTED_DIR = path.join(WORKSPACE, 'social-leads', 'rejected');

fs.mkdirSync(SENT_DIR, { recursive: true });
fs.mkdirSync(REJECTED_DIR, { recursive: true });

// Find most recent leads file
function getLatestLeadsFile() {
  const files = fs.readdirSync(LEADS_DIR)
    .filter(f => f.endsWith('-leads.json') && !f.includes('sent') && !f.includes('rejected'))
    .map(f => ({
      name: f,
      path: path.join(LEADS_DIR, f),
      mtime: fs.statSync(path.join(LEADS_DIR, f)).mtime
    }))
    .sort((a, b) => b.mtime - a.mtime);
  
  return files[0];
}

// Display lead for review
function displayLead(lead, index, total) {
  console.clear();
  console.log(`\n=== LEAD ${index + 1} OF ${total} ===\n`);
  console.log(`Score: ${lead.score}/100 ${lead.isHighValue ? '🔥 HIGH VALUE' : ''}`);
  console.log(`Category: ${lead.category}`);
  console.log(`\nAuthor: @${lead.authorHandle}`);
  console.log(`Name: ${lead.name || lead.authorName}`);
  console.log(`Followers: ${lead.followers?.toLocaleString()}`);
  console.log(`Bio: ${lead.authorBio || 'N/A'}`);
  console.log(`\nTweet: ${lead.tweetText?.slice(0, 200)}${lead.tweetText?.length > 200 ? '...' : ''}`);
  console.log(`URL: ${lead.tweetUrl}`);
  console.log(`\n--- PROPOSED DM ---\n`);
  console.log(lead.dmTemplate);
  console.log('\n--- ACTIONS ---');
  console.log('[s] Send DM');
  console.log('[e] Edit DM');
  console.log('[r] Reject/Skip');
  console.log('[q] Quit');
  console.log('\nChoice: ');
}

// Send DM via bird
function sendDM(lead, customMessage = null) {
  const message = customMessage || lead.dmTemplate;
  const handle = lead.authorHandle;
  
  try {
    // Note: bird doesn't have a direct DM command, so we use browser or other method
    // For now, output the command that would be used
    console.log(`\nTo send DM to @${handle}:`);
    console.log(`Message: ${message}`);
    console.log('\nNote: Twitter/X DMs require browser automation or API.');
    console.log('Copy the message above and send manually, or use browser tool.');
    
    // Mark as sent
    lead.status = 'sent';
    lead.sentDate = new Date().toISOString();
    lead.sentMessage = message;
    
    return true;
  } catch (error) {
    console.error('Error sending DM:', error.message);
    return false;
  }
}

// Main approval workflow
async function runApprovalWorkflow() {
  const latestFile = getLatestLeadsFile();
  
  if (!latestFile) {
    console.log('No leads files found. Run daily-social-listen.sh first.');
    process.exit(1);
  }
  
  console.log(`Loading leads from: ${latestFile.name}`);
  const leads = JSON.parse(fs.readFileSync(latestFile.path, 'utf8'));
  
  // Filter to pending leads only
  const pendingLeads = leads.filter(l => l.status === 'identified');
  
  if (pendingLeads.length === 0) {
    console.log('No pending leads to review.');
    return;
  }
  
  console.log(`Found ${pendingLeads.length} pending leads to review.`);
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const ask = (prompt) => new Promise(resolve => readline.question(prompt, resolve));
  
  for (let i = 0; i < pendingLeads.length; i++) {
    const lead = pendingLeads[i];
    displayLead(lead, i, pendingLeads.length);
    
    const choice = await ask('');
    
    switch (choice.trim().toLowerCase()) {
      case 's':
        console.log('Sending DM...');
        sendDM(lead);
        lead.status = 'approved_sent';
        break;
      case 'e':
        console.log('Current DM:');
        console.log(lead.dmTemplate);
        console.log('\nEnter custom DM (or press Enter to keep current):');
        const custom = await ask('');
        if (custom.trim()) {
          sendDM(lead, custom);
          lead.status = 'approved_sent';
        }
        break;
      case 'r':
        console.log('Lead rejected.');
        lead.status = 'rejected';
        break;
      case 'q':
        console.log('Quitting...');
        i = pendingLeads.length; // Exit loop
        break;
      default:
        console.log('Invalid choice. Skipping...');
    }
    
    // Save progress after each decision
    fs.writeFileSync(latestFile.path, JSON.stringify(leads, null, 2));
  }
  
  readline.close();
  
  // Generate summary
  const sent = leads.filter(l => l.status === 'approved_sent').length;
  const rejected = leads.filter(l => l.status === 'rejected').length;
  const pending = leads.filter(l => l.status === 'identified').length;
  
  console.log('\n=== APPROVAL SUMMARY ===');
  console.log(`Total leads: ${leads.length}`);
  console.log(`Sent: ${sent}`);
  console.log(`Rejected: ${rejected}`);
  console.log(`Pending: ${pending}`);
  
  // Export sent leads for tracking
  if (sent > 0) {
    const sentLeads = leads.filter(l => l.status === 'approved_sent');
    const sentFile = path.join(SENT_DIR, `${latestFile.name.replace('-leads.json', '')}-sent.json`);
    fs.writeFileSync(sentFile, JSON.stringify(sentLeads, null, 2));
    console.log(`\nSent leads exported to: ${sentFile}`);
  }
}

// Check if running in interactive mode
if (require.main === module) {
  runApprovalWorkflow().catch(console.error);
}

module.exports = { runApprovalWorkflow, getLatestLeadsFile };
