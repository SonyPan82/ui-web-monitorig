import { NextResponse, NextRequest } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { connectDB } from '@/lib/mongoose';
import UserModel from '@/models/User';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  await connectDB();
  const body = await request.json();

  const user = await UserModel.findById(id);
  if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });

  if (body.username) user.username = body.username;
  if (body.role) user.role = body.role;
  if (body.password) user.password = body.password;

  await user.save();
  return NextResponse.json({ id: String(user._id), username: user.username, role: user.role });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  await connectDB();
  const result = await UserModel.findByIdAndDelete(id);
  if (!result) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });

  return NextResponse.json({ success: true });
}
