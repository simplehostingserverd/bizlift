# BizLift Deployment Guide

## Quick Railway Deployment (5 minutes)

### Step 1: Prepare Your Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: BizLift SaaS platform"

# Push to GitHub
git remote add origin <your-github-repo>
git push -u origin main
```

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your BizLift repository
6. Railway will detect Next.js and configure automatically

### Step 3: Add PostgreSQL Database

1. In your Railway project dashboard
2. Click "New" → "Database" → "PostgreSQL"
3. Railway automatically:
   - Provisions database
   - Sets `DATABASE_URL` environment variable
   - Links it to your service

### Step 4: Configure Environment Variables

Click on your service → "Variables" tab → Add these:

```env
# NextAuth (generate secret with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-random-32-char-secret
NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}

# Stripe (from dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (add after webhook setup)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe URLs
STRIPE_SUCCESS_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}/checkout/success
STRIPE_CANCEL_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}/checkout/cancel

# App URL
NEXT_PUBLIC_APP_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
```

### Step 5: Deploy

Railway auto-deploys on git push. Monitor build logs in dashboard.

First deploy may take 3-5 minutes.

### Step 6: Run Database Migrations

After first successful deploy:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run npx prisma migrate deploy

# Seed database
railway run npm run prisma:seed
```

### Step 7: Configure Stripe Webhook

1. Copy your Railway app URL (e.g., `https://bizlift-production.up.railway.app`)
2. Go to Stripe Dashboard → Developers → Webhooks
3. Click "Add endpoint"
4. URL: `https://your-app.up.railway.app/api/stripe/webhook`
5. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Copy webhook signing secret
7. Add to Railway environment variables as `STRIPE_WEBHOOK_SECRET`
8. Redeploy (Railway auto-redeploys on env var change)

### Step 8: Create Stripe Products

Use Stripe Dashboard to create products matching `public/stripeProducts.json`:

**Premium Monthly:**
```
Name: BizLift Premium - Monthly
Price: $29.99/month recurring
```

**Premium Annual:**
```
Name: BizLift Premium - Annual
Price: $299.99/year recurring
```

**Onboarding Boost:**
```
Name: Onboarding Boost
Price: $99.99 one-time
```

**Application Support:**
```
Name: Application Support Package
Price: $149.99 one-time
```

Update price IDs in `app/pricing/page.tsx`:

```typescript
// Find and replace these placeholder IDs with your actual Stripe Price IDs
handleCheckout("price_premium_monthly", "subscription")
// becomes
handleCheckout("price_1ABC123...", "subscription")
```

### Step 9: Test Your Deployment

1. Visit your Railway app URL
2. Register a new account
3. Complete business profile
4. View funding recommendations
5. Test checkout (use test card: 4242 4242 4242 4242)
6. Verify webhook processing in Stripe Dashboard

### Step 10: Update Default Credentials

For security, change default admin password:

```bash
# Connect to Railway database
railway run npx prisma studio

# Or use psql
railway run psql $DATABASE_URL

# Update admin password (hash of new password)
UPDATE "User" SET password = '<new-bcrypt-hash>' WHERE email = 'admin@bizlift.com';
```

Or delete demo users and create new admin via signup.

---

## Environment Variables Reference

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Auto-set by Railway |
| `NEXTAUTH_SECRET` | Random 32-char string | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app URL | `https://your-app.up.railway.app` |
| `STRIPE_SECRET_KEY` | Stripe API secret key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | `whsec_...` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | For enhanced AI matching | None |
| `NODE_ENV` | Environment mode | `production` |

---

## Continuous Deployment

Railway automatically deploys on every git push to main branch.

**Workflow:**
```bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push origin main

# Railway automatically:
# 1. Detects push
# 2. Runs build (npm install, prisma generate, next build)
# 3. Runs migrations (prisma migrate deploy)
# 4. Starts app (npm start)
# 5. Zero-downtime deployment
```

---

## Monitoring & Logs

**View Logs:**
1. Railway Dashboard → Your Service → "Deployments"
2. Click on a deployment to see logs
3. Or use CLI: `railway logs`

**Metrics:**
- CPU usage
- Memory usage
- Request count
- Response times

Available in Railway Dashboard → "Metrics" tab

---

## Custom Domain

1. Railway Dashboard → Your Service → "Settings"
2. Scroll to "Domains"
3. Click "Add Domain"
4. Enter your domain (e.g., `app.yourdomain.com`)
5. Add CNAME record to your DNS:
   ```
   CNAME app.yourdomain.com → <railway-domain>
   ```
6. Update environment variables:
   ```env
   NEXTAUTH_URL=https://app.yourdomain.com
   NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
   STRIPE_SUCCESS_URL=https://app.yourdomain.com/checkout/success
   STRIPE_CANCEL_URL=https://app.yourdomain.com/checkout/cancel
   ```
7. Update Stripe webhook URL

Railway automatically provisions SSL certificate.

---

## Rollback

If something goes wrong:

1. Railway Dashboard → "Deployments"
2. Find last working deployment
3. Click "⋯" → "Redeploy"
4. Or use CLI:
   ```bash
   railway rollback
   ```

---

## Database Backups

Railway automatically backs up PostgreSQL databases.

**Manual backup:**
```bash
# Export database
railway run pg_dump $DATABASE_URL > backup.sql

# Restore
railway run psql $DATABASE_URL < backup.sql
```

---

## Scaling

Railway auto-scales based on traffic.

**Manual scaling:**
1. Dashboard → Service → "Settings"
2. Adjust resources (RAM, CPU)
3. Railway handles load balancing

---

## Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
# Clear Railway cache
railway run npm ci
```

**Error: "Prisma Client not generated"**
```bash
# Ensure postinstall script runs
# Check package.json:
"postinstall": "prisma generate"
```

### Database Connection Fails

**Error: "Can't reach database server"**

1. Check `DATABASE_URL` is set
2. Verify PostgreSQL service is running
3. Check connection in Railway Dashboard → Database → Connect

### Stripe Webhook Errors

**Error: "No signatures found"**

1. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
2. Check webhook URL is correct
3. Test with Stripe CLI:
   ```bash
   stripe trigger checkout.session.completed \
     --url https://your-app.up.railway.app/api/stripe/webhook
   ```

### App Not Responding

1. Check Railway logs: `railway logs`
2. Verify deployment succeeded
3. Check for errors in build output
4. Restart service: Railway Dashboard → Service → "Restart"

---

## Production Checklist

- [ ] Changed default admin password
- [ ] Configured custom domain
- [ ] Updated Stripe webhook URL
- [ ] Tested checkout flow end-to-end
- [ ] Verified webhook processing
- [ ] Set up monitoring/alerts
- [ ] Backed up database
- [ ] Configured error tracking (Sentry)
- [ ] Added privacy policy and terms
- [ ] Enabled HTTPS (auto with Railway)
- [ ] Tested mobile responsiveness

---

## Security Recommendations

1. **Environment Variables**: Never commit `.env` to git
2. **API Keys**: Use production keys for live deployment
3. **HTTPS**: Railway provides automatic SSL
4. **Rate Limiting**: Add to API routes for production
5. **Input Validation**: Already implemented with Zod
6. **SQL Injection**: Protected by Prisma
7. **XSS**: React auto-escapes by default
8. **CSRF**: Consider adding tokens for forms

---

## Cost Optimization

Railway charges based on usage:

**Free Tier:**
- $5 credit/month
- Good for development/testing

**Pro Plan ($20/month):**
- Unlimited projects
- Better performance
- Team collaboration

**Optimize costs:**
- Use preview environments sparingly
- Clean up unused deployments
- Monitor resource usage
- Scale down dev environments

---

## Support

**Railway Issues:**
- Discord: [railway.app/discord](https://railway.app/discord)
- Docs: [docs.railway.app](https://docs.railway.app)

**BizLift Issues:**
- GitHub: [your-repo]/issues
- Email: support@bizlift.com

---

✅ **Your BizLift platform is now live on Railway with full Stripe integration!**
