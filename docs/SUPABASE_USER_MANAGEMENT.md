# Supabase User Management Guide

## How to View Registered Users

### Method 1: Supabase Dashboard (Easiest)

1. **Go to your Supabase Dashboard**
   - Visit [supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Navigate to Authentication**
   - Click **"Authentication"** in the left sidebar
   - Click **"Users"** tab

3. **View Users**
   - You'll see a list of all registered users
   - Each user shows:
     - Email address
     - User ID (UUID)
     - Created date
     - Last sign in
     - Confirmed status
     - Authentication method

4. **User Details**
   - Click on any user to see:
     - Full profile information
     - User metadata (like name if provided)
     - Authentication providers
     - Sessions
     - Audit logs

### Method 2: Using SQL Editor

1. **Open SQL Editor**
   - In Supabase Dashboard, click **"SQL Editor"** in the left sidebar
   - Click **"New query"**

2. **Run Query**
   ```sql
   -- View all users
   SELECT 
     id,
     email,
     created_at,
     last_sign_in_at,
     email_confirmed_at,
     raw_user_meta_data
   FROM auth.users
   ORDER BY created_at DESC;
   ```

3. **Count Users**
   ```sql
   -- Count total users
   SELECT COUNT(*) as total_users FROM auth.users;
   ```

### Method 3: Using Supabase API (Programmatic)

You can also query users programmatically using the Supabase Admin API (requires service role key - **NEVER expose this in frontend code**):

```typescript
// Backend only - requires service_role key
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Admin key
);

// List users
const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
```

## User Information Available

### In Dashboard:
- **Email**: User's email address
- **User ID**: Unique identifier (UUID)
- **Created At**: Registration timestamp
- **Last Sign In**: Most recent login time
- **Email Confirmed**: Whether email is verified
- **Phone**: Phone number (if provided)
- **Metadata**: Custom user data (like name)

### In Database:
- All authentication data is in `auth.users` table
- User metadata is in `raw_user_meta_data` JSON column
- Sessions are tracked in `auth.sessions` table

## Common Tasks

### Delete a User
1. Go to Authentication → Users
2. Click on the user
3. Click "Delete user" button
4. Confirm deletion

### Reset User Password
1. Go to Authentication → Users
2. Click on the user
3. Click "Send password reset email"

### View User Activity
1. Go to Authentication → Users
2. Click on the user
3. View "Audit logs" tab to see all authentication events

## Security Notes

⚠️ **Important:**
- Never expose your `service_role` key in frontend code
- User data in `auth.users` is protected by Row Level Security (RLS)
- Only authenticated users can access their own data (unless you configure otherwise)
- Admin operations require service role key and should only run on backend

## Next Steps

- Set up Row Level Security (RLS) policies for user data
- Create user profiles table if you need additional user information
- Configure email templates for better user experience
- Set up user roles and permissions if needed
