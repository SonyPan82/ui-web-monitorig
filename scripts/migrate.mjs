import { readFile } from 'fs/promises';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/web-monitoring';

const ServiceSchema = new mongoose.Schema(
  {
    name: String,
    url: String,
    status: { type: String, default: 'unknown' },
    lastCheck: { type: Date, default: null },
    responseTime: { type: Number, default: null },
  },
  { toJSON: { virtuals: true } }
);

const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

async function migrate() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const raw = await readFile('./data/services.json', 'utf-8');
  const services = JSON.parse(raw);

  let inserted = 0;
  let skipped = 0;

  for (const s of services) {
    const exists = await Service.findOne({ name: s.name, url: s.url });
    if (exists) {
      console.log(`  SKIP  ${s.name} (already exists)`);
      skipped++;
      continue;
    }

    await Service.create({
      name: s.name,
      url: s.url,
      status: s.status,
      lastCheck: s.lastCheck ? new Date(s.lastCheck) : null,
      responseTime: s.responseTime ?? null,
    });

    console.log(`  OK    ${s.name}`);
    inserted++;
  }

  console.log(`\nDone: ${inserted} inserted, ${skipped} skipped`);
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
