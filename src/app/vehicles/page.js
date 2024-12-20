import VehicleGrid from '@/components/vehicles/VehicleGrid'
import VehicleFilters from '@/components/vehicles/VehicleFilters'

export default function VehiclesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Vehicles</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64">
          <VehicleFilters />
        </div>
        <div className="flex-1">
          <VehicleGrid />
        </div>
      </div>
    </div>
  )
}