export default function VehicleFilters() {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-4">Filters</h2>
        
        {/* Make Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Make
          </label>
          <select className="w-full border rounded-md py-2 px-3">
            <option value="">All Makes</option>
            <option value="BMW">BMW</option>
            <option value="Mercedes">Mercedes</option>
            <option value="Toyota">Toyota</option>
          </select>
        </div>
  
        {/* Price Range Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <select className="w-full border rounded-md py-2 px-3">
            <option value="">Any Price</option>
            <option value="0-30000">Under $30,000</option>
            <option value="30000-50000">$30,000 - $50,000</option>
            <option value="50000-100000">$50,000 - $100,000</option>
            <option value="100000+">$100,000+</option>
          </select>
        </div>
  
        {/* Year Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <select className="w-full border rounded-md py-2 px-3">
            <option value="">Any Year</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>
      </div>
    )
  }