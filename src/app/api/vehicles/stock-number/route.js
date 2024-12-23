// src/app/api/vehicles/stock-number/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear()
    
    // Get the latest vehicle for this year
    const latestVehicle = await prisma.vehicle.findFirst({
      where: {
        stockNumber: {
          startsWith: `SMK${currentYear}`
        }
      },
      orderBy: {
        stockNumber: 'desc'
      }
    })

    let newStockNumber
    if (!latestVehicle) {
      // First vehicle of the year
      newStockNumber = `SMK${currentYear}001`
    } else {
      // Extract the numeric part and increment
      const currentNumber = parseInt(latestVehicle.stockNumber.slice(-3))
      const nextNumber = (currentNumber + 1).toString().padStart(3, '0')
      newStockNumber = `SMK${currentYear}${nextNumber}`
    }

    return NextResponse.json({ stockNumber: newStockNumber })
  } catch (error) {
    console.error('Error generating stock number:', error)
    return NextResponse.json(
      { error: 'Failed to generate stock number' },
      { status: 500 }
    )
  }
}