# Word Hive Live - Project Overview

## 🎯 Project Summary

**Word Hive Live** is a real-time multiplayer word puzzle game designed for remote teams and online meetings. Players create words from 7 letters, compete for high scores, and enjoy a fun, interactive experience together.

## 📱 User Journey

### 1. Landing Page (`/`)
- Welcome screen with game title and description
- Two main actions: "Create Room" or "Join Room"
- How to play instructions
- Clean, inviting design with honey/bee theme

### 2. Create Room Flow (`/create`)
- Host enters their name
- Selects game duration (5, 10, 15, or 20 minutes)
- System generates unique 6-character room code
- Redirects to lobby with room code displayed

### 3. Join Room Flow (`/join`)
- Player enters 6-character room code
- Player enters their display name
- System validates room exists and has space
- Handles duplicate names by adding numbers
- Redirects to lobby

### 4. Waiting Lobby (`/room/[roomCode]` - waiting status)
- Displays room code prominently
- Shows list of all joined players (max 10)
- Host badge displayed next to host name
- Game settings shown (duration, max players)
- Shareable invite link with copy button
- Host sees "Start Game" button
- Players see "Waiting for host..." message
- Real-time updates when players join

### 5. Active Game (`/room/[roomCode]` - active status)
- **Header Section:**
  - Room code display
  - Live countdown timer
  - Current player name

- **Main Game Area:**
  - Honeycomb-style letter display
    - 6 outer letters
    - 1 center letter (highlighted in gold)
  - Word input field
  - Submit button
  - Feedback messages (success/error/pangram)
  - Game rules reminder
  - Player's found words display

- **Sidebar:**
  - Live leaderboard with rankings
  - Player scores and word counts
  - Current player highlighted
  - Host badge displayed
  - "End Game Early" button (host only)

### 6. Results Page (`/room/[roomCode]` - ended status)
- Winner announcement with crown emoji
- Final leaderboard with rankings
- Statistics panel:
  - Total possible words
  - Number of pangrams available
- Pangrams list display
- Action buttons:
  - "Play Again" (host only) - resets and returns to lobby
  - "Back to Home" (all players)

## 🎮 Core Gameplay Mechanics

### Puzzle Structure
Each puzzle contains:
- 7 unique letters
- 1 designated center letter (required in all words)
- Pre-validated list of acceptable words
- List of pangrams (words using all 7 letters)

### Word Validation Rules
✅ **Valid if:**
- At least 4 letters long
- Contains the center letter
- Uses only the 7 available letters
- Exists in the puzzle's word list
- Not previously submitted by the same player

❌ **Invalid if:**
- Too short (< 4 letters)
- Missing center letter
- Contains letters not in the puzzle
- Not in dictionary
- Already found by player

### Scoring System
```
4-letter word:        1 point
5-letter word:        5 points
6-letter word:        6 points
7-letter word:        7 points
8-letter word:        8 points
...and so on

Pangram bonus:        +7 points

Example: "READING" (7 letters, uses all 7) = 7 + 7 = 14 points
```

### Game Flow
1. Host creates room → Lobby
2. Players join → Lobby updates in real-time
3. Host starts game → Timer begins
4. Players submit words → Scores update live
5. Timer ends OR host ends early → Results page
6. Host can "Play Again" → Returns to lobby with same players

## 🏗️ Technical Architecture

### Frontend (Next.js + React)
```
Pages:
├── index.js          - Landing page
├── create.js         - Room creation
├── join.js           - Room joining
└── room/[roomCode].js - Main game room (handles 3 states)

Components:
├── LetterHive.js     - Honeycomb letter display
├── Leaderboard.js    - Score ranking component
├── Timer.js          - Countdown timer with auto-end
└── WordInput.js      - Word submission form

Libraries:
├── puzzles.js        - Puzzle database (10 curated puzzles)
├── wordValidator.js  - Word validation & scoring logic
└── supabase.js       - State management (in-memory demo)
```

### State Management (Demo Mode)
- In-memory JavaScript objects
- Event subscription system for updates
- LocalStorage for player persistence
- Manual notification triggers

**Production Alternative:**
- Supabase real-time subscriptions
- Firebase Realtime Database
- WebSocket server (Socket.io)

### Data Models

#### Room
```javascript
{
  code: string,           // 6-char room code
  hostId: string,         // Player ID of host
  status: string,         // 'waiting' | 'active' | 'ended'
  duration: number,       // Game duration in minutes
  startTime: number,      // Timestamp
  endTime: number,        // Timestamp
  puzzleId: number,       // Selected puzzle ID
  players: [string],      // Array of player IDs
  createdAt: number       // Timestamp
}
```

#### Player
```javascript
{
  id: string,             // Unique player ID
  roomId: string,         // Room code
  name: string,           // Display name
  score: number,          // Current score
  wordsFound: [string],   // Array of found words
  isHost: boolean         // Host flag
}
```

#### Puzzle
```javascript
{
  id: number,
  letters: [string],      // 7 letters including center
  centerLetter: string,   // Required letter
  validWords: [string],   // All acceptable words
  pangrams: [string]      // Words using all 7 letters
}
```

## 🎨 Design System

### Color Palette (Honey Theme)
- **Primary**: Honey gold (#f59e0b, #fbbf24)
- **Backgrounds**: Cream/off-white (#fffbeb, #fef3c7)
- **Text**: Dark gray (#1f2937)
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Pangram**: Gold gradient (#fbbf24 → #f59e0b)

### UI Components
- **Cards**: White with rounded corners, shadow
- **Buttons**: Two styles - primary (gold) and secondary (outlined)
- **Inputs**: Clean borders, focus states
- **Letter cells**: Bordered squares with hover effects
- **Center letter**: Gold background, larger size

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Grid layouts adapt to screen size
- Touch-friendly tap targets

## 🔧 Customization Guide

### Adding Puzzles
Edit `lib/puzzles.js`:
```javascript
{
  id: 11,
  letters: ['N', 'E', 'W', 'L', 'T', 'R', 'S'],
  centerLetter: 'E',
  validWords: ['new', 'went', 'enter', ...],
  pangrams: ['newsletter']
}
```

### Changing Scoring
Edit `lib/wordValidator.js` → `calculateScore()` function

### Modifying Theme
Edit `tailwind.config.js` → `theme.extend.colors`

### Adjusting Timer
Edit room duration options in `pages/create.js`

### Word Length Rules
Edit `lib/wordValidator.js` → `validateWord()` function

## 📊 Current Limitations (Demo Mode)

1. **No Persistence**: Refresh loses all data
2. **Single Instance**: Works only in same browser
3. **No Cross-Device**: Can't join from different computers
4. **No Room Persistence**: Rooms disappear on server restart
5. **Limited Real-time**: Uses manual notifications

## 🚀 Production Readiness Checklist

To make this production-ready:

- [ ] Replace in-memory state with Supabase/Firebase
- [ ] Add real-time subscriptions
- [ ] Implement proper error handling
- [ ] Add loading states
- [ ] Set up analytics
- [ ] Add SEO metadata
- [ ] Implement room cleanup (expire old rooms)
- [ ] Add rate limiting
- [ ] Set up monitoring
- [ ] Create admin dashboard
- [ ] Add more puzzles (aim for 100+)
- [ ] Implement difficulty levels
- [ ] Add sound effects (optional)
- [ ] Create tutorial/onboarding
- [ ] Add accessibility features (ARIA labels, keyboard nav)
- [ ] Set up CI/CD pipeline

## 📈 Potential Enhancements

### Phase 2 Features
- Daily puzzle mode (everyone gets same puzzle)
- Team mode (teams compete against each other)
- Tournament brackets
- Player statistics and history
- Achievements/badges
- Custom puzzle creator
- Hint system
- Word definitions on hover

### Phase 3 Features
- Mobile apps (React Native)
- Social sharing of results
- Leaderboards across all games
- Puzzle difficulty ratings
- AI-generated puzzles
- Multiple game modes
- In-game chat
- Reactions/emojis
- Theme customization

## 🎓 Learning Resources

This project demonstrates:
- Next.js routing (file-based, dynamic routes)
- React Hooks (useState, useEffect, useCallback)
- Component composition
- State management patterns
- Real-time data patterns
- Tailwind CSS utility classes
- Responsive design
- User experience flow
- Game logic implementation

## 📄 File Organization

```
word-hive-live/
├── components/          # Reusable React components
├── lib/                 # Business logic & utilities
├── pages/              # Next.js pages (routes)
│   ├── room/           # Dynamic route folder
│   ├── _app.js         # App wrapper
│   └── _document.js    # HTML document
├── public/             # Static assets
├── styles/             # Global CSS
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── GETTING_STARTED.md  # Quick start guide
├── README.md           # Main documentation
├── PROJECT_OVERVIEW.md # This file
├── next.config.js      # Next.js configuration
├── package.json        # Dependencies & scripts
├── postcss.config.js   # PostCSS configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## 🤝 Contributing Guidelines

1. Follow existing code style
2. Add comments for complex logic
3. Test on multiple screen sizes
4. Update documentation when adding features
5. Keep components small and focused
6. Use descriptive variable names

## ✅ Testing Checklist

Before deploying:
- [ ] Create room works
- [ ] Join room works
- [ ] Room code validation
- [ ] Player name handling (duplicates)
- [ ] Start game functionality
- [ ] Word submission
- [ ] Scoring accuracy
- [ ] Timer countdown
- [ ] Auto game end
- [ ] Manual game end
- [ ] Results display
- [ ] Play again functionality
- [ ] Mobile responsive
- [ ] Multiple players (test with 10)
- [ ] Error messages clear
- [ ] Copy buttons work

## 🌟 Success Metrics

Track these for product success:
- Games created per day
- Average players per game
- Average game duration
- Words submitted per game
- Completion rate (games finished vs abandoned)
- User retention
- Social shares

---

**Built with ❤️ for teams who love words!** 🐝📝
