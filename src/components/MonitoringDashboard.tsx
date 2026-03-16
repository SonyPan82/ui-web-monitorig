import ServiceCard from './ServiceCard';

interface Service {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'inactive' | 'unknown';
  lastCheck: string | null;
  responseTime: number | null;
}

interface MonitoringDashboardProps {
  services: Service[];
  onAddService?: () => void;
  onEditService?: (service: Service) => void;
  onDeleteService?: (id: string) => void;
}

export default function MonitoringDashboard({
  services,
  onAddService,
  onEditService,
  onDeleteService,
}: MonitoringDashboardProps) {
  return (
    <main className="flex-1 p-3 sm:p-6 md:p-8 bg-gray-100 overflow-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8 auto-rows-max">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="relative group"
            style={{
              animation: 'bubbleGrow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
              animationDelay: `${index * 80}ms`,
            }}
          >
            <div
              onClick={() => onEditService?.(service)}
              className="cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              <ServiceCard
                name={service.name}
                url={service.url}
                status={service.status}
                responseTime={service.responseTime}
                lastCheck={service.lastCheck}
              />
            </div>

            {/* Boutons d'action toujours visibles */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditService?.(service);
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Editer
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteService?.(service.id);
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}

        {/* Bouton pour ajouter un nouveau service */}
        <div
          style={{
            animation: 'bubbleGrow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
            animationDelay: `${services.length * 80}ms`,
          }}
        >
          <button
            onClick={onAddService}
            className="w-full bg-blue-400 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg min-h-36 sm:min-h-44 md:min-h-48 border-4 border-blue-500 flex flex-col justify-center items-center text-center hover:bg-blue-500 transition-colors hover:scale-105 duration-200"
          >
            <span className="text-5xl text-white font-light">+</span>
            <p className="text-white text-sm mt-2">Ajouter un service</p>
          </button>
        </div>
      </div>
      <style>{`
        @keyframes bubbleGrow {
          from { transform: scale(0.3); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </main>
  );
}
