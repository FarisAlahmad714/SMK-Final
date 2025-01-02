// src/app/admin/dashboard/page.js
'use client';
import { useState, useEffect } from 'react';
import { format, subMonths, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      {/* Header with Month Navigation */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3 bg-white rounded-lg shadow p-2">
          <button 
            onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium px-3">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button 
            onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Overall Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <MetricCard 
          title="Total Revenue" 
          value={`$${metrics.totalRevenue.toLocaleString()}`}
        />
        <MetricCard 
          title="Total Vehicles" 
          value={metrics.totalVehicles}
        />
        <MetricCard 
          title="Active Inventory" 
          value={metrics.activeInventory}
        />
        <MetricCard 
          title="Total Customers" 
          value={metrics.totalCustomers}
        />
      </div>

      {/* Monthly Stats Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Appointments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Monthly Appointments</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Website Bookings</span>
              <span>{metrics.websiteAppointments}</span>
            </div>
            <div className="flex justify-between">
              <span>Other Sources</span>
              <span>{metrics.otherAppointments}</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled</span>
              <span>{metrics.cancelledAppointments}</span>
            </div>
            <div className="pt-3 mt-3 border-t">
              <div className="flex justify-between font-medium">
                <span>Total Appointments</span>
                <span>{metrics.totalAppointments}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sales */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Monthly Sales</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Website Test Drive Sales</span>
              <span>{metrics.websiteDriveSales}</span>
            </div>
            <div className="flex justify-between">
              <span>Other Source Sales</span>
              <span>{metrics.otherSourceSales}</span>
            </div>
            <div className="pt-3 mt-3 border-t">
              <div className="flex justify-between font-medium">
                <span>Total Vehicles Sold</span>
                <span>{metrics.totalVehiclesSold}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value || '0'}</p>
    </div>
  );
}