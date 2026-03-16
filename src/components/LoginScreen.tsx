'use client';

import { useState } from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [animating, setAnimating] = useState(false);

  const handleSubmit = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      setError('');
      setAnimating(true);
      setTimeout(() => onLogin(), 700);
    } else {
      const data = await res.json();
      setError(data.error ?? 'Identifiants incorrects');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      style={{
        animation: animating ? 'loginZoomOut 0.7s cubic-bezier(0.4, 0, 1, 1) forwards' : undefined,
      }}
    >
      <div className="flex flex-col items-center w-full max-w-sm px-8">
        {/* Avatar */}
        <div className="w-40 h-40 rounded-full bg-blue-200 flex items-center justify-center mb-10 shadow-md">
          <svg viewBox="0 0 24 24" className="w-24 h-24 text-blue-600" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>

        {/* Champ USER */}
        <input
          type="text"
          placeholder="USER"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-center text-lg py-4 px-6 rounded-lg mb-4 placeholder-white outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
        />

        {/* Champ PASSWORD */}
        <input
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-center text-lg py-4 px-6 rounded-lg mb-6 placeholder-white outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
        />

        {error && (
          <p className="text-red-500 font-semibold text-sm mb-4">{error}</p>
        )}

        {/* Bouton OK */}
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-lg py-4 px-16 rounded-lg transition-all shadow-md"
        >
          OK
        </button>

        {/* Bouton ? */}
        <button className="absolute bottom-8 right-8 w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full shadow transition-colors">
          ?
        </button>
      </div>

      <style>{`
        @keyframes loginZoomOut {
          0%   { transform: scale(1);   opacity: 1; }
          60%  { transform: scale(1.8); opacity: 0.6; }
          100% { transform: scale(3);   opacity: 0; }
        }
      `}</style>
    </div>
  );
}
