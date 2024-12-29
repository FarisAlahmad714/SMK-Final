// src/components/admin/BlockTimeModal.js
'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { format } from 'date-fns'

export default function BlockTimeModal({ date, onClose, onSave }) {
    const formattedDate = format(date, 'MMMM d, yyyy')
    
    const [formData, setFormData] = useState({
      date: date.toISOString(),
      startTime: '09:00',
      endTime: '19:00',
      reason: '',
      blockFullDay: false
    })

    const timeSlots = Array.from({ length: 11 }, (_, i) => {
      const hour = i + 9;
      return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
    });

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/blocked-times', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.date,
          startTime: formData.blockFullDay ? '09:00' : formData.startTime,
          endTime: formData.blockFullDay ? '19:00' : formData.endTime,
          reason: formData.reason
        })
      })

      if (!res.ok) throw new Error('Failed to block time')
      onSave()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg w-full max-w-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Block Time</h2>
          <p className="text-sm text-gray-600">{formattedDate}</p>
        </div>
        <button onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
      </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.blockFullDay}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  blockFullDay: e.target.checked
                }))}
              />
              <span>Block entire day</span>
            </label>
          </div>

          {!formData.blockFullDay && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <select
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    startTime: e.target.value
                  }))}
                  className="w-full border rounded-md px-3 py-2"
                >
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <select
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    endTime: e.target.value
                  }))}
                  className="w-full border rounded-md px-3 py-2"
                >
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Reason (Optional)</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                reason: e.target.value
              }))}
              className="w-full border rounded-md px-3 py-2"
              rows="3"
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
            >
              Block Time
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}