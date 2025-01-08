// src/app/admin/dashboard/page.js
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
    totalVehicles: 0,
    totalAppointments: 0
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

  const COLORS = ['#4ADE80', '#3B82F6', '#F472B6'];

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
      
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          title="Total Revenue" 
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          icon="💰"
          bgColor="bg-blue-500"
        />
        <MetricCard 
          title="Total Vehicles" 
          value={metrics.totalVehicles}
          icon="🚗"
          bgColor="bg-green-500"
        />
        <MetricCard 
          title="Active Inventory" 
          value={metrics.activeInventory}
          icon="📦"
          bgColor="bg-yellow-500"
        />
        <MetricCard 
          title="Total Customers" 
          value={metrics.totalCustomers}
          icon="👥"
          bgColor="bg-purple-500"
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
              <Bar dataKey="value" fill="#3B82F6" barSize={50} />
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

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdditionalMetricCard 
          title="Total Appointments" 
          value={metrics.totalAppointments}
          icon="📅"
          bgColor="bg-indigo-500"
        />
        <AdditionalMetricCard 
          title="Total Vehicles Sold" 
          value={metrics.totalVehiclesSold}
          icon="🏆"
          bgColor="bg-red-500"
        />
        <AdditionalMetricCard 
          title="Cancelled Appointments" 
          value={metrics.cancelledAppointments}
          icon="❌"
          bgColor="bg-pink-500"
        />
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

function AdditionalMetricCard({ title, value, icon, bgColor }) {
  return (
    <div className={`flex items-center p-4 rounded-lg shadow text-white ${bgColor}`}>
      <div className="text-3xl mr-4">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-xl font-bold">{value || '0'}</p>
      </div>
    </div>
  );
}
