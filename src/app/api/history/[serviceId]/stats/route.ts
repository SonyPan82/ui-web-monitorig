import { NextResponse, NextRequest } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { connectDB } from '@/lib/mongoose';
import HistoryModel from '@/models/HistoryEntry';

interface RouteContext {
  params: Promise<{ serviceId: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { serviceId } = await context.params;
  if (!isValidObjectId(serviceId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  await connectDB();

  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const entries = await HistoryModel.find({
    serviceId,
    timestamp: { $gte: since },
  }).lean();

  // Construire les 7 derniers jours
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  });

  const stats = days.map(day => {
    const dayEntries = entries.filter(e =>
      new Date(e.timestamp as Date).toISOString().slice(0, 10) === day
    );
    const total = dayEntries.length;
    const success = dayEntries.filter(e => e.status === 'success').length;
    const uptime = total > 0 ? Math.round((success / total) * 100) : null;

    return {
      day,
      label: new Date(day).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
      uptime,
      total,
      success,
      fail: total - success,
    };
  });

  return NextResponse.json(stats);
}
