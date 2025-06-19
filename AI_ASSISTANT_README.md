# AI Assistant for SMK Auto Admin Panel

## Overview

The AI Assistant is a powerful tool integrated into the SMK Auto admin panel that provides intelligent insights and analysis of your dealership data. It uses OpenAI's GPT-4 to analyze sales, inventory, customer, and test drive data to provide actionable business insights.

## Features

### 🤖 Natural Language Queries
- Ask questions in plain English about your dealership data
- Get instant insights on sales performance, inventory status, customer trends, and more
- Conversational interface with chat history

### 📊 AI-Generated Visualizations
- Automatic chart generation based on data analysis
- Sales trends, inventory distribution, customer sources, and test drive status
- Interactive charts with Recharts library

### 🎯 Quick Action Buttons
- Pre-built queries for common business questions
- One-click access to key metrics and insights
- Customizable action buttons for your specific needs

### 📈 Smart Recommendations
- AI-generated business recommendations
- Trend analysis with percentage changes
- Actionable insights for business improvement

## Setup Instructions

### 1. Environment Variables
Add your OpenAI API key to your `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Install Dependencies
The required packages are already installed:
- `openai` - OpenAI API client
- `langchain` - AI framework
- `recharts` - Chart library (already in your project)

### 3. Generate Sample Data (Optional)
If you want to test the AI with sample data:
```bash
npm run generate:sample-data
```

This will create:
- 20 sample vehicles
- 15 sample customers
- 25 sample test drives
- 8 sample transactions
- 6 months of sample metrics
- 5 sample vehicle submissions

## Usage Examples

### Sales Analysis
- "Show me this month's sales performance compared to last month"
- "What's our average profit margin on vehicles sold?"
- "Which vehicles are generating the highest profits?"

### Inventory Management
- "Which vehicles have been in inventory the longest?"
- "Show me our current inventory status"
- "What's the average price of our available vehicles?"

### Customer Insights
- "What are the top customer sources this month?"
- "How many customers came from the website vs walk-ins?"
- "Show me customer conversion rates from test drives to sales"

### Test Drive Analysis
- "How many test drives were scheduled vs completed this week?"
- "What's our test drive to sale conversion rate?"
- "Which vehicles are getting the most test drive requests?"

### General Business Questions
- "Give me a quick summary of today's dealership activity"
- "What are our top performing months this year?"
- "Show me trends in our sell/trade requests"

## API Endpoints

### `/api/admin/ai-chat`
Handles natural language queries and returns AI-generated responses.

**Request:**
```json
{
  "message": "Show me this month's sales performance",
  "history": [
    {"role": "user", "content": "Previous question"},
    {"role": "assistant", "content": "Previous answer"}
  ]
}
```

**Response:**
```json
{
  "response": "AI-generated analysis...",
  "dataType": "sales",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### `/api/admin/ai-insights`
Generates structured insights and recommendations from data.

**Request:**
```json
{
  "dataType": "sales",
  "data": { /* relevant data */ }
}
```

**Response:**
```json
{
  "insights": {
    "metrics": [
      {
        "label": "Total Sales",
        "value": "$125,000",
        "trend": "up",
        "change": 15
      }
    ],
    "recommendations": [
      "Focus on high-margin vehicles",
      "Improve test drive conversion rates"
    ]
  }
}
```

## Data Types Supported

The AI can analyze these data types:

1. **Sales Data** (`sales`)
   - Transactions with profit margins
   - Monthly revenue trends
   - Sales performance metrics

2. **Inventory Data** (`inventory`)
   - Vehicle status distribution
   - Aging inventory analysis
   - Price and cost analysis

3. **Customer Data** (`customers`)
   - Customer sources and demographics
   - Customer behavior patterns
   - Lead conversion analysis

4. **Test Drive Data** (`testDrives`)
   - Appointment status tracking
   - Conversion rates
   - Scheduling patterns

5. **Sell/Trade Data** (`submissions`)
   - Request volume and types
   - Approval rates
   - Customer interest trends

## Customization

### Adding New Quick Actions
Edit the `quickActions` array in `src/app/admin/ai-assistant/page.js`:

```javascript
const quickActions = [
  {
    icon: <YourIcon className="w-5 h-5" />,
    title: "Your Custom Action",
    prompt: "Your custom AI prompt here"
  }
]
```

### Modifying AI Prompts
Update the system prompts in the API endpoints:
- `src/app/api/admin/ai-chat/route.js` - Main chat functionality
- `src/app/api/admin/ai-insights/route.js` - Insights generation

### Adding New Chart Types
Extend the `AIInsights` component in `src/components/admin/AIInsights.js` to add new visualization types.

## Security Considerations

- All AI endpoints are protected by admin authentication
- No sensitive customer data is sent to OpenAI (only aggregated metrics)
- API keys are stored securely in environment variables
- All requests are logged for audit purposes

## Cost Optimization

- Uses GPT-4o-mini for cost efficiency
- Limits token usage with `max_tokens` parameter
- Caches responses where possible
- Filters data before sending to reduce context size

## Troubleshooting

### Common Issues

1. **"Failed to get response" error**
   - Check your OpenAI API key
   - Verify your API key has sufficient credits
   - Check network connectivity

2. **No data showing in charts**
   - Ensure you have data in your database
   - Run the sample data generation script
   - Check database connections

3. **Slow response times**
   - The AI analysis can take 2-5 seconds
   - Consider reducing data scope for faster responses
   - Check OpenAI API status

### Debug Mode
Add `console.log` statements in the API endpoints to debug data flow and AI responses.

## Future Enhancements

- [ ] Real-time data streaming
- [ ] Predictive analytics
- [ ] Email report generation
- [ ] Mobile app integration
- [ ] Voice interface
- [ ] Custom AI model training

## Support

For issues or questions about the AI Assistant:
1. Check the browser console for errors
2. Review the API response logs
3. Verify your OpenAI API key and credits
4. Ensure your database has sufficient data for analysis 