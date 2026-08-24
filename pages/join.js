import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getRoom, joinRoom } from '../lib/supabase';

export default function JoinRoom() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const queryRoomCode = router.query.code
    ? String(router.query.code).toUpperCase()
    : '';
  const enteredRoomCode = roomCode ?? queryRoomCode;

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!enteredRoomCode.trim() || !playerName.trim()) return;

    setLoading(true);
    setError('');

    try {
      const upperCode = enteredRoomCode.trim().toUpperCase();

      // Check if room exists
      const room = await getRoom(upperCode);
      if (!room) {
        setError('Room not found. Please check the code and try again.');
        setLoading(false);
        return;
      }

      // Join the room
      const result = await joinRoom(upperCode, playerName.trim());

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Store player info in localStorage
      localStorage.setItem('playerId', result.player.id);
      localStorage.setItem('playerName', result.player.name);

      await router.push(`/room/${upperCode}`);
    } catch (err) {
      console.error('Error joining room:', err);
      setError('Failed to join room. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Join Room - Word Hive Live</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-honey-700 mb-2">
              🚪 Join Room
            </h1>
            <p className="text-gray-600">
              Enter the room code to join the game
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleJoin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Room Code
                </label>
                <input
                  type="text"
                  value={enteredRoomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit code..."
                  className="input-field text-center text-2xl tracking-widest font-mono"
                  required
                  maxLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name..."
                  className="input-field"
                  required
                  maxLength={20}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!enteredRoomCode.trim() || !playerName.trim() || loading}
                className="btn-primary w-full text-lg"
              >
                {loading ? 'Joining...' : 'Join Game'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => router.push('/')}
                className="text-honey-600 hover:text-honey-700 text-sm font-medium"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
