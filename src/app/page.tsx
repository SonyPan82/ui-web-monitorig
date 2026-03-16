'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MonitoringDashboard from '@/components/MonitoringDashboard';

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('home');

  const services = [
    { id: '1', name: 'ECOLE CENTRALE', status: 'active' as const },
    { id: '2', name: 'GOOGLE', status: 'active' as const },
    { id: '3', name: 'MYSPACE', status: 'inactive' as const },
    { id: '4', name: 'LEROY MERLIN', status: 'active' as const },
    { id: '5', name: 'UNKNOWN', status: 'unknown' as const },
    { id: '6', name: 'WINDOWS PHONE', status: 'inactive' as const },
    { id: '7', name: 'APPLE', status: 'active' as const },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header title="E.2.A « ADMIN »ÉCRAN D'ACCUEIL" />

        {/* Dashboard */}
        <MonitoringDashboard services={services} />
      </div>
    </div>
  );
}
