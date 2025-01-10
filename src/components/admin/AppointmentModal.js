'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { parseISO, isSameDay } from 'date-fns'

export default function AppointmentModal({ 
  isOpen, 
  onClose, 
  appointment = null, 
  selectedDate = null,
  onSave 
}) {
  const [vehicles, setVehicles] = useState([])
  const [error, setError] = useState("")
  const [blockedTimes, setBlockedTimes] = useState([])

  const [formData, setFormData] = useState({
    vehicleId: appointment?.vehicleId || '',
    customerName: appointment?.customerName || '',
    email: appointment?.email || '',
    phone: appointment?.phone || '',
    date: appointment?.date 
      ? new Date(appointment.date).toISOString().split('T')[0] 
      : selectedDate?.toISOString().split('T')[0] || '',
    time: appointment?.time || '09:00',
    status: appointment?.status || 'PENDING',
    notes: appointment?.notes || '',
    source: appointment?.source || '',
    cancellationReason: appointment?.cancellationReason || ''
  })
  
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/vehicles?status=AVAILABLE')
      if (!res.ok) throw new Error('Failed to fetch vehicles')
      const data = await res.json()
      setVehicles(data)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    }
  }

  useEffect(() => {
    if (!formData.date) return;
    
    const fetchBlockedTimes = async () => {
      try {
        const res = await fetch(`/api/blocked-times?date=${formData.date}`);
        if (!res.ok) throw new Error('Failed to fetch blocked times');
        const data = await res.json();
        setBlockedTimes(data);
      } catch (error) {
        console.error('Error fetching blocked times:', error);
      }
    };

    fetchBlockedTimes();
  }, [formData.date]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const convert12to24 = (time12h) => {
      const [time, modifier] = time12h.split(' ');
      let [hours] = time.split(':');
      hours = parseInt(hours);

      if (hours === 12) {
        hours = modifier === 'PM' ? 12 : 0;
      } else {
        hours = modifier === 'PM' ? hours + 12 : hours;
      }

      return `${hours.toString().padStart(2, '0')}:00`;
    };
    
    const time24 = convert12to24(formData.time);
    const localDate = new Date(formData.date + 'T' + time24)
    const utcDate = new Date(Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(), 
      localDate.getHours(),
      localDate.getMinutes()
    ))
   
    try {
      const url = appointment
        ? `/api/test-drives/${appointment.id}`
        : '/api/test-drives'
      
      const method = appointment ? 'PUT' : 'POST'
   
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          time: time24,
          date: utcDate.toISOString()
        })
      })
   
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to save appointment");
      }
   
      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving appointment:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!appointment || !window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }
  
    setLoading(true);
    try {
      const res = await fetch(`/api/test-drives/${appointment.id}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) throw new Error('Failed to delete appointment');
  
      onSave();
      onClose();
    } catch (error) {
      console.error('Error deleting appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 9;
    return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {appointment ? 'Edit Appointment' : 'New Appointment'}
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle
            </label>
            <select
              required
              className="w-full border rounded-md px-3 py-2"
              value={formData.vehicleId}
              onChange={(e) => setFormData(prev => ({ ...prev, vehicleId: e.target.value }))}
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.year} {vehicle.make} {vehicle.model} - #{vehicle.stockNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                required
                className="w-full border rounded-md px-3 py-2"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                required
                className="w-full border rounded-md px-3 py-2"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {formData.status === 'CANCELLED' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cancellation Reason
                </label>
                <select
                  required
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.cancellationReason || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, cancellationReason: e.target.value }))}
                >
                  <option value="">Select reason</option>
                  <option value="CUSTOMER_REQUEST">Customer Request</option>
                  <option value="VEHICLE_SOLD">Vehicle Sold</option>
                  <option value="NO_SHOW">No Show</option>
                  <option value="RESCHEDULED">Rescheduled</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                className="w-full border rounded-md px-3 py-2"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <select
                required
                className="w-full border rounded-md px-3 py-2"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              >
                {timeSlots.map((time) => {
                  const isBlocked = blockedTimes.some(block =>
                    isSameDay(parseISO(block.date), new Date(formData.date)) &&
                    time >= block.startTime &&
                    time <= block.endTime
                  );

                  return (
                    <option key={time} value={time}>
                      {time} {isBlocked ? '(Blocked)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lead Source
            </label>
            {formData.source === 'WEBSITE' ? (
              <div className="w-full px-3 py-2 bg-gray-100 border rounded-md text-gray-600">
                Website
              </div>
            ) : (
              <select
                required
                className="w-full border rounded-md px-3 py-2"
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
              >
                <option value="">Select source</option>
                <option value="OFFERUP">OfferUp</option>
                <option value="FACEBOOK">Facebook Marketplace</option>
                <option value="FRIEND">Friend Referral</option>
                <option value="AD">Advertisement</option>
                <option value="OTHER">Other</option>
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              rows="3"
              className="w-full border rounded-md px-3 py-2"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            ></textarea>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            {appointment && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}