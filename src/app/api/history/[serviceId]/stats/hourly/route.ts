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
  since.setHours(since.getHours() - 23, 0, 0, 0);

  const entries = await HistoryModel.find({
    serviceId,
    timestamp: { $gte: since },
  }).lean();

  const hours = Array.from({ length: 24 }, (_, i) => {
    const d = new Date();
    d.setHours(d.getHours() - (23 - i), 0, 0, 0);
    return d;
  });

  const stats = hours.map(hour => {
    const next = new Date(hour);
    next.setHours(next.getHours() + 1);

    const hourEntries = entries.filter(e => {
      const t = new Date(e.timestamp as Date);
      return t >= hour && t < next;
    });

    const total = hourEntries.length;
    const success = hourEntries.filter(e => e.status === 'success').length;
    const uptime = total > 0 ? Math.round((success / total) * 100) : null;
    const avgResponse = total > 0
      ? Math.round(hourEntries.filter(e => e.responseTime).reduce((a, e) => a + (e.responseTime ?? 0), 0) / hourEntries.filter(e => e.responseTime).length) || null
      : null;

    return {
      hour: hour.toISOString(),
      label: hour.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      uptime,
      total,
      success,
      fail: total - success,
      avgResponse,
    };
  });

  return NextResponse.json(stats);
}
