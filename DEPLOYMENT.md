# Deployment Guide

## GitHub Repository

✅ Repository created and pushed: https://github.com/workwAIse/journey_builder_EGYM_v0

## Vercel Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended for first deployment)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select the repository: `workwAIse/journey_builder_EGYM_v0`
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **Vite** (should auto-detect)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `dist` (default)
   - Install Command: `npm install` (default)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add the following:
     - `VITE_SUPABASE_URL` = `your-supabase-project-url`
     - `VITE_SUPABASE_ANON_KEY` = `your-supabase-anon-key`
   - Make sure to add them for **Production**, **Preview**, and **Development** environments

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at: `https://journey-builder-egym-v0.vercel.app` (or similar)

### Option 2: Deploy via Vercel CLI

```bash
# Login to Vercel (if not already logged in)
vercel login

# Deploy to production
vercel --prod

# Follow the prompts to link your project
```

**Note:** When deploying via CLI, you'll need to add environment variables through the Vercel dashboard after the first deployment.

## Post-Deployment

1. **Verify Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Ensure both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set

2. **Test the Deployment**
   - Visit your deployment URL
   - The app should load and work in mock mode (if Supabase isn't configured)
   - If Supabase is configured, test creating a journey and adding actions

3. **Set up Custom Domain (Optional)**
   - Go to Settings → Domains
   - Add your custom domain

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify `package.json` has correct build scripts
- Check Vercel build logs for specific errors

### App Works Locally but Not on Vercel
- Ensure environment variables are set in Vercel dashboard
- Check that Supabase CORS settings allow your Vercel domain
- Verify `vercel.json` configuration is correct

### Supabase Connection Issues
- Double-check environment variables match your Supabase project
- Ensure Supabase project is active and not paused
- Check Supabase logs for connection errors

## Continuous Deployment

Once connected, Vercel will automatically deploy:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches (creates preview deployments)

## Next Steps

After successful deployment:
1. Share the Vercel URL with stakeholders
2. Test all features in the production environment
3. Set up monitoring and error tracking (optional)
4. Configure custom domain if needed






