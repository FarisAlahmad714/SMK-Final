// src/components/vehicles/VehicleFilters.js
'use client'
import { useState, useEffect } from 'react'

export default function VehicleFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    make: '',
    minPrice: '',
    maxPrice: '',
    year: ''
  })

  const [makes, setMakes] = useState([])
  const years = Array.from({ length: 2024 - 2015 + 1 }, (_, i) => 2024 - i)
  const priceRanges = [
    { label: 'Any Price', min: '', max: '' },
    { label: 'Under $30,000', min: '', max: '30000' },
    { label: '$30,000 - $50,000', min: '30000', max: '50000' },
    { label: '$50,000 - $100,000', min: '50000', max: '100000' },
    { label: 'Over $100,000', min: '100000', max: '' }
  ]

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const res = await fetch('/api/vehicles')
        const vehicles = await res.json()
        const uniqueMakes = [...new Set(vehicles.map(v => v.make))].sort()
        setMakes(uniqueMakes)
      } catch (error) {
        console.error('Error fetching makes:', error)
      }
    }

    fetchMakes()
  }, [])

  const handleChange = (name, value) => {
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceRangeChange = (range) => {
    const newFilters = {
      ...filters,
      minPrice: range.min,
      maxPrice: range.max
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Make
        </label>
        <select
          className="w-full border rounded-md py-2 px-3"
          value={filters.make}
          onChange={(e) => handleChange('make', e.target.value)}
        >
          <option value="">All Makes</option>
          {makes.map((make) => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <select
          className="w-full border rounded-md py-2 px-3"
          value={`${filters.minPrice}-${filters.maxPrice}`}
          onChange={(e) => {
            const [min, max] = e.target.value.split('-')
            handlePriceRangeChange({ min, max })
          }}
        >
          {priceRanges.map((range) => (
            <option 
              key={`${range.min}-${range.max}`} 
              value={`${range.min}-${range.max}`}
            >
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Year
        </label>
        <select
          className="w-full border rounded-md py-2 px-3"
          value={filters.year}
          onChange={(e) => handleChange('year', e.target.value)}
        >
          <option value="">Any Year</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
    </div>
  )
}