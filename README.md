# BizLift - Small Business Funding Platform

A production-ready SaaS platform built with Next.js 15, Prisma, PostgreSQL, and Stripe that helps small businesses find and apply for funding programs using AI-powered matching.

## Features

- **Business Onboarding** - Multi-step form to capture business profile
- **AI-Powered Matching** - Smart algorithm matches businesses with 100+ funding programs
- **Stripe Integration** - Subscriptions and one-time purchases
- **Role-Based Access** - Client and Admin dashboards
- **Railway Deployment** - Zero-config cloud deployment

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js
- **Payments:** Stripe (Subscriptions + One-time)
- **Deployment:** Railway

## Project Structure

```
BusinessPlatform/
├── app/
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth & registration
│   │   ├── stripe/               # Stripe endpoints
│   │   │   ├── create-checkout-session/
│   │   │   ├── webhook/
│   │   │   └── billing-portal/
│   │   ├── onboarding/           # Business profile
│   │   ├── funding/              # Recommendations & programs
│   │   └── admin/                # Admin management
│   ├── auth/                     # Auth pages
│   ├── onboarding/               # Onboarding flow
│   ├── dashboard/                # Client dashboard
│   ├── admin/                    # Admin dashboard
│   ├── pricing/                  # Pricing page
│   └── checkout/                 # Success/cancel pages
├── components/
│   └── ui/                       # Reusable UI components
├── lib/
│   ├── prisma.ts                 # Prisma client
│   ├── stripe.ts                 # Stripe client
│   ├── auth.ts                   # NextAuth config
│   ├── fundingEngine.ts          # Matching algorithm
│   └── utils.ts                  # Utility functions
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Seed script
│   └── migrations/               # Database migrations
├── public/
│   ├── fundingPrograms.json      # Funding program data
│   └── stripeProducts.json       # Stripe product definitions
└── railway.json                  # Railway deployment config
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or use Railway's)
- Stripe account
- Railway account (for deployment)

### Local Development Setup

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd BusinessPlatform
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bizlift"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-a-random-32-character-string>"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

STRIPE_SUCCESS_URL="http://localhost:3000/checkout/success"
STRIPE_CANCEL_URL="http://localhost:3000/checkout/cancel"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Generate NEXTAUTH_SECRET**

```bash
openssl rand -base64 32
```

5. **Set up Stripe**

- Go to [Stripe Dashboard](https://dashboard.stripe.com)
- Get your API keys from Developers > API keys
- Create products and prices (or use test mode)

6. **Run database migrations**

```bash
npx prisma migrate dev --name init
```

7. **Seed the database**

```bash
npm run prisma:seed
```

This creates:
- Admin user: `admin@bizlift.com` / `Admin123!`
- Demo user: `demo@example.com` / `Demo123!`
- 12 funding programs
- Sample recommendations

8. **Start development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Testing Stripe Locally

1. **Install Stripe CLI**

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe

# Or download from https://stripe.com/docs/stripe-cli
```

2. **Login to Stripe**

```bash
stripe login
```

3. **Forward webhooks to local server**

```bash
npm run stripe:listen
```

This will output a webhook signing secret. Add it to your `.env`:

```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

4. **Test checkout flow**

- Go to http://localhost:3000/pricing
- Use Stripe test card: `4242 4242 4242 4242`
- Any future expiry date and CVC

## Stripe Setup Guide

### Creating Products and Prices

#### Option 1: Use Stripe Dashboard

1. Go to Stripe Dashboard > Products
2. Create products matching `public/stripeProducts.json`:

**Premium Monthly:**
- Name: "BizLift Premium - Monthly"
- Price: $29.99/month recurring
- Copy the Price ID to your checkout code

**Premium Annual:**
- Name: "BizLift Premium - Annual"
- Price: $299.99/year recurring
- Copy the Price ID

**One-time products:**
- Onboarding Boost: $99.99 one-time
- Application Support: $149.99 one-time

#### Option 2: Use Stripe CLI

```bash
# Create subscription product
stripe products create \
  --name="BizLift Premium - Monthly" \
  --description="Unlimited funding matches and premium support"

# Create price
stripe prices create \
  --product=<product-id> \
  --unit-amount=2999 \
  --currency=usd \
  --recurring interval=month
```

### Webhook Configuration

#### For Local Development

Use Stripe CLI (see above)

#### For Production (Railway)

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Enter URL: `https://your-app.up.railway.app/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret to Railway environment variables

## Railway Deployment

### Prerequisites

- Railway account: [railway.app](https://railway.app)
- GitHub repository with your code

### Deployment Steps

1. **Create new Railway project**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

2. **Add PostgreSQL database**

In Railway dashboard:
- Click "New" > "Database" > "PostgreSQL"
- Railway auto-provisions and sets `DATABASE_URL`

3. **Set environment variables**

In Railway dashboard, add these variables:

```env
NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
NEXTAUTH_SECRET=<your-secret>

STRIPE_SECRET_KEY=<your-key>
STRIPE_PUBLISHABLE_KEY=<your-key>
STRIPE_WEBHOOK_SECRET=<your-webhook-secret>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-key>

STRIPE_SUCCESS_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}/checkout/success
STRIPE_CANCEL_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}/checkout/cancel

NEXT_PUBLIC_APP_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
```

4. **Deploy**

Push to GitHub and Railway auto-deploys, or:

```bash
railway up
```

5. **Run migrations**

After first deploy:

```bash
railway run npx prisma migrate deploy
```

6. **Seed database**

```bash
railway run npm run prisma:seed
```

7. **Configure Stripe webhook**

Use your Railway URL in Stripe webhook settings:
`https://your-app.up.railway.app/api/stripe/webhook`

### Railway Configuration

The `railway.json` file configures:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx prisma generate && npm run build"
  },
  "deploy": {
    "startCommand": "npx prisma migrate deploy && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Migrations run automatically on deploy** via the `startCommand`.

## Database Schema

### Key Models

**User** - Authentication and account info
**BusinessProfile** - Business details for matching
**FundingProgram** - Available funding opportunities
**Recommendation** - Matched programs with scores
**Customer** - Stripe customer mapping
**Subscription** - Active subscriptions
**Purchase** - One-time purchases

See `prisma/schema.prisma` for full schema.

## Funding Matching Algorithm

Located in `lib/fundingEngine.ts`, the algorithm:

1. **Filters** programs by hard requirements (industry, location, revenue)
2. **Scores** each program 0-100 based on:
   - Industry match (25 points)
   - Revenue requirements (20 points)
   - Employee count (10 points)
   - Years in business (10 points)
   - Credit score (15 points)
   - Collateral availability (10 points)
   - Location match (10 points)
   - Funding amount fit (10 points)
   - Favorable terms (bonuses)

3. **Returns** sorted recommendations with reasons

## API Endpoints

### Authentication

- `POST /api/auth/register` - Create account
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Business Profile

- `GET /api/onboarding` - Get profile
- `POST /api/onboarding` - Create/update profile

### Funding

- `GET /api/funding/recommendations` - Get matches
- `POST /api/funding/recommendations` - Update status
- `GET /api/funding/programs` - List all programs

### Stripe

- `POST /api/stripe/create-checkout-session` - Create checkout
- `POST /api/stripe/webhook` - Handle webhooks
- `POST /api/stripe/billing-portal` - Customer portal

### Admin

- `GET /api/admin/programs` - List programs
- `POST /api/admin/programs` - Create program
- `PATCH /api/admin/programs/[id]` - Update program
- `DELETE /api/admin/programs/[id]` - Delete program
- `GET /api/admin/users` - List users

## Security Best Practices

✅ **Implemented:**

- Password hashing with bcrypt
- JWT-based sessions (NextAuth)
- Stripe webhook signature verification
- Role-based access control
- SQL injection prevention (Prisma)
- Environment variable protection

⚠️ **Recommendations:**

- Enable HTTPS in production (Railway does this)
- Add rate limiting for API routes
- Implement CSRF protection for forms
- Add input sanitization for user data
- Set up monitoring and error tracking (Sentry, LogRocket)

## Troubleshooting

### Prisma Issues

**Error: "Can't reach database server"**

```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection
npx prisma db push
```

### Stripe Webhooks

**Error: "No signatures found matching the expected signature"**

- Ensure `STRIPE_WEBHOOK_SECRET` matches your endpoint
- Use raw body for webhook route (already configured)
- Check Stripe CLI is forwarding to correct port

**Webhook not triggering:**

```bash
# Check webhook endpoint
curl -X POST https://your-app.com/api/stripe/webhook

# View Stripe webhook logs
stripe listen --print-secret
```

### Railway Deployment

**Build fails:**

- Check build logs in Railway dashboard
- Verify all dependencies in `package.json`
- Ensure Prisma schema is valid

**Migrations fail:**

```bash
# Run manually
railway run npx prisma migrate deploy

# Or reset database (CAUTION: deletes data)
railway run npx prisma migrate reset
```

## Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio

# Stripe
npm run stripe:listen    # Forward webhooks locally
```

## Pricing Tiers

**Free:**
- 3 funding recommendations
- Basic profile creation
- Access to funding database

**Premium Monthly ($29.99/mo):**
- Unlimited recommendations
- Priority support
- Monthly coaching session
- Advanced analytics

**Premium Annual ($299.99/yr):**
- All Premium features
- 2 months free
- Quarterly reports
- Dedicated account manager

**One-time Services:**
- Onboarding Boost: $99.99
- Application Support: $149.99

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file

## Support

For issues and questions:
- GitHub Issues: [your-repo]/issues
- Email: support@bizlift.com
- Documentation: [your-docs-url]

---

## ✅ BizLift Railway deployment ready (with Stripe integration)

Your application is now fully configured for production deployment on Railway with complete Stripe payment processing!

### Quick Start Checklist

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Set up PostgreSQL database
- [ ] Configure Stripe API keys
- [ ] Run `npx prisma migrate dev`
- [ ] Run `npm run prisma:seed`
- [ ] Start dev server with `npm run dev`
- [ ] Deploy to Railway
- [ ] Configure Stripe webhooks for production
- [ ] Test checkout flow

### Default Login Credentials

**Admin:**
- Email: `admin@bizlift.com`
- Password: `Admin123!`

**Demo User:**
- Email: `demo@example.com`
- Password: `Demo123!`

**Change these in production!**
