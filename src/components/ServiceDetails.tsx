'use client';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Service {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'inactive' | 'unknown';
  lastCheck: string | null;
  responseTime: number | null;
}

interface HistoryEntry {
  id: string;
  serviceId: string;
  serviceName: string;
  timestamp: string;
  status: 'success' | 'fail';
  responseTime: number | null;
}

interface ServiceDetailsProps {
  service: Service;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ServiceDetails({
  service,
  onClose,
  onEdit,
  onDelete,
}: ServiceDetailsProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [statsTab, setStatsTab] = useState<'24h' | '7j'>('24h');
  const [stats7j, setStats7j] = useState<{ label: string; uptime: number | null }[]>([]);
  const [stats24h, setStats24h] = useState<{ label: string; uptime: number | null; avgResponse: number | null }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [r7j, r24h] = await Promise.all([
        fetch(`/api/history/${service.id}/stats`),
        fetch(`/api/history/${service.id}/stats/hourly`),
      ]);
      if (r7j.ok) setStats7j(await r7j.json());
      if (r24h.ok) setStats24h(await r24h.json());
    };
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, [service.id]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/history/${service.id}?limit=20`);
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, [service.id]);

  const formatTime = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatHistoryTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const statusColor = {
    active: { bg: 'bg-green-400', text: 'ACTIVE', borderColor: 'border-green-500' },
    inactive: { bg: 'bg-red-400', text: 'INACTIVE', borderColor: 'border-red-500' },
    unknown: { bg: 'bg-yellow-400', text: 'UNKNOWN', borderColor: 'border-yellow-500' },
  };

  const config = statusColor[service.status];

  const avgUptime = (() => {
    const data = statsTab === '7j' ? stats7j : stats24h;
    const valid = data.filter(s => s.uptime !== null);
    if (!valid.length) return null;
    return Math.round(valid.reduce((a, s) => a + (s.uptime ?? 0), 0) / valid.length);
  })();

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-30"
        onClick={onClose}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
      />

      {/* Bulle centrée, scrollable sur mobile */}
      <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none sm:pl-48 px-3 py-4">
        <div
          className={`${config.bg} rounded-3xl shadow-2xl border-4 ${config.borderColor} pointer-events-auto w-full max-w-4xl flex flex-col`}
          style={{
            animation: 'bubbleGrow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            maxHeight: 'calc(100vh - 2rem)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 p-5 sm:p-6" style={{ scrollbarWidth: 'thin' }}>

            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {(() => {
                  try {
                    return (
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${new URL(service.url).hostname}&sz=32`}
                        alt=""
                        width={24}
                        height={24}
                        className="rounded-sm flex-shrink-0"
                      />
                    );
                  } catch { return null; }
                })()}
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{service.name}</h1>
                  <p className="text-xs text-gray-700 truncate">{service.url}</p>
                </div>
                <span className="bg-white text-gray-800 font-bold px-4 py-1 rounded-full text-sm flex-shrink-0">
                  {config.text}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-900 hover:bg-black hover:bg-opacity-20 rounded-full p-2 text-lg flex-shrink-0 ml-3"
              >
                ✕
              </button>
            </div>

            {/* Layout 2 colonnes sur desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Colonne gauche : info + logs */}
              <div className="flex flex-col gap-3">
                {/* Info row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white bg-opacity-30 rounded-xl p-3 text-gray-900">
                    <p className="text-xs font-semibold text-gray-700">Dernier check</p>
                    <p className="text-base font-bold">{formatTime(service.lastCheck)}</p>
                  </div>
                  <div className="bg-white bg-opacity-30 rounded-xl p-3 text-gray-900">
                    <p className="text-xs font-semibold text-gray-700">Temps réponse</p>
                    <p className="text-base font-bold">
                      {service.responseTime ? `${service.responseTime}ms` : '—'}
                    </p>
                  </div>
                </div>

                {/* Logs style Datadog */}
                <div className="rounded-lg overflow-hidden border border-gray-700 flex-1" style={{ background: '#0f1117' }}>
                  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700" style={{ background: '#161b22' }}>
                    <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-widest">Logs</span>
                    <span className="text-xs font-mono text-gray-500">{history.length} events</span>
                  </div>
                  <div className="max-h-52 overflow-y-auto font-mono text-xs">
                    {loadingHistory ? (
                      <div className="px-3 py-2 text-gray-500">Chargement...</div>
                    ) : history.length === 0 ? (
                      <div className="px-3 py-2 text-gray-500">No logs found</div>
                    ) : (
                      history.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 px-3 py-1.5 border-b border-gray-800 hover:bg-white hover:bg-opacity-5"
                        >
                          <div className={`w-0.5 self-stretch rounded-full flex-shrink-0 ${item.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="text-gray-500 flex-shrink-0 w-32">{formatHistoryTimestamp(item.timestamp)}</span>
                          <span className={`flex-shrink-0 px-1 py-0.5 rounded text-xs font-bold ${item.status === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                            {item.status === 'success' ? 'OK' : 'ERR'}
                          </span>
                          <span className="text-gray-300 flex-1 truncate">
                            {item.status === 'success' ? 'Health check passed' : 'Health check failed'}
                          </span>
                          {item.responseTime != null && (
                            <span className="text-gray-500 flex-shrink-0">{item.responseTime}ms</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Colonne droite : graphiques */}
              <div className="bg-white bg-opacity-30 rounded-xl p-3 text-gray-900">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-1 bg-white bg-opacity-40 rounded-lg p-1">
                    {(['24h', '7j'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setStatsTab(tab)}
                        className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${statsTab === tab ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-white hover:bg-opacity-50'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  {avgUptime !== null && (
                    <span className="text-sm font-bold">{avgUptime}% moy.</span>
                  )}
                </div>

                {/* Graphe uptime */}
                {(() => {
                  const data = statsTab === '7j' ? stats7j : stats24h;
                  if (!data.length) return <p className="text-sm text-gray-700">Pas encore de données</p>;
                  return (
                    <ResponsiveContainer width="100%" height={120}>
                      <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                        <defs>
                          <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="label" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={statsTab === '24h' ? 3 : 0} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                        <Tooltip
                          formatter={(v) => v != null ? `${v}%` : 'N/A'}
                          contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', background: 'rgba(255,255,255,0.95)' }}
                        />
                        <Area type="monotone" dataKey="uptime" stroke="#1d4ed8" strokeWidth={2} fill="url(#uptimeGrad)" connectNulls dot={{ fill: '#1d4ed8', r: 2 }} activeDot={{ r: 4 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  );
                })()}

                {/* Graphe temps de réponse (24h seulement) */}
                {statsTab === '24h' && stats24h.some(s => s.avgResponse != null) && (
                  <>
                    <p className="text-xs font-bold text-gray-600 mt-2 mb-1">Temps de réponse moyen (ms)</p>
                    <ResponsiveContainer width="100%" height={80}>
                      <AreaChart data={stats24h} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                        <defs>
                          <linearGradient id="respGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#059669" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="label" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={3} />
                        <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                        <Tooltip
                          formatter={(v) => v != null ? `${v}ms` : 'N/A'}
                          contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', background: 'rgba(255,255,255,0.95)' }}
                        />
                        <Area type="monotone" dataKey="avgResponse" stroke="#059669" strokeWidth={2} fill="url(#respGrad)" connectNulls dot={false} activeDot={{ r: 4 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={onEdit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm"
              >
                Editer
              </button>
              <button
                onClick={onDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm"
              >
                Supprimer
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bubbleGrow {
          from { transform: scale(0.3); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </>
  );
}
