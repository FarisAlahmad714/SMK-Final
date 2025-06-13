"use client";
import Link from "next/link";
import { useState } from "react";
import VehicleGrid from "@/components/vehicles/VehicleGrid";
import VehicleFilters from "@/components/vehicles/VehicleFilters";
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function VehiclesPage() {
  const [filters, setFilters] = useState({
    make: "",
    minPrice: "",
    maxPrice: "",
    year: "",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Available Vehicles</h1>
        
        {/* “Back to Home” button */}
        <Link 
    href="/"
    className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-md shadow hover:bg-gray-50 transition-colors group"
  >
    <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
    Back to Home
  </Link>
      </div>

      {/* The Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search vehicles..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64">
          <div className="bg-white p-4 rounded-lg shadow sticky top-4">
            <VehicleFilters onFilterChange={setFilters} />
          </div>
        </div>
        <div className="flex-1">
          <VehicleGrid filters={filters} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}
