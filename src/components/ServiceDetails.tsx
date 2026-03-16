import { useState, useEffect } from 'react';

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

  // Charger l'historique au démarrage et le rafraîchir toutes les 10 secondes
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

    // Refresh toutes les 10 secondes
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

  return (
    <>
      {/* Overlay ultra-transparent - juste pour le clic */}
      <div 
        className="fixed inset-0 z-30 transition-opacity"
        onClick={onClose}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
      />

      {/* Bulle qui s'agrandit */}
      <div 
        className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none"
      >
        <div
          className={`${config.bg} rounded-3xl p-8 shadow-2xl max-w-2xl w-11/12 border-4 ${config.borderColor} pointer-events-auto`}
          style={{
            animation: 'bubbleGrow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transformOrigin: 'center center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header avec bouton fermer */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
              <p className="text-sm text-gray-800 break-all">{service.url}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-900 hover:bg-black hover:bg-opacity-20 rounded-full p-2 text-2xl flex-shrink-0 ml-4"
            >
              ✕
            </button>
          </div>

          {/* Statut Badge */}
          <div className="mb-6">
            <span className="bg-white text-gray-800 font-bold px-6 py-2 rounded-full text-lg inline-block">
              {config.text}
            </span>
          </div>

          {/* Info Row */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white bg-opacity-30 rounded-lg p-4 text-gray-900">
              <p className="text-xs font-semibold text-gray-800">Dernier check</p>
              <p className="text-xl font-bold">{formatTime(service.lastCheck)}</p>
            </div>
            <div className="bg-white bg-opacity-30 rounded-lg p-4 text-gray-900">
              <p className="text-xs font-semibold text-gray-800">Temps réponse</p>
              <p className="text-xl font-bold">
                {service.responseTime ? `${service.responseTime}ms` : '—'}
              </p>
            </div>
          </div>

          {/* Historique style Datadog */}
          <div className="rounded-lg mb-6 overflow-hidden border border-gray-700" style={{ background: '#0f1117' }}>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700" style={{ background: '#161b22' }}>
              <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-widest">Logs</span>
              <span className="text-xs font-mono text-gray-500">{history.length} events</span>
            </div>
            {/* Log lines */}
            <div className="max-h-48 overflow-y-auto font-mono text-xs">
              {loadingHistory ? (
                <div className="px-4 py-3 text-gray-500">Chargement...</div>
              ) : history.length === 0 ? (
                <div className="px-4 py-3 text-gray-500">No logs found</div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-1.5 border-b border-gray-800 hover:bg-white hover:bg-opacity-5 transition-colors"
                  >
                    {/* Barre de couleur latérale */}
                    <div className={`w-0.5 self-stretch rounded-full flex-shrink-0 ${item.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                    {/* Timestamp */}
                    <span className="text-gray-500 flex-shrink-0 w-36">{formatHistoryTimestamp(item.timestamp)}</span>
                    {/* Niveau */}
                    <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-bold uppercase ${item.status === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                      {item.status === 'success' ? 'OK' : 'ERR'}
                    </span>
                    {/* Message */}
                    <span className="text-gray-300 flex-1">
                      {item.status === 'success'
                        ? `Health check passed — ${service.url}`
                        : `Health check failed — ${service.url}`}
                    </span>
                    {/* Response time */}
                    {item.responseTime != null && (
                      <span className="text-gray-500 flex-shrink-0">{item.responseTime}ms</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Graphique simple */}
          <div className="bg-white bg-opacity-30 rounded-lg p-4 mb-6 text-gray-900">
            <h2 className="font-bold text-lg mb-3">Disponibilité (7j)</h2>
            <div className="flex items-end justify-between h-20 gap-1">
              {[85, 60, 90, 75, 95, 88, 92].map((percent, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gray-900 opacity-40 rounded-t"
                    style={{ height: `${percent}%`, minHeight: '4px' }}
                  ></div>
                  <span className="text-xs font-semibold">{percent}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Boutons d'actions */}
          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Editer
            </button>
            <button
              onClick={onDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Supprimer
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bubbleGrow {
          from {
            transform: scale(0.3);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
