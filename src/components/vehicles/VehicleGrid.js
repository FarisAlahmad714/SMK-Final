import VehicleCard from './VehicleCard'

export default function VehicleGrid() {
  // Sample data - will be replaced with real data later
  const vehicles = [
    {
      id: 1,
      name: '2024 BMW M2',
      price: 80800,
      mileage: '125 mi',
      image: '/api/placeholder/400/300',
      stockNumber: 'SMK30260',
      transmission: 'Automatic',
      exteriorColor: 'Blue'
    },
    {
      id: 2,
      name: '2024 Mercedes GLS',
      price: 50000,
      mileage: '300 mi',
      image: '/api/placeholder/400/300',
      stockNumber: 'SMK30264',
      transmission: 'Automatic',
      exteriorColor: 'Black'
    },
    {
      id: 3,
      name: '2024 Toyota Rav4',
      price: 35000,
      mileage: '100 mi',
      image: '/api/placeholder/400/300',
      stockNumber: 'SMK30270',
      transmission: 'Automatic',
      exteriorColor: 'Gray'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map(vehicle => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  )
}