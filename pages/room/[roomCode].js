import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  getRoom,
  getPlayer,
  getRoomPlayers,
  updateRoomStatus,
  submitWord as submitWordToDb,
  subscribeToRoom,
  notifyRoomUpdate,
  resetPlayerScores,
  resetPlayerWordsForRound
} from '../../lib/supabase';
import { getRandomPuzzle, getRandomPuzzleExcluding, getPuzzleById } from '../../lib/puzzles';
import {
  TOTAL_ROUNDS,
  ROUND_DURATION_MS,
  TOTAL_GAME_MINUTES,
  getRoundLabel
} from '../../lib/gameConfig';
import { validateWord, isPangram, calculateScore } from '../../lib/wordValidator';
import LetterHive from '../../components/LetterHive';
import Leaderboard from '../../components/Leaderboard';
import RoundLeaderboard from '../../components/RoundLeaderboard';
import Timer from '../../components/Timer';
import WordInput from '../../components/WordInput';

export default function Room() {
  const router = useRouter();
  const { roomCode } = router.query;

  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  // Load room and player data
  useEffect(() => {
    if (!roomCode) return;

    const loadData = async () => {
      const roomData = await getRoom(roomCode);
      if (!roomData) {
        router.push('/');
        return;
      }

      setRoom(roomData);
      const roomPlayers = await getRoomPlayers(roomCode);
      setPlayers(roomPlayers);

      const playerId = localStorage.getItem('playerId');
      if (playerId) {
        const player = roomPlayers.find((p) => p.id === playerId) || (await getPlayer(playerId));
        setCurrentPlayer(player);
      }

      if (roomData.puzzleId) {
        const puzzleData = getPuzzleById(roomData.puzzleId);
        setPuzzle(puzzleData);
      }
    };

    loadData();

    // Subscribe to room updates
    const unsubscribe = subscribeToRoom(roomCode, ({ room: updatedRoom, players: updatedPlayers }) => {
      setRoom(updatedRoom);
      setPlayers(updatedPlayers);

      // Refresh current player data
      const playerId = localStorage.getItem('playerId');
      if (playerId) {
        const player = updatedPlayers.find(p => p.id === playerId);
        if (player) {
          setCurrentPlayer(player);
        }
      }

      // Load puzzle if it changed
      if (updatedRoom.puzzleId && updatedRoom.puzzleId !== puzzle?.id) {
        const puzzleData = getPuzzleById(updatedRoom.puzzleId);
        setPuzzle(puzzleData);
      }
    });

    return unsubscribe;
  }, [roomCode, router, puzzle]);

  // Generate invite link
  useEffect(() => {
    if (typeof window !== 'undefined' && roomCode) {
      setInviteLink(`${window.location.origin}/join?code=${roomCode}`);
    }
  }, [roomCode]);

  const isHost = currentPlayer?.isHost;

  const handleStartGame = async () => {
    if (!isHost || !room) return;

    await resetPlayerScores(roomCode);
    const selectedPuzzle = getRandomPuzzle();
    const startTime = Date.now();

    await updateRoomStatus(roomCode, 'active', {
      currentRound: 1,
      puzzleId: selectedPuzzle.id,
      startTime,
      endTime: startTime + ROUND_DURATION_MS
    });

    setPuzzle(selectedPuzzle);
    await notifyRoomUpdate(roomCode);
  };

  const handleStartNextRound = async () => {
    if (!isHost || !room || room.status !== 'round_break') return;

    const nextRound = room.currentRound + 1;
    await resetPlayerWordsForRound(roomCode);
    const selectedPuzzle = getRandomPuzzleExcluding([room.puzzleId]);
    const startTime = Date.now();

    await updateRoomStatus(roomCode, 'active', {
      currentRound: nextRound,
      puzzleId: selectedPuzzle.id,
      startTime,
      endTime: startTime + ROUND_DURATION_MS
    });

    setPuzzle(selectedPuzzle);
    await notifyRoomUpdate(roomCode);
  };

  const handleTimeUp = useCallback(async () => {
    if (!isHost) return;

    const latest = await getRoom(roomCode);
    if (!latest || latest.status !== 'active') return;

    if (latest.currentRound >= TOTAL_ROUNDS) {
      await updateRoomStatus(roomCode, 'ended', { endTime: Date.now() });
    } else {
      await updateRoomStatus(roomCode, 'round_break', {
        startTime: null,
        endTime: null
      });
    }
    await notifyRoomUpdate(roomCode);
  }, [isHost, roomCode]);

  const handleSubmitWord = async (word) => {
    if (!puzzle || !currentPlayer || room.status !== 'active') return;

    const validation = validateWord(
      word,
      puzzle.centerLetter,
      puzzle.letters,
      puzzle.validWords
    );

    if (!validation.valid) {
      setFeedback(validation.message);
      setFeedbackType('error');
      setTimeout(() => setFeedback(''), 3000);
      return;
    }

    const score = calculateScore(word, puzzle.letters);
    const result = await submitWordToDb(roomCode, currentPlayer.id, word, score);

    if (result.error) {
      setFeedback(result.error);
      setFeedbackType('error');
      setTimeout(() => setFeedback(''), 3000);
      return;
    }

    const isWordPangram = isPangram(word, puzzle.letters);
    if (isWordPangram) {
      setFeedback(`🎉 PANGRAM! +${score} points!`);
      setFeedbackType('pangram');
    } else {
      setFeedback(`✓ Great! +${score} points`);
      setFeedbackType('success');
    }

    setTimeout(() => setFeedback(''), 3000);
    await notifyRoomUpdate(roomCode);
  };

  const handleLetterClick = (letter) => {
    setCurrentWord(prev => prev + letter);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setFeedback('Invite link copied!');
    setFeedbackType('success');
    setTimeout(() => setFeedback(''), 2000);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setFeedback('Room code copied!');
    setFeedbackType('success');
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleEndGame = async () => {
    if (!isHost) return;
    await updateRoomStatus(roomCode, 'ended');
    await notifyRoomUpdate(roomCode);
  };

  const handlePlayAgain = async () => {
    if (!isHost) return;
    await resetPlayerScores(roomCode);
    await updateRoomStatus(roomCode, 'waiting', {
      puzzleId: null,
      startTime: null,
      endTime: null,
      currentRound: 0
    });
    setPuzzle(null);
    await notifyRoomUpdate(roomCode);
  };

  if (!room || !currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // Waiting Lobby
  if (room.status === 'waiting') {
    return (
      <>
        <Head>
          <title>Lobby - {roomCode} - Word Hive Live</title>
        </Head>

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-honey-700 mb-2">
                🐝 Game Lobby
              </h1>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="card inline-block">
                  <div className="text-sm text-gray-600 mb-1">Room Code</div>
                  <div className="text-3xl font-mono font-bold text-honey-700 tracking-wider">
                    {roomCode}
                  </div>
                  <button
                    onClick={copyRoomCode}
                    className="text-xs text-honey-600 hover:text-honey-700 mt-2"
                  >
                    Click to copy
                  </button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  👥 Players ({players.length}/10)
                </h3>
                <div className="space-y-2">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-semibold text-gray-800">
                        {player.name}
                      </span>
                      {player.isHost && (
                        <span className="text-xs bg-honey-500 text-white px-2 py-1 rounded">
                          HOST
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  ⚙️ Game Settings
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Format:</span>
                    <span className="font-semibold text-honey-700">
                      {TOTAL_ROUNDS} hives × 2 min
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total time:</span>
                    <span className="font-semibold text-honey-700">
                      {TOTAL_GAME_MINUTES} minutes
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Max players:</span>
                    <span className="font-semibold text-honey-700">10</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Share invite link:</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className="input-field text-sm flex-1"
                    />
                    <button
                      onClick={copyInviteLink}
                      className="btn-secondary px-4 py-2 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {feedback && (
              <div className="card mt-6 bg-honey-100 border-2 border-honey-400">
                <div className="text-center text-honey-800 font-semibold">
                  {feedback}
                </div>
              </div>
            )}

            <div className="mt-8 text-center">
              {isHost ? (
                <button
                  onClick={handleStartGame}
                  className="btn-primary text-xl px-12 py-4"
                  disabled={players.length < 1}
                >
                  🚀 Start Hive 1
                </button>
              ) : (
                <div className="text-lg text-gray-600">
                  Waiting for host to start the first hive...
                </div>
              )}
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => router.push('/')}
                className="text-honey-600 hover:text-honey-700 text-sm font-medium"
              >
                ← Leave Room
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Active Game
  if (room.status === 'active' && puzzle) {
    return (
      <>
        <Head>
          <title>Playing - {roomCode} - Word Hive Live</title>
        </Head>

        <div className="min-h-screen p-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="card mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-gray-600">Room Code</div>
                  <div className="text-2xl font-mono font-bold text-honey-700">
                    {roomCode}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm font-semibold text-honey-600 mb-1">
                    {getRoundLabel(room.currentRound)}
                  </div>
                  <Timer
                    endTime={room.endTime}
                    onTimeUp={handleTimeUp}
                    label="Hive time left"
                  />
                </div>

                <div>
                  <div className="text-sm text-gray-600">Playing as</div>
                  <div className="text-xl font-bold text-gray-800">
                    {currentPlayer.name}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Game Area */}
              <div className="lg:col-span-2 space-y-6">
                <div className="card">
                  <LetterHive
                    letters={puzzle.letters}
                    centerLetter={puzzle.centerLetter}
                    onLetterClick={handleLetterClick}
                  />

                  <div className="mt-6">
                    <WordInput
                      onSubmit={handleSubmitWord}
                      disabled={room.status !== 'active'}
                    />
                  </div>

                  {feedback && (
                    <div
                      className={`mt-4 p-4 rounded-lg text-center font-semibold ${
                        feedbackType === 'error'
                          ? 'bg-red-50 border border-red-200 text-red-700'
                          : feedbackType === 'pangram'
                          ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-300 text-yellow-900'
                          : 'bg-green-50 border border-green-200 text-green-700'
                      }`}
                    >
                      {feedback}
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-sm font-semibold text-gray-700 mb-2">
                      Rules:
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Words must be at least 4 letters long</li>
                      <li>
                        • Must include the center letter{' '}
                        <span className="font-bold text-honey-600">
                          "{puzzle.centerLetter}"
                        </span>
                      </li>
                      <li>• Use any letter multiple times</li>
                      <li>• Pangrams (all 7 letters) get +7 bonus points!</li>
                    </ul>
                  </div>
                </div>

                {/* Player's Found Words */}
                <div className="card">
                  <h3 className="text-lg font-bold mb-3 text-gray-800">
                    Your Words ({currentPlayer.wordsFound.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentPlayer.wordsFound.length === 0 ? (
                      <div className="text-gray-500 text-sm">
                        No words found yet. Start typing!
                      </div>
                    ) : (
                      currentPlayer.wordsFound.map((word, index) => {
                        const wordIsPangram = isPangram(word, puzzle.letters);
                        return (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              wordIsPangram
                                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                                : 'bg-honey-100 text-honey-800'
                            }`}
                          >
                            {word}
                            {wordIsPangram && ' ⭐'}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="lg:col-span-1">
                <Leaderboard players={players} currentPlayerId={currentPlayer.id} />

                {isHost && (
                  <button
                    onClick={handleEndGame}
                    className="btn-secondary w-full mt-4"
                  >
                    End Game Early
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Between hives — cumulative scores, host starts next round
  if (room.status === 'round_break') {
    const nextRound = room.currentRound + 1;

    return (
      <>
        <Head>
          <title>Hive {room.currentRound} results - {roomCode}</title>
        </Head>

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-honey-700 mb-2">
                ⏸️ Hive {room.currentRound} complete
              </h1>
              <p className="text-gray-600">
                Cumulative scores after {getRoundLabel(room.currentRound)}
              </p>
            </div>

            <RoundLeaderboard
              players={players}
              currentPlayerId={currentPlayer.id}
              title="Standings"
              subtitle={`${TOTAL_ROUNDS - room.currentRound} hive${
                TOTAL_ROUNDS - room.currentRound === 1 ? '' : 's'
              } remaining`}
            />

            <div className="mt-8 text-center">
              {isHost ? (
                <button
                  onClick={handleStartNextRound}
                  className="btn-primary text-xl px-12 py-4"
                >
                  🚀 Start {getRoundLabel(nextRound)}
                </button>
              ) : (
                <div className="text-lg text-gray-600">
                  Waiting for host to start {getRoundLabel(nextRound)}...
                </div>
              )}
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => router.push('/')}
                className="text-honey-600 hover:text-honey-700 text-sm font-medium"
              >
                ← Leave Room
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Final results
  if (room.status === 'ended') {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];

    return (
      <>
        <Head>
          <title>Results - {roomCode} - Word Hive Live</title>
        </Head>

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-honey-700 mb-4">
                🎊 Game Over!
              </h1>
              <p className="text-gray-600 mb-2">
                All {TOTAL_ROUNDS} hives complete ({TOTAL_GAME_MINUTES} minutes)
              </p>
              {winner && (
                <div className="text-2xl text-gray-700">
                  👑 Winner: <span className="font-bold text-honey-600">{winner.name}</span>
                </div>
              )}
            </div>

            <RoundLeaderboard
              players={players}
              currentPlayerId={currentPlayer.id}
              title="Final leaderboard"
              subtitle="Total score across all hives"
            />

            <div className="flex flex-wrap gap-4 justify-center">
              {isHost && (
                <button
                  onClick={handlePlayAgain}
                  className="btn-primary text-lg px-8"
                >
                  🔄 Play Again
                </button>
              )}
              <button
                onClick={() => router.push('/')}
                className="btn-secondary text-lg px-8"
              >
                🏠 Back to Home
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}
