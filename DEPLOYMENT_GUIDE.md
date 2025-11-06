# Deployment Guide for Campus Resale

This guide will walk you through deploying your full-stack application to production with a custom domain.

## 🆓 Quick Answer: Free Hosting Setup

**Want to host for FREE?** Here's the recommended stack:
- **Domain**: Cloudflare (~$10-15/year) - one-time purchase
- **Frontend**: Cloudflare Pages (FREE)
- **Backend + Database**: Render (FREE - includes PostgreSQL!)
- **Storage**: AWS S3 (FREE tier: 5 GB)

**Total cost**: Only the domain (~$10-15/year)!

**Note**: Render free tier has one limitation - services spin down after 15 minutes of inactivity. First request after spin-down takes ~30 seconds. This is fine for development and low-traffic apps. Upgrade to paid ($7/month) later if you need always-on.

## Overview

Your application consists of:
- **Frontend**: React + Vite (Static site)
- **Backend**: Node.js/Express API
- **Database**: PostgreSQL
- **Storage**: AWS S3 (for images)

## Step 1: Purchase a Domain

### Option A: Cloudflare (Recommended)
1. Go to [Cloudflare](https://www.cloudflare.com/products/registrar/)
2. Search for your desired domain name
3. Purchase the domain (Cloudflare offers at-cost pricing)
4. Domain will automatically be added to your Cloudflare account

**Why Cloudflare?**
- Free SSL certificates
- CDN included
- DNS management
- Good pricing
- Easy integration with their hosting services

### Option B: Other Registrars
- Namecheap
- Google Domains
- GoDaddy

*Note: You can still use Cloudflare DNS even if you buy the domain elsewhere*

## Step 2: Choose Hosting Services

### 🆓 FREE Hosting Stack (Recommended for Getting Started)

#### Frontend Hosting (All Free)
- **Cloudflare Pages** (Free) - Best integration with Cloudflare domain
- **Vercel** (Free tier) - Easy deployment, great for React
- **Netlify** (Free tier) - Similar to Vercel

#### Backend Hosting (Free Options)
1. **Render** (Free tier) ⭐ **BEST FREE OPTION**
   - 512 MB RAM, 0.5 CPU
   - Free PostgreSQL database included (1 GB storage)
   - Services spin down after 15 min inactivity (cold starts)
   - Perfect for development and small projects

2. **Fly.io** (Free tier)
   - 3 shared-CPU VMs (256 MB RAM each)
   - 3 GB storage included
   - Global edge network
   - Requires Dockerfile setup

3. **Railway** (Free credits)
   - $5 free credits per month
   - May need to upgrade if you exceed credits
   - Very easy to use

#### Database (Free Options)
- **Render** - PostgreSQL included with free tier
- **Supabase** (Free tier) - PostgreSQL with 500 MB storage
- **Neon** (Free tier) - Serverless PostgreSQL with 0.5 GB storage

### 💰 Paid Options (For Later)
If you need more resources in the future:
- **Railway** ($5/month) - Simple, PostgreSQL included
- **Render** ($7/month) - No spin-downs, better performance
- **DigitalOcean App Platform** ($5/month) - Reliable

## Step 3: Deploy Backend

### 🆓 Option A: Render (FREE - Recommended for Free Hosting)

**Render is the best free option** - it includes both backend hosting AND a free PostgreSQL database!

1. **Sign up at [Render.com](https://render.com)** (free account)

2. **Create a PostgreSQL Database** (Free tier):
   - Click "New +" → "PostgreSQL"
   - Name it (e.g., "campus-resale-db")
   - Select "Free" plan
   - Choose a region close to you
   - Click "Create Database"
   - **Copy the connection details** (Internal Database URL)

3. **Deploy your backend**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repo and branch
   - Configure:
     - **Name**: `campus-resale-backend` (or any name)
     - **Environment**: `Node`
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`
     - **Plan**: Select **"Free"** plan
   
4. **Configure Environment Variables** in Render dashboard:
   ```
   PORT=3001
   DB_HOST=<from Render PostgreSQL Internal Database URL>
   DB_PORT=5432
   DB_NAME=<from Render PostgreSQL Internal Database URL>
   DB_USER=<from Render PostgreSQL Internal Database URL>
   DB_PASSWORD=<from Render PostgreSQL Internal Database URL>
   JWT_SECRET=<generate a strong random string - see ENV_VARIABLES.md>
   AWS_ACCESS_KEY_ID=<your AWS access key>
   AWS_SECRET_ACCESS_KEY=<your AWS secret key>
   AWS_REGION=<your AWS region>
   AWS_S3_BUCKET_NAME=<your S3 bucket name>
   NODE_ENV=production
   ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   ```
   
   **💡 Tip**: Render provides the database connection string in the format:
   `postgresql://user:password@host:port/dbname`
   
   You can parse it or use the individual fields from the Render dashboard.

5. **Important Notes about Render Free Tier**:
   - ⚠️ Services **spin down after 15 minutes of inactivity**
   - First request after spin-down takes ~30 seconds (cold start)
   - Perfect for development and low-traffic apps
   - If you need always-on, consider upgrading to paid ($7/month)

6. Render will automatically deploy and give you a URL like `https://your-backend.onrender.com`

7. **Test your deployment**:
   - Visit `https://your-backend.onrender.com/api/health`
   - Should return: `{"ok":true,"service":"backend",...}`

### 🆓 Option B: Fly.io (FREE - More Setup Required)

1. **Sign up at [Fly.io](https://fly.io)** (free account)
2. **Install Fly CLI**: `curl -L https://fly.io/install.sh | sh`
3. **Create a Dockerfile** in `backend/` directory (see below)
4. **Initialize Fly app**: `cd backend && fly launch`
5. **Add PostgreSQL**: `fly postgres create --name campus-resale-db`
6. **Attach database**: `fly postgres attach -a campus-resale-db`
7. **Set environment variables**: `fly secrets set KEY=value`
8. **Deploy**: `fly deploy`

**Note**: Fly.io requires a Dockerfile. If you choose this option, I can help create one.

### 💰 Option C: Railway (Free Credits, May Need Payment)

Railway offers $5 in free credits per month, but you may need to pay if you exceed them.

1. Sign up at [Railway.app](https://railway.app)
2. Create a new project
3. Add a PostgreSQL database (uses credits)
4. Deploy your backend from GitHub
5. Set root directory to `backend/`
6. Configure environment variables (same as Render)
7. Deploy

**Note**: Railway is easy to use but may require payment after free credits run out.

## Step 4: Deploy Frontend

### Option A: Cloudflare Pages (Recommended)

1. **Sign up at [Cloudflare Pages](https://pages.cloudflare.com)**
2. **Connect your GitHub repository**
3. **Configure build settings**:
   - Framework preset: `Vite`
   - Build command: `cd frontend && npm run build`
   - Build output directory: `frontend/dist`
   - Root directory: `/frontend`

4. **Set Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   VITE_BACKEND_URL=https://your-backend.onrender.com
   ```
   
   *(Replace with your actual Render backend URL)*

5. **Deploy** - Cloudflare will build and deploy automatically

6. **Custom Domain**:
   - Go to your Cloudflare Pages project
   - Navigate to "Custom domains"
   - Add your domain (e.g., `yourdomain.com`)
   - Cloudflare will automatically configure DNS

### Option B: Vercel

1. Sign up at [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - Framework: Vite
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variables (same as Cloudflare Pages)
5. Deploy

## Step 5: Update Frontend Code for Production

You need to update `frontend/src/utils/api.ts` to use environment variables:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
```

## Step 6: Configure DNS

### If using Cloudflare for domain and hosting:

1. **In Cloudflare Dashboard**:
   - Go to your domain
   - Click "DNS" → "Records"
   - Add an **A record** or **CNAME** for your frontend:
     - Type: `CNAME`
     - Name: `@` (or `www`)
     - Target: Your Cloudflare Pages domain (e.g., `your-project.pages.dev`)
     - Proxy status: Proxied (orange cloud)

2. **For backend API** (optional subdomain):
   - Type: `CNAME`
   - Name: `api`
   - Target: Your backend URL (e.g., `your-backend.railway.app`)
   - Proxy status: Proxied

### If using different services:

1. **Frontend** (e.g., Vercel):
   - Vercel will provide DNS instructions
   - Add CNAME record pointing to Vercel

2. **Backend**:
   - Add CNAME record for `api.yourdomain.com` pointing to your backend URL
   - Or use the backend URL directly in your frontend environment variables

## Step 7: Update Backend CORS

Make sure your `backend/server.js` allows your production frontend domain:

```javascript
app.use(cors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'http://localhost:5173' // Keep for local development
  ],
  credentials: true,
  // ... rest
}));
```

## Step 8: SSL Certificates

- **Cloudflare**: SSL is automatic and free
- **Vercel**: SSL is automatic
- **Railway**: SSL is automatic
- **Render**: SSL is automatic

Most modern hosting platforms provide SSL automatically!

## Step 9: Database Migration

Run your database schema on the production database:

1. Connect to your production PostgreSQL database
2. Run your SQL schema/migration files
3. Or use a migration tool like `node-pg-migrate`

## Step 10: Testing

1. Visit `https://yourdomain.com`
2. Test all features:
   - User registration/login
   - Creating posts
   - Image uploads
   - API connections

## Cost Estimate

### 🆓 Free Tier (Perfect for Getting Started):
- **Domain**: $10-15/year (Cloudflare)
- **Frontend**: Free (Cloudflare Pages/Vercel)
- **Backend**: Free (Render - includes PostgreSQL!)
- **Database**: Free (Included with Render)
- **AWS S3**: Free tier (5 GB storage, 20,000 GET requests/month)
- **Total**: ~$10-15/year (domain only!)

### 💰 Paid Tier (When You Need More):
- **Domain**: $10-15/year
- **Frontend**: Free (Cloudflare Pages)
- **Backend**: $7/month (Render paid - no spin-downs)
- **Database**: Included (with Render)
- **AWS S3**: ~$1-5/month (if you exceed free tier)
- **Total**: ~$8-20/month + $10-15/year

**Note**: The free tier is perfect for development and small projects. You can start free and upgrade later if needed!

## Quick Start Checklist

- [ ] Purchase domain (Cloudflare recommended)
- [ ] Deploy backend to Render (free tier)
- [ ] Set backend environment variables
- [ ] Update backend CORS for production domain
- [ ] Deploy frontend to Cloudflare Pages/Vercel
- [ ] Set frontend environment variables
- [ ] Update frontend API URLs to use environment variables
- [ ] Configure DNS records
- [ ] Run database migrations
- [ ] Test all functionality
- [ ] Set up monitoring (optional)

## Troubleshooting

### CORS Errors
- Make sure your backend CORS includes your frontend domain
- Check that credentials are set correctly

### API Not Found
- Verify environment variables are set correctly
- Check that backend is running and accessible
- Verify DNS is pointing correctly

### Database Connection Issues
- Double-check database credentials
- Ensure database is accessible from your backend host
- Check if database needs IP whitelisting

## Next Steps

1. Set up monitoring (e.g., Sentry for error tracking)
2. Set up CI/CD (automatic deployments on git push)
3. Add analytics (Google Analytics, Plausible)
4. Set up backups for your database
5. Configure rate limiting on your API
6. Set up logging (e.g., Logtail, Datadog)

## Support

For platform-specific help:
- [Railway Docs](https://docs.railway.app)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)

