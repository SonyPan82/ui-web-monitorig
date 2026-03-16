interface ServiceCardProps {
  name: string;
  status: 'active' | 'inactive' | 'unknown';
  responseTime?: number | null;
  lastCheck?: string | null;
}

export default function ServiceCard({ name, status, responseTime, lastCheck }: ServiceCardProps) {
  const statusConfig = {
    active: {
      bg: 'bg-green-400',
      borderColor: 'border-green-500',
      textColor: 'text-gray-800',
      statusText: 'ACTIVE',
      badgeBg: 'bg-green-600',
    },
    inactive: {
      bg: 'bg-red-400',
      borderColor: 'border-red-500',
      textColor: 'text-white',
      statusText: 'INACTIVE',
      badgeBg: 'bg-red-600',
    },
    unknown: {
      bg: 'bg-yellow-400',
      borderColor: 'border-yellow-500',
      textColor: 'text-gray-800',
      statusText: 'UNKNOWN',
      badgeBg: 'bg-yellow-600',
    },
  };

  const config = statusConfig[status];

  // Formater l'heure du dernier check
  const formatTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'Jamais';
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div
      className={`${config.bg} rounded-3xl p-8 shadow-lg min-h-48 flex flex-col justify-between border-4 ${config.borderColor} cursor-pointer hover:shadow-xl transition-shadow`}
    >
      {/* Titre */}
      <div>
        <h3 className={`font-bold text-2xl ${config.textColor}`}>
          {name}
        </h3>
      </div>

      {/* Statut et informations */}
      <div className="space-y-3">
        {/* Badge de statut */}
        <div className={`${config.badgeBg} text-white font-bold px-4 py-2 rounded-full inline-block text-center`}>
          {config.statusText}
        </div>

        {/* Temps de réponse */}
        {responseTime !== null && responseTime !== undefined && (
          <div className={`text-sm font-semibold ${config.textColor}`}>
            {responseTime}ms
          </div>
        )}

        {/* Dernier check */}
        <div className={`text-xs font-semibold ${config.textColor} opacity-90`}>
          {formatTime(lastCheck)}
        </div>
      </div>
    </div>
  );
}
