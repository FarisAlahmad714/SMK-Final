import Link from 'next/link'

export default function VehicleCard({ vehicle }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
        <div className="mt-2 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-blue-600 font-bold">${vehicle.price.toLocaleString()}</span>
            <span className="text-gray-600">{vehicle.mileage}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{vehicle.transmission}</span>
            <span>{vehicle.exteriorColor}</span>
          </div>
          <div className="text-sm text-gray-500">
            Stock #: {vehicle.stockNumber}
          </div>
        </div>
        <Link
          href={`/vehicles/${vehicle.id}`}
          className="mt-4 block w-full bg-gray-900 text-white text-center py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}