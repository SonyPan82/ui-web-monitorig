import { connectDB } from './mongoose';
import ServiceModel from '@/models/Service';
import HistoryModel from '@/models/HistoryEntry';

export interface Service {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'inactive' | 'unknown';
  lastCheck: string | null;
  responseTime: number | null;
}

export interface HistoryEntry {
  id: string;
  serviceId: string;
  serviceName: string;
  timestamp: string;
  status: 'success' | 'fail';
  responseTime: number | null;
}

function toService(doc: Record<string, unknown>): Service {
  return {
    id: String(doc._id ?? doc.id),
    name: doc.name as string,
    url: doc.url as string,
    status: doc.status as Service['status'],
    lastCheck: doc.lastCheck ? new Date(doc.lastCheck as string).toISOString() : null,
    responseTime: (doc.responseTime as number) ?? null,
  };
}

function toHistoryEntry(doc: Record<string, unknown>): HistoryEntry {
  return {
    id: String(doc._id ?? doc.id),
    serviceId: String(doc.serviceId),
    serviceName: doc.serviceName as string,
    timestamp: new Date(doc.timestamp as string).toISOString(),
    status: doc.status as HistoryEntry['status'],
    responseTime: (doc.responseTime as number) ?? null,
  };
}

export async function getServices(): Promise<Service[]> {
  await connectDB();
  const docs = await ServiceModel.find().lean();
  return docs.map(toService);
}

export async function getServiceById(id: string): Promise<Service | null> {
  await connectDB();
  const doc = await ServiceModel.findById(id).lean();
  return doc ? toService(doc as Record<string, unknown>) : null;
}

export async function createService(
  data: Omit<Service, 'id' | 'lastCheck' | 'responseTime'>
): Promise<Service> {
  await connectDB();
  const doc = await ServiceModel.create({ ...data, lastCheck: null, responseTime: null });
  return toService(doc.toObject());
}

export async function updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
  await connectDB();
  const doc = await ServiceModel.findByIdAndUpdate(id, updates, { new: true }).lean();
  return doc ? toService(doc as Record<string, unknown>) : null;
}

export async function deleteService(id: string): Promise<boolean> {
  await connectDB();
  const result = await ServiceModel.findByIdAndDelete(id).lean();
  return result !== null;
}

export async function getServiceHistory(serviceId: string, limit = 50): Promise<HistoryEntry[]> {
  await connectDB();
  const docs = await HistoryModel.find({ serviceId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
  return docs.map(toHistoryEntry);
}

export async function addHistoryEntry(
  entry: Omit<HistoryEntry, 'id'>
): Promise<HistoryEntry> {
  await connectDB();
  const doc = await HistoryModel.create(entry);
  return toHistoryEntry(doc.toObject());
}

export async function checkUrlHealth(url: string): Promise<{
  status: 'active' | 'inactive';
  responseTime: number | null;
}> {
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return {
      status: response.ok ? 'active' : 'inactive',
      responseTime: Date.now() - startTime,
    };
  } catch {
    return { status: 'inactive', responseTime: null };
  }
}
