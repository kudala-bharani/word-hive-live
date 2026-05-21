import { useState, useEffect } from 'react';

export default function Timer({ endTime, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      setTimeLeft(remaining);

      if (remaining === 0) {
        onTimeUp && onTimeUp();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [endTime, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const isLowTime = timeLeft < 60000 && timeLeft > 0;

  return (
    <div className={`text-center ${isLowTime ? 'animate-pulse' : ''}`}>
      <div className="text-sm text-gray-600 mb-1">Time Remaining</div>
      <div className={`text-4xl font-bold ${isLowTime ? 'text-red-600' : 'text-honey-700'}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
}
