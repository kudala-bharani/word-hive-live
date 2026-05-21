# 🚀 Deployment Guide - Word Hive Live

This guide covers deploying your Word Hive Live game to various platforms.

## ⚡ Quick Deploy Options

### 🔷 Option 1: Vercel (Recommended - Easiest)

Vercel is made by the Next.js team and provides the best experience.

**Steps:**

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub account
   - Select your repository
   - Click "Deploy"

3. **Done!** 🎉
   - Vercel auto-detects Next.js
   - Automatic HTTPS
   - Global CDN
   - Preview deployments for PRs

**Your site will be live at:** `https://your-project-name.vercel.app`

### 🔷 Option 2: Netlify

**Steps:**

1. **Push code to GitHub** (same as above)

2. **Deploy to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import existing project"
   - Connect GitHub
   - Select repository
   - Configure:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy"

3. **Add Build Plugin**
   - Go to Site settings → Build & Deploy → Build plugins
   - Add "Next.js Build Plugin"

**Your site will be live at:** `https://your-site-name.netlify.app`

### 🔷 Option 3: Self-Hosted (VPS/Server)

For running on your own server (Ubuntu/Debian):

**Prerequisites:**
- Server with Node.js 16+
- Domain name (optional)
- SSH access

**Steps:**

1. **Connect to server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone repository**
   ```bash
   git clone YOUR_REPO_URL
   cd word-hive-live
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Run with PM2**
   ```bash
   sudo npm install -g pm2
   pm2 start npm --name "word-hive" -- start
   pm2 save
   pm2 startup
   ```

7. **Set up Nginx (optional)**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔧 Production Upgrade: Real-Time Features

For **true multiplayer** across different devices, upgrade to real-time database:

### Using Supabase (Recommended)

**Step 1: Create Supabase Project**

1. Visit [supabase.com](https://supabase.com)
2. Create new project
3. Note your project URL and anon key

**Step 2: Set Up Database**

In Supabase SQL Editor, run:

```sql
-- Create rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  host_id TEXT NOT NULL,
  host_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting',
  duration INTEGER NOT NULL,
  start_time BIGINT,
  end_time BIGINT,
  puzzle_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create players table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_code TEXT REFERENCES rooms(code) ON DELETE CASCADE,
  name TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  words_found TEXT[] DEFAULT '{}',
  is_host BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE players;

-- Add indexes
CREATE INDEX idx_rooms_code ON rooms(code);
CREATE INDEX idx_players_room ON players(room_code);
```

**Step 3: Update Code**

1. **Install Supabase client**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Add environment variables**
   
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Update `lib/supabase.js`**
   
   Replace in-memory functions with Supabase calls:
   ```javascript
   import { createClient } from '@supabase/supabase-js';

   const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
   );

   export async function createRoom(roomCode, hostName, duration) {
     const { data, error } = await supabase
       .from('rooms')
       .insert([{ code: roomCode, host_name: hostName, duration }])
       .select()
       .single();
     
     // Also create host player record
     // ...return data
   }
   
   // Update other functions similarly...
   ```

4. **Add real-time subscriptions**
   ```javascript
   export function subscribeToRoom(roomCode, callback) {
     const subscription = supabase
       .channel(`room:${roomCode}`)
       .on('postgres_changes', 
         { event: '*', schema: 'public', table: 'rooms', filter: `code=eq.${roomCode}` },
         callback
       )
       .subscribe();

     return () => subscription.unsubscribe();
   }
   ```

**Step 4: Deploy**

Deploy to Vercel with environment variables:
- Go to Project Settings → Environment Variables
- Add `NEXT_PUBLIC_SUPABASE_URL`
- Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Redeploy

### Using Firebase

**Step 1: Create Firebase Project**

1. Visit [firebase.google.com](https://firebase.google.com)
2. Create new project
3. Enable Realtime Database

**Step 2: Install Firebase**

```bash
npm install firebase
```

**Step 3: Update Code**

Similar process to Supabase but using Firebase SDK.

## 🌍 Custom Domain

### Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records

## 📊 Analytics (Optional)

### Google Analytics

1. **Create GA4 property**
2. **Add to `pages/_app.js`:**

```javascript
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}
      </Script>
      <Component {...pageProps} />
    </>
  );
}
```

## 🔒 Security Checklist

Before going live:

- [ ] Add rate limiting
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Enable CORS properly
- [ ] Add CSP headers
- [ ] Set up error logging (Sentry)
- [ ] Implement room expiration
- [ ] Add profanity filter for names
- [ ] Test with malicious inputs

## 🎯 Performance Optimization

- [ ] Enable Next.js image optimization
- [ ] Add loading states
- [ ] Implement code splitting
- [ ] Compress static assets
- [ ] Use CDN for static files
- [ ] Add service worker (PWA)
- [ ] Monitor Core Web Vitals

## 📱 PWA (Progressive Web App)

Make it installable on mobile:

1. **Install next-pwa**
   ```bash
   npm install next-pwa
   ```

2. **Update next.config.js**
   ```javascript
   const withPWA = require('next-pwa')({
     dest: 'public'
   });

   module.exports = withPWA({
     reactStrictMode: true,
   });
   ```

3. **Add manifest.json**
4. **Add service worker**

## 🐛 Troubleshooting

### Build Errors

**Error: Module not found**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Error: Port in use**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
```

### Runtime Errors

**Real-time not working**
- Check Supabase/Firebase credentials
- Verify real-time is enabled in dashboard
- Check browser console for errors

**Images not loading**
- Check `next.config.js` image domains
- Verify public folder structure

## 📈 Scaling Tips

As your app grows:

1. **Use Redis** for session management
2. **Add load balancer** for multiple instances
3. **Implement caching** (CDN, Redis)
4. **Use database connection pooling**
5. **Monitor performance** (New Relic, Datadog)
6. **Set up auto-scaling**

## ✅ Pre-Launch Checklist

- [ ] Test on mobile devices
- [ ] Test in all major browsers
- [ ] Check loading performance
- [ ] Verify all links work
- [ ] Test with 10 players
- [ ] Check error handling
- [ ] Review analytics setup
- [ ] Test room expiration
- [ ] Verify environment variables
- [ ] Set up monitoring/alerts
- [ ] Create backup strategy
- [ ] Document deployment process

## 🎉 You're Ready!

Your Word Hive Live game is now deployed and ready for players!

**Next Steps:**
- Share the URL with your team
- Monitor usage and performance
- Collect feedback
- Iterate and improve!

---

Need help? Check the main README.md or review deployment platform docs.
