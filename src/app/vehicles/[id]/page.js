'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import TestDriveForm from '@/components/forms/TestDriveForm'

export default function VehicleDetailsPage({ params }) {
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const vehicleId = params?.id 

  useEffect(() => {
    if (vehicleId) {
      fetchVehicleDetails()
    }
  }, [vehicleId])

  const fetchVehicleDetails = async () => {
    try {
      const res = await fetch(`/api/vehicles/${vehicleId}`)
      if (!res.ok) throw new Error('Failed to fetch vehicle')
      const data = await res.json()
      setVehicle(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Not Found</h2>
          <p className="mt-2 text-gray-600 mb-4">The vehicle you're looking for might have been removed or sold.</p>
          <Link
            href="/vehicles"
            className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-md shadow hover:bg-gray-50 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Inventory
          </Link>
        </div>
      </div>
    )
  }

  const vehicleName = `${vehicle.year} ${vehicle.make} ${vehicle.model}`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/vehicles"
        className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-md shadow hover:bg-gray-50 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Inventory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden shadow-md">
            <img
              src={vehicle.images[selectedImage] || '/api/placeholder/800/600'}
              alt={vehicleName}
              className="w-full h-full object-cover"
            />
          </div>
          {vehicle.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {vehicle.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-sm
                    ${selectedImage === index ? 'ring-2 ring-blue-600' : 'hover:opacity-75'}`}
                >
                  <img
                    src={image}
                    alt={`${vehicleName} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Vehicle Details */}
        <div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{vehicleName}</h1>
            <p className="text-2xl text-blue-600 font-bold mb-4">
              ${vehicle.price.toLocaleString()}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm text-gray-500">Stock #</h3>
                <p className="text-gray-900 font-medium">{vehicle.stockNumber}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">VIN </h3>
                <p className="text-gray-900 font-medium">{vehicle.vin}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Mileage</h3>
                <p className="text-gray-900 font-medium">{vehicle.mileage.toLocaleString()} mi</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Transmission</h3>
                <p className="text-gray-900 font-medium">{vehicle.transmission}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Exterior Color</h3>
                <p className="text-gray-900 font-medium">{vehicle.exteriorColor}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Schedule Test Drive
            </button>
          </div>
        </div>
      </div>

      {/* Test Drive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <TestDriveForm 
              vehicle={vehicle}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}