# Supabase Setup Instructions

## Quick Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Sign in with GitHub (recommended) or email
4. Create a new organization (if needed)
5. Click "New Project"

### Step 2: Project Configuration

Fill in the project details:
- **Name**: Your project name (e.g., "KumiBox")
- **Database Password**: Create a strong password (save it!)
- **Region**: Choose closest to your users
- **Pricing Plan**: Free tier (perfect for up to 50,000 users)

Click "Create new project" (takes 1-2 minutes)

### Step 3: Get API Keys

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### Step 5: Enable Email Auth

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional):
   - Welcome email
   - Password reset email
   - Email confirmation

### Step 6: Set Up Email (Optional but Recommended)

For production, configure SMTP:
1. Go to **Settings** → **Auth** → **SMTP Settings**
2. Add your SMTP credentials (SendGrid, AWS SES, etc.)
3. Or use Supabase's built-in email (limited on free tier)

### Step 7: Test It

Run the app and try logging in - it should work!

## Free Tier Limits

- ✅ **50,000 monthly active users** (plenty for your 5,000 user goal)
- ✅ **500 MB database storage**
- ✅ **2 GB bandwidth**
- ✅ **Unlimited API requests**

## When to Upgrade

Upgrade to Pro ($25/month) when you need:
- More database storage
- More bandwidth
- Priority support
- Daily backups

## Security Notes

- ✅ The `anon` key is safe to use in frontend (protected by Row Level Security)
- ✅ Never expose your `service_role` key in frontend code
- ✅ Row Level Security (RLS) is enabled by default
- ✅ All auth endpoints are secure and rate-limited

## Next Steps

After setup:
1. Test login/register flows
2. Configure user profiles table (if needed)
3. Set up Row Level Security policies
4. Configure email templates

## Troubleshooting

**"Invalid API key" error:**
- Check that you copied the full key (it's long!)
- Make sure `.env.local` is in the project root
- Restart your dev server after adding env vars

**"Email not confirmed" error:**
- Go to **Authentication** → **Settings**
- Disable "Enable email confirmations" for development
- Or check your email and confirm the account

**Can't connect to Supabase:**
- Check your internet connection
- Verify the project URL is correct
- Make sure the project is active (not paused)

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
