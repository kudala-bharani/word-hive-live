# 🚀 START HERE - Word Hive Live

Welcome to **Word Hive Live** - your new multiplayer word puzzle game!

## ⚡ Quick Start (3 Steps)

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Start Development Server
```bash
npm run dev
```

### 3️⃣ Open Browser
Visit: **http://localhost:3000**

That's it! Your game is now running! 🎉

## 🎮 Test It Out

### Test with Multiple Players:

1. **Tab 1** (Host):
   - Click "Create Room"
   - Enter name: "Alice"
   - Select duration: 10 minutes
   - Click "Create Game Room"
   - Copy the room code (e.g., "ABC123")

2. **Tab 2** (Player):
   - Open new tab to http://localhost:3000
   - Click "Join Room"
   - Enter room code: "ABC123"
   - Enter name: "Bob"
   - Click "Join Game"

3. **Start Playing**:
   - Back to Tab 1 (Host): Click "Start Game"
   - Both tabs now show the same 7 letters!
   - Type words and submit
   - Watch scores update in real-time!

## 📚 Documentation

- **GETTING_STARTED.md** - Detailed setup guide
- **README.md** - Full documentation
- **PROJECT_OVERVIEW.md** - Technical details

## ✅ What's Included

✓ Complete multiplayer word game  
✓ Room creation and joining  
✓ 10 curated word puzzles  
✓ Real-time leaderboard  
✓ Timer functionality  
✓ Pangram detection  
✓ Responsive design  
✓ No login required  

## 🎨 Features

- **Up to 10 players** per room
- **4 game durations**: 5, 10, 15, 20 minutes
- **Smart scoring**: 4-letter = 1pt, 5+ = length, Pangrams = +7 bonus
- **Live updates**: See other players' scores in real-time
- **Mobile friendly**: Works on phones, tablets, and desktop
- **Easy sharing**: Copy room code or invite link

## 🔧 Customization

Want to customize? Edit these files:

- **Puzzles**: `lib/puzzles.js`
- **Colors**: `tailwind.config.js`
- **Scoring**: `lib/wordValidator.js`
- **Styles**: `styles/globals.css`

## 🚀 Deploy to Production

### Vercel (Easiest):
1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import repository
4. Click "Deploy"

### Other Options:
- Netlify
- AWS
- Heroku
- Your own server

## ⚠️ Important Note

**Demo Mode**: Currently uses in-memory state. Perfect for testing!

For production with real users across different devices:
- Upgrade to Supabase (recommended) or Firebase
- See README.md for instructions

## 🐛 Having Issues?

### Port Already in Use?
```bash
npm run dev -- -p 3001
```
Then visit: http://localhost:3001

### Module Errors?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Need Help?
- Check GETTING_STARTED.md
- Read README.md
- Review code comments

## 🎯 Next Steps

1. ✅ Test the game locally
2. 📝 Customize puzzles and styling
3. 🚀 Deploy to Vercel
4. 🌐 Share with your team!

## 📞 Support

Questions? Check the documentation files or review the code - it's well-commented!

---

**Ready to play?** Run `npm run dev` and visit http://localhost:3000! 🐝

Have fun! 🎉
