import mongoose, { Schema } from 'mongoose';

const HistoryEntrySchema = new Schema(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
    serviceName: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, index: true },
    status: { type: String, enum: ['success', 'fail'], required: true },
    responseTime: { type: Number, default: null },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

HistoryEntrySchema.index({ serviceId: 1, timestamp: -1 });

export default mongoose.models.HistoryEntry || mongoose.model('HistoryEntry', HistoryEntrySchema);
