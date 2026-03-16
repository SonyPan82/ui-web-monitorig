import ServiceCard from './ServiceCard';

interface Service {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'unknown';
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
          />
        ))}
        
        {/* Bouton pour ajouter un nouveau service */}
        <button className="bg-blue-400 rounded-3xl p-8 shadow-lg min-h-32 flex flex-col justify-center items-center text-center hover:bg-blue-500 transition-colors">
          <span className="text-5xl text-white font-light">+</span>
        </button>
      </div>
    </main>
  );
}
