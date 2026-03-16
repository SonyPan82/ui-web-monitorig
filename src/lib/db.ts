import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'services.json');

export interface Service {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'inactive' | 'unknown';
  lastCheck: string | null;
  responseTime: number | null;
}

// Lire tous les services
export async function getServices(): Promise<Service[]> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading services:', error);
    return [];
  }
}

// Obtenir un service par ID
export async function getServiceById(id: string): Promise<Service | null> {
  const services = await getServices();
  return services.find(s => s.id === id) || null;
}

// Créer un nouveau service
export async function createService(
  service: Omit<Service, 'id' | 'lastCheck' | 'responseTime'>
): Promise<Service> {
  const services = await getServices();
  const newId = (Math.max(...services.map(s => parseInt(s.id))) + 1).toString();
  
  const newService: Service = {
    ...service,
    id: newId,
    lastCheck: null,
    responseTime: null,
  };

  services.push(newService);
  await saveServices(services);
  return newService;
}

// Mettre à jour un service
export async function updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
  const services = await getServices();
  const index = services.findIndex(s => s.id === id);
  
  if (index === -1) return null;

  const updated = { ...services[index], ...updates };
  services[index] = updated;
  await saveServices(services);
  return updated;
}

// Supprimer un service
export async function deleteService(id: string): Promise<boolean> {
  const services = await getServices();
  const filtered = services.filter(s => s.id !== id);
  
  if (filtered.length === services.length) return false;
  
  await saveServices(filtered);
  return true;
}

// Sauvegarder les services
async function saveServices(services: Service[]): Promise<void> {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(services, null, 2));
  } catch (error) {
    console.error('Error saving services:', error);
    throw error;
  }
}

// Vérifier la santé d'une URL
export async function checkUrlHealth(url: string): Promise<{
  status: 'active' | 'inactive';
  responseTime: number | null;
}> {
  const startTime = Date.now();
  
  try {
    // Créer un contrôleur d'annulation avec timeout de 5 secondes
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    return {
      status: response.ok ? 'active' : 'inactive',
      responseTime,
    };
  } catch (error) {
    return {
      status: 'inactive',
      responseTime: null,
    };
  }
}
