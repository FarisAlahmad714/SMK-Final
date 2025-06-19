const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function generateSampleData() {
  try {
    console.log('Generating sample data for AI testing...')

    // Clear existing data first (optional - comment out if you want to keep existing data)
    console.log('Clearing existing sample data...')
    await prisma.transaction.deleteMany({})
    await prisma.testDrive.deleteMany({})
    await prisma.vehicleSubmission.deleteMany({})
    await prisma.customer.deleteMany({})
    await prisma.vehicle.deleteMany({})
    await prisma.monthlyMetric.deleteMany({})

    // Generate sample vehicles
    const vehicles = []
    const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes', 'Audi']
    const models = {
      'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander'],
      'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot'],
      'Ford': ['F-150', 'Escape', 'Explorer', 'Mustang'],
      'Chevrolet': ['Silverado', 'Equinox', 'Tahoe', 'Camaro'],
      'Nissan': ['Altima', 'Sentra', 'Rogue', 'Pathfinder'],
      'BMW': ['3 Series', '5 Series', 'X3', 'X5'],
      'Mercedes': ['C-Class', 'E-Class', 'GLC', 'GLE'],
      'Audi': ['A4', 'A6', 'Q5', 'Q7']
    }
    const colors = ['White', 'Black', 'Silver', 'Blue', 'Red', 'Gray']

    for (let i = 0; i < 30; i++) {
      const make = makes[Math.floor(Math.random() * makes.length)]
      const model = models[make][Math.floor(Math.random() * models[make].length)]
      const year = 2018 + Math.floor(Math.random() * 6)
      const price = 15000 + Math.floor(Math.random() * 35000)
      const cost = price * (0.7 + Math.random() * 0.2)
      
      const vehicle = await prisma.vehicle.create({
        data: {
          stockNumber: `STK${String(i + 1).padStart(4, '0')}`,
          make,
          model,
          year,
          price,
          cost,
          mileage: 10000 + Math.floor(Math.random() * 80000),
          transmission: Math.random() > 0.5 ? 'Automatic' : 'Manual',
          exteriorColor: colors[Math.floor(Math.random() * colors.length)],
          status: 'AVAILABLE', // Start all as available
          description: `${year} ${make} ${model} in excellent condition`,
          images: []
        }
      })
      vehicles.push(vehicle)
    }

    // Generate sample customers with unique emails
    const customers = []
    const sources = ['WEBSITE', 'WALK_IN', 'REFERRAL', 'SOCIAL_MEDIA', 'PHONE']
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Amy', 'Chris', 'Emma', 'Alex', 'Maria', 'James', 'Sophia', 'Ryan']
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson']

    for (let i = 0; i < 25; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const uniqueId = Math.floor(Math.random() * 10000)
      
      const customer = await prisma.customer.create({
        data: {
          name: `${firstName} ${lastName}`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${uniqueId}@example.com`,
          phone: `555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          source: sources[Math.floor(Math.random() * sources.length)],
          notes: Math.random() > 0.7 ? 'Interested in financing options' : null
        }
      })
      customers.push(customer)
    }

    // Generate sample test drives
    for (let i = 0; i < 40; i++) {
      const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)]
      const customer = customers[Math.floor(Math.random() * customers.length)]
      const date = new Date()
      date.setDate(date.getDate() + Math.floor(Math.random() * 60) - 30) // Mix of past and future dates
      
      await prisma.testDrive.create({
        data: {
          vehicleId: vehicle.id,
          customerId: customer.id,
          customerName: customer.name,
          email: customer.email,
          phone: customer.phone,
          date,
          time: `${Math.floor(Math.random() * 12) + 9}:00`,
          status: Math.random() > 0.3 ? 'CONFIRMED' : Math.random() > 0.5 ? 'PENDING' : 'CANCELLED',
          source: customer.source
        }
      })
    }

    // Generate sample transactions (SALES) - This is the key part!
    console.log('Creating sales transactions...')
    const soldVehicles = []
    
    // Sell 15 vehicles (about 50% of inventory)
    for (let i = 0; i < 15; i++) {
      const vehicle = vehicles[i] // Use first 15 vehicles for sales
      const customer = customers[Math.floor(Math.random() * customers.length)]
      const salePrice = vehicle.price * (0.95 + Math.random() * 0.1) // 95-105% of list price
      const profit = salePrice - vehicle.cost
      const profitMargin = (profit / salePrice) * 100
      
      // Create sale dates spread across the last 6 months, with more recent sales
      const daysAgo = Math.floor(Math.random() * 180) // Last 6 months
      const saleDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      
      // Create the transaction FIRST
      const transaction = await prisma.transaction.create({
        data: {
          vehicleId: vehicle.id,
          customerId: customer.id,
          salePrice,
          profit,
          profitMargin,
          date: saleDate
        }
      })

      // Then update vehicle status to SOLD with the same date
      await prisma.vehicle.update({
        where: { id: vehicle.id },
        data: { 
          status: 'SOLD',
          soldDate: saleDate,
          soldPrice: salePrice
        }
      })
      
      soldVehicles.push(vehicle.id)
      console.log(`✅ Sold: ${vehicle.year} ${vehicle.make} ${vehicle.model} for $${salePrice.toLocaleString()} on ${saleDate.toLocaleDateString()}`)
    }

    // Generate sample monthly metrics for the last 12 months
    console.log('Creating monthly metrics...')
    for (let i = 0; i < 12; i++) {
      const month = new Date()
      month.setMonth(month.getMonth() - i)
      
      await prisma.monthlyMetric.create({
        data: {
          month,
          totalAppointments: 20 + Math.floor(Math.random() * 40),
          websiteAppointments: 10 + Math.floor(Math.random() * 20),
          otherAppointments: 5 + Math.floor(Math.random() * 15),
          totalVehiclesSold: 5 + Math.floor(Math.random() * 10),
          websiteDriveSales: 3 + Math.floor(Math.random() * 6),
          otherSourceSales: 2 + Math.floor(Math.random() * 5),
          totalRevenue: 150000 + Math.floor(Math.random() * 250000),
          totalVehicleCosts: 100000 + Math.floor(Math.random() * 180000),
          netProfit: 20000 + Math.floor(Math.random() * 60000),
          profitMargin: 10 + Math.random() * 18,
          cancelledAppointments: 2 + Math.floor(Math.random() * 8),
          activeInventory: 15 + Math.floor(Math.random() * 15),
          totalCustomers: 25 + Math.floor(Math.random() * 30),
          totalVehicles: 20 + Math.floor(Math.random() * 15),
          monthlySellRequests: 3 + Math.floor(Math.random() * 7),
          monthlyTradeRequests: 2 + Math.floor(Math.random() * 6),
          pendingSellTrade: 1 + Math.floor(Math.random() * 4),
          approvedSellTrade: 2 + Math.floor(Math.random() * 5),
          rejectedSellTrade: 1 + Math.floor(Math.random() * 3),
          totalSellRequests: 10 + Math.floor(Math.random() * 20),
          totalTradeRequests: 8 + Math.floor(Math.random() * 15)
        }
      })
    }

    // Generate sample vehicle submissions
    console.log('Creating vehicle submissions...')
    for (let i = 0; i < 10; i++) {
      await prisma.vehicleSubmission.create({
        data: {
          type: Math.random() > 0.5 ? 'sell' : 'trade',
          vin: `1HGBH41JXMN${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
          vehicleDetails: {
            make: makes[Math.floor(Math.random() * makes.length)],
            model: 'Sample Model',
            year: 2015 + Math.floor(Math.random() * 8),
            mileage: 50000 + Math.floor(Math.random() * 100000)
          },
          condition: {
            exterior: 'Good',
            interior: 'Good',
            mechanical: 'Good'
          },
          ownership: Math.random() > 0.5 ? 'OWNED' : 'FINANCED',
          photoUrls: [],
          status: Math.random() > 0.6 ? 'PENDING_REVIEW' : Math.random() > 0.5 ? 'APPROVED' : 'REJECTED',
          customerInfo: {
            name: customers[Math.floor(Math.random() * customers.length)].name,
            phone: customers[Math.floor(Math.random() * customers.length)].phone
          }
        }
      })
    }

    // Verify the data
    const finalVehicles = await prisma.vehicle.findMany()
    const finalTransactions = await prisma.transaction.findMany()
    const soldCount = finalVehicles.filter(v => v.status === 'SOLD').length
    const availableCount = finalVehicles.filter(v => v.status === 'AVAILABLE').length

    // Check current month sales
    const currentMonth = new Date()
    const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const currentMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    
    const currentMonthSales = finalVehicles.filter(v => 
      v.status === 'SOLD' && 
      v.soldDate && 
      new Date(v.soldDate) >= currentMonthStart && 
      new Date(v.soldDate) <= currentMonthEnd
    )

    console.log('\n✅ Sample data generated successfully!')
    console.log(`📊 Final Data Summary:`)
    console.log(`   - ${finalVehicles.length} total vehicles`)
    console.log(`   - ${soldCount} SOLD vehicles`)
    console.log(`   - ${availableCount} AVAILABLE vehicles`)
    console.log(`   - ${finalTransactions.length} sales transactions`)
    console.log(`   - ${customers.length} customers`)
    console.log(`   - 40 test drives`)
    console.log(`   - 12 months of metrics`)
    console.log(`   - 10 vehicle submissions`)
    console.log(`\n📅 Current Month Sales: ${currentMonthSales.length} vehicles`)
    console.log('\n🚀 Your AI Assistant is now ready to test with REAL sales data!')
    console.log('\n💡 Try asking: "Show me this month\'s sales performance" or "What\'s our total revenue?"')
    console.log('🎯 The dashboard should now show sales metrics!')

  } catch (error) {
    console.error('❌ Error generating sample data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
generateSampleData() 