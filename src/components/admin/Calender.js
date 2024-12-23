// src/components/admin/Calendar.js
'use client'
import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, 
         startOfWeek, endOfWeek, isSameMonth, isSameDay, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle, Clock, Plus, Ban } from 'lucide-react'
import AppointmentModal from './AppointmentModal'
import BlockTimeModal from './BlockTimeModal'

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [appointments, setAppointments] = useState([])
  const [blockedTimes, setBlockedTimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBlockTimeModalOpen, setIsBlockTimeModalOpen] = useState(false)

  useEffect(() => {
    fetchAppointments()
    fetchBlockedTimes()
  }, [currentMonth])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const start = startOfMonth(currentMonth)
      const end = endOfMonth(currentMonth)
      const res = await fetch(
        `/api/test-drives?start=${start.toISOString()}&end=${end.toISOString()}`
      )
      if (!res.ok) throw new Error('Failed to fetch appointments')
      const data = await res.json()
      setAppointments(data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }
  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }
  
    try {
      const res = await fetch(`/api/test-drives/${appointmentId}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) throw new Error('Failed to delete appointment');
  
      // Refresh appointments after deletion
      fetchAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };
  const fetchBlockedTimes = async () => {
    try {
      const res = await fetch(`/api/blocked-times?date=${currentMonth.toISOString()}`)
      if (!res.ok) throw new Error('Failed to fetch blocked times')
      const data = await res.json()
      setBlockedTimes(data)
    } catch (error) {
      console.error('Error fetching blocked times:', error)
    }
  }

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    setSelectedAppointment(null)
    setIsModalOpen(true)
  }

  const handleBlockTimeClick = (date) => {
    setSelectedDate(date)
    setIsBlockTimeModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedAppointment(null)
  }

  const handleModalSave = () => {
    fetchAppointments()
    handleModalClose()
  }

  // Get calendar days
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Stats for the current month
  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'PENDING').length,
    confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
    cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
    blocked: blockedTimes.length
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'BLOCKED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle className="w-3 h-3" />
      case 'PENDING': return <Clock className="w-3 h-3" />
      case 'CANCELLED': return <AlertCircle className="w-3 h-3" />
      case 'BLOCKED': return <Ban className="w-3 h-3" />
      default: return null
    }
  }

  const renderDay = (day) => {
  const dayAppointments = appointments.filter(
    appt => isSameDay(parseISO(appt.date), day)
  )

  const dayBlockedTimes = blockedTimes.filter(
    block => isSameDay(parseISO(block.date), day)
  )

  const isFullyBlocked = dayBlockedTimes.some(block => 
    block.startTime === '09:00' && block.endTime === '19:00'
  )

  return (
    <div
      onClick={() => !isFullyBlocked && handleDateClick(day)}
      className={`
        min-h-32 p-2 border-b border-r relative 
        ${!isFullyBlocked ? 'cursor-pointer hover:bg-gray-50' : 'bg-gray-100 cursor-not-allowed'}
        ${!isSameMonth(day, currentMonth) ? 'bg-gray-50 text-gray-400' : ''}
        ${isSameDay(day, selectedDate) ? 'bg-blue-50' : ''}
      `}
    >
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium">
          {format(day, 'd')}
        </span>
        {isFullyBlocked && (
          <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full">
            Blocked
          </span>
        )}
      </div>
      
      <div className="space-y-1 mt-1">
        {dayBlockedTimes.map((block, idx) => (
          <div
            key={block.id || idx}
            className="text-xs p-1 rounded bg-red-50 text-red-700 flex items-center gap-1"
          >
            <Ban className="w-3 h-3" />
            <span>{block.startTime}-{block.endTime}</span>
          </div>
        ))}

        {dayAppointments.map((appt) => (
          <div
            key={appt.id}
            onClick={(e) => {
              e.stopPropagation()
              !isFullyBlocked && handleAppointmentClick(appt)
            }}
            className={`
              text-xs p-1 rounded flex items-center gap-1
              ${!isFullyBlocked ? 'cursor-pointer hover:opacity-75' : 'opacity-50'}
              ${getStatusColor(appt.status)}
            `}
          >
            {getStatusIcon(appt.status)}
            <span>{appt.time}</span>
            <span className="truncate">
              {appt.customerName}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Test Drive Calendar</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Appointment
            </button>
            <button
              onClick={() => setIsBlockTimeModalOpen(true)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
            >
              <Ban className="w-5 h-5" />
              Block Time
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Appointments</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Confirmed</p>
            <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Blocked Times</p>
            <p className="text-2xl font-bold text-gray-600">{stats.blocked}</p>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-3 py-1 bg-gray-100 rounded-md text-sm mr-2"
            >
              Today
            </button>
            <span className="text-lg font-semibold">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCurrentMonth(prev => new Date(prev.setMonth(prev.getMonth() - 1)))
              }}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setCurrentMonth(prev => new Date(prev.setMonth(prev.getMonth() + 1)))
              }}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-7 bg-gray-50 border-b">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {calendarDays.map(day => renderDay(day))}
            </div>
          </div>
        )}
      </div>

      {/* Appointment Modal */}
      {isModalOpen && (
        <AppointmentModal
          appointment={selectedAppointment}
          selectedDate={selectedDate}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}

      {/* Block Time Modal */}
      {isBlockTimeModalOpen && (
        <BlockTimeModal
          date={selectedDate}
          onClose={() => setIsBlockTimeModalOpen(false)}
          onSave={() => {
            fetchBlockedTimes()
            setIsBlockTimeModalOpen(false)
          }}
        />
      )}
    </div>
  )
}