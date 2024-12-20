// src/app/admin/test-drives/page.js
'use client'
import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, parseISO } from 'date-fns'
import { Calendar, CheckCircle, Clock } from 'lucide-react'

export default function TestDrivesPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  // Sample data - will be replaced with real data later
  const appointments = [
    {
      id: 1,
      customerName: 'John Doe',
      vehicle: '2024 BMW M2',
      date: '2024-01-15',
      time: '10:00',
      email: 'john@example.com',
      phone: '123-456-7890',
      status: 'confirmed',
      notes: 'Would like to check the car out please.'
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      vehicle: '2024 Mercedes GLS',
      date: '2024-01-16',
      time: '14:00',
      email: 'jane@example.com',
      phone: '123-456-7890',
      status: 'pending',
      notes: ''
    }
  ]

  // Get days for the current month
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: startDate, end: endDate })

  // Get appointments for selected date
  const selectedDateAppointments = selectedDate
    ? appointments.filter(
        appointment => isSameDay(parseISO(appointment.date), selectedDate)
      )
    : []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Test Drive Calendar</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">2</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Confirmed</p>
              <p className="text-2xl font-semibold text-gray-900">1</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="w-6 h-6 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">1</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Calendar */}
        <div className="flex-1 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-sm"
              >
                Today
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const newMonth = new Date(currentMonth)
                    newMonth.setMonth(currentMonth.getMonth() - 1)
                    setCurrentMonth(newMonth)
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  ←
                </button>
                <button
                  onClick={() => {
                    const newMonth = new Date(currentMonth)
                    newMonth.setMonth(currentMonth.getMonth() + 1)
                    setCurrentMonth(newMonth)
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
            {days.map((day, dayIdx) => {
              const dayAppointments = appointments.filter(appointment =>
                isSameDay(parseISO(appointment.date), day)
              )
              
              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    bg-white relative py-6 px-3 hover:bg-gray-50
                    ${!isSameMonth(day, currentMonth) && 'text-gray-400'}
                    ${isSameDay(day, selectedDate) && 'bg-blue-50'}
                  `}
                >
                  <time dateTime={format(day, 'yyyy-MM-dd')}>
                    {format(day, 'd')}
                  </time>
                  {dayAppointments.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="h-1 w-1 rounded-full bg-blue-600"></div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Appointments for selected date */}
        <div className="w-96 bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedDate
                ? format(selectedDate, 'MMMM d, yyyy')
                : 'Select a date'}
            </h2>
          </div>
          <div className="p-6">
            {selectedDateAppointments.length > 0 ? (
              <div className="space-y-6">
                {selectedDateAppointments.map((appointment) => (
                  <div key={appointment.id} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {appointment.customerName}
                        </p>
                        <p className="text-sm text-gray-500">{appointment.vehicle}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p>Time: {appointment.time}</p>
                      <p>Email: {appointment.email}</p>
                      <p>Phone: {appointment.phone}</p>
                      {appointment.notes && (
                        <p className="mt-2">Notes: {appointment.notes}</p>
                      )}
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          // Will implement status toggle later
                          console.log('Toggle status', appointment.id)
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Toggle Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                {selectedDate
                  ? 'No appointments for this date'
                  : 'Select a date to view appointments'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}