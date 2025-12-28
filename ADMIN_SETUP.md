# Admin Access Setup Guide

## Admin Credentials

**Email:** `admin@nextignition.com`  
**Password:** `Admin@2024#Secure`

## Quick Setup in Supabase

### Step 1: Create Admin User in Supabase

1. **Go to Supabase Dashboard** → **Authentication** → **Users**

2. **Click "Add User"** or "Create New User"

3. **Enter the credentials:**

   - **Email:** `admin@nextignition.com`
   - **Password:** `Admin@2024#Secure`
   - **Auto Confirm User:** ✅ Check this box (to bypass email verification)

4. **Click "Create User"**

### Step 2: Set Admin Role in Profiles Table

1. **Go to Supabase Dashboard** → **Table Editor** → **profiles** table

2. **Find the user** you just created (search by email: `admin@nextignition.com`)

3. **Click on the row** to edit it

4. **Set these values:**

   - `role`: `admin`
   - `onboarding_completed`: `true`
   - `full_name`: `Admin User` (or any name you prefer)

5. **Save the changes**

### Step 3: Login to Admin Dashboard

1. **Open the app** (mobile or web)

2. **Go to Login screen**

3. **Enter credentials:**

   - Email: `admin@nextignition.com`
   - Password: `Admin@2024#Secure`

4. **Click Sign In**

5. ✅ **You'll be redirected directly to the Admin Dashboard!**

---

## Alternative: Using SQL in Supabase

You can also run this SQL query in Supabase SQL Editor after creating the user:

```sql
-- First, create the user in Authentication (do this manually in UI)
-- Then run this to set admin role:

UPDATE profiles
SET
  role = 'admin',
  onboarding_completed = true,
  full_name = 'Admin User',
  updated_at = now()
WHERE email = 'admin@nextignition.com';
```

---

## What Happens on Admin Login?

When you login with `admin@nextignition.com`:

1. ✅ System detects the admin email
2. ✅ Verifies the user has `role = 'admin'` in profiles table
3. ✅ **Bypasses role selection** (no role selection screen)
4. ✅ **Bypasses onboarding** (no onboarding process)
5. ✅ Redirects directly to **Admin Dashboard**

---

## Admin Dashboard Features

Once logged in, you can access:

- 📊 **Dashboard** - Overview and statistics
- 👥 **Users Management** - View and manage all users
- 📈 **Reports** - Generate system reports
- 📉 **Analytics** - View platform analytics
- ⚙️ **Settings** - Admin-specific settings
- 💬 **Support** - Handle support tickets
- 🎥 **Webinar Management** - Manage events and webinars

---

## Access Admin Panel Anytime

If you're logged in as admin, access the admin dashboard from:

**Profile Menu** (top-right) → **Admin Dashboard**

---

## Changing Admin Credentials

To use different admin credentials:

1. **Edit** `constants/admin.ts`
2. **Change** the email in `ADMIN_CREDENTIALS.email`
3. **Create user** in Supabase with your new email
4. **Set role** to `admin` in profiles table

---

## Security Notes

⚠️ **Important for Production:**

- Change the default password immediately
- Use a strong, unique password
- Enable MFA (Multi-Factor Authentication) in Supabase
- Restrict admin access by IP if possible
- Monitor admin activity through logs
- Store credentials in environment variables

---

## Troubleshooting

**Problem:** Not redirecting to admin dashboard  
**Solution:** Check that `role = 'admin'` in the profiles table

**Problem:** "Access Denied" on admin pages  
**Solution:** Ensure `onboarding_completed = true` in profiles table

**Problem:** Can't login  
**Solution:** Verify the user is confirmed in Supabase Authentication

**Problem:** Admin option not in profile menu  
**Solution:** Sign out and sign back in to refresh profile data
