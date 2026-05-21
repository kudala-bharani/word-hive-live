import { useState } from 'react';

export default function WordInput({ onSubmit, disabled }) {
  const [word, setWord] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (word.trim() && !disabled) {
      onSubmit(word.trim());
      setWord('');
    }
  };

  const handleChange = (e) => {
    // Only allow letters
    const value = e.target.value.replace(/[^a-zA-Z]/g, '');
    setWord(value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={word}
          onChange={handleChange}
          placeholder="Type your word..."
          className="input-field flex-1 text-xl"
          disabled={disabled}
          autoFocus
        />
        <button
          type="submit"
          disabled={!word.trim() || disabled}
          className="btn-primary px-8"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
