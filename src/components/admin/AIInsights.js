'use client'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Car, Users, Calendar } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function AIInsights({ dataType, data }) {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (dataType && data) {
      generateInsights()
    }
  }, [dataType, data])

  const generateInsights = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataType,
          data
        })
      })

      if (response.ok) {
        const result = await response.json()
        setInsights(result.insights)
      }
    } catch (error) {
      console.error('Error generating insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderSalesChart = (transactions) => {
    if (!transactions || transactions.length === 0) return null

    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      if (!acc[month]) {
        acc[month] = { month, sales: 0, profit: 0, count: 0 }
      }
      acc[month].sales += transaction.salePrice
      acc[month].profit += transaction.profit
      acc[month].count += 1
      return acc
    }, {})

    const chartData = Object.values(monthlyData).slice(-6)

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">📈 Sales Trend (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#0088FE" name="Sales Revenue" />
            <Line type="monotone" dataKey="profit" stroke="#00C49F" name="Profit" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const renderInventoryChart = (vehicles) => {
    if (!vehicles || vehicles.length === 0) return null

    const statusData = vehicles.reduce((acc, vehicle) => {
      acc[vehicle.status] = (acc[vehicle.status] || 0) + 1
      return acc
    }, {})

    const chartData = Object.entries(statusData).map(([status, count]) => ({
      name: status,
      value: count
    }))

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">🚗 Vehicle Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const renderCustomerSourceChart = (customers) => {
    if (!customers || customers.length === 0) return null

    const sourceData = customers.reduce((acc, customer) => {
      const source = customer.source || 'Unknown'
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {})

    const chartData = Object.entries(sourceData).map(([source, count]) => ({
      source,
      count
    }))

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">👥 Customer Sources</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884D8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const renderTestDriveChart = (testDrives) => {
    if (!testDrives || testDrives.length === 0) return null

    const statusData = testDrives.reduce((acc, testDrive) => {
      acc[testDrive.status] = (acc[testDrive.status] || 0) + 1
      return acc
    }, {})

    const chartData = Object.entries(statusData).map(([status, count]) => ({
      status,
      count
    }))

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">📅 Test Drive Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82CA9D" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const renderKeyMetrics = () => {
    if (!insights) return null

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {insights.metrics?.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 flex items-center">
                  {metric.icon && <span className="mr-2">{metric.icon}</span>}
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
              <div className={`p-2 rounded-full ${metric.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {metric.trend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
            </div>
            {metric.change && (
              <p className={`text-sm mt-1 ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change > 0 ? '+' : ''}{metric.change}% from last period
              </p>
            )}
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">🤔 Generating insights...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {renderKeyMetrics()}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dataType === 'sales' && renderSalesChart(data.transactions)}
        {dataType === 'inventory' && renderInventoryChart(data.vehicles)}
        {dataType === 'customers' && renderCustomerSourceChart(data.customers)}
        {dataType === 'testDrives' && renderTestDriveChart(data.testDrives)}
      </div>

      {insights?.recommendations && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">💡</span>
            AI Recommendations
          </h3>
          <div className="space-y-3">
            {insights.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 