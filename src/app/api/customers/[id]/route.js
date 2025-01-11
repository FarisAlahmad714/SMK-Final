import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        sellTradeRequest: data.sellTradeRequest,
        notes: data.notes,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}