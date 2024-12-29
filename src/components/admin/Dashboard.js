// src/app/admin/components/Dashboard.js
'use client';
import { useState, useEffect } from 'react';
import { format, subMonths, addMonths } from 'date-fns';

export default function Dashboard() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [currentMonth]);

  const fetchMetrics = async () => {
    try {
      const res = await fetch(`/api/dashboard/metrics?month=${currentMonth.toISOString()}`);
      const data = await res.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}>
            Previous Month
          </button>
          <span className="font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}>
            Next Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <MetricCard 
          title="Total Appointments" 
          value={metrics.totalAppointments} 
        />
        <MetricCard 
          title="Website Appointments" 
          value={metrics.websiteAppointments} 
        />
        <MetricCard 
          title="Other Source Appointments" 
          value={metrics.otherAppointments} 
        />
        <MetricCard 
          title="Total Vehicles Sold" 
          value={metrics.totalVehiclesSold} 
        />
       // src/app/admin/components/Dashboard.js continued...
        <MetricCard 
          title="Total Revenue" 
          value={`$${metrics.totalRevenue.toLocaleString()}`} 
        />
        <MetricCard 
          title="Website Sales" 
          value={metrics.websiteDriveSales} 
        />
        <MetricCard 
          title="Other Source Sales" 
          value={metrics.otherSourceSales} 
        />
        <MetricCard 
          title="Cancelled Appointments" 
          value={metrics.cancelledAppointments} 
        />
      </div>

      {/* Top stats section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Overall Stats</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-2">Total Vehicles</h3>
            <p className="text-3xl font-bold">{metrics.totalVehicles}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-2">Total Customers</h3>
            <p className="text-3xl font-bold">{metrics.totalCustomers}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}