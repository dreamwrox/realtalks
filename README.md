# Talks Live — a real messenger (two real people can chat)

This version uses **Supabase** for accounts, a database, and real-time delivery.
Follow the steps in order. It takes about 10 minutes.

---

## Part 1 — Set up Supabase (the backend)

1. Go to **https://supabase.com** → sign up (free) → **New project**.
   - Give it a name, set a database password (save it somewhere), pick the closest region.
   - Wait ~2 minutes for it to finish setting up.

2. In your project, open **SQL Editor** (left sidebar) → **New query**.
   - Open the file **`supabase-setup.sql`** from this folder, copy everything, paste it in, and click **Run**.
   - You should see "Success. No rows returned." That created your tables and rules.

3. Turn off email confirmation (so you can test quickly):
   - Go to **Authentication** → **Sign In / Providers** (or **Providers → Email**).
   - Turn **OFF** "Confirm email" and save.
   - (You can turn it back on later for a real launch.)

4. Get your two keys:
   - Go to **Project Settings** (gear icon) → **API**.
   - Copy the **Project URL** and the **anon public** key.
   - The anon key is meant to be used in the browser — it's safe, because the
     rules from step 2 control what it can actually do.

---

## Part 2 — Run it on your computer

1. In this folder, make a copy of **`.env.example`** and name the copy **`.env`**.
   Open `.env` and paste your two values:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

2. In a terminal in this folder:
   ```bash
   npm install
   npm run dev
   ```
   Open the `http://localhost:5173` link it prints.

3. Click **"Create one"**, pick a username, email, and password, and sign up.
   You're in!

---

## Part 3 — Actually chat with a friend

Both people need an account on the **same deployed app** (or same Supabase project).

1. Your friend signs up too and picks their own username.
2. In the box on the left, type **their username** and press **Chat**.
3. Send a message — it appears on their screen live, and theirs on yours.

To let a friend who isn't at your computer join, do Part 4 to put it online.

---

## Part 4 — Put it online (so friends can use it anywhere / on phones)

Deploy with Vercel, exactly like before:
```bash
npm install -g vercel
vercel
```
Then in the Vercel dashboard → your project → **Settings → Environment Variables**,
add BOTH of these (same values as your `.env`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Redeploy: `vercel --prod`. Share the live link with your friend — they open it,
sign up, and you can chat. On a phone, open the link and use **Add to Home Screen**.

---

## What this version does (and doesn't) do yet
- ✅ Real accounts, real 1-to-1 chats, messages delivered live, saved in the cloud.
- ✅ Your friend on another device/phone sees your messages instantly.
- ⛔ No groups, voice notes, photos, or typing indicators yet — this build focuses on
  getting real messaging solid first. Those can be added on top later.

## Troubleshooting
- **"Almost there" screen** → your `.env` is missing or the app wasn't restarted. Check the two values and re-run `npm run dev`.
- **"No user with that username"** → your friend hasn't signed up yet, or the username was typed differently. Usernames are lowercase.
- **Sign-up says confirm your email** → you skipped step 3 (turn off "Confirm email").
- **Messages don't arrive live** → make sure the SQL ran fully (it enables realtime on the last line).
