import { NextResponse, NextRequest } from 'next/server';
import { checkUrlHealth, updateService, getServiceById, addHistoryEntry } from '@/lib/db';

// POST /api/health - Vérifier la santé d'une URL
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, serviceId } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'Missing required field: url' },
        { status: 400 }
      );
    }

    const { status, responseTime } = await checkUrlHealth(url);

    // Si serviceId est fourni, mettre à jour le service et enregistrer dans l'historique
    if (serviceId) {
      const service = await getServiceById(serviceId);
      
      if (service) {
        await updateService(serviceId, {
          status,
          responseTime,
          lastCheck: new Date().toISOString(),
        });

        // Enregistrer dans l'historique
        await addHistoryEntry({
          serviceId,
          serviceName: service.name,
          timestamp: new Date().toISOString(),
          status: status === 'active' ? 'success' : 'fail',
          responseTime,
        });
      }
    }

    return NextResponse.json({ status, responseTime });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { error: 'Failed to check health' },
      { status: 500 }
    );
  }
}

