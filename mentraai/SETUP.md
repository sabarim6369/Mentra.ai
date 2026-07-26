# Mentra.ai - Setup Guide

## Prerequisites

1. **Node.js** (v20 or higher)
2. **PostgreSQL** database
3. **npm/yarn/pnpm/bun** package manager
4. **ngrok** (for local webhook testing)
5. **Git**

## Step 1: Install Dependencies

Navigate to the project directory and install dependencies:

```bash
cd mentra.ai/huddleai
npm install
```

## Step 2: Set Up PostgreSQL Database

1. Create a PostgreSQL database
2. Get the connection string in format: `postgresql://user:password@host:port/database`

## Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your actual values:

### Required Environment Variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stream.io Video (Get from https://dashboard.getstream.io/)
NEXT_PUBLIC_STREAM_VIDEO_API_KEY=your_stream_api_key
STREAM_VIDEO_SECRET_KEY=your_stream_secret_key

# Google OAuth (Get from https://console.cloud.google.com/)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth (Get from https://github.com/settings/developers)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Google Gemini AI (Get from https://ai.google.dev/)
GEMINI_API_KEY=your_gemini_api_key

# OpenAI API (Get from https://platform.openai.com/)
OPENAI_API_KEY=your_openai_api_key

# Inngest (Get from https://app.inngest.com/)
INNGEST_SIGNING_KEY=your_inngest_signing_key
INNGEST_EVENT_KEY=your_inngest_event_key
```

### How to Get API Keys:

**Stream.io:**
1. Sign up at https://dashboard.getstream.io/
2. Create a new app
3. Copy API Key and Secret from dashboard

**Google OAuth:**
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

**GitHub OAuth:**
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Set callback URL to `http://localhost:3000/api/auth/callback/github`

**Gemini API:**
1. Go to https://ai.google.dev/
2. Create API key

**OpenAI API:**
1. Go to https://platform.openai.com/
2. Create API key

**Inngest:**
1. Sign up at https://app.inngest.com/
2. Create new app
3. Get signing key and event key from dashboard

## Step 4: Set Up Database Schema

Run database migrations:

```bash
npm run db:push
```

This will create all required tables in your PostgreSQL database.

## Step 5: Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

## Step 6: Start Inngest Dev Server (Optional but Recommended)

In a new terminal:

```bash
npm run inngest:dev
```

This starts the Inngest development server for background job processing.

## Step 7: Set Up ngrok for Webhooks (Required for Video Features)

In a new terminal:

```bash
npm run dev:webhook
```

This starts ngrok and provides a public URL. Copy this URL and:

1. Configure Stream.io webhook settings to use: `YOUR_NGROK_URL/api/webhook`
2. Configure Inngest to use: `YOUR_NGROK_URL/api/inngest`

## Available Scripts

- `npm run dev` - Start Next.js dev server (with Turbo)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:generate` - Generate database migrations
- `npm run db:reset` - Reset database
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run dev:webhook` - Start ngrok for webhook testing
- `npm run inngest:dev` - Start Inngest dev server

## Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── api/          # API routes (webhook, inngest, etc.)
│   ├── auth/         # Authentication pages
│   ├── dashboard/    # Dashboard pages
│   └── call/         # Video call pages
├── components/       # Reusable UI components
├── db/              # Database schema and connection
├── hooks/           # Custom React hooks
├── inngest/         # Background job functions
├── lib/             # Utility functions
├── modules/         # Feature modules (agents, meetings, etc.)
└── trpc/            # tRPC API setup
```

## Troubleshooting

**Database connection issues:**
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check database permissions

**Webhook not working:**
- Ensure ngrok is running
- Check Stream.io webhook configuration
- Verify webhook URL is accessible

**Inngest not processing jobs:**
- Ensure Inngest dev server is running
- Check INNGEST_SIGNING_KEY and INNGEST_EVENT_KEY
- Verify Inngest app configuration

**Authentication issues:**
- Verify OAuth redirect URIs are configured correctly
- Check Google/GitHub OAuth credentials
- Ensure NEXT_PUBLIC_APP_URL is set correctly
