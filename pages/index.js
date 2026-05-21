import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Word Hive Live - Multiplayer Word Puzzle Game</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-honey-700 mb-4">
              🐝 Word Hive Live
            </h1>
            <p className="text-xl text-gray-700">
              A live multiplayer word puzzle game for teams
            </p>
            <p className="text-gray-600 mt-2">
              Create words from 7 letters • Play with up to 10 friends • Real-time scoring
            </p>
          </div>

          <div className="card max-w-md mx-auto">
            <div className="space-y-4">
              <button
                onClick={() => router.push('/create')}
                className="btn-primary w-full text-xl py-4"
              >
                🎮 Create Room
              </button>

              <button
                onClick={() => router.push('/join')}
                className="btn-secondary w-full text-xl py-4"
              >
                🚪 Join Room
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">How to Play:</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Create words using the 7 letters provided</li>
                <li>✓ Every word must include the center letter</li>
                <li>✓ Words must be at least 4 letters long</li>
                <li>✓ Use letters as many times as you want</li>
                <li>✓ Find pangrams (words using all 7 letters) for bonus points!</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8 text-gray-600 text-sm">
            Perfect for remote teams, online meetings, and virtual hangouts
          </div>
        </div>
      </div>
    </>
  );
}
