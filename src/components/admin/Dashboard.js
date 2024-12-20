'use client'
import { Car, Calendar, CheckCircle, Clock } from 'lucide-react'

export default function Dashboard() {
  const stats = [
    {
      name: 'Total Vehicles',
      value: '12',
      icon: Car,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Appointments',
      value: '4',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      name: 'Confirmed',
      value: '2',
      icon: CheckCircle,
      color: 'bg-purple-500'
    },
    {
      name: 'Pending',
      value: '2',
      icon: Clock,
      color: 'bg-yellow-500'
    }
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}