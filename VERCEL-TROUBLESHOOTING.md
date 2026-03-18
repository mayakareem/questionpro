# 🔍 Vercel Deployment Troubleshooting

## Quick Status Check

### Where to Find Your Live URL

1. **After Deployment Completes:**
   - Look for the **big "Visit" button** at the top
   - Or the **Domains** section showing your URL
   - Usually looks like: `https://questionpro-xxx.vercel.app`

2. **From Vercel Dashboard:**
   - Go to: https://vercel.com/dashboard
   - Click on your **"questionpro"** project
   - You'll see:
     - **Production URL** at the top
     - **Visit** button
     - **Deployments** tab showing status

3. **Check Deployment Status:**
   - Go to: https://vercel.com/dashboard
   - Click **"questionpro"** project
   - Look at the **Deployments** tab
   - Status should be one of:
     - ✅ **Ready** - Deployment succeeded, site is live
     - 🔄 **Building** - Still deploying, wait a few minutes
     - ❌ **Failed** - Deployment failed, check logs

---

## Common Issues & Solutions

### Issue 1: "I don't see my project in Vercel"

**Solution:**
1. Go to https://vercel.com/new
2. Make sure you're signed in with the same GitHub account as "mayakareem"
3. Look for **"questionpro"** in the repository list
4. Click **"Import"**

### Issue 2: "Deployment is still building"

**What to do:**
- Wait 2-3 minutes for the build to complete
- Refresh the page
- Look for the progress indicator
- When done, you'll see "✅ Deployment Ready"

### Issue 3: "Deployment failed"

**Check the build logs:**
1. Click on the failed deployment
2. Click **"View Function Logs"** or **"Build Logs"**
3. Look for errors like:
   - `ANTHROPIC_API_KEY not configured` → Add environment variable
   - `Module not found` → Missing dependencies
   - `Type error` → Build error in code

**Most common fix:**
- Go to **Project Settings** → **Environment Variables**
- Add `ANTHROPIC_API_KEY` with your API key
- Click **"Redeploy"** from Deployments tab

### Issue 4: "Site loads but Generate Plan doesn't work"

**This means the API key is missing:**
1. Go to your Vercel project
2. Click **Settings** → **Environment Variables**
3. Add:
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: `[Your API key from .env file]`
   - **Environments**: Select all three (Production, Preview, Development)
4. Save
5. Go to **Deployments** tab
6. Click **"..."** menu on latest deployment
7. Click **"Redeploy"**

### Issue 5: "Request timeout / 504 error"

**This happens because the free tier has 10-second timeout:**

Vercel free tier limits functions to 10 seconds, but Claude API takes ~90-110 seconds.

**Solutions:**
1. **Upgrade to Vercel Pro** ($20/month) for 60-second timeout
2. **Use streaming responses** (requires code changes)
3. **Deploy elsewhere:**
   - Railway.app (allows longer timeouts)
   - Render.com (allows up to 10 minutes)
   - Your own server

---

## Step-by-Step Verification

### ✅ Checklist to Verify Deployment

1. **GitHub Repository**
   - [ ] Visit https://github.com/mayakareem/questionpro
   - [ ] Verify all files are there (104 files)
   - [ ] Check that last commit is visible

2. **Vercel Project Created**
   - [ ] Go to https://vercel.com/dashboard
   - [ ] See "questionpro" project listed
   - [ ] Click on it

3. **Environment Variable Added**
   - [ ] In project → Settings → Environment Variables
   - [ ] See `ANTHROPIC_API_KEY` listed
   - [ ] It's enabled for Production, Preview, Development

4. **Deployment Successful**
   - [ ] In Deployments tab
   - [ ] Latest deployment shows "Ready" status
   - [ ] Green checkmark visible

5. **Live URL Works**
   - [ ] Click "Visit" or copy the URL
   - [ ] Site loads with "AI Research Guide" heading
   - [ ] Form is visible

6. **API Works**
   - [ ] Enter a test question
   - [ ] Click "Generate Plan"
   - [ ] After ~30-45 seconds, research plan appears

---

## How to Find Your Live URL

### Method 1: From Deployment Success Screen
After deployment completes, you'll see:
```
🎉 Congratulations!

Your project has been deployed.

[Visit] [View Domains]

https://questionpro-xxx.vercel.app
```

### Method 2: From Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click on **"questionpro"** project
3. Look at the top - you'll see:
   ```
   Production Deployment
   https://questionpro-xxx.vercel.app
   [Visit]
   ```

### Method 3: From Deployments Tab
1. Go to project → **Deployments**
2. Find the deployment with ✅ "Ready" status
3. Click on it
4. URL is shown at the top

---

## Still Can't Find It?

Share with me:
1. Screenshot of your Vercel dashboard
2. Or tell me what you see when you visit: https://vercel.com/dashboard
3. Did you see any error messages during import/deployment?

I'll help you troubleshoot further!

---

## Test Your Deployment

Once you find the URL, test it:

1. **Visit the URL** (e.g., `https://questionpro-xxx.vercel.app`)

2. **Enter a test question:**
   ```
   What is the best way to understand customer satisfaction with our mobile app?
   ```

3. **Click "Generate Plan"**

4. **Wait 30-45 seconds**

5. **Verify you see:**
   - Research methodology recommendations
   - Sample sizes and timelines
   - Expected outputs
   - Markdown formatting (bold, headers, lists)

If it works - **you're done!** 🎉

If it doesn't work:
- Check the browser console (F12 → Console tab)
- Look for error messages
- Share the error with me for help

---

## Quick Links

- **Your GitHub Repo**: https://github.com/mayakareem/questionpro
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel New Import**: https://vercel.com/new
- **Vercel Docs**: https://vercel.com/docs
- **Get API Key**: Check your local `.env` file

---

## Need Help?

Tell me:
1. What step are you on?
2. What do you see on your screen?
3. Any error messages?

I'll guide you through it!
