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
}

export default function MonitoringDashboard({ services }: MonitoringDashboardProps) {
  return (
    <main className="flex-1 p-8 bg-gray-100 overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-max">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            name={service.name}
            status={service.status}
            responseTime={service.responseTime}
            lastCheck={service.lastCheck}
          />
        ))}
        
        {/* Bouton pour ajouter un nouveau service */}
        <button className="bg-blue-400 rounded-3xl p-8 shadow-lg min-h-40 flex flex-col justify-center items-center text-center hover:bg-blue-500 transition-colors">
          <span className="text-5xl text-white font-light">+</span>
          <p className="text-white text-sm mt-2">Ajouter un service</p>
        </button>
      </div>
    </main>
  );
}
