// src/app/admin/dashboard/page.js
'use client';
import { useState, useEffect } from 'react';
import { Bar } from 'recharts';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [timeframe, setTimeframe] = useState('month'); // month, quarter, year

  // Add detailed metrics sections
  return (
    <div className="p-8">
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Total Stats */}
        <MetricCard
          title="Total Revenue"
          value={`$${metrics?.totalRevenue.toLocaleString()}`}
          trend={metrics?.revenueTrend}
        />
        <MetricCard
          title="Vehicles Sold"
          value={metrics?.totalVehiclesSold}
          trend={metrics?.salesTrend}
        />
        <MetricCard
          title="Active Inventory"
          value={metrics?.activeInventory}
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Sales Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Sales by Source</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Website Test Drives</span>
              <span>{metrics?.websiteDriveSales}</span>
            </div>
            <div className="flex justify-between">
              <span>Other Sources</span>
              <span>{metrics?.otherSourceSales}</span>
            </div>
          </div>
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Appointment Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Completed</span>
              <span>{metrics?.completedAppointments}</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled</span>
              <span>{metrics?.cancelledAppointments}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending</span>
              <span>{metrics?.pendingAppointments}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Monthly Performance</h3>
        <Bar
          data={metrics?.monthlyData}
          width={800}
          height={300}
          // ... chart configuration
        />
      </div>
    </div>
  );
}