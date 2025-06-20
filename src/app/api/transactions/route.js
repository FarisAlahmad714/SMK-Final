// src/app/api/transactions/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
  try {
    const data = await request.json()
    console.log('Transaction data received:', data)

    // Validate required fields
    if (!data.vehicleId || !data.customerId || !data.salePrice) {
      console.log('Missing required fields:', { data })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if a transaction already exists for this vehicle
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        vehicleId: data.vehicleId
      }
    })

    if (existingTransaction) {
      return NextResponse.json(
        { error: 'Transaction already exists for this vehicle' },
        { status: 400 }
      )
    }

    // Create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        vehicleId: data.vehicleId,
        customerId: data.customerId,
        salePrice: parseFloat(data.salePrice),
        profit: parseFloat(data.profit),
        profitMargin: parseFloat(data.profitMargin),
        date: new Date().toISOString()
      }
    })

    // If transaction is created successfully, update the vehicle status to SOLD
    await prisma.vehicle.update({
      where: { id: data.vehicleId },
      data: {
        status: 'SOLD',
        soldPrice: parseFloat(data.salePrice),
        soldDate: new Date().toISOString()
      }
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Detailed error:', error)
    return NextResponse.json(
      { error: 'Error creating transaction: ' + error.message },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        vehicle: true,
        customer: true,
      },
      orderBy: {
        date: 'desc'
      },
      distinct: ['vehicleId'] // Add this line to ensure uniqueness
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Error fetching transactions' },
      { status: 500 }
    )
  }
}