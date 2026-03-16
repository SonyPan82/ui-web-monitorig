'use client';
import { useState, useEffect, useRef } from 'react';

interface Service {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'inactive' | 'unknown';
  lastCheck: string | null;
  responseTime: number | null;
}

interface SpotlightSearchProps {
  services: Service[];
  onClose: () => void;
  onSelectService: (service: Service) => void;
}

const statusDot = {
  active: 'bg-green-400',
  inactive: 'bg-red-400',
  unknown: 'bg-yellow-400',
};

export default function SpotlightSearch({ services, onClose, onSelectService }: SpotlightSearchProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? services.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.url.toLowerCase().includes(query.toLowerCase())
      )
    : services;

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { setSelected(i => Math.min(i + 1, results.length - 1)); e.preventDefault(); }
      if (e.key === 'ArrowUp') { setSelected(i => Math.max(i - 1, 0)); e.preventDefault(); }
      if (e.key === 'Enter' && results[selected]) { onSelectService(results[selected]); onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [results, selected, onClose, onSelectService]);

  // Reset selection when results change
  useEffect(() => { setSelected(0); }, [query]);

  const getFavicon = (url: string) => {
    try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`; }
    catch { return null; }
  };

  return (
    <>
      {/* Backdrop violet semi-transparent */}
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-32 sm:pl-48 px-4"
        style={{ backgroundColor: 'rgba(67, 56, 202, 0.25)', backdropFilter: 'blur(12px)' }}
        onClick={onClose}
      >
        {/* Fenêtre Spotlight */}
        <div
          className="w-full max-w-2xl"
          style={{ animation: 'bubbleGrow 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Barre de recherche */}
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.25)' }}
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 opacity-70 flex-shrink-0">
              <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher un service..."
              className="flex-1 bg-transparent text-white placeholder-white placeholder-opacity-50 text-lg font-medium outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-white opacity-50 hover:opacity-100 text-sm">✕</button>
            )}
          </div>

          {/* Résultats */}
          {results.length > 0 && (
            <div
              className="mt-2 rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              {results.map((service, i) => (
                <button
                  key={service.id}
                  className="w-full flex items-center gap-4 px-5 py-3 text-left transition-colors"
                  style={{ background: i === selected ? 'rgba(255,255,255,0.15)' : 'transparent' }}
                  onMouseEnter={() => setSelected(i)}
                  onClick={() => { onSelectService(service); onClose(); }}
                >
                  {/* Favicon */}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    {getFavicon(service.url)
                      ? <img src={getFavicon(service.url)!} alt="" width={20} height={20} />
                      : <span className="text-white text-xs font-bold">{service.name[0]}</span>
                    }
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{service.name}</p>
                    <p className="text-white text-xs opacity-50 truncate">{service.url}</p>
                  </div>

                  {/* Statut + response time */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {service.responseTime && (
                      <span className="text-white text-xs opacity-60">{service.responseTime}ms</span>
                    )}
                    <div className={`w-2.5 h-2.5 rounded-full ${statusDot[service.status]}`} />
                  </div>
                </button>
              ))}
            </div>
          )}

          {query && results.length === 0 && (
            <div
              className="mt-2 rounded-2xl px-5 py-4 text-center text-white opacity-60"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}
            >
              Aucun service trouvé pour &quot;{query}&quot;
            </div>
          )}

          {/* Hint clavier */}
          <div className="mt-3 flex justify-center gap-4 text-white text-xs opacity-40">
            <span>↑↓ naviguer</span>
            <span>↵ ouvrir</span>
            <span>esc fermer</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bubbleGrow {
          from { transform: scale(0.92); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
