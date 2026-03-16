import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import UserModel from '@/models/User';

export async function GET() {
  await connectDB();
  const users = await UserModel.find().select('-password').lean();
  return NextResponse.json(users.map(u => ({ id: String(u._id), username: u.username, role: u.role })));
}

export async function POST(request: NextRequest) {
  await connectDB();
  const { username, password, role } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'username et password requis' }, { status: 400 });
  }

  const exists = await UserModel.findOne({ username });
  if (exists) {
    return NextResponse.json({ error: 'Utilisateur déjà existant' }, { status: 409 });
  }

  const user = await UserModel.create({ username, password, role: role ?? 'user' });
  return NextResponse.json({ id: String(user._id), username: user.username, role: user.role }, { status: 201 });
}
