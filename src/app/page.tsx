'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MonitoringDashboard from '@/components/MonitoringDashboard';

interface Service {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'inactive' | 'unknown';
  lastCheck: string | null;
  responseTime: number | null;
}

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('home');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les services depuis l'API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header title="E.2.A « ADMIN »ÉCRAN D'ACCUEIL" />

        {/* Dashboard */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-2xl text-gray-600">Chargement des services...</p>
          </div>
        ) : (
          <MonitoringDashboard services={services} />
        )}
      </div>
    </div>
  );
}
