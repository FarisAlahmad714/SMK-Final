'use client';  // Add this at the very top

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function FeaturedVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch('/api/vehicles?sort=newest&limit=3&status=AVAILABLE')
        if (!res.ok) throw new Error('Failed to fetch vehicles')
        const data = await res.json()
        setVehicles(data)
      } catch (error) {
        console.error('Error fetching featured vehicles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])
  
  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!vehicles.length) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Vehicles</h2>
          <Link 
    href="/vehicles" 
    className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-md shadow hover:bg-gray-50 transition-colors group"
  >
    View All 
    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
  </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48">
                <img
                  src={vehicle.images[0] || '/api/placeholder/400/300'}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <h3 className="text-lg font-semibold text-white">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold text-lg">
                    ${vehicle.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600">
                    {vehicle.mileage.toLocaleString()} mi
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <span>{vehicle.transmission} • {vehicle.exteriorColor}</span>
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