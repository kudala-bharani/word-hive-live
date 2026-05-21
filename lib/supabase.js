import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// --- In-memory fallback (local dev without Supabase) ---
let rooms = {};
let players = {};
const listeners = {};

function mapRoom(row) {
  if (!row) return null;
  return {
    code: row.code,
    hostId: row.host_id,
    hostName: row.host_name,
    status: row.status,
    duration: row.duration,
    startTime: row.start_time ?? null,
    endTime: row.end_time ?? null,
    puzzleId: row.puzzle_id ?? null,
    createdAt: row.created_at,
  };
}

function mapPlayer(row) {
  if (!row) return null;
  return {
    id: row.id,
    roomId: row.room_code,
    name: row.name,
    score: row.score ?? 0,
    wordsFound: row.words_found ?? [],
    isHost: row.is_host ?? false,
  };
}

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// --- Supabase implementations ---

async function sbCreateRoom(roomCode, hostName, duration) {
  const hostId = newId();

  const { data: roomRow, error: roomError } = await supabaseClient
    .from('rooms')
    .insert({
      code: roomCode,
      host_id: hostId,
      host_name: hostName,
      status: 'waiting',
      duration,
    })
    .select()
    .single();

  if (roomError) throw roomError;

  const { data: playerRow, error: playerError } = await supabaseClient
    .from('players')
    .insert({
      id: hostId,
      room_code: roomCode,
      name: hostName,
      is_host: true,
    })
    .select()
    .single();

  if (playerError) throw playerError;

  return { room: mapRoom(roomRow), player: mapPlayer(playerRow) };
}

async function sbGetRoom(roomCode) {
  const { data, error } = await supabaseClient
    .from('rooms')
    .select('*')
    .eq('code', roomCode)
    .maybeSingle();

  if (error) throw error;
  return mapRoom(data);
}

async function sbGetRoomPlayers(roomCode) {
  const { data, error } = await supabaseClient
    .from('players')
    .select('*')
    .eq('room_code', roomCode)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map(mapPlayer);
}

async function sbJoinRoom(roomCode, playerName) {
  const room = await sbGetRoom(roomCode);
  if (!room) return { error: 'Room not found' };

  const existing = await sbGetRoomPlayers(roomCode);
  if (existing.length >= 10) return { error: 'Room is full' };

  let finalName = playerName;
  let counter = 1;
  while (existing.some((p) => p.name === finalName)) {
    finalName = `${playerName}${counter}`;
    counter++;
  }

  const { data: playerRow, error } = await supabaseClient
    .from('players')
    .insert({
      room_code: roomCode,
      name: finalName,
      is_host: false,
    })
    .select()
    .single();

  if (error) throw error;
  return { player: mapPlayer(playerRow) };
}

async function sbUpdateRoomStatus(roomCode, status, updates = {}) {
  const payload = { status };
  if (updates.puzzleId !== undefined) payload.puzzle_id = updates.puzzleId;
  if (updates.startTime !== undefined) payload.start_time = updates.startTime;
  if (updates.endTime !== undefined) payload.end_time = updates.endTime;

  const { data, error } = await supabaseClient
    .from('rooms')
    .update(payload)
    .eq('code', roomCode)
    .select()
    .single();

  if (error) throw error;
  return mapRoom(data);
}

async function sbSubmitWord(roomCode, playerId, word, score) {
  const { data: playerRow, error: fetchError } = await supabaseClient
    .from('players')
    .select('*')
    .eq('id', playerId)
    .eq('room_code', roomCode)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!playerRow) return null;

  const wordsFound = playerRow.words_found ?? [];
  const lower = word.toLowerCase();
  if (wordsFound.includes(lower)) {
    return { error: 'You already found this word' };
  }

  const { data: updated, error } = await supabaseClient
    .from('players')
    .update({
      words_found: [...wordsFound, lower],
      score: (playerRow.score ?? 0) + score,
    })
    .eq('id', playerId)
    .select()
    .single();

  if (error) throw error;
  return { player: mapPlayer(updated) };
}

async function sbGetPlayer(playerId) {
  const { data, error } = await supabaseClient
    .from('players')
    .select('*')
    .eq('id', playerId)
    .maybeSingle();

  if (error) throw error;
  return mapPlayer(data);
}

async function sbResetPlayerScores(roomCode) {
  const { error } = await supabaseClient
    .from('players')
    .update({ score: 0, words_found: [] })
    .eq('room_code', roomCode);

  if (error) throw error;
}

function sbSubscribeToRoom(roomCode, callback) {
  const refresh = async () => {
    try {
      const room = await sbGetRoom(roomCode);
      const roomPlayers = await sbGetRoomPlayers(roomCode);
      callback({ room, players: roomPlayers });
    } catch (err) {
      console.error('Room refresh failed:', err);
    }
  };

  refresh();

  const channel = supabaseClient
    .channel(`room:${roomCode}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'rooms', filter: `code=eq.${roomCode}` },
      refresh
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'players', filter: `room_code=eq.${roomCode}` },
      refresh
    )
    .subscribe();

  return () => {
    supabaseClient.removeChannel(channel);
  };
}

// --- In-memory implementations ---

function memCreateRoom(roomCode, hostName, duration) {
  const hostId = `${roomCode}-${Date.now()}-host`;
  rooms[roomCode] = {
    code: roomCode,
    hostId,
    hostName,
    status: 'waiting',
    duration,
    startTime: null,
    endTime: null,
    puzzleId: null,
    createdAt: Date.now(),
  };

  const hostPlayer = {
    id: hostId,
    roomId: roomCode,
    name: hostName,
    score: 0,
    wordsFound: [],
    isHost: true,
  };

  players[hostId] = hostPlayer;
  return { room: rooms[roomCode], player: hostPlayer };
}

function memGetRoom(roomCode) {
  return rooms[roomCode] || null;
}

function memGetRoomPlayers(roomCode) {
  const room = rooms[roomCode];
  if (!room) return [];
  return Object.values(players).filter((p) => p.roomId === roomCode);
}

function memJoinRoom(roomCode, playerName) {
  const room = rooms[roomCode];
  if (!room) return { error: 'Room not found' };

  const existing = memGetRoomPlayers(roomCode);
  if (existing.length >= 10) return { error: 'Room is full' };

  let finalName = playerName;
  let counter = 1;
  while (existing.some((p) => p.name === finalName)) {
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
    isHost: false,
  };

  players[playerId] = player;
  return { player };
}

function memUpdateRoomStatus(roomCode, status, updates = {}) {
  const room = rooms[roomCode];
  if (!room) return null;
  room.status = status;
  Object.assign(room, updates);
  return room;
}

function memSubmitWord(roomCode, playerId, word, score) {
  const player = players[playerId];
  if (!player || player.roomId !== roomCode) return null;

  if (player.wordsFound.includes(word.toLowerCase())) {
    return { error: 'You already found this word' };
  }

  player.wordsFound.push(word.toLowerCase());
  player.score += score;
  return { player };
}

function memGetPlayer(playerId) {
  return players[playerId] || null;
}

function memResetPlayerScores(roomCode) {
  Object.values(players)
    .filter((p) => p.roomId === roomCode)
    .forEach((p) => {
      p.score = 0;
      p.wordsFound = [];
    });
}

function memSubscribeToRoom(roomCode, callback) {
  if (!listeners[roomCode]) listeners[roomCode] = [];
  listeners[roomCode].push(callback);

  callback({ room: memGetRoom(roomCode), players: memGetRoomPlayers(roomCode) });

  return () => {
    listeners[roomCode] = (listeners[roomCode] || []).filter((cb) => cb !== callback);
  };
}

function memNotifyRoomUpdate(roomCode) {
  if (!listeners[roomCode]) return;
  const payload = { room: memGetRoom(roomCode), players: memGetRoomPlayers(roomCode) };
  listeners[roomCode].forEach((cb) => cb(payload));
}

// --- Public API ---

const useSupabase = () => !!supabaseClient;

export async function createRoom(roomCode, hostName, duration) {
  if (useSupabase()) return sbCreateRoom(roomCode, hostName, duration);
  return memCreateRoom(roomCode, hostName, duration);
}

export async function getRoom(roomCode) {
  if (useSupabase()) return sbGetRoom(roomCode);
  return memGetRoom(roomCode);
}

export async function joinRoom(roomCode, playerName) {
  if (useSupabase()) return sbJoinRoom(roomCode, playerName);
  return memJoinRoom(roomCode, playerName);
}

export async function getRoomPlayers(roomCode) {
  if (useSupabase()) return sbGetRoomPlayers(roomCode);
  return memGetRoomPlayers(roomCode);
}

export async function updateRoomStatus(roomCode, status, updates = {}) {
  if (useSupabase()) return sbUpdateRoomStatus(roomCode, status, updates);
  return memUpdateRoomStatus(roomCode, status, updates);
}

export async function submitWord(roomCode, playerId, word, score) {
  if (useSupabase()) return sbSubmitWord(roomCode, playerId, word, score);
  return memSubmitWord(roomCode, playerId, word, score);
}

export async function getPlayer(playerId) {
  if (useSupabase()) return sbGetPlayer(playerId);
  return memGetPlayer(playerId);
}

export async function resetPlayerScores(roomCode) {
  if (useSupabase()) return sbResetPlayerScores(roomCode);
  return memResetPlayerScores(roomCode);
}

export function subscribeToRoom(roomCode, callback) {
  if (useSupabase()) return sbSubscribeToRoom(roomCode, callback);
  return memSubscribeToRoom(roomCode, callback);
}

export async function notifyRoomUpdate(roomCode) {
  if (useSupabase()) return;
  memNotifyRoomUpdate(roomCode);
}
