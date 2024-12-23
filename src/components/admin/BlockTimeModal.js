// src/components/admin/BlockTimeModal.js
'use client'
import { useState } from 'react'
import { X } from 'lucide-react'

export default function BlockTimeModal({ date, onClose, onSave }) {
  const [formData, setFormData] = useState({
    startTime: '09:00',
    endTime: '17:00',
    reason: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/blocked-times', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: date,
          ...formData
        })
      })

      if (!res.ok) throw new Error('Failed to block time')

      onSave()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Block Time Slot</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              >
                {Array.from({ length: 9 }, (_, i) => i + 9).map(hour => (
                  <option key={hour} value={`${hour}:00`}>
                    {`${hour}:00`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              >
                {Array.from({ length: 9 }, (_, i) => i + 9).map(hour => (
                  <option key={hour} value={`${hour}:00`}>
                    {`${hour}:00`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason (Optional)
            </label>
            <textarea
              className="w-full border rounded-md px-3 py-2"
              rows="3"
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Why is this time being blocked?"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Blocking...' : 'Block Time'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}