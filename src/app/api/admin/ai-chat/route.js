import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'

const prisma = new PrismaClient()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// System prompt for the AI - STRICTLY DEALERSHIP FOCUSED with ENHANCED FORMATTING
const SYSTEM_PROMPT = `You are Abood, the AI assistant for SMK Auto dealership. Your name is Abood and you should introduce yourself as such when greeted or asked about your name.

STRICT RULES:
- ONLY answer: vehicles, sales, customers, inventory, test drives, financial metrics, dealership operations
- For other topics, respond: "I'm Abood, your SMK Auto AI assistant. I'm specifically designed to help with SMK Auto dealership data and automotive business questions only. What would you like to know about your dealership data?"
- When users greet you or ask your name, respond warmly as "Abood"
- You can respond to greetings like "Hi Abood", "Hello Abood", or questions like "What's your name?"

PERSONALITY:
- You are Abood - friendly, professional, and knowledgeable about SMK Auto
- Be conversational but always focused on dealership business
- Show enthusiasm for helping with dealership data analysis

FORMATTING:
- Use emojis strategically (🚗💰📊👥📈📉)
- Use markdown formatting and bold for key numbers
- Include visual separators and bullet points
- Format tables properly with clean structure
- Use color indicators: 🟢 positive, 🔴 negative, 🟡 neutral
- Structure with clear headers using ###

Provide specific insights with numbers. Be conversational but professional.`

// Helper function to check if query is dealership-related
function isDealershipRelated(query) {
  const lowerQuery = query.toLowerCase().trim()
  
  // Always allow greetings and name-related queries for Abood
  const namePatterns = [
    /\b(hi|hello|hey)\s+(abood)\b/,
    /\babood\b/,
    /what('s|\s+is)\s+your\s+name/,
    /who\s+are\s+you/,
    /introduce\s+yourself/,
    /\b(hi|hello|hey|good\s+(morning|afternoon|evening))\b$/
  ]
  
  // Check name patterns first
  if (namePatterns.some(pattern => pattern.test(lowerQuery))) {
    return true
  }
  
  // More flexible and comprehensive dealership-related patterns
  const dealershipPatterns = [
    // Vehicle-related patterns
    /\b(vehicle|car|truck|suv|sedan|inventory|stock|auto|automobile)\b/,
    /\b(make|model|year|mileage|condition|status|vin|engine|transmission)\b/,
    /\b(bought|purchased|sold|acquired|got|owns|has|drives)\b/,
    /\b(who|what|when|where|how|why)\b.*\b(bought|purchased|sold|has|owns|got|drives)\b/,
    
    // Sales and financial patterns
    /\b(sale|sell|buy|trade|purchase|transaction|deal|financing)\b/,
    /\b(profit|revenue|margin|cost|price|financial|money|paid|spent|income)\b/,
    /\b(amount|value|total|sum|average|highest|lowest|top|best|worst)\b/,
    
    // Customer patterns
    /\b(customer|client|lead|prospect|buyer|purchaser|person|someone|anyone|owner)\b/,
    /\b(who|which|what)\b.*\b(customer|person|buyer|owner|client)\b/,
    
    // Business operations
    /\b(test drive|appointment|booking|schedule|visit|showroom)\b/,
    /\b(dealership|auto|automotive|dealer|business|store|lot)\b/,
    /\b(performance|trend|analysis|report|metric|data|statistics|stats)\b/,
    
    // Time patterns
    /\b(month|year|period|quarter|week|daily|today|yesterday|recent|ago)\b/,
    /\b(this|last|previous|current|upcoming)\b.*\b(month|year|week|quarter)\b/,
    
    // Status patterns
    /\b(pending|approved|rejected|confirmed|cancelled|done|completed|active)\b/,
    /\b(available|sold|reserved|in stock|out of stock|gone|listed)\b/,
    
    // Question patterns
    /\b(how many|what is|show me|tell me|analyze|find|search|list|display)\b/,
    /\b(compare|filter|sort|rank|order|count|calculate)\b/,
    /\b(percentage|ratio|rate|number|count|total|summary)\b/,
    
    // Car brands (common ones to catch vehicle-related queries)
    /\b(toyota|honda|ford|chevrolet|chevy|nissan|hyundai|kia|mazda|subaru|volkswagen|vw|bmw|mercedes|audi|lexus|acura|infiniti|cadillac|buick|gmc|jeep|dodge|chrysler|ram|lincoln|volvo|jaguar|porsche|tesla|mitsubishi)\b/,
    
    // Specific vehicle questions (enhanced patterns)
    /\b(who|which|what)\b.*\b(bought|purchased|sold|has|owns|got|drives)\b.*\b\d{4}\b/,
    /\b\d{4}\b.*\b(make|model|car|vehicle|auto|truck|suv|sedan)\b/,
    /\b(make|model|car|vehicle|auto|truck|suv|sedan)\b.*\b\d{4}\b/,
    
    // Direct questions about specific vehicles
    /\b\d{4}\b\s+\b(toyota|honda|ford|chevrolet|chevy|nissan|hyundai|kia|mazda|subaru|volkswagen|vw|bmw|mercedes|audi|lexus|acura|infiniti|cadillac|buick|gmc|jeep|dodge|chrysler|ram|lincoln|volvo|jaguar|porsche|tesla|mitsubishi)\b/
  ]
  
  // Check if query matches any dealership pattern
  const isMatch = dealershipPatterns.some(pattern => pattern.test(lowerQuery))
  
  // Additional safety check: if query contains year + brand, it's likely vehicle-related
  const hasYear = /\b(19|20)\d{2}\b/.test(lowerQuery)
  const hasBrand = /\b(toyota|honda|ford|chevrolet|chevy|nissan|hyundai|kia|mazda|subaru|volkswagen|vw|bmw|mercedes|audi|lexus|acura|infiniti|cadillac|buick|gmc|jeep|dodge|chrysler|ram|lincoln|volvo|jaguar|porsche|tesla|mitsubishi)\b/.test(lowerQuery)
  
  return isMatch || (hasYear && hasBrand)
}

// Helper function to get optimized relevant data based on query type
async function getOptimizedData(query) {
  const lowerQuery = query.toLowerCase()
  
  try {
    // Sales and financial data
    if (lowerQuery.includes('sales') || lowerQuery.includes('profit') || lowerQuery.includes('revenue') || lowerQuery.includes('margin') ||
        lowerQuery.includes('bought') || lowerQuery.includes('purchased') || lowerQuery.includes('who bought') || lowerQuery.includes('who purchased')) {
      const [transactions, monthlyMetrics] = await Promise.all([
        prisma.transaction.findMany({
          select: {
            salePrice: true,
            profit: true,
            profitMargin: true,
            date: true,
            vehicle: {
              select: {
                make: true,
                model: true,
                year: true
              }
            },
            customer: {
              select: {
                name: true,
                email: true,
                phone: true
              }
            }
          },
          orderBy: { date: 'desc' },
          take: 15 // Increased for better coverage
        }),
        prisma.monthlyMetric.findMany({
          select: {
            month: true,
            totalVehiclesSold: true,
            totalRevenue: true,
            netProfit: true,
            profitMargin: true
          },
          orderBy: { month: 'desc' },
          take: 3 // Reduced from 6
        })
      ])
      
      return {
        transactions,
        monthlyMetrics,
        dataType: 'sales'
      }
    }
    
    // Inventory data
    if (lowerQuery.includes('inventory') || lowerQuery.includes('vehicle') || lowerQuery.includes('car') || lowerQuery.includes('stock')) {
      const vehicles = await prisma.vehicle.findMany({
        select: {
          make: true,
          model: true,
          year: true,
          price: true,
          status: true
        },
        orderBy: { createdAt: 'asc' },
        take: 15 // Reduced from 30
      })
      
      return {
        vehicles,
        dataType: 'inventory'
      }
    }
    
    // Customer data
    if (lowerQuery.includes('customer') || lowerQuery.includes('source') || lowerQuery.includes('lead') || 
        lowerQuery.includes('top') || lowerQuery.includes('paying') || lowerQuery.includes('buyer')) {
      const customers = await prisma.customer.findMany({
        select: {
          name: true,
          email: true,
          source: true,
          createdAt: true,
          transactions: {
            select: {
              salePrice: true,
              profit: true,
              date: true
            },
            orderBy: { date: 'desc' }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20 // Reduced from 50
      })
      
      return {
        customers,
        dataType: 'customers'
      }
    }
    
    // Test drive data
    if (lowerQuery.includes('test drive') || lowerQuery.includes('appointment') || lowerQuery.includes('booking')) {
      const testDrives = await prisma.testDrive.findMany({
        select: {
          status: true,
          date: true,
          source: true
        },
        orderBy: { date: 'desc' },
        take: 20 // Reduced from 50
      })
      
      return {
        testDrives,
        dataType: 'testDrives'
      }
    }
    
    // Sell/trade data
    if (lowerQuery.includes('sell') || lowerQuery.includes('trade') || lowerQuery.includes('submission')) {
      const submissions = await prisma.vehicleSubmission.findMany({
        select: {
          type: true,
          status: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10 // Reduced from 25
      })
      
      return {
        submissions,
        dataType: 'submissions'
      }
    }
    
    // General overview - get minimal recent data
    const [recentTransactions, recentVehicles, monthlyMetrics] = await Promise.all([
      prisma.transaction.findMany({
        select: {
          salePrice: true,
          profit: true,
          date: true
        },
        orderBy: { date: 'desc' },
        take: 5 // Reduced from 10
      }),
      prisma.vehicle.findMany({
        select: {
          status: true,
          price: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5 // Reduced from 10
      }),
      prisma.monthlyMetric.findMany({
        select: {
          month: true,
          totalVehiclesSold: true,
          totalRevenue: true,
          netProfit: true
        },
        orderBy: { month: 'desc' },
        take: 2 // Reduced from 3
      })
    ])
    
    return {
      recentTransactions,
      recentVehicles,
      monthlyMetrics,
      dataType: 'overview'
    }
    
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export async function POST(request) {
  try {
    const { message, history = [] } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }
    
    // Check if the query is dealership-related
    const isRelated = isDealershipRelated(message)
    console.log(`[AI-CHAT] Query: "${message}" | Is dealership-related: ${isRelated}`)
    
    if (!isRelated) {
      console.log(`[AI-CHAT] BLOCKED query: "${message}"`)
      return NextResponse.json({
        response: "🚫 **Topic Not Supported**\n\nHi! I'm Abood, your SMK Auto AI assistant. I'm specifically designed to help with SMK Auto dealership data and automotive business questions only.\n\n**What I can help you with:**\n• 📊 Sales performance analysis\n• 🚗 Inventory status and trends\n• 👥 Customer insights and behavior\n• 💰 Financial metrics and profit margins\n• 📅 Test drive and appointment data\n• 🔄 Sell/trade request analysis\n\n**What would you like to know about your dealership data?**",
        dataType: 'restricted',
        timestamp: new Date().toISOString()
      })
    }
    
    console.log(`[AI-CHAT] ALLOWED query: "${message}"`)
    
    // Get optimized data based on the query
    const relevantData = await getOptimizedData(message)
    
    // Prepare minimal context for the AI - use compact JSON
    const context = JSON.stringify(relevantData) // Remove pretty formatting to save tokens
    
    // Prepare conversation history (limit to last 3 messages to save tokens)
    const conversationHistory = history.slice(-3).map(msg => ({
      role: msg.role,
      content: msg.content
    }))
    
    // Create the full conversation
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { 
        role: 'user', 
        content: `Dealership data: ${context}\n\nQuestion: ${message}\n\nProvide a detailed, helpful response with specific insights and numbers. Use emojis, bold formatting, and visual elements to make the response eye-catching. Format tables properly with clean structure.` 
      }
    ]
    
    // Call OpenAI with increased token limit for complete responses
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 1500, // Increased from 800 to ensure complete responses
      temperature: 0.7,
    })
    
    const response = completion.choices[0].message.content
    
    return NextResponse.json({ 
      response,
      dataType: relevantData.dataType,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('AI Chat Error:', error)
    
    // Handle token limit error specifically
    if (error.code === 'context_length_exceeded') {
      return NextResponse.json({
        response: "⚠️ **Data Too Large**\n\nI'm sorry, but the data for your query is too large to process. Please try asking a more specific question or break it down into smaller parts.\n\n**Try asking:**\n• \"Show me this month's sales\"\n• \"What's our current inventory?\"\n• \"How many customers this week?\"",
        dataType: 'error',
        timestamp: new Date().toISOString()
      })
    }
    
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    )
  }
} 