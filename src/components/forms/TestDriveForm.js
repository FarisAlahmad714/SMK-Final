// src/components/forms/TestDriveForm.js
'use client'
import { useState } from 'react'

export default function TestDriveForm({ vehicle }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission - will be implemented later
    console.log('Form submitted:', formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Generate available time slots (9 AM to 5 PM)
  const timeSlots = []
  for (let i = 9; i <= 17; i++) {
    timeSlots.push(`${i}:00`)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Schedule Test Drive</h2>
        <p className="text-gray-600">{vehicle.name}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">
            Preferred Date
          </label>
          <input
            type="date"
            id="preferredDate"
            name="preferredDate"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.preferredDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700">
            Preferred Time
          </label>
          <select
            id="preferredTime"
            name="preferredTime"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.preferredTime}
            onChange={handleChange}
          >
            <option value="">Select a time</option>
            {timeSlots.map(time => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={() => document.getElementById('test-drive-modal').close()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Schedule Test Drive
          </button>
        </div>
      </form>
    </div>
  )
}