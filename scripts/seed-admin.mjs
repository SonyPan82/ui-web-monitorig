import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/web-monitoring';

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, default: 'admin' },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);

  const exists = await User.findOne({ username: 'admin' });
  if (exists) {
    console.log('Utilisateur admin déjà existant');
  } else {
    const hashed = await bcrypt.hash('admin', 10);
    await User.create({ username: 'admin', password: hashed, role: 'admin' });
    console.log('Utilisateur admin créé (password: admin)');
  }

  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
