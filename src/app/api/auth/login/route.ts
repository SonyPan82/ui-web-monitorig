import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import UserModel from '@/models/User';

export async function POST(request: NextRequest) {
  await connectDB();
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Champs requis' }, { status: 400 });
  }

  const user = await UserModel.findOne({ username });
  if (!user) {
    return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
  }

  return NextResponse.json({ id: String(user._id), username: user.username, role: user.role });
}
