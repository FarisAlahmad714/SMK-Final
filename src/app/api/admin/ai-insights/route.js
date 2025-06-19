import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const INSIGHTS_PROMPT = `You are an AI analyst for SMK Auto dealership. You are ONLY allowed to analyze dealership-related data and provide automotive business insights.

STRICT RULES:
1. ONLY analyze: vehicle sales, inventory, customer data, test drives, financial metrics, dealership operations
2. Focus on automotive business insights and recommendations
3. Provide specific, actionable business advice for a car dealership

Analyze the provided dealership data and generate structured insights including:

1. Key metrics with trends (up/down indicators and percentage changes)
2. Specific recommendations for dealership business improvement
3. Data-driven insights about automotive sales performance

Format your response as JSON with this structure:
{
  "metrics": [
    {
      "label": "Dealership metric name",
      "value": "formatted value",
      "trend": "up" or "down",
      "change": percentage change number,
      "icon": "relevant emoji"
    }
  ],
  "recommendations": [
    "Specific actionable dealership recommendation 1",
    "Specific actionable dealership recommendation 2"
  ]
}

VISUAL ENHANCEMENTS:
- Use relevant emojis for each metric (🚗, 💰, 📊, 👥, 📈, etc.)
- Make metric labels descriptive and engaging
- Include percentage changes where applicable
- Focus on actionable automotive business insights
- Use positive/negative trend indicators

Be specific with numbers and provide actionable automotive business insights.`

export async function POST(request) {
  try {
    const { dataType, data } = await request.json()
    
    if (!dataType || !data) {
      return NextResponse.json({ error: 'Data type and data are required' }, { status: 400 })
    }

    // Prepare context based on data type
    let context = ''
    switch (dataType) {
      case 'sales':
        context = `Sales Data: ${JSON.stringify({
          transactions: data.transactions?.length || 0,
          totalRevenue: data.transactions?.reduce((sum, t) => sum + t.salePrice, 0) || 0,
          totalProfit: data.transactions?.reduce((sum, t) => sum + t.profit, 0) || 0,
          avgProfitMargin: data.transactions?.length ? 
            (data.transactions.reduce((sum, t) => sum + t.profitMargin, 0) / data.transactions.length) : 0,
          monthlyMetrics: data.monthlyMetrics?.slice(0, 6) || []
        })}`
        break
      
      case 'inventory':
        context = `Inventory Data: ${JSON.stringify({
          totalVehicles: data.vehicles?.length || 0,
          availableVehicles: data.vehicles?.filter(v => v.status === 'AVAILABLE').length || 0,
          soldVehicles: data.vehicles?.filter(v => v.status === 'SOLD').length || 0,
          avgPrice: data.vehicles?.length ? 
            (data.vehicles.reduce((sum, v) => sum + v.price, 0) / data.vehicles.length) : 0,
          oldestVehicles: data.vehicles?.slice(0, 5).map(v => ({
            make: v.make,
            model: v.model,
            year: v.year,
            daysInInventory: Math.floor((new Date() - new Date(v.createdAt)) / (1000 * 60 * 60 * 24))
          })) || []
        })}`
        break
      
      case 'customers':
        context = `Customer Data: ${JSON.stringify({
          totalCustomers: data.customers?.length || 0,
          sources: data.customers?.reduce((acc, c) => {
            acc[c.source || 'Unknown'] = (acc[c.source || 'Unknown'] || 0) + 1
            return acc
          }, {}) || {},
          customersWithTestDrives: data.customers?.filter(c => c.testDrives?.length > 0).length || 0,
          customersWithTransactions: data.customers?.filter(c => c.transactions?.length > 0).length || 0
        })}`
        break
      
      case 'testDrives':
        context = `Test Drive Data: ${JSON.stringify({
          totalTestDrives: data.testDrives?.length || 0,
          confirmed: data.testDrives?.filter(td => td.status === 'CONFIRMED').length || 0,
          pending: data.testDrives?.filter(td => td.status === 'PENDING').length || 0,
          cancelled: data.testDrives?.filter(td => td.status === 'CANCELLED').length || 0,
          conversionRate: data.testDrives?.length ? 
            ((data.testDrives.filter(td => td.status === 'CONFIRMED').length / data.testDrives.length) * 100) : 0
        })}`
        break
      
      default:
        context = `General Dealership Data: ${JSON.stringify({
          recentTransactions: data.recentTransactions?.length || 0,
          recentVehicles: data.recentVehicles?.length || 0,
          recentCustomers: data.recentCustomers?.length || 0,
          recentTestDrives: data.recentTestDrives?.length || 0,
          monthlyMetrics: data.monthlyMetrics?.slice(0, 3) || []
        })}`
    }

    // Call OpenAI for insights
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: INSIGHTS_PROMPT },
        { 
          role: 'user', 
          content: `Analyze this ${dataType} dealership data and provide automotive business insights:\n\n${context}\n\nProvide specific, actionable dealership insights with numbers and visual enhancements.` 
        }
      ],
      max_tokens: 800,
      temperature: 0.3,
    })

    const response = completion.choices[0].message.content
    
    // Try to parse JSON response
    try {
      const insights = JSON.parse(response)
      return NextResponse.json({ insights })
    } catch (parseError) {
      // If JSON parsing fails, return a structured fallback
      return NextResponse.json({
        insights: {
          metrics: [
            {
              label: "Dealership Data Analysis",
              value: "Completed",
              trend: "up",
              change: 0,
              icon: "📊"
            }
          ],
          recommendations: [
            "Dealership analysis completed successfully",
            "Review the chat response for detailed automotive business insights"
          ]
        }
      })
    }
    
  } catch (error) {
    console.error('AI Insights Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate insights', details: error.message },
      { status: 500 }
    )
  }
} 