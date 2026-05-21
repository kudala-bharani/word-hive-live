export default function LetterHive({ letters, centerLetter, onLetterClick }) {
  const center = centerLetter;
  const outer = letters.filter(l => l !== centerLetter);

  return (
    <div className="flex flex-col items-center justify-center gap-4 my-8">
      {/* Top row */}
      <div className="flex gap-4">
        <div
          className="letter-cell w-20 h-20"
          onClick={() => onLetterClick && onLetterClick(outer[0])}
        >
          {outer[0]}
        </div>
        <div
          className="letter-cell w-20 h-20"
          onClick={() => onLetterClick && onLetterClick(outer[1])}
        >
          {outer[1]}
        </div>
      </div>

      {/* Middle row */}
      <div className="flex gap-4">
        <div
          className="letter-cell w-20 h-20"
          onClick={() => onLetterClick && onLetterClick(outer[2])}
        >
          {outer[2]}
        </div>
        <div
          className="letter-cell center-letter w-24 h-24 text-3xl"
          onClick={() => onLetterClick && onLetterClick(center)}
        >
          {center}
        </div>
        <div
          className="letter-cell w-20 h-20"
          onClick={() => onLetterClick && onLetterClick(outer[3])}
        >
          {outer[3]}
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex gap-4">
        <div
          className="letter-cell w-20 h-20"
          onClick={() => onLetterClick && onLetterClick(outer[4])}
        >
          {outer[4]}
        </div>
        <div
          className="letter-cell w-20 h-20"
          onClick={() => onLetterClick && onLetterClick(outer[5])}
        >
          {outer[5]}
        </div>
      </div>
    </div>
  );
}
