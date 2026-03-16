import { NextResponse, NextRequest } from 'next/server';
import { getServices, createService } from '@/lib/db';

// GET /api/services - Récupérer tous les services
export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST /api/services - Créer un nouveau service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url } = body;

    if (!name || !url) {
      return NextResponse.json(
        { error: 'Missing required fields: name, url' },
        { status: 400 }
      );
    }

    const newService = await createService({
      name,
      url,
      status: 'unknown',
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
