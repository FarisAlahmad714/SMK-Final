'use client';

import { useState, useEffect } from 'react';
import { format, subMonths, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
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
    cancellationReasons: [] 
  });

  useEffect(() => {
    fetchMetrics(currentMonth);
  }, [currentMonth]);

  const fetchMetrics = async (date) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/dashboard/metrics?month=${date.toISOString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch metrics');
      }
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  // Safe number formatting function
  const formatCurrency = (value) => {
    const number = Number(value) || 0;
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };

  // Safe calculations
  const profitMargin = metrics.totalRevenue > 0 
    ? (((Number(metrics.totalRevenue) || 0) - (Number(metrics.totalVehicleCosts) || 0)) / 
       (Number(metrics.totalRevenue) || 1) * 100).toFixed(2)
    : '0.00';

  const netProfit = (Number(metrics.totalRevenue) || 0) - (Number(metrics.totalVehicleCosts) || 0);

  if (loading) return <div className="p-8 text-center text-gray-600">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  // Data for Charts
  const appointmentData = [
    { name: 'Website Bookings', value: metrics.websiteAppointments },
    { name: 'Other Sources', value: metrics.otherAppointments },
    { name: 'Cancelled', value: metrics.cancelledAppointments },
  ];

  const salesData = [
    { name: 'Website Test Drive Sales', value: metrics.websiteDriveSales },
    { name: 'Other Source Sales', value: metrics.otherSourceSales },
    { name: 'Total Vehicles Sold', value: metrics.totalVehiclesSold },
  ];

  const COLORS = ['#6B7280', '#4B5563', '#9CA3AF']; // Muted gray tones for Pie Chart

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header with Month Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Dashboard</h1>
        <div className="flex items-center bg-white rounded-lg shadow p-2">
          <button 
            onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-medium px-3 text-gray-700">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button 
            onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Next Month"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Top Metrics: Active Inventory & Total Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <MetricCard 
          title="Active Inventory" 
          value={metrics.activeInventory || 0}
          icon="📦"
          bgColor="bg-blue-300"
        />
        <MetricCard 
          title="Total Customers" 
          value={metrics.totalCustomers || 0}
          icon="👥"
          bgColor="bg-green-300"
        />
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Use AdditionalMetricCard if description is needed */}
        <AdditionalMetricCard 
          title="Total Revenue" 
          value={formatCurrency(metrics.totalRevenue)}
          icon="💰"
          bgColor="bg-blue-400"
          description="Cumulative Final Price totals"
        />
        <AdditionalMetricCard 
          title="Total Vehicles Sold" 
          value={metrics.totalVehiclesSold || 0}
          icon="🚗"
          bgColor="bg-green-400"
          description="This month"
        />
        <AdditionalMetricCard 
          title="Total Appointments" 
          value={metrics.totalAppointments || 0}
          icon="📅"
          bgColor="bg-indigo-400"
          description="This month"
        />
        <AdditionalMetricCard 
          title="Cancelled Appointments" 
          value={metrics.cancelledAppointments || 0}
          icon="❌"
          bgColor="bg-red-400"
          description="This month"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Appointments Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Appointments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appointmentData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
              <YAxis tick={{ fill: '#6B7280' }} />
              <Tooltip />
              <Bar dataKey="value" fill="#4B5563" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {salesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AdditionalMetricCard 
          title="Total Vehicle Costs" 
          value={formatCurrency(metrics.totalVehicleCosts)}
          icon="💵"
          bgColor="bg-red-300"
          description="Cumulative Cost totals"
        />
        <MetricCard 
          title="Net Profit" 
          value={formatCurrency(netProfit)}
          icon="💸"
          bgColor="bg-green-300"
        />
        <MetricCard 
          title="Profit Margin" 
          value={`${profitMargin}%`}
          icon="📈"
          bgColor="bg-indigo-300"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <AdditionalMetricCard 
          title="Website Appointments" 
          value={metrics.websiteAppointments}
          icon="🌐"
          bgColor="bg-green-300"
          description="Scheduled through website"
        />
        <AdditionalMetricCard 
          title="Other Appointments" 
          value={metrics.otherAppointments}
          icon="🔗"
          bgColor="bg-indigo-300"
          description="Scheduled through other sources"
        />
        <AdditionalMetricCard 
          title="Website Test Drive Sales" 
          value={metrics.websiteDriveSales}
          icon="🚘"
          bgColor="bg-teal-300"
          description="Sales from website test drives"
        />
        <AdditionalMetricCard 
          title="Other Sources Test Drive Sales" 
          value={metrics.otherSourceSales}
          icon="🚙"
          bgColor="bg-orange-300"
          description="Sales from other sources' test drives"
        />
      </div>
      <div className="mb-8">
  <CancellationChart data={metrics.cancellationReasons || []} />
</div>
    </div>
  );
}

function MetricCard({ title, value, icon, bgColor }) {
  return (
    <div className={`flex items-center p-4 rounded-lg shadow text-white ${bgColor}`}>
      <div className="text-4xl mr-4">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-xl font-bold">{value || '0'}</p>
      </div>
    </div>
  );
}

function AdditionalMetricCard({ title, value, icon, bgColor, description }) {
  return (
    <div className={`flex flex-col justify-between p-4 rounded-lg shadow text-white ${bgColor}`}>
      <div className="flex items-center">
        <div className="text-3xl mr-4">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-medium">{title}</h4>
          <p className="text-xl font-bold">{value || '0'}</p>
        </div>
      </div>
      {description && <p className="text-xs opacity-80 mt-2">{description}</p>}
    </div>
  );
}
const CancellationChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Cancellation Reasons</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No cancellations this month
        </div>
      </div>
    );
  }

  // Sort data by count in descending order
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Cancellation Reasons</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="reason"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis tick={{ fill: '#6B7280' }} />
          <Tooltip />
          <Bar dataKey="count" fill="#EF4444" name="Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};