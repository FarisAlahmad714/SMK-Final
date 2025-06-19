const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createAdminSales() {
  try {
    console.log('Creating sales through proper admin workflow...')

    // Get available vehicles
    const availableVehicles = await prisma.vehicle.findMany({
      where: { status: 'AVAILABLE' },
      take: 10 // Sell 10 vehicles
    })

    // Get customers
    const customers = await prisma.customer.findMany()

    if (availableVehicles.length === 0) {
      console.log('❌ No available vehicles to sell')
      return
    }

    if (customers.length === 0) {
      console.log('❌ No customers found')
      return
    }

    console.log(`📦 Found ${availableVehicles.length} available vehicles`)
    console.log(`👥 Found ${customers.length} customers`)

    // Create sales through proper admin workflow
    for (let i = 0; i < Math.min(10, availableVehicles.length); i++) {
      const vehicle = availableVehicles[i]
      const customer = customers[Math.floor(Math.random() * customers.length)]
      
      // Calculate sale price (95-105% of list price)
      const salePrice = vehicle.price * (0.95 + Math.random() * 0.1)
      const profit = salePrice - vehicle.cost
      const profitMargin = (profit / salePrice) * 100
      
      // Create sale date (spread across current month)
      const daysAgo = Math.floor(Math.random() * 30) // Current month
      const saleDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

      console.log(`\n🔄 Processing sale for ${vehicle.year} ${vehicle.make} ${vehicle.model}...`)

      try {
        // Step 1: Create transaction (like the admin panel does)
        const transaction = await prisma.transaction.create({
          data: {
            vehicleId: vehicle.id,
            customerId: customer.id,
            salePrice: parseFloat(salePrice),
            profit: parseFloat(profit),
            profitMargin: parseFloat(profitMargin),
            date: saleDate
          }
        })

        // Step 2: Update vehicle status to SOLD (like the admin panel does)
        await prisma.vehicle.update({
          where: { id: vehicle.id },
          data: {
            status: 'SOLD',
            soldPrice: parseFloat(salePrice),
            soldDate: saleDate
          }
        })

        console.log(`✅ SOLD: ${vehicle.year} ${vehicle.make} ${vehicle.model}`)
        console.log(`   💰 Sale Price: $${salePrice.toLocaleString()}`)
        console.log(`   💸 Profit: $${profit.toLocaleString()}`)
        console.log(`   📊 Margin: ${profitMargin.toFixed(2)}%`)
        console.log(`   👤 Customer: ${customer.name}`)
        console.log(`   📅 Date: ${saleDate.toLocaleDateString()}`)

      } catch (error) {
        console.error(`❌ Error selling ${vehicle.make} ${vehicle.model}:`, error.message)
      }
    }

    // Verify the results
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

    const currentMonthRevenue = currentMonthSales.reduce((sum, v) => sum + (v.soldPrice || 0), 0)

    console.log('\n🎉 Sales created successfully!')
    console.log(`📊 Final Summary:`)
    console.log(`   - ${finalVehicles.length} total vehicles`)
    console.log(`   - ${soldCount} SOLD vehicles`)
    console.log(`   - ${availableCount} AVAILABLE vehicles`)
    console.log(`   - ${finalTransactions.length} total transactions`)
    console.log(`\n📅 Current Month (${currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}):`)
    console.log(`   - ${currentMonthSales.length} vehicles sold`)
    console.log(`   - $${currentMonthRevenue.toLocaleString()} revenue`)
    console.log('\n🚀 Your dashboard should now show proper sales metrics!')
    console.log('💡 Refresh your dashboard to see the updated numbers')

  } catch (error) {
    console.error('❌ Error creating admin sales:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
createAdminSales() 