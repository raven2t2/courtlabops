# CourtLab Deployment Runbook

## Overview
This document defines the **single source of truth** for deploying the CourtLab application to production.

## Canonical Deployment Target
- **Project Name:** `courtlabops`
- **Production URL:** https://courtlabops.vercel.app
- **Project ID:** `prj_UGYJ0AIrtVhysbY7DHVY3lu3az3S`

## ⚠️ IMPORTANT
**NEVER deploy to `courtlabops-repo`** - this is a deprecated project that exists only for historical purposes. All deployments must go to `courtlabops`.

## Deployment Commands

### Production Deploy (Standard)
```bash
npm run deploy:prod
```

### With Confirmation Prompt
```bash
vercel --prod
```

### Preview Deploy
```bash
npm run deploy:preview
```

## Pre-Deployment Checklist

1. **Ensure you're on the correct branch:**
   ```bash
   git branch
   # Should be: main
   ```

2. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

3. **Run build locally to verify:**
   ```bash
   npm run build
   ```

4. **Deploy to production:**
   ```bash
   npm run deploy:prod
   ```

5. **Verify deployment:**
   - Check https://courtlabops.vercel.app
   - Confirm commit SHA matches

## What NOT to Do

❌ **Never run:** `vercel --prod --yes` without checking project
❌ **Never deploy to:** `courtlabops-repo` project
❌ **Never commit:** The `.vercel/project.json` file has been locked to `courtlabops`

## Gallery Size Protection

The deployment is configured to avoid bundling the large gallery assets (500MB+) on every deploy. This is handled automatically by Vercel's build configuration.

## Troubleshooting

### Wrong Project Linked
If deploys are going to the wrong project:
```bash
# Re-link to courtlabops
vercel link
# Select: courtlabops
```

### Deployment Fails
1. Check build output: `npm run build`
2. Verify Vercel token is valid
3. Check Vercel dashboard for errors

## Project Status

| Project | Status | Action |
|---------|--------|--------|
| `courtlabops` | ✅ Active | Use this for all deployments |
| `courtlabops-repo` | ⛔ Deprecated | Do not use - Git integration disabled |

## Support

If you encounter deployment issues:
1. Check this runbook
2. Verify project is `courtlabops` in `.vercel/project.json`
3. Contact the team lead

---
Last Updated: 2026-02-07
