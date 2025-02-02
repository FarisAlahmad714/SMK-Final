'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import ImageUpload from '@/components/common/ImageUpload'
import FinalPriceModal from './FinalPriceModal'

export default function AddEditVehicleModal({ vehicle, onClose, onSave }) {
  const [formData, setFormData] = useState({
    stockNumber: vehicle?.stockNumber || '',
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    vin: vehicle?.vin || '',
    price: vehicle?.price || '',
    cost: vehicle?.cost || '',
    mileage: vehicle?.mileage || '',
    transmission: vehicle?.transmission || 'Automatic',
    exteriorColor: vehicle?.exteriorColor || '',
    description: vehicle?.description || '',
    images: vehicle?.images || [],
    status: vehicle?.status || 'AVAILABLE',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isFinalPriceModalOpen, setIsFinalPriceModalOpen] = useState(false)

  useEffect(() => {
    if (!vehicle) {
      generateStockNumber()
    }
  }, [vehicle])

  const generateStockNumber = async () => {
    try {
      const res = await fetch('/api/vehicles/stock-number')
      if (!res.ok) throw new Error('Failed to generate stock number')
      const data = await res.json()
      setFormData((prev) => ({ ...prev, stockNumber: data.stockNumber }))
    } catch (error) {
      console.error('Error generating stock number:', error)
      setError('Error generating stock number.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // If status is being changed to SOLD, show the final price modal
      if (formData.status === 'SOLD' && vehicle?.status !== 'SOLD') {
        setIsFinalPriceModalOpen(true)
        return
      }

      // Otherwise, just save the vehicle
      await saveVehicle()
    } catch (error) {
      console.error('Error saving vehicle:', error)
      setError(error.message || 'Error saving vehicle.')
    } finally {
      setLoading(false)
    }
  }

  // NOTE: We removed the redundant transaction creation here!
  const handleFinalPriceSave = async (finalPrice, customerId) => {
    setLoading(true)
    try {
      // Simply update the vehicle with the final price
      await saveVehicle(finalPrice)
    } catch (error) {
      console.error('Error updating vehicle:', error)
      setError(error.message)
    } finally {
      setLoading(false)
      setIsFinalPriceModalOpen(false)
    }
  }

  const saveVehicle = async (finalPrice = null) => {
    const url = vehicle ? `/api/vehicles/${vehicle.id}` : '/api/vehicles'
    const method = vehicle ? 'PUT' : 'POST'

    const dataToSend = {
      ...formData,
      vin: formData.vin,
      soldPrice: finalPrice,
      soldDate: finalPrice ? new Date().toISOString() : null,
    }

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || 'Failed to save vehicle')
    }

    onSave()
    onClose()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Number
                  </label>
                  <input
                    type="text"
                    value={formData.stockNumber}
                    readOnly
                    className="w-full border rounded-md px-3 py-2 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    VIN Number
                  </label>
                  <input
                    type="text"
                    name="vin"
                    required
                    className="w-full border rounded-md px-3 py-2"
                    value={formData.vin}
                    onChange={handleChange}
                    placeholder="Enter VIN Number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Make
                  </label>
                  <input
                    type="text"
                    name="make"
                    required
                    className="w-full border rounded-md px-3 py-2"
                    value={formData.make}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    name="model"
                    required
                    className="w-full border rounded-md px-3 py-2"
                    value={formData.model}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    required
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="w-full border rounded-md px-3 py-2"
                    value={formData.year}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Listing Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    className="w-full border rounded-md px-3 py-2"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Cost ($)
                  </label>
                  <input
                    type="number"
                    name="cost"
                    required
                    min="0"
                    step="0.01"
                    className="w-full border rounded-md px-3 py-2"
                    value={formData.cost}
                    onChange={handleChange}
                    placeholder="Enter total cost"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mileage
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    required
                    min="0"
                    className="w-full border rounded-md px-3 py-2"
                    value={formData.mileage}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transmission
                  </label>
                  <select
                    name="transmission"
                    required
                    className="w-full border rounded-md px-3 py-2"
                    value={formData.transmission}
                    onChange={handleChange}
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exterior Color
                  </label>
                  <input
                    type="text"
                    name="exteriorColor"
                    required
                    className="w-full border rounded-md px-3 py-2"
                    value={formData.exteriorColor}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    required
                    className="w-full border rounded-md px-3 py-2"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="SOLD">Sold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter vehicle description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Images
                </label>
                <ImageUpload
                  images={formData.images}
                  onChange={(newImages) =>
                    setFormData((prev) => ({ ...prev, images: newImages }))
                  }
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
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
                  {loading ? 'Saving...' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {isFinalPriceModalOpen && (
        <FinalPriceModal
          isOpen={isFinalPriceModalOpen}
          onClose={() => setIsFinalPriceModalOpen(false)}
          onSave={handleFinalPriceSave}
          vehicle={{
            ...formData,
            id: vehicle.id, // Make sure we pass the original vehicle ID
          }}
        />
      )}
    </>
  )
}
