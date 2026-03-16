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
      text: 'ACTIVE',
      textColor: 'text-gray-800',
    },
    inactive: {
      bg: 'bg-red-300',
      text: 'INACTIVE',
      textColor: 'text-gray-800',
    },
    unknown: {
      bg: 'bg-red-300',
      text: 'UNKNOWN',
      textColor: 'text-gray-800',
    },
  };

  const config = statusConfig[status];
  
  // Formater la date du dernier check
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Jamais';
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`${config.bg} rounded-3xl p-8 shadow-lg min-h-40 flex flex-col justify-between text-center cursor-pointer hover:shadow-xl transition-shadow`}
    >
      <div>
        <h3 className={`font-bold text-lg ${config.textColor}`}>
          {name}
        </h3>
        <p className={`text-sm font-semibold ${config.textColor} mt-2`}>
          {config.text}
        </p>
      </div>
      
      {/* Informations supplémentaires */}
      <div className={`text-xs ${config.textColor} opacity-80 mt-4`}>
        {responseTime !== null && responseTime !== undefined && (
          <p>⏱ {responseTime}ms</p>
        )}
        <p className="mt-1">🕐 {formatDate(lastCheck)}</p>
      </div>
    </div>
  );
}
