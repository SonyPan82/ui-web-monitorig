import mongoose, { Schema } from 'mongoose';

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['active', 'inactive', 'unknown'],
      default: 'unknown',
    },
    lastCheck: { type: Date, default: null },
    responseTime: { type: Number, default: null },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
