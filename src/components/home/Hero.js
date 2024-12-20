import Link from 'next/link'

export default function Hero() {
  return (
    <div className="relative bg-gray-900 h-[600px]">
      <div className="absolute inset-0 bg-[url('/api/placeholder/1920/600')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col justify-center h-full text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            SMK-Auto
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
            Experience our curated collection of premium vehicles, where luxury meets exceptional performance.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/vehicles"
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              View Inventory
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}