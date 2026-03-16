'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MonitoringDashboard from '@/components/MonitoringDashboard';
import Modal from '@/components/Modal';
import ServiceForm from '@/components/ServiceForm';
import ServiceDetails from '@/components/ServiceDetails';

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [detailService, setDetailService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const detailServiceRef = useRef<Service | null>(null);

  // Garder la ref synchronisée avec l'état
  useEffect(() => {
    detailServiceRef.current = detailService;
  }, [detailService]);

  // Récupérer les services depuis l'API
  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);

      // Mettre à jour detailService via la ref pour éviter les stale closures
      const current = detailServiceRef.current;
      if (current) {
        const updatedService = data.find((s: Service) => s.id === current.id);
        if (updatedService) {
          setDetailService(updatedService);
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  // Vérifier la santé de tous les services en parallèle
  const checkAllServices = async () => {
    try {
      const currentServices: Service[] = await fetch('/api/services').then(r => r.json());
      await Promise.all(
        currentServices.map(service =>
          fetch('/api/health', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: service.url, serviceId: service.id }),
          })
        )
      );
      await fetchServices();
    } catch (error) {
      console.error('Error checking services health:', error);
    }
  };

  useEffect(() => {
    fetchServices();

    // Health check automatique toutes les 15 secondes
    const healthInterval = setInterval(checkAllServices, 15000);

    return () => clearInterval(healthInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Créer un nouveau service
  const handleAddService = async (data: { name: string; url: string }) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newService = await response.json();
        setServices([...services, newService]);
        setShowAddModal(false);
        alert('Service créé avec succès!');
      } else {
        alert('Erreur lors de la création du service');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      alert('Erreur lors de la création du service');
    } finally {
      setSubmitting(false);
    }
  };

  // Éditer un service
  const handleEditService = async (data: { name: string; url: string }) => {
    if (!selectedService) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/services/${selectedService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updated = await response.json();
        
        // Vérifier la santé du site immédiatement pour mettre à jour le statut
        const healthResponse = await fetch('/api/health', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: data.url,
            serviceId: selectedService.id,
          }),
        });

        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          updated.status = healthData.status;
          updated.responseTime = healthData.responseTime;
          updated.lastCheck = new Date().toISOString();
        }

        setServices(
          services.map((s) => (s.id === updated.id ? updated : s))
        );
        setShowEditModal(false);
        setSelectedService(null);
        alert('Service mis à jour et vérifié avec succès!');
      } else {
        alert('Erreur lors de la mise à jour du service');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Erreur lors de la mise à jour du service');
    } finally {
      setSubmitting(false);
    }
  };

  // Supprimer un service
  const handleDeleteService = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service?')) return;

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setServices(services.filter((s) => s.id !== id));
        alert('Service supprimé avec succès!');
      } else {
        alert('Erreur lors de la suppression du service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Erreur lors de la suppression du service');
    }
  };

  // Ouvrir le modal d'édition
  const handleOpenEditModal = (service: Service) => {
    setSelectedService(service);
    setShowEditModal(true);
  };

  // Ouvrir la page de détails
  const handleOpenServiceDetails = (service: Service) => {
    setDetailService(service);
    setShowServiceDetails(true);
  };

  // Fermer la page de détails
  const handleCloseServiceDetails = () => {
    setShowServiceDetails(false);
    setDetailService(null);
  };

  // Éditer depuis la page de détails
  const handleEditFromDetails = () => {
    handleCloseServiceDetails();
    if (detailService) {
      handleOpenEditModal(detailService);
    }
  };

  // Supprimer depuis la page de détails
  const handleDeleteFromDetails = () => {
    if (detailService) {
      handleCloseServiceDetails();
      handleDeleteService(detailService.id);
    }
  };

  return (
    <div className="h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} />

      {/* Main content décalé pour la sidebar fixe */}
      <div className={`flex flex-col flex-1 ml-48 h-screen transition-all duration-200 ${showServiceDetails ? 'blur-sm' : ''}`}>
        {/* Header */}
        <Header title="E.2.A « ADMIN »ÉCRAN D'ACCUEIL" />

        {/* Dashboard */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-2xl text-gray-600">Chargement des services...</p>
          </div>
        ) : (
          <MonitoringDashboard 
            services={services}
            onAddService={() => setShowAddModal(true)}
            onEditService={handleOpenServiceDetails}
            onDeleteService={handleDeleteService}
          />
        )}
      </div>

      {/* Modal d'ajout */}
      <Modal
        isOpen={showAddModal}
        title="Ajouter un service"
        onClose={() => setShowAddModal(false)}
      >
        <ServiceForm
          onSubmit={handleAddService}
          onCancel={() => setShowAddModal(false)}
          isLoading={submitting}
        />
      </Modal>

      {/* Modal d'édition */}
      <Modal
        isOpen={showEditModal && selectedService !== null}
        title="Éditer le service"
        onClose={() => setShowEditModal(false)}
      >
        {selectedService && (
          <ServiceForm
            initialData={selectedService}
            onSubmit={handleEditService}
            onCancel={() => setShowEditModal(false)}
            isLoading={submitting}
            isEditing={true}
          />
        )}
      </Modal>

      {/* Page de détails du service */}
      {showServiceDetails && detailService && (
        <ServiceDetails
          service={detailService}
          onClose={handleCloseServiceDetails}
          onEdit={handleEditFromDetails}
          onDelete={handleDeleteFromDetails}
        />
      )}
    </div>
  );
}

