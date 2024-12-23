// src/components/admin/VehicleManagement.js
'use client'
import { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Edit, Trash } from 'lucide-react'
import AddEditVehicleModal from './AddEditVehicleModal'

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/vehicles')
      if (!res.ok) throw new Error('Failed to fetch vehicles')
      const data = await res.json()
      setVehicles(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group vehicles by make
  const groupedVehicles = useMemo(() => {
    const grouped = vehicles.reduce((acc, vehicle) => {
      const make = vehicle.make
      if (!acc[make]) acc[make] = []
      acc[make].push(vehicle)
      return acc
    }, {})

    // Sort vehicles within each make by year (newest first)
    Object.keys(grouped).forEach(make => {
      grouped[make].sort((a, b) => b.year - a.year)
    })

    return grouped
  }, [vehicles])

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groupedVehicles

    const filtered = {}
    Object.entries(groupedVehicles).forEach(([make, makeVehicles]) => {
      const filteredVehicles = makeVehicles.filter(vehicle => 
        vehicle.stockNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.year.toString().includes(searchTerm)
      )
      if (filteredVehicles.length > 0) {
        filtered[make] = filteredVehicles
      }
    })
    return filtered
  }, [groupedVehicles, searchTerm])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return

    try {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete vehicle')
      fetchVehicles()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Vehicle Inventory</h1>
          <button
            onClick={() => {
              setEditingVehicle(null)
              setIsModalOpen(true)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Vehicle
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search vehicles..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Vehicle List by Make */}
        {Object.entries(filteredGroups).map(([make, makeVehicles]) => (
          <div key={make} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold text-gray-900">{make}</h2>
            </div>
            <div className="divide-y">
              {makeVehicles.map((vehicle) => (
                <div key={vehicle.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {vehicle.year} {vehicle.model}
                      </h3>
                      <div className="mt-1 text-sm text-gray-500 space-x-4">
                        <span>Stock #{vehicle.stockNumber}</span>
                        <span>${vehicle.price.toLocaleString()}</span>
                        <span>{vehicle.mileage.toLocaleString()} miles</span>
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        `}>
                          {vehicle.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          setEditingVehicle(vehicle)
                          setIsModalOpen(true)
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <AddEditVehicleModal
          vehicle={editingVehicle}
          onClose={() => {
            setIsModalOpen(false)
            setEditingVehicle(null)
          }}
          onSave={() => {
            fetchVehicles()
            setIsModalOpen(false)
            setEditingVehicle(null)
          }}
        />
      )}
    </div>
  )
}