import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { createRoom } from '../lib/supabase';

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
  const [duration, setDuration] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!hostName.trim()) return;

    setLoading(true);
    const roomCode = generateRoomCode();

    try {
      const { room, player } = await createRoom(roomCode, hostName.trim(), duration);

      // Store player info in localStorage for persistence
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Game Duration
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[5, 10, 15, 20].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDuration(mins)}
                      className={`py-3 rounded-lg font-semibold transition-all ${
                        duration === mins
                          ? 'bg-honey-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {mins} minutes
                    </button>
                  ))}
                </div>
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
