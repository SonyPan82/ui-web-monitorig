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
    <main className="flex-1 p-8 bg-gray-100 overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-max">
        {services.map((service) => (
          <div key={service.id} className="relative group">
            <div
              onClick={() => onEditService?.(service)}
              className="cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              <ServiceCard
                name={service.name}
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
        <div>
          <button
            onClick={onAddService}
            className="w-full bg-blue-400 rounded-3xl p-8 shadow-lg min-h-48 border-4 border-blue-500 flex flex-col justify-center items-center text-center hover:bg-blue-500 transition-colors hover:scale-105 duration-200"
          >
            <span className="text-5xl text-white font-light">+</span>
            <p className="text-white text-sm mt-2">Ajouter un service</p>
          </button>
        </div>
      </div>
    </main>
  );
}
