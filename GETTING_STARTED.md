# Getting Started with Word Hive Live

## Quick Start (5 minutes)

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages (Next.js, React, Tailwind CSS, etc.)

### Step 2: Start the Development Server

```bash
npm run dev
```

You should see output like:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 3: Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

You should see the Word Hive Live landing page! 🎉

## Testing the Game

### As Host (Tab/Window 1):

1. Click "Create Room"
2. Enter your name (e.g., "Alice")
3. Select game duration (e.g., 10 minutes)
4. Click "Create Game Room"
5. You'll see a 6-character room code (e.g., "ABC123")
6. Wait for players to join

### As Player (Tab/Window 2):

1. Open a new browser tab/window to http://localhost:3000
2. Click "Join Room"
3. Enter the room code from the host
4. Enter your name (e.g., "Bob")
5. Click "Join Game"

### Playing:

1. Host clicks "Start Game" when ready
2. Everyone sees the same 7 letters
3. Type words using those letters
4. Every word must include the center letter
5. Submit words to earn points
6. Watch the live leaderboard update!

## Game Rules Quick Reference

✅ **Valid Words:**
- At least 4 letters long
- Contains the center letter
- Uses only the 7 available letters
- Can reuse letters multiple times

🏆 **Scoring:**
- 4-letter word = 1 point
- 5+ letter word = length in points
- Pangram (uses all 7 letters) = word length + 7 bonus points

## Demo Mode Notes

The current version uses **in-memory state**, which means:

- ✅ Perfect for testing and demos
- ✅ No database setup required
- ✅ Works immediately out of the box
- ⚠️ All data is lost on page refresh
- ⚠️ Only works in the same browser instance
- ⚠️ Not suitable for production with real users

**For production use**: See README.md for instructions on upgrading to Supabase or Firebase.

## Common Issues

### Port Already in Use

If port 3000 is taken, you can use a different port:

```bash
npm run dev -- -p 3001
```

Then access the app at http://localhost:3001

### Node Version Issues

This project requires Node.js 16 or higher. Check your version:

```bash
node --version
```

If you need to upgrade, visit [nodejs.org](https://nodejs.org)

### Module Not Found Errors

Try deleting `node_modules` and reinstalling:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. ✅ **Test the game** with multiple browser tabs
2. 📝 **Customize puzzles** in `lib/puzzles.js`
3. 🎨 **Adjust styling** in `tailwind.config.js` and `styles/globals.css`
4. 🚀 **Deploy** to Vercel or Netlify (see Deployment section)

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Click "Deploy"

Vercel will automatically detect Next.js and configure everything!

### Deploy to Netlify

1. Push your code to GitHub
2. Visit [netlify.com](https://netlify.com)
3. Connect your repository
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Click "Deploy"

## Production Upgrade

For **real multiplayer** across different devices/browsers:

1. **Create a Supabase account** (free tier available)
2. **Set up database tables** for rooms and players
3. **Update `lib/supabase.js`** to use real Supabase client
4. **Add environment variables** for API keys
5. **Enable real-time subscriptions**

See README.md for detailed instructions.

## Need Help?

- Check the main README.md for detailed documentation
- Review the code comments in each file
- Open an issue on GitHub

Happy word hunting! 🐝📝
