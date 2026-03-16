import { NextResponse, NextRequest } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { getServiceHistory } from '@/lib/db';

interface RouteContext {
  params: Promise<{ serviceId: string }>;
}

// GET /api/history/[serviceId] - Récupérer l'historique d'un service
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { serviceId } = await context.params;
    if (!isValidObjectId(serviceId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    // Récupérer le paramètre limit de la query
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const history = await getServiceHistory(serviceId, limit);
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
