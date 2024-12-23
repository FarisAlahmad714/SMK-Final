// src/components/vehicles/VehicleGrid.js
"use client";
import { useState, useEffect } from "react";
import VehicleCard from "./VehicleCard";

export default function VehicleGrid({ filters, searchQuery = "" }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters based on filters & search query
        const params = new URLSearchParams();
        if (filters?.make) params.append("make", filters.make);
        if (filters?.minPrice) params.append("minPrice", filters.minPrice);
        if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice);
        if (filters?.year) params.append("year", filters.year);

        // Pass the search query as well (optional, name it whatever you prefer)
        if (searchQuery) {
          params.append("search", searchQuery);
        }

        const url = `/api/vehicles${
          params.toString() ? `?${params.toString()}` : ""
        }`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch vehicles");

        const data = await res.json();
        setVehicles(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching vehicles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [filters, searchQuery]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Loading vehicles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading vehicles: {error}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No vehicles found matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
