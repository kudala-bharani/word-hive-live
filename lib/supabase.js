import { createClient } from '@supabase/supabase-js';

// Note: For production, these should be environment variables
// For this demo, we'll use localStorage-based state management instead of Supabase
// to avoid requiring API keys setup

// In-memory store for demo purposes (in real app, use Supabase or similar)
let rooms = {};
let players = {};

export const supabaseClient = null; // Placeholder

// Room Management
export function createRoom(roomCode, hostName, duration) {
  const roomId = roomCode;
  rooms[roomId] = {
    code: roomCode,
    hostId: `${roomId}-${Date.now()}-host`,
    hostName: hostName,
    status: 'waiting', // waiting, active, paused, ended
    duration: duration,
    startTime: null,
    endTime: null,
    puzzleId: null,
    players: [],
    createdAt: Date.now()
  };

  // Add host as first player
  const hostPlayer = {
    id: rooms[roomId].hostId,
    roomId: roomId,
    name: hostName,
    score: 0,
    wordsFound: [],
    isHost: true
  };

  players[hostPlayer.id] = hostPlayer;
  rooms[roomId].players.push(hostPlayer.id);

  return { room: rooms[roomId], player: hostPlayer };
}

export function getRoom(roomCode) {
  return rooms[roomCode] || null;
}

export function joinRoom(roomCode, playerName) {
  const room = rooms[roomCode];
  if (!room) {
    return { error: 'Room not found' };
  }

  if (room.players.length >= 10) {
    return { error: 'Room is full' };
  }

  // Check for duplicate name and add number if needed
  let finalName = playerName;
  let counter = 1;
  while (getRoomPlayers(roomCode).some(p => p.name === finalName)) {
    finalName = `${playerName}${counter}`;
    counter++;
  }

  const playerId = `${roomCode}-${Date.now()}-${Math.random()}`;
  const player = {
    id: playerId,
    roomId: roomCode,
    name: finalName,
    score: 0,
    wordsFound: [],
    isHost: false
  };

  players[playerId] = player;
  room.players.push(playerId);

  return { player };
}

export function getRoomPlayers(roomCode) {
  const room = rooms[roomCode];
  if (!room) return [];

  return room.players.map(pid => players[pid]).filter(Boolean);
}

export function updateRoomStatus(roomCode, status, updates = {}) {
  const room = rooms[roomCode];
  if (!room) return null;

  room.status = status;
  Object.assign(room, updates);

  return room;
}

export function submitWord(roomCode, playerId, word, score) {
  const player = players[playerId];
  if (!player || player.roomId !== roomCode) return null;

  // Check if word already found by this player
  if (player.wordsFound.includes(word.toLowerCase())) {
    return { error: 'You already found this word' };
  }

  player.wordsFound.push(word.toLowerCase());
  player.score += score;

  return { player };
}

export function getPlayer(playerId) {
  return players[playerId] || null;
}

export function resetPlayerScores(roomCode) {
  const room = rooms[roomCode];
  if (!room) return;

  room.players.forEach(pid => {
    const player = players[pid];
    if (player) {
      player.score = 0;
      player.wordsFound = [];
    }
  });
}

// Event listeners for real-time updates
const listeners = {};

export function subscribeToRoom(roomCode, callback) {
  if (!listeners[roomCode]) {
    listeners[roomCode] = [];
  }
  listeners[roomCode].push(callback);

  // Return unsubscribe function
  return () => {
    listeners[roomCode] = listeners[roomCode].filter(cb => cb !== callback);
  };
}

export function notifyRoomUpdate(roomCode) {
  if (listeners[roomCode]) {
    const room = getRoom(roomCode);
    const roomPlayers = getRoomPlayers(roomCode);
    listeners[roomCode].forEach(callback => {
      callback({ room, players: roomPlayers });
    });
  }
}
