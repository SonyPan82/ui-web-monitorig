interface ServiceCardProps {
  name: string;
  status: 'active' | 'inactive' | 'unknown';
}

export default function ServiceCard({ name, status }: ServiceCardProps) {
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

  return (
    <div
      className={`${config.bg} rounded-3xl p-8 shadow-lg min-h-32 flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-xl transition-shadow`}
    >
      <h3 className={`font-bold text-lg ${config.textColor}`}>
        {name}
      </h3>
      <p className={`text-sm font-semibold ${config.textColor} mt-2`}>
        {config.text}
      </p>
    </div>
  );
}
