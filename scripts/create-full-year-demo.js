const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createFullYearDemo() {
  try {
    console.log('🚀 Creating MASSIVE full-year dealership demo data...')
    console.log('This will be the most impressive demo ever! 💪\n')

    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await prisma.transaction.deleteMany({})
    await prisma.testDrive.deleteMany({})
    await prisma.vehicleSubmission.deleteMany({})
    await prisma.customer.deleteMany({})
    await prisma.vehicle.deleteMany({})
    await prisma.monthlyMetric.deleteMany({})

    // Generate a large inventory of vehicles
    console.log('🚗 Creating vehicle inventory...')
    const vehicles = []
    const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes', 'Audi', 'Hyundai', 'Kia', 'Mazda', 'Subaru']
    const models = {
      'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', 'Tundra', 'Prius'],
      'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V', 'Passport', 'Ridgeline'],
      'Ford': ['F-150', 'Escape', 'Explorer', 'Mustang', 'Edge', 'Bronco', 'Ranger'],
      'Chevrolet': ['Silverado', 'Equinox', 'Tahoe', 'Camaro', 'Traverse', 'Colorado', 'Blazer'],
      'Nissan': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Murano', 'Frontier', 'Armada'],
      'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'X1', 'X7', 'M3'],
      'Mercedes': ['C-Class', 'E-Class', 'GLC', 'GLE', 'A-Class', 'S-Class', 'AMG'],
      'Audi': ['A4', 'A6', 'Q5', 'Q7', 'Q3', 'A3', 'RS'],
      'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Venue', 'Kona'],
      'Kia': ['Forte', 'K5', 'Sportage', 'Telluride', 'Sorento', 'Soul', 'Rio'],
      'Mazda': ['CX-5', 'CX-30', 'Mazda3', 'Mazda6', 'CX-9', 'MX-5', 'CX-50'],
      'Subaru': ['Outback', 'Forester', 'Crosstrek', 'Impreza', 'Ascent', 'Legacy', 'WRX']
    }
    const colors = ['White', 'Black', 'Silver', 'Blue', 'Red', 'Gray', 'Green', 'Orange']

    // Create 100 vehicles
    for (let i = 0; i < 100; i++) {
      const make = makes[Math.floor(Math.random() * makes.length)]
      const model = models[make][Math.floor(Math.random() * models[make].length)]
      const year = 2018 + Math.floor(Math.random() * 6)
      const price = 15000 + Math.floor(Math.random() * 45000)
      const cost = price * (0.65 + Math.random() * 0.25) // 65-90% of price
      
      const vehicle = await prisma.vehicle.create({
        data: {
          stockNumber: `STK${String(i + 1).padStart(4, '0')}`,
          make,
          model,
          year,
          price,
          cost,
          mileage: 5000 + Math.floor(Math.random() * 100000),
          transmission: Math.random() > 0.3 ? 'Automatic' : 'Manual',
          exteriorColor: colors[Math.floor(Math.random() * colors.length)],
          status: 'AVAILABLE',
          description: `${year} ${make} ${model} in excellent condition with low mileage`,
          images: []
        }
      })
      vehicles.push(vehicle)
    }

    // Create special "Inventory Buddy" vehicles that stay in active inventory
    console.log('🤖 Creating Inventory Buddy vehicles (special demo vehicles)...')
    const inventoryBuddies = [
      {
        stockNumber: 'BUDDY001',
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        price: 28000,
        cost: 22000,
        mileage: 15000,
        transmission: 'Automatic',
        exteriorColor: 'Silver',
        description: 'Inventory Buddy Demo Vehicle - Perfect for showcasing active inventory features'
      },
      {
        stockNumber: 'BUDDY002',
        make: 'Honda',
        model: 'CR-V',
        year: 2021,
        price: 32000,
        cost: 26000,
        mileage: 22000,
        transmission: 'Automatic',
        exteriorColor: 'Blue',
        description: 'Inventory Buddy Demo Vehicle - Great for inventory management demonstrations'
      },
      {
        stockNumber: 'BUDDY003',
        make: 'Ford',
        model: 'F-150',
        year: 2020,
        price: 45000,
        cost: 38000,
        mileage: 35000,
        transmission: 'Automatic',
        exteriorColor: 'Black',
        description: 'Inventory Buddy Demo Vehicle - Premium truck for active inventory showcase'
      },
      {
        stockNumber: 'BUDDY004',
        make: 'BMW',
        model: '3 Series',
        year: 2021,
        price: 42000,
        cost: 35000,
        mileage: 18000,
        transmission: 'Automatic',
        exteriorColor: 'White',
        description: 'Inventory Buddy Demo Vehicle - Luxury sedan for inventory diversity'
      },
      {
        stockNumber: 'BUDDY005',
        make: 'Hyundai',
        model: 'Tucson',
        year: 2022,
        price: 26000,
        cost: 21000,
        mileage: 12000,
        transmission: 'Automatic',
        exteriorColor: 'Red',
        description: 'Inventory Buddy Demo Vehicle - Compact SUV for active inventory management'
      }
    ]

    // Add inventory buddy vehicles to the database
    for (const buddy of inventoryBuddies) {
      const vehicle = await prisma.vehicle.create({
        data: {
          ...buddy,
          status: 'AVAILABLE', // These will NEVER be sold
          images: []
        }
      })
      vehicles.push(vehicle)
      console.log(`🤖 Created Inventory Buddy: ${buddy.year} ${buddy.make} ${buddy.model} (${buddy.stockNumber})`)
    }

    // Generate 150 customers with diverse sources
    console.log('👥 Creating customer database...')
    const customers = []
    const sources = ['WEBSITE', 'WALK_IN', 'REFERRAL', 'SOCIAL_MEDIA', 'PHONE', 'ONLINE_AD', 'TRADE_SHOW']
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Amy', 'Chris', 'Emma', 'Alex', 'Maria', 'James', 'Sophia', 'Ryan', 'Olivia', 'Michael', 'Emily', 'Daniel', 'Jessica', 'Robert', 'Ashley', 'William', 'Amanda', 'Richard', 'Nicole', 'Joseph', 'Stephanie', 'Thomas', 'Melissa', 'Christopher', 'Michelle', 'Charles', 'Kimberly', 'Anthony', 'Tiffany', 'Mark', 'Laura', 'Donald', 'Heather', 'Steven', 'Samantha', 'Paul', 'Christine', 'Andrew', 'Deborah', 'Joshua', 'Rachel', 'Kenneth', 'Carolyn', 'Kevin', 'Janet', 'Brian', 'Catherine', 'George', 'Maria', 'Timothy', 'Heather', 'Ronald', 'Diane', 'Jason', 'Ruth', 'Edward', 'Julie', 'Jeffrey', 'Joyce', 'Ryan', 'Virginia', 'Jacob', 'Victoria', 'Gary', 'Kelly', 'Nicholas', 'Lauren', 'Eric', 'Christine', 'Jonathan', 'Joan', 'Stephen', 'Evelyn', 'Larry', 'Judith', 'Justin', 'Megan', 'Scott', 'Cheryl', 'Brandon', 'Andrea', 'Benjamin', 'Hannah', 'Samuel', 'Jacqueline', 'Frank', 'Martha', 'Gregory', 'Gloria', 'Raymond', 'Teresa', 'Alexander', 'Ann', 'Patrick', 'Sara', 'Jack', 'Madison', 'Dennis', 'Frances', 'Jerry', 'Kathryn', 'Tyler', 'Janice', 'Aaron', 'Jean', 'Jose', 'Abigail', 'Adam', 'Alice', 'Nathan', 'Julia', 'Henry', 'Judy', 'Douglas', 'Sophia', 'Zachary', 'Grace', 'Peter', 'Denise', 'Kyle', 'Amber', 'Walter', 'Doris', 'Ethan', 'Marilyn', 'Jeremy', 'Danielle', 'Harold', 'Beverly', 'Carl', 'Isabella', 'Keith', 'Theresa', 'Roger', 'Diana', 'Gerald', 'Natalie', 'Christian', 'Brittany', 'Terry', 'Charlotte', 'Sean', 'Monica', 'Gavin', 'Lori', 'Austin', 'Tammy', 'Arthur', 'Monica', 'Lawrence', 'Erica', 'Jesse', 'Colleen', 'Dylan', 'Allison', 'Bryan', 'Suzanne', 'Joe', 'Carrie', 'Jordan', 'Charlotte', 'Billy', 'Monica', 'Bruce', 'Erica', 'Albert', 'Colleen', 'Willie', 'Allison', 'Gabriel', 'Suzanne', 'Logan', 'Carrie', 'Alan', 'Charlotte', 'Juan', 'Monica', 'Wayne', 'Erica', 'Roy', 'Colleen', 'Ralph', 'Allison', 'Randy', 'Suzanne', 'Eugene', 'Carrie', 'Vincent', 'Charlotte', 'Russell', 'Monica', 'Elijah', 'Erica', 'Louis', 'Colleen', 'Bobby', 'Allison', 'Philip', 'Suzanne', 'Johnny', 'Carrie']
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Torres', 'Peterson', 'Gray', 'Ramirez', 'James', 'Watson', 'Brooks', 'Kelly', 'Sanders', 'Price', 'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Hughes', 'Flores', 'Washington', 'Butler', 'Simmons', 'Foster', 'Gonzales', 'Bryant', 'Alexander', 'Russell', 'Griffin', 'Diaz', 'Hayes', 'Myers', 'Ford', 'Hamilton', 'Graham', 'Sullivan', 'Wallace', 'Woods', 'Cole', 'West', 'Jordan', 'Owens', 'Reynolds', 'Fisher', 'Ellis', 'Harrison', 'Gibson', 'McDonald', 'Cruz', 'Marshall', 'Ortiz', 'Gomez', 'Murray', 'Freeman', 'Wells', 'Webb', 'Simpson', 'Stevens', 'Tucker', 'Porter', 'Hunter', 'Hicks', 'Crawford', 'Henry', 'Boyd', 'Mason', 'Morales', 'Kennedy', 'Warren', 'Dixon', 'Ramos', 'Reyes', 'Burns', 'Gordon', 'Shaw', 'Holmes', 'Rice', 'Robertson', 'Hunt', 'Black', 'Daniels', 'Palmer', 'Mills', 'Nichols', 'Grant', 'Knight', 'Ferguson', 'Rose', 'Stone', 'Hawkins', 'Dunn', 'Perkins', 'Hudson', 'Spencer', 'Gardner', 'Stephens', 'Payne', 'Pierce', 'Berry', 'Matthews', 'Arnold', 'Wagner', 'Willis', 'Ray', 'Watkins', 'Olson', 'Carroll', 'Duncan', 'Snyder', 'Hart', 'Cunningham', 'Bradley', 'Lane', 'Andrews', 'Ruiz', 'Harper', 'Fox', 'Riley', 'Armstrong', 'Carpenter', 'Weaver', 'Greene', 'Lawrence', 'Elliott', 'Chavez', 'Sims', 'Austin', 'Peters', 'Kelley', 'Franklin', 'Lawson', 'Fields', 'Gutierrez', 'Ryan', 'Schmidt', 'Carr', 'Vasquez', 'Castillo', 'Wheeler', 'Chapman', 'Oliver', 'Montgomery', 'Richards', 'Williamson', 'Johnston', 'Banks', 'Meyer', 'Bishop', 'McCoy', 'Howell', 'Alvarez', 'Morrison', 'Hansen', 'Fernandez', 'Garza', 'Harvey', 'Little', 'Burton', 'Stanley', 'Nguyen', 'George', 'Jacobs', 'Reid', 'Kim', 'Fuller', 'Lynch', 'Dean', 'Gilbert', 'Garrett', 'Romero', 'Welch', 'Larson', 'Frazier', 'Burke', 'Hanson', 'Day', 'Mendoza', 'Moreno', 'Bowman', 'Medina', 'Fowler', 'Brewer', 'Hoffman', 'Carlson', 'Silva', 'Pearson', 'Holland', 'Douglas', 'Fleming', 'Jensen', 'Vargas', 'Byrd', 'Davidson', 'Hopkins', 'May', 'Terry', 'Herrera', 'Wade', 'Soto', 'Walters', 'Curtis', 'Neal', 'Caldwell', 'Lowe', 'Jennings', 'Barnett', 'Graves', 'Jimenez', 'Horton', 'Shelton', 'Barrett', 'Obrien', 'Castro', 'Sutton', 'Gregory', 'McKinney', 'Lucas', 'Miles', 'Craig', 'Rodriquez', 'Chambers', 'Holt', 'Lambert', 'Fletcher', 'Watts', 'Bates', 'Hale', 'Rhodes', 'Pena', 'Beck', 'Newman', 'Haynes', 'McDaniel', 'Mendez', 'Bush', 'Vaughn', 'Parks', 'Dawson', 'Santiago', 'Norris', 'Hardy', 'Love', 'Steele', 'Curry', 'Powers', 'Schultz', 'Barker', 'Guzman', 'Page', 'Munoz', 'Ballard', 'Schwartz', 'Mcbride', 'Houston', 'Christensen', 'Klein', 'Pratt', 'Briggs', 'Parsons', 'Mclaughlin', 'Zimmerman', 'French', 'Buchanan', 'Moran', 'Copeland', 'Roy', 'Pittman', 'Brady', 'Mccormick', 'Holloway', 'Brock', 'Poole', 'Frank', 'Logan', 'Owen', 'Bass', 'Marsh', 'Drake', 'Wong', 'Jefferson', 'Park', 'Morton', 'Abbott', 'Sparks', 'Patrick', 'Norton', 'Huff', 'Clayton', 'Massey', 'Lloyd', 'Figueroa', 'Carson', 'Bowers', 'Roberson', 'Barton', 'Tran', 'Lamb', 'Harrington', 'Casey', 'Boone', 'Cortez', 'Clarke', 'Mathis', 'Singleton', 'Wilkins', 'Cain', 'Bryan', 'Underwood', 'Hogan', 'Mckenzie', 'Collier', 'Luna', 'Phelps', 'Mcguire', 'Allison', 'Bridges', 'Wilkerson', 'Nash', 'Summers', 'Atkins']

    for (let i = 0; i < 150; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const uniqueId = Math.floor(Math.random() * 10000)
      
      const customer = await prisma.customer.create({
        data: {
          name: `${firstName} ${lastName}`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${uniqueId}@example.com`,
          phone: `555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          source: sources[Math.floor(Math.random() * sources.length)],
          notes: Math.random() > 0.8 ? 'Interested in financing options' : null
        }
      })
      customers.push(customer)
    }

    // Generate test drives throughout the year
    console.log('🚙 Creating test drive appointments...')
    const testDrives = []
    
    // Create test drives for the past 12 months with seasonal trends
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date()
      monthDate.setMonth(monthDate.getMonth() - month)
      
      // Seasonal adjustment: more test drives in spring/summer, fewer in winter
      let monthlyTestDrives = 30 + Math.floor(Math.random() * 40) // Base 30-70 per month
      if (monthDate.getMonth() >= 2 && monthDate.getMonth() <= 7) { // Spring/Summer
        monthlyTestDrives += 20 // More in spring/summer
      } else if (monthDate.getMonth() >= 10 || monthDate.getMonth() <= 1) { // Winter
        monthlyTestDrives -= 10 // Fewer in winter
      }
      
      for (let i = 0; i < monthlyTestDrives; i++) {
        const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)]
        const customer = customers[Math.floor(Math.random() * customers.length)]
        
        // Random date within the month
        const day = Math.floor(Math.random() * 28) + 1
        const testDriveDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day)
        
        const testDrive = await prisma.testDrive.create({
          data: {
            vehicleId: vehicle.id,
            customerId: customer.id,
            customerName: customer.name,
            email: customer.email,
            phone: customer.phone,
            date: testDriveDate,
            time: `${Math.floor(Math.random() * 12) + 9}:00`,
            status: Math.random() > 0.2 ? 'CONFIRMED' : Math.random() > 0.5 ? 'PENDING' : 'CANCELLED',
            source: customer.source
          }
        })
        testDrives.push(testDrive)
      }
    }

    // Generate sales throughout the year with realistic patterns
    console.log('💰 Creating sales transactions...')
    const sales = []
    
    // Track sold vehicles to avoid duplicates
    const soldVehicleIds = new Set()
    
    // Calculate how many vehicles to sell (keep at least 30-40% as active inventory)
    const totalVehicles = vehicles.length
    const maxVehiclesToSell = Math.floor(totalVehicles * 0.6) // Sell max 60%, keep 40% active
    let vehiclesSold = 0
    
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date()
      monthDate.setMonth(monthDate.getMonth() - month)
      
      // Seasonal sales adjustment: more sales in spring/summer, fewer in winter
      let monthlySales = 8 + Math.floor(Math.random() * 12) // Base 8-20 per month
      if (monthDate.getMonth() >= 2 && monthDate.getMonth() <= 7) { // Spring/Summer
        monthlySales += 5 // More in spring/summer
      } else if (monthDate.getMonth() >= 10 || monthDate.getMonth() <= 1) { // Winter
        monthlySales -= 3 // Fewer in winter
      }
      
      // Growth trend: more sales in recent months
      if (month < 6) { // Recent months
        monthlySales += 3
      }
      
      // Don't exceed the maximum vehicles we want to sell
      if (vehiclesSold >= maxVehiclesToSell) {
        monthlySales = 0
      }
      
      for (let i = 0; i < monthlySales; i++) {
        // Find an available vehicle that hasn't been sold
        const availableVehicles = vehicles.filter(v => !soldVehicleIds.has(v.id))
        if (availableVehicles.length === 0 || vehiclesSold >= maxVehiclesToSell) break
        
        // Filter out inventory buddy vehicles (they should never be sold)
        const sellableVehicles = availableVehicles.filter(v => !v.stockNumber.startsWith('BUDDY'))
        if (sellableVehicles.length === 0) break
        
        const vehicle = sellableVehicles[Math.floor(Math.random() * sellableVehicles.length)]
        const customer = customers[Math.floor(Math.random() * customers.length)]
        
        // Calculate sale price with some variation
        const salePrice = vehicle.price * (0.92 + Math.random() * 0.16) // 92-108% of list price
        const profit = salePrice - vehicle.cost
        const profitMargin = (profit / salePrice) * 100
        
        // Random date within the month
        const day = Math.floor(Math.random() * 28) + 1
        const saleDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day)
        
        // Create transaction
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
        
        // Update vehicle status
        await prisma.vehicle.update({
          where: { id: vehicle.id },
          data: {
            status: 'SOLD',
            soldPrice: parseFloat(salePrice),
            soldDate: saleDate
          }
        })
        
        soldVehicleIds.add(vehicle.id)
        sales.push(transaction)
        vehiclesSold++
        
        console.log(`✅ Sold: ${vehicle.year} ${vehicle.make} ${vehicle.model} for $${salePrice.toLocaleString()} on ${saleDate.toLocaleDateString()}`)
      }
    }

    // Generate vehicle submissions (sell/trade requests)
    console.log('📝 Creating sell/trade requests...')
    for (let i = 0; i < 25; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)]
      const make = makes[Math.floor(Math.random() * makes.length)]
      
      await prisma.vehicleSubmission.create({
        data: {
          type: Math.random() > 0.5 ? 'sell' : 'trade',
          vin: `1HGBH41JXMN${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
          vehicleDetails: {
            make: make,
            model: models[make][Math.floor(Math.random() * models[make].length)],
            year: 2015 + Math.floor(Math.random() * 8),
            mileage: 30000 + Math.floor(Math.random() * 120000)
          },
          condition: {
            exterior: Math.random() > 0.7 ? 'Excellent' : Math.random() > 0.5 ? 'Good' : 'Fair',
            interior: Math.random() > 0.7 ? 'Excellent' : Math.random() > 0.5 ? 'Good' : 'Fair',
            mechanical: Math.random() > 0.7 ? 'Excellent' : Math.random() > 0.5 ? 'Good' : 'Fair'
          },
          ownership: Math.random() > 0.5 ? 'OWNED' : 'FINANCED',
          photoUrls: [],
          status: Math.random() > 0.6 ? 'PENDING_REVIEW' : Math.random() > 0.5 ? 'APPROVED' : 'REJECTED',
          customerInfo: {
            name: customer.name,
            phone: customer.phone
          }
        }
      })
    }

    // Generate monthly metrics for the past 12 months
    console.log('📊 Creating monthly metrics...')
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date()
      monthDate.setMonth(monthDate.getMonth() - month)
      
      // Calculate metrics for this month
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
      
      const monthTestDrives = testDrives.filter(td => 
        new Date(td.date) >= monthStart && new Date(td.date) <= monthEnd
      )
      
      const monthSales = sales.filter(s => 
        new Date(s.date) >= monthStart && new Date(s.date) <= monthEnd
      )
      
      const monthVehicles = vehicles.filter(v => 
        v.soldDate && new Date(v.soldDate) >= monthStart && new Date(v.soldDate) <= monthEnd
      )
      
      const totalRevenue = monthVehicles.reduce((sum, v) => sum + (v.soldPrice || 0), 0)
      const totalCosts = monthVehicles.reduce((sum, v) => sum + (v.cost || 0), 0)
      const netProfit = totalRevenue - totalCosts
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
      
      await prisma.monthlyMetric.create({
        data: {
          month: monthStart,
          totalAppointments: monthTestDrives.length,
          websiteAppointments: monthTestDrives.filter(td => td.source === 'WEBSITE').length,
          otherAppointments: monthTestDrives.filter(td => td.source !== 'WEBSITE').length,
          totalVehiclesSold: monthVehicles.length,
          websiteDriveSales: monthVehicles.filter(v => {
            const vehicleTestDrives = testDrives.filter(td => td.vehicleId === v.id)
            return vehicleTestDrives.some(td => td.source === 'WEBSITE')
          }).length,
          otherSourceSales: monthVehicles.filter(v => {
            const vehicleTestDrives = testDrives.filter(td => td.vehicleId === v.id)
            return !vehicleTestDrives.some(td => td.source === 'WEBSITE')
          }).length,
          totalRevenue,
          totalVehicleCosts: totalCosts,
          netProfit,
          profitMargin,
          cancelledAppointments: monthTestDrives.filter(td => td.status === 'CANCELLED').length,
          activeInventory: vehicles.filter(v => v.status === 'AVAILABLE').length,
          totalCustomers: customers.length,
          totalVehicles: vehicles.length,
          monthlySellRequests: Math.floor(Math.random() * 5) + 2,
          monthlyTradeRequests: Math.floor(Math.random() * 4) + 1,
          pendingSellTrade: Math.floor(Math.random() * 3) + 1,
          approvedSellTrade: Math.floor(Math.random() * 4) + 2,
          rejectedSellTrade: Math.floor(Math.random() * 2) + 1,
          totalSellRequests: 15 + Math.floor(Math.random() * 10),
          totalTradeRequests: 10 + Math.floor(Math.random() * 8)
        }
      })
    }

    // Final verification and summary
    const finalVehicles = await prisma.vehicle.findMany()
    const finalTransactions = await prisma.transaction.findMany()
    const finalTestDrives = await prisma.testDrive.findMany()
    const finalCustomers = await prisma.customer.findMany()
    const finalSubmissions = await prisma.vehicleSubmission.findMany()
    
    const soldCount = finalVehicles.filter(v => v.status === 'SOLD').length
    const availableCount = finalVehicles.filter(v => v.status === 'AVAILABLE').length

    // Current month stats
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
    const totalRevenue = finalVehicles.filter(v => v.status === 'SOLD').reduce((sum, v) => sum + (v.soldPrice || 0), 0)

    console.log('\n🎉 MASSIVE full-year demo data created successfully!')
    console.log('='.repeat(60))
    console.log('📊 COMPREHENSIVE DATA SUMMARY:')
    console.log('='.repeat(60))
    console.log(`🚗 VEHICLES:`)
    console.log(`   - Total: ${finalVehicles.length}`)
    console.log(`   - Sold: ${soldCount}`)
    console.log(`   - Available: ${availableCount}`)
    console.log(`   - Sold this month: ${currentMonthSales.length}`)
    console.log(`   - 🤖 Inventory Buddies: 5 (always available for demos)`)
    console.log('')
    console.log(`💰 FINANCIAL:`)
    console.log(`   - Total Revenue (all time): $${totalRevenue.toLocaleString()}`)
    console.log(`   - Current Month Revenue: $${currentMonthRevenue.toLocaleString()}`)
    console.log(`   - Total Transactions: ${finalTransactions.length}`)
    console.log('')
    console.log(`👥 CUSTOMERS & ACTIVITY:`)
    console.log(`   - Total Customers: ${finalCustomers.length}`)
    console.log(`   - Test Drives: ${finalTestDrives.length}`)
    console.log(`   - Sell/Trade Requests: ${finalSubmissions.length}`)
    console.log('')
    console.log(`📅 TIME SPAN: 12 months of realistic data`)
    console.log(`🌱 SEASONAL TRENDS: Spring/Summer peaks, Winter lows`)
    console.log(`📈 GROWTH PATTERN: Increasing sales in recent months`)
    console.log('')
    console.log('🚀 YOUR AI ASSISTANT NOW HAS A YEAR OF RICH DATA TO ANALYZE!')
    console.log('💡 Try asking: "Show me sales trends over the past year"')
    console.log('🎯 Your dashboard will show impressive metrics!')
    console.log('🤖 Inventory Buddies ensure you always have active inventory for demos!')
    console.log('='.repeat(60))

  } catch (error) {
    console.error('❌ Error creating full-year demo:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
createFullYearDemo() 