// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create admin user (credentials must be provided via env)
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPlainPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPlainPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be set when running the seed script.')
  }

  const hashedPassword = await bcrypt.hash(adminPlainPassword, 10)
  
  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  console.log('Created admin:', admin)

  // Create luxury demo vehicles
  const demoVehicles = [
    {
      stockNumber: 'SMK001',
      vin: '1HGCM82633A123456',
      make: 'Mercedes-Benz',
      model: 'S-Class',
      year: 2023,
      price: 89999.00,
      cost: 75000.00,
      mileage: 5420,
      transmission: 'Automatic',
      exteriorColor: 'Obsidian Black Metallic',
      description: 'Flagship luxury sedan with advanced technology and unparalleled comfort. Features premium leather interior, massage seats, and state-of-the-art infotainment system.',
      images: ['/images/hero1.webp'],
      status: 'AVAILABLE'
    },
    {
      stockNumber: 'SMK002', 
      vin: '1FTFW1ET5DFC12345',
      make: 'BMW',
      model: 'M5 Competition',
      year: 2024,
      price: 115999.00,
      cost: 98000.00,
      mileage: 1250,
      transmission: 'Automatic',
      exteriorColor: 'Alpine White',
      description: 'High-performance luxury sports sedan with twin-turbo V8 engine. Track-tuned suspension and carbon fiber accents throughout.',
      images: ['/images/hero2.jpg'],
      status: 'AVAILABLE'
    },
    {
      stockNumber: 'SMK003',
      vin: 'WP0AB2A99LS123456',
      make: 'Porsche',
      model: '911 Turbo S',
      year: 2023,
      price: 229999.00,
      cost: 195000.00,
      mileage: 890,
      transmission: 'PDK',
      exteriorColor: 'Racing Yellow',
      description: 'Ultimate sports car experience with 640hp twin-turbo flat-six engine. Carbon ceramic brakes and sport chrono package.',
      images: ['/images/hero3.png'],
      status: 'AVAILABLE'
    },
    {
      stockNumber: 'SMK004',
      vin: 'WVWZZZ1JZ3W123456',
      make: 'Audi',
      model: 'RS7 Sportback',
      year: 2024,
      price: 139999.00,
      cost: 118000.00,
      mileage: 2100,
      transmission: 'Tiptronic',
      exteriorColor: 'Nardo Gray',
      description: 'Performance luxury coupe with quattro all-wheel drive. Premium Bang & Olufsen sound system and virtual cockpit.',
      images: ['/images/hero1.webp'],
      status: 'AVAILABLE'
    },
    {
      stockNumber: 'SMK005',
      vin: 'JN1AZ4EH8JM123456',
      make: 'Lamborghini',
      model: 'Huracán EVO',
      year: 2023,
      price: 259999.00,
      cost: 225000.00,
      mileage: 650,
      transmission: 'LDF',
      exteriorColor: 'Arancio Borealis',
      description: 'Exotic supercar with naturally aspirated V10 engine. Advanced aerodynamics and cutting-edge infotainment.',
      images: ['/images/hero2.jpg'],
      status: 'SOLD',
      soldDate: new Date('2024-01-15'),
      soldPrice: 255000.00
    },
    {
      stockNumber: 'SMK006',
      vin: 'WBAJB1C50JB123456',
      make: 'Tesla',
      model: 'Model S Plaid',
      year: 2024,
      price: 109999.00,
      cost: 95000.00,
      mileage: 1200,
      transmission: 'Single-Speed',
      exteriorColor: 'Pearl White Multi-Coat',
      description: 'Tri-motor electric luxury sedan with 1,020 horsepower. Autopilot capability and over-the-air updates.',
      images: ['/images/hero3.png'],
      status: 'AVAILABLE'
    },
    {
      stockNumber: 'SMK007',
      vin: 'WBAPL9C50CA123456',
      make: 'McLaren',
      model: '720S Spider',
      year: 2023,
      price: 349999.00,
      cost: 310000.00,
      mileage: 450,
      transmission: '7-Speed SSG',
      exteriorColor: 'Papaya Spark',
      description: 'Open-top supercar with retractable hardtop. Carbon fiber monocoque chassis and active aerodynamics.',
      images: ['/images/hero1.webp'],
      status: 'RESERVED'
    },
    {
      stockNumber: 'SMK008',
      vin: 'WDD4G5EB9JA123456',
      make: 'Bentley',
      model: 'Continental GT',
      year: 2024,
      price: 249999.00,
      cost: 215000.00,
      mileage: 800,
      transmission: 'Dual-Clutch',
      exteriorColor: 'Beluga Black',
      description: 'Handcrafted luxury grand tourer with W12 engine. Diamond-quilted leather and real wood veneers.',
      images: ['/images/hero2.jpg'],
      status: 'AVAILABLE'
    }
  ]

  for (const vehicleData of demoVehicles) {
    await prisma.vehicle.upsert({
      where: { stockNumber: vehicleData.stockNumber },
      update: {},
      create: vehicleData
    })
  }

  // Create demo customers
  const demoCustomers = [
    {
      name: 'John Richardson',
      email: 'john.richardson@example.com',
      phone: '(555) 234-5678',
      source: 'WEBSITE',
      notes: 'Interested in luxury sedans, high-value customer'
    },
    {
      name: 'Sarah Martinez',
      email: 'sarah.martinez@example.com', 
      phone: '(555) 345-6789',
      source: 'REFERRAL',
      notes: 'Looking for sports car, pre-approved financing'
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '(555) 456-7890',
      source: 'WEBSITE',
      notes: 'Electric vehicle enthusiast, tech-focused buyer'
    },
    {
      name: 'Emily Johnson',
      email: 'emily.johnson@example.com',
      phone: '(555) 567-8901',
      source: 'WALK_IN',
      notes: 'Repeat customer, interested in luxury SUVs'
    }
  ]

  for (const customerData of demoCustomers) {
    await prisma.customer.upsert({
      where: { email: customerData.email },
      update: {},
      create: customerData
    })
  }

  // Create demo test drives
  const vehicles = await prisma.vehicle.findMany()
  const customers = await prisma.customer.findMany()

  const demoTestDrives = [
    {
      vehicleId: vehicles[0].id,
      customerId: customers[0].id,
      customerName: customers[0].name,
      email: customers[0].email,
      phone: customers[0].phone,
      date: new Date('2024-02-15T14:00:00Z'),
      time: '14:00',
      status: 'CONFIRMED',
      source: 'WEBSITE',
      notes: 'Interested in financing options'
    },
    {
      vehicleId: vehicles[1].id,
      customerId: customers[1].id,
      customerName: customers[1].name,
      email: customers[1].email,
      phone: customers[1].phone,
      date: new Date('2024-02-16T16:30:00Z'),
      time: '16:30',
      status: 'PENDING',
      source: 'WEBSITE',
      notes: 'First-time buyer, needs guidance'
    }
  ]

  for (const testDriveData of demoTestDrives) {
    await prisma.testDrive.create({
      data: testDriveData
    })
  }

  // Create demo transaction (for sold vehicle)
  const soldVehicle = vehicles.find(v => v.stockNumber === 'SMK005')
  if (soldVehicle) {
    await prisma.transaction.create({
      data: {
        vehicleId: soldVehicle.id,
        customerId: customers[0].id,
        salePrice: 255000.00,
        profit: 30000.00,
        profitMargin: 11.76,
        date: new Date('2024-01-15')
      }
    })
  }

  // Create demo monthly metrics
  await prisma.monthlyMetric.upsert({
    where: { month: new Date('2024-01-01') },
    update: {},
    create: {
      month: new Date('2024-01-01'),
      totalAppointments: 24,
      websiteAppointments: 18,
      otherAppointments: 6,
      totalVehiclesSold: 3,
      websiteDriveSales: 2,
      otherSourceSales: 1,
      totalRevenue: 485000.00,
      totalVehicleCosts: 410000.00,
      netProfit: 75000.00,
      profitMargin: 15.46,
      cancelledAppointments: 3,
      activeInventory: 7,
      totalCustomers: 28,
      totalVehicles: 8,
      monthlySellRequests: 5,
      monthlyTradeRequests: 3,
      pendingSellTrade: 2,
      approvedSellTrade: 4,
      rejectedSellTrade: 2,
      totalSellRequests: 15,
      totalTradeRequests: 12
    }
  })

  // Create demo vehicle submissions
  await prisma.vehicleSubmission.create({
    data: {
      type: 'sell',
      vin: '1HGCM82633A987654',
      vehicleDetails: {
        year: 2020,
        make: 'Audi',
        model: 'A6',
        mileage: 45000,
        condition: 'Excellent'
      },
      condition: {
        exterior: 'Excellent',
        interior: 'Good',
        mechanical: 'Excellent',
        maintenance: 'Up to date'
      },
      ownership: 'Clean Title',
      photoUrls: ['/images/hero1.webp'],
      status: 'PENDING_REVIEW',
      customerInfo: {
        name: 'David Wilson',
        email: 'david.wilson@example.com',
        phone: '(555) 678-9012'
      },
      notes: 'Looking to upgrade to newer model'
    }
  })

  console.log('Demo data seeded successfully!')
  console.log('- Created 8 luxury vehicles')
  console.log('- Created 4 demo customers') 
  console.log('- Created 2 test drive appointments')
  console.log('- Created 1 transaction record')
  console.log('- Created monthly metrics')
  console.log('- Created 1 vehicle submission')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })