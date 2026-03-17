# 🚀 Deployment Guide - AI Research Guide

Complete guide to deploy your AI Research Guide to Vercel via GitHub.

---

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier works!)
- Your Anthropic API key (found in your local `.env` file)

---

## Step 1: Create GitHub Repository

### Option A: Via GitHub Website (Easier)

1. Go to https://github.com/new
2. Fill in the details:
   - **Repository name**: `ai-research-guide`
   - **Description**: "AI-powered research methodology recommendation tool"
   - **Visibility**: Choose Private or Public
   - **DO NOT** initialize with README (we already have one)
3. Click **"Create repository"**
4. Keep this page open - you'll need the commands shown

### Option B: Via GitHub CLI

```bash
gh repo create ai-research-guide --public --source=. --remote=origin --push
```

---

## Step 2: Push Your Code to GitHub

Open Terminal and run these commands:

```bash
# Navigate to your project
cd /Users/sindhusreenath/Downloads/ai-research-guide

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ai-research-guide.git

# Verify the remote was added
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

**Expected output:**
```
Enumerating objects: 104, done.
Counting objects: 100% (104/104), done.
Writing objects: 100% (104/104), done.
To https://github.com/YOUR_USERNAME/ai-research-guide.git
 * [new branch]      main -> main
```

---

## Step 3: Deploy to Vercel

### Via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit https://vercel.com/new
   - Sign in with GitHub (if not already)

2. **Import Repository**
   - Click **"Import Git Repository"**
   - You'll see a list of your GitHub repos
   - Find **"ai-research-guide"**
   - Click **"Import"**

3. **Configure Project**
   - **Project Name**: `ai-research-guide` (auto-filled)
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)

4. **Add Environment Variable**
   - Click **"Environment Variables"**
   - Add variable:
     - **Name**: `ANTHROPIC_API_KEY`
     - **Value**: `[Your API key from .env file]`
   - **Environments**: Check all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **"Add"**

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes for build to complete
   - You'll see "🎉 Congratulations!" when done

6. **Get Your URL**
   - Your app will be live at: `https://ai-research-guide-xxx.vercel.app`
   - Click **"Visit"** to open your deployed app

---

## Step 4: Test Your Deployment

1. Visit your Vercel URL
2. Enter a research question, e.g.:
   ```
   What is the best way to understand customer satisfaction with our mobile app?
   ```
3. Click **"Generate Plan"**
4. Wait ~30-45 seconds for the AI to generate the plan
5. Verify the plan displays correctly with:
   - Research methodology recommendations
   - Sample sizes
   - Timelines
   - Expected outputs

---

## ✅ Success Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created and linked to GitHub repo
- [ ] Environment variable `ANTHROPIC_API_KEY` added
- [ ] Deployment completed successfully
- [ ] Live URL accessible
- [ ] Test question generates a research plan
- [ ] Markdown formatting displays correctly

---

## 🔧 Troubleshooting

### Build Fails on Vercel

**Error**: "Module not found" or "Type error"
**Solution**: Check that all dependencies are in `package.json`

```bash
# Locally run build to verify
npm run build
```

### API Key Not Working

**Error**: "ANTHROPIC_API_KEY not configured"
**Solution**:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `ANTHROPIC_API_KEY` is added
3. Click "Redeploy" button

### "Analyzing" Never Finishes

**Error**: Request times out after 30 seconds
**Solution**: Vercel's free tier has 10-second function timeout. Upgrade to Pro plan or:
1. In `vercel.json`, add:
```json
{
  "functions": {
    "app/api/plan/route.ts": {
      "maxDuration": 120
    }
  }
}
```
2. Requires Vercel Pro plan ($20/month)

---

## 🔄 Updating Your Deployment

Whenever you make code changes:

```bash
# Commit your changes
git add .
git commit -m "Your commit message"

# Push to GitHub
git push origin main
```

Vercel will automatically detect the push and redeploy! 🎉

---

## 📊 Monitoring

### View Deployment Logs

1. Go to Vercel Dashboard
2. Click your project → "Deployments"
3. Click any deployment → "View Function Logs"
4. Monitor API calls and errors

### Check Usage

- Vercel Dashboard → Project → Analytics
- Monitor API request counts
- Track response times

---

## 💰 Cost Estimates

### Vercel (Free Tier)

- **100GB bandwidth/month** - Free
- **10-second function timeout** - May need Pro for long AI requests
- **Pro Plan**: $20/month for 60-second timeout

### Anthropic Claude API

- **$0.12-0.18 per research plan**
- Based on ~20,000-50,000 tokens per request
- 100 plans = ~$12-18
- 1,000 plans = ~$120-180

### Total Estimated Monthly Cost

- **Light usage** (50 plans): ~$6-9
- **Medium usage** (500 plans): ~$60-90
- **Heavy usage** (2,000 plans): ~$240-360 + Vercel Pro ($20)

---

## 🎯 Next Steps

1. **Custom Domain** (Optional)
   - Vercel Dashboard → Your Project → Settings → Domains
   - Add your custom domain (e.g., `research.yourdomain.com`)

2. **Team Access**
   - Invite team members in Vercel settings
   - Share deployment URL with stakeholders

3. **Analytics Setup**
   - Enable Vercel Analytics
   - Or integrate Google Analytics

4. **Continuous Improvement**
   - Monitor user queries
   - Refine methodology knowledge base
   - Update system prompts based on feedback

---

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Test API locally with `npm run dev`
3. Verify environment variables are set correctly
4. Check Anthropic API dashboard for usage/errors

---

**🎉 Congratulations! Your AI Research Guide is now live!**
