import { NextResponse } from 'next/server';
import { getServices, checkUrlHealth, updateService } from '@/lib/db';

// GET /api/monitor - Vérifier la santé de tous les services
export async function GET() {
  try {
    const services = await getServices();
    const results = [];

    // Vérifier chaque service en parallèle
    const checks = services.map(async (service) => {
      const { status, responseTime } = await checkUrlHealth(service.url);
      
      // Mettre à jour le service avec le résultat
      await updateService(service.id, {
        status,
        responseTime,
        lastCheck: new Date().toISOString(),
      });

      return {
        id: service.id,
        name: service.name,
        status,
        responseTime,
      };
    });

    const results_final = await Promise.all(checks);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      checked: results_final.length,
      results: results_final,
    });
  } catch (error) {
    console.error('Monitoring error:', error);
    return NextResponse.json(
      { error: 'Monitoring failed' },
      { status: 500 }
    );
  }
}
