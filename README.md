# 🐝 Word Hive Live

A real-time multiplayer word puzzle game for teams and online meetings.

## Features

✨ **Multiplayer Fun**
- Up to 10 players per game room
- Real-time score updates and leaderboard
- No login or account required

🎮 **Engaging Gameplay**
- 7-letter word puzzles with one required center letter
- Create words 4+ letters long
- Find pangrams (words using all 7 letters) for bonus points
- Configurable game duration (5, 10, 15, or 20 minutes)

👥 **Perfect for Teams**
- Easy room creation with shareable codes
- Works great while screen-sharing in Zoom, Teams, or Meet
- Clean, modern interface optimized for all devices

## How to Play

1. **Create a Room**: Host creates a game and shares the 6-character room code
2. **Join**: Players enter the code and their name to join
3. **Play**: Form words using the 7 available letters
   - Every word must include the center letter
   - Words must be at least 4 letters long
   - Use letters as many times as needed
   - Find pangrams for bonus points!
4. **Compete**: Watch the live leaderboard and see who finds the most words
5. **Results**: View final scores and see all possible words

## Scoring System

- **4-letter word**: 1 point
- **5+ letter word**: 1 point per letter
- **Pangram bonus**: +7 points

Examples:
- "READ" (4 letters) = 1 point
- "GARDEN" (6 letters) = 6 points
- "READING" (7-letter pangram) = 7 + 7 = 14 points

## Tech Stack

- **Frontend**: Next.js 14 + React
- **Styling**: Tailwind CSS
- **State Management**: In-memory (for demo) - easily replaceable with Supabase/Firebase
- **Real-time**: Custom event system (demo mode)

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
word-hive-live/
├── components/          # React components
│   ├── LetterHive.js   # Honeycomb letter display
│   ├── Leaderboard.js  # Score ranking display
│   ├── Timer.js        # Countdown timer
│   └── WordInput.js    # Word submission form
├── lib/                # Utility functions
│   ├── puzzles.js      # Puzzle database (10 curated puzzles)
│   ├── supabase.js     # State management (in-memory for demo)
│   └── wordValidator.js# Word validation and scoring
├── pages/              # Next.js pages
│   ├── index.js        # Landing page
│   ├── create.js       # Create room page
│   ├── join.js         # Join room page
│   └── room/[roomCode].js # Game room (lobby + game + results)
├── styles/             # CSS styles
│   └── globals.css     # Global styles + Tailwind
└── public/             # Static assets
```

## Upgrading to Production

The current implementation uses in-memory state for simplicity. For production deployment with multiple users:

### Option 1: Supabase (Recommended)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create tables for rooms and players
3. Update `lib/supabase.js` to use the Supabase client
4. Enable real-time subscriptions

### Option 2: Firebase

1. Set up Firebase Realtime Database or Firestore
2. Update state management to use Firebase SDK
3. Configure real-time listeners

### Option 3: WebSockets

1. Add a Node.js WebSocket server (Socket.io)
2. Connect frontend to WebSocket server
3. Broadcast room updates to all connected clients

## Customization

### Adding More Puzzles

Edit `lib/puzzles.js` to add new puzzles:

```javascript
{
  id: 11,
  letters: ['Y', 'O', 'U', 'R', 'L', 'E', 'T', 'S'],
  centerLetter: 'E',
  validWords: ['your', 'words', 'here'],
  pangrams: ['pangram1', 'pangram2']
}
```

### Changing Theme Colors

Edit `tailwind.config.js` to customize the honey theme colors.

### Adjusting Game Rules

Edit `lib/wordValidator.js` to modify:
- Minimum word length
- Scoring system
- Validation rules

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations (Demo Mode)

- **No persistence**: Refreshing the page loses all data
- **Single server**: All rooms are in-memory, not shared across tabs/devices
- **No real-time sync**: Uses localStorage polling instead of WebSockets

These limitations are intentional for the demo. Upgrade to Supabase/Firebase for production use.

## Future Enhancements

- [ ] Daily puzzle mode
- [ ] Team vs team mode
- [ ] Custom word lists
- [ ] Difficulty levels
- [ ] Sound effects and animations
- [ ] Chat/reactions
- [ ] Export game results
- [ ] Admin dashboard
- [ ] Player statistics

## Contributing

This is a demonstration project. Feel free to fork and customize!

## License

MIT License - Feel free to use this project for any purpose.

## Acknowledgments

This game is inspired by word puzzle games but does not copy any specific implementation, branding, or proprietary content. All puzzles and word lists are original or from public domain sources.

## Support

For issues or questions, please open an issue on the repository.

---

Built with ❤️ for remote teams and word game enthusiasts!
