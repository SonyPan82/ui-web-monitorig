import { NextResponse, NextRequest } from 'next/server';
import { checkUrlHealth, updateService } from '@/lib/db';

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

    // Si serviceId est fourni, mettre à jour le service dans la BD
    if (serviceId) {
      await updateService(serviceId, {
        status,
        responseTime,
        lastCheck: new Date().toISOString(),
      });
    }

    return NextResponse.json({ status, responseTime });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check health' },
      { status: 500 }
    );
  }
}
