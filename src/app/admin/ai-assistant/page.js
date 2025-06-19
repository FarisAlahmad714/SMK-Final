'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Brain, TrendingUp, Car, Users, DollarSign, Calendar, Zap, BarChart3 } from 'lucide-react'
import Head from 'next/head'
import { trackAIAssistantUsage } from '@/lib/firebase'

// Enhanced markdown renderer for better formatting
const renderMarkdown = (text) => {
  if (!text) return text
  
  return text
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Headers
    .replace(/### (.*?)$/gm, '<h3 class="text-lg font-bold text-gray-900 mt-4 mb-2">$1</h3>')
    .replace(/## (.*?)$/gm, '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h2>')
    .replace(/# (.*?)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-6 mb-4">$1</h1>')
    // Bullet points
    .replace(/^• (.*?)$/gm, '<li class="ml-4 mb-1">• $1</li>')
    .replace(/^- (.*?)$/gm, '<li class="ml-4 mb-1">• $1</li>')
    // Numbered lists
    .replace(/^\d+\. (.*?)$/gm, '<li class="ml-4 mb-1">$&</li>')
    // Tables - Enhanced table rendering
    .replace(/\|(.+)\|/g, (match, content) => {
      const cells = content.split('|').map(cell => cell.trim())
      const isHeader = match.includes('---') || match.includes('--')
      
      if (isHeader) {
        return '<tr class="border-b border-gray-300">' + 
               cells.map(cell => `<th class="px-3 py-2 text-left font-semibold text-gray-700">${cell}</th>`).join('') + 
               '</tr>'
      } else {
        return '<tr class="border-b border-gray-200">' + 
               cells.map(cell => `<td class="px-3 py-2 text-gray-600">${cell}</td>`).join('') + 
               '</tr>'
      }
    })
    // Wrap tables in proper table structure
    .replace(/(<tr.*?<\/tr>)+/g, '<table class="w-full border-collapse border border-gray-300 my-4"><tbody>$&</tbody></table>')
    // Line breaks
    .replace(/\n/g, '<br>')
    // Visual separators
    .replace(/━━━/g, '<hr class="my-4 border-gray-300">')
    .replace(/---/g, '<hr class="my-4 border-gray-300">')
    // Clean up any double line breaks
    .replace(/<br><br>/g, '<br>')
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "🚗 **Hi! I'm Abood, your SMK Auto AI Assistant!**\n\nNice to meet you! I'm here to help you analyze your dealership data and provide actionable insights.\n\n**What I can help you with:**\n• 📊 Sales performance analysis\n• 🚗 Inventory status and trends\n• 👥 Customer insights and behavior\n• 💰 Financial metrics and profit margins\n• 📅 Test drive and appointment data\n• 🔄 Sell/trade request analysis\n\n**What would you like to know about your dealership data?**\n\n*Feel free to call me Abood! 😊*",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickActions = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Sales Analysis",
      prompt: "Show me this month's sales performance compared to last month"
    },
    {
      icon: <Car className="w-5 h-5" />,
      title: "Inventory Status",
      prompt: "Which vehicles have been in inventory the longest?"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Customer Insights",
      prompt: "What are the top customer sources this month?"
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "Profit Analysis",
      prompt: "Show me the profit margins for vehicles sold this month"
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Test Drive Trends",
      prompt: "How many test drives were scheduled vs completed this week?"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Quick Summary",
      prompt: "Give me a quick summary of today's dealership activity"
    }
  ]

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    const startTime = Date.now()

    try {
      const response = await fetch('/api/admin/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          history: messages.slice(-10).map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      
      // Track AI Assistant usage in Firebase/GA4
      const responseTime = Date.now() - startTime
      trackAIAssistantUsage(messageText, responseTime)
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "❌ **Error**\n\nSorry, I'm having trouble processing your request right now. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleQuickAction = (prompt) => {
    sendMessage(prompt)
  }

  return (
    <>
      <Head>
        <title>Abood (AI Assistant) - SMK Auto</title>
        <meta name="description" content="Chat with Abood, your dedicated SMK Auto AI assistant for dealership data analysis" />
      </Head>
      <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Brain className="w-8 h-8 mr-3 text-blue-600" />
          Meet Abood - Your AI Assistant
        </h1>
        <p className="text-gray-600 mt-2">
          Chat with Abood to get insights about your dealership data, sales performance, customer trends, and automotive business metrics
        </p>
        <div className="mt-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>🎯 Meet Abood:</strong> Your dedicated SMK Auto AI assistant, specifically designed for dealership data analysis. 
            Abood can help with vehicles, sales, customers, inventory, financial metrics, and automotive business topics only.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Actions Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-center">
                    <div className="text-gray-500 group-hover:text-blue-600 mr-3">
                      {action.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                      {action.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg font-semibold text-gray-900">💬 Chat with Abood</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 text-gray-900 border border-gray-200'
                    }`}
                  >
                    <div 
                      className="text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ 
                        __html: message.type === 'ai' ? renderMarkdown(message.content) : message.content 
                      }}
                    />
                    <p className={`text-xs mt-2 ${message.type === 'user' ? 'opacity-70' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 text-gray-900 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">🤔 Abood is analyzing your data...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Abood about your dealership data, sales, inventory, customers..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      </div>
    </>
  )
} 