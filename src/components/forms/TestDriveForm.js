// src/components/forms/TestDriveForm.js
'use client'
import { useState } from 'react'
import { X } from 'lucide-react'

export default function TestDriveForm({ vehicle, onClose }) {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Generate available time slots (9 AM to 5 PM)
  const timeSlots = []
  for (let hour = 9; hour <= 17; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/test-drives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          vehicleId: vehicle.id
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to schedule test drive')
      }

      setSuccess(true)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center p-6">
        <h3 className="text-xl font-bold text-green-600 mb-2">
          Test Drive Scheduled!
        </h3>
        <p className="text-gray-600 mb-4">
          We'll be in touch shortly to confirm your appointment.
        </p>
        <button
          onClick={onClose}
          className="text-blue-600 hover:text-blue-800"
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute right-0 top-0 p-2"
      >
        <X className="w-6 h-6" />
      </button>

      <h2 className="text-xl font-bold mb-4">
        Schedule Test Drive
      </h2>
      <p className="text-gray-600 mb-6">
        {vehicle.year} {vehicle.make} {vehicle.model}
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            required
            className="w-full border rounded-md px-3 py-2"
            value={formData.customerName}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              customerName: e.target.value
            }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            className="w-full border rounded-md px-3 py-2"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              email: e.target.value
            }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            required
            className="w-full border rounded-md px-3 py-2"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              phone: e.target.value
            }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Date
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full border rounded-md px-3 py-2"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                date: e.target.value
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Time
            </label>
            <select
              required
              className="w-full border rounded-md px-3 py-2"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                time: e.target.value
              }))}
            >
              <option value="">Select time</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            rows="3"
            className="w-full border rounded-md px-3 py-2"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              notes: e.target.value
            }))}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? 'Scheduling...' : 'Schedule Test Drive'}
        </button>
      </form>
    </div>
  )
}