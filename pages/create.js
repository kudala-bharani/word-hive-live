import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { createRoom } from '../lib/supabase';
import { TOTAL_GAME_MINUTES, TOTAL_ROUNDS, ROUND_DURATION_MINUTES } from '../lib/gameConfig';

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function CreateRoom() {
  const router = useRouter();
  const [hostName, setHostName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!hostName.trim()) return;

    setLoading(true);
    const roomCode = generateRoomCode();

    try {
      const { player } = await createRoom(roomCode, hostName.trim(), TOTAL_GAME_MINUTES);

      localStorage.setItem('playerId', player.id);
      localStorage.setItem('playerName', player.name);

      await router.push(`/room/${roomCode}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Room - Word Hive Live</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-honey-700 mb-2">
              🐝 Create Room
            </h1>
            <p className="text-gray-600">
              Set up a new game for your team
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="Enter your name..."
                  className="input-field"
                  required
                  maxLength={20}
                />
              </div>

              <div className="bg-honey-50 border border-honey-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Game format</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• {TOTAL_GAME_MINUTES} minutes total</li>
                  <li>• {TOTAL_ROUNDS} word hives × {ROUND_DURATION_MINUTES} minutes each</li>
                  <li>• Scores add up across all hives</li>
                  <li>• Host starts each new hive after round scores</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={!hostName.trim() || loading}
                className="btn-primary w-full text-lg"
              >
                {loading ? 'Creating...' : 'Create Game Room'}
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
