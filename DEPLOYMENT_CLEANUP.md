# Deployment Cleanup Script

## Manual Steps Required (via Vercel Dashboard)

The `courtlabops-repo` project needs to be disabled to prevent accidental deploys.

### Option A: Disable Git Integration (Recommended)
1. Go to https://vercel.com/dashboard
2. Select project: `courtlabops-repo`
3. Go to Settings → Git
4. Click "Disconnect Git Repository"
5. Confirm disconnection

### Option B: Delete Project (if no longer needed)
⚠️ **WARNING:** Only delete if you're certain no production traffic uses this URL

1. Go to https://vercel.com/dashboard  
2. Select project: `courtlabops-repo`
3. Go to Settings → Advanced
4. Click "Delete Project"
5. Type project name to confirm

### Impact Analysis

**If deleted:**
- URL https://courtlabops-repo.vercel.app will return 404
- Any existing links/bookmarks will break
- No impact on https://courtlabops.vercel.app

**If Git disconnected:**
- Auto-deploys from GitHub will stop
- Manual deploys would still be possible (but blocked by local config)
- Safest option for transition period

## Verification

After disabling, verify:
```bash
# Should only show courtlabops
vercel project list
```

## Current Protection

Local `.vercel/project.json` is locked to `courtlabops` - this prevents accidental deploys from local CLI.

## Post-Cleanup

Once `courtlabops-repo` is disabled, delete this file and update DEPLOYMENT.md.
