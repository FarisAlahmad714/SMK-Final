'use client';

import { useState, useEffect } from 'react';
import { format, subMonths, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    websiteAppointments: 0,
    otherAppointments: 0,
    totalVehiclesSold: 0,
    websiteDriveSales: 0,
    otherSourceSales: 0,
    activeInventory: 0,
    totalCustomers: 0,
    cancelledAppointments: 0,
    totalVehicleCosts: 0,
    totalAppointments: 0,
    cancellationReasons: [],
    monthlySellRequests: 0,
    monthlyTradeRequests: 0,
    totalSellRequests: 0,
    totalTradeRequests: 0,
    pendingSellTrade: 0,
    approvedSellTrade: 0,
    rejectedSellTrade: 0
  });

  useEffect(() => {
    fetchMetrics(currentMonth);
  }, [currentMonth]);

  const fetchMetrics = async (date) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/dashboard/metrics?month=${date.toISOString()}`);
      if (!res.ok) throw new Error('Failed to fetch metrics');
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    const number = Number(value) || 0;
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };

  const netProfit = (Number(metrics.totalRevenue) || 0) - (Number(metrics.totalVehicleCosts) || 0);
  const profitMargin = metrics.totalRevenue > 0 
    ? (((Number(metrics.totalRevenue) || 0) - (Number(metrics.totalVehicleCosts) || 0)) / 
       (Number(metrics.totalRevenue) || 1) * 100).toFixed(2)
    : '0.00';



  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
            <div className="mt-4 md:mt-0 flex items-center bg-gray-50 rounded-lg p-2">
              <button 
                onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="font-medium px-4 text-gray-900">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <button 
                onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       {/* Key Performance Indicators */}
<section className="mb-8">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
    <MetricCard
      title="Monthly Revenue"
      value={formatCurrency(metrics.totalRevenue)}
      icon="💰"
      trend={"+12.3%"}
      trendType="up"
      color="primary"
    />
    <MetricCard
      title="Net Profit"
      value={formatCurrency(netProfit)}
      icon="💸"
      trend={"+8.1%"}
      trendType="up"
      color="success"
    />
    <MetricCard
      title="Total Customers"
      value={metrics.totalCustomers}
      icon="👥"
      trend={"+15.7%"}
      trendType="up"
      color="info"
      description="All time"
    />
    <MetricCard
      title="Profit Margin"
      value={`${profitMargin}%`}
      icon="📊"
      trend={"-2.4%"}
      trendType="down"
      color="warning"
    />
    <MetricCard
      title="Active Inventory"
      value={metrics.activeInventory}
      icon="📦"
      trend={"+5"}
      trendType="up"
      color="neutral"
    />
  </div>
</section>

        {/* Sales Performance */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Performance</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base font-semibold text-gray-900">Monthly Sales Trend</h3>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center text-sm text-emerald-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +8.4% vs last month
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Website Sales', value: metrics.websiteDriveSales },
                    { name: 'Other Sales', value: metrics.otherSourceSales },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                    <YAxis tick={{ fill: '#6B7280' }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <MetricCard
                title="Total Vehicles Sold"
                value={metrics.totalVehiclesSold}
                icon="🚗"
                description="This month"
                color="primary"
              />
              <MetricCard
                title="Website Sales"
                value={metrics.websiteDriveSales}
                icon="🌐"
                description="From website leads"
                color="success"
              />
              <MetricCard
                title="Other Sales"
                value={metrics.otherSourceSales}
                icon="🤝"
                description="From other sources"
                color="info"
              />
            </div>
          </div>
        </section>

        {/* Appointments & Test Drives */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointments & Test Drives</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-6">Appointment Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Website Bookings', value: metrics.websiteAppointments },
                        { name: 'Other Sources', value: metrics.otherAppointments },
                        { name: 'Cancelled', value: metrics.cancelledAppointments }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      <Cell fill="#3B82F6" />
                      <Cell fill="#10B981" />
                      <Cell fill="#EF4444" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <MetricCard
                title="Total Appointments"
                value={metrics.totalAppointments}
                icon="📅"
                description="This month"
                color="primary"
              />
              <MetricCard
                title="Website Bookings"
                value={metrics.websiteAppointments}
                icon="🌐"
                description="Online scheduling"
                color="success"
              />
              <MetricCard
                title="Cancellations"
                value={metrics.cancelledAppointments}
                icon="❌"
                description="This month"
                color="danger"
              />
            </div>
          </div>
        </section>

        {/* Sell/Trade Requests */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sell/Trade Requests</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Request Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Monthly Requests</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <MetricCard
                  title="Sell Requests"
                  value={metrics.monthlySellRequests}
                  icon="📝"
                  color="primary"
                />
                <MetricCard
                  title="Trade Requests"
                  value={metrics.monthlyTradeRequests}
                  icon="🔄"
                  color="info"
                />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Sell', value: metrics.monthlySellRequests },
                      { name: 'Trade', value: metrics.monthlyTradeRequests }
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    <Cell fill="#3B82F6" />
                    <Cell fill="#6366F1" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Request Status Distribution */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Request Status</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <MetricCard
                  title="Pending"
                  value={metrics.pendingSellTrade}
                  icon="⏳"
                  color="warning"
                />
                <MetricCard
                  title="Approved"
                  value={metrics.approvedSellTrade}
                  icon="✅"
                  color="success"
                />
                <MetricCard
                  title="Rejected"
                  value={metrics.rejectedSellTrade}
                  icon="❌"
                  color="danger"
                />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { name: 'Pending', value: metrics.pendingSellTrade },
                    { name: 'Approved', value: metrics.approvedSellTrade },
                    { name: 'Rejected', value: metrics.rejectedSellTrade }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Cancellation Analysis */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cancellation Analysis</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <CancellationChart data={metrics.cancellationReasons || []} />
          </div>
        </section>
      </main>
    </div>
  );
}

const COLORS = {
  primary: {
    light: 'bg-blue-500',
    dark: 'bg-blue-600',
  },
  success: {
    light: 'bg-emerald-500',
    dark: 'bg-emerald-600',
  },
  warning: {
    light: 'bg-amber-500',
    dark: 'bg-amber-600',
  },
  danger: {
    light: 'bg-rose-500',
    dark: 'bg-rose-600',
  },
  info: {
    light: 'bg-indigo-500',
    dark: 'bg-indigo-600',
  },
  neutral: {
    light: 'bg-gray-500',
    dark: 'bg-gray-600',
  }
};

const CHART_COLORS = {
  primary: '#3B82F6',   // blue-500
  success: '#10B981',   // emerald-500
  warning: '#F59E0B',   // amber-500
  danger: '#EF4444',    // rose-500
  info: '#6366F1',      // indigo-500
  gray: '#6B7280'       // gray-500
};
// Loading State Component
function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    </div>
  );
}

// Error State Component
function ErrorState({ message }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          <p className="font-medium">Error loading dashboard</p>
          <p className="text-sm">{message}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="text-blue-500 hover:text-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, icon, color = 'primary', description, trend, trendType }) {
  const bgColor = COLORS[color]?.light || COLORS.primary.light;
  const isPositiveTrend = trendType === 'up';

  return (
    <div className={`${bgColor} rounded-lg shadow-sm p-6 text-white`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-3xl">{icon}</span>
        {trend && (
          <div className={`flex items-center text-sm font-medium ${
            isPositiveTrend ? 'text-green-100' : 'text-red-100'
          }`}>
            {isPositiveTrend ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {trend}
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      {description && (
        <p className="text-sm text-white/60 mt-2">{description}</p>
      )}
    </div>
  );
}

// Cancellation Chart Component
function CancellationChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-500">
        No cancellations recorded this month
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => b.count - a.count);
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-semibold text-gray-900">Cancellation Reasons</h3>
        <div className="text-sm text-gray-500">
          Total: {sortedData.reduce((acc, curr) => acc + curr.count, 0)}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="reason"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis tick={{ fill: '#6B7280' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <Bar 
            dataKey="count" 
            fill="#EF4444" 
            name="Count"
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
