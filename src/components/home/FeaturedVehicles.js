// src/components/home/FeaturedVehicles.js
import Link from 'next/link'

export default function FeaturedVehicles() {
  // Sample data - will be replaced with real data later
  const vehicles = [
    {
      id: 1,
      name: '2024 BMW M2',
      price: 80800,
      mileage: '125 mi',
      image: '/api/placeholder/400/300',
      stockNumber: 'SMK30260'
    },
    {
      id: 2,
      name: '2024 Mercedes GLS',
      price: 50000,
      mileage: '300 mi',
      image: '/api/placeholder/400/300',
      stockNumber: 'SMK30264'
    },
    {
      id: 3,
      name: '2024 Toyota Rav4',
      price: 35000,
      mileage: '100 mi',
      image: '/api/placeholder/400/300',
      stockNumber: 'SMK30270'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Vehicles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <span className="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded-md text-sm">
                  Available
                </span>
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{vehicle.name}</h3>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-blue-600 font-bold">${vehicle.price.toLocaleString()}</span>
                  <span className="text-gray-600">{vehicle.mileage}</span>
                </div>
                <Link
                  href={`/vehicles/${vehicle.id}`}
                  className="mt-4 block w-full bg-gray-900 text-white text-center py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}