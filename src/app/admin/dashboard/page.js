// src/app/admin/dashboard/page.js
'use client'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalAppointments: 0,
    websiteAppointments: 0,
    otherAppointments: 0,
    totalVehiclesSold: 0,
    websiteDriveSales: 0,
    otherSourceSales: 0,
    totalRevenue: 0,
    cancelledAppointments: 0,
    activeInventory: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/dashboard/metrics');
      if (!res.ok) throw new Error('Failed to fetch metrics');
      const data = await res.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        <MetricCard 
          title="Total Revenue" 
          value={`$${metrics.totalRevenue.toLocaleString()}`}
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

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Appointments</h3>
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
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Sales</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Website Test Drive Sales</span>
              <span>{metrics.websiteDriveSales}</span>
            </div>
            <div className="flex justify-between">
              <span>Other Source Sales</span>
              <span>{metrics.otherSourceSales}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Vehicles Sold</span>
              <span>{metrics.totalVehiclesSold}</span>
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
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}