// src/app/vehicles/[id]/page.js
import Link from 'next/link'
import TestDriveForm from '@/components/forms/TestDriveForm'

export default function VehicleDetailsPage({ params }) {
  // Sample data - will be replaced with real data later
  const vehicle = {
    id: params.id,
    name: '2024 BMW M2',
    price: 80800,
    mileage: '125 mi',
    images: [
      '/api/placeholder/800/600',
      '/api/placeholder/400/300',
      '/api/placeholder/400/300',
      '/api/placeholder/400/300',
      '/api/placeholder/400/300'
    ],
    stockNumber: 'SMK30260',
    transmission: 'Automatic',
    exteriorColor: 'Blue',
    status: 'available',
    description: 'Experience the pinnacle of performance with the 2024 BMW M2. This vehicle combines luxury, power, and precision engineering to deliver an unforgettable driving experience.'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/vehicles"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        ← Back to Inventory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={vehicle.images[0]}
              alt={vehicle.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {vehicle.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${vehicle.name} view ${index + 2}`}
                className="w-full h-24 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Vehicle Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{vehicle.name}</h1>
          <p className="text-2xl text-blue-600 font-bold mb-4">
            ${vehicle.price.toLocaleString()}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm text-gray-500">Stock #</h3>
              <p className="text-gray-900">{vehicle.stockNumber}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Mileage</h3>
              <p className="text-gray-900">{vehicle.mileage}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Transmission</h3>
              <p className="text-gray-900">{vehicle.transmission}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Exterior Color</h3>
              <p className="text-gray-900">{vehicle.exteriorColor}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{vehicle.description}</p>
          </div>

          <button
            onClick={() => document.getElementById('test-drive-modal').showModal()}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Schedule Test Drive
          </button>
        </div>
      </div>

      {/* Test Drive Modal */}
      <dialog id="test-drive-modal" className="modal">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <TestDriveForm vehicle={vehicle} />
        </div>
      </dialog>
    </div>
  )
}