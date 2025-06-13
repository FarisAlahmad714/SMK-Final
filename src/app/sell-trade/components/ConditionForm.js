// src/app/sell-trade/components/ConditionForm.js

'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function ConditionForm({ formData, setFormData, onNext, onPrev }) {
  const [isComplete, setIsComplete] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [vehiclesError, setVehiclesError] = useState('');

  const updateCondition = (field, value) => {
    setFormData(prev => ({
      ...prev,
      condition: {
        ...prev.condition,
        [field]: value
      }
    }));
  };

  // Fetch available vehicles if intent is 'trade'
  useEffect(() => {
    if (formData.intent === 'trade') {
      fetchAvailableVehicles();
    }
  }, [formData.intent]);

  const fetchAvailableVehicles = async () => {
    setVehiclesLoading(true);
    setVehiclesError('');
    try {
      const res = await fetch('/api/vehicles?status=AVAILABLE');
      if (!res.ok) {
        throw new Error(`Failed to fetch vehicles. Status: ${res.status}`);
      }
      const data = await res.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setVehiclesError('Failed to load available vehicles. Please try again.');
    } finally {
      setVehiclesLoading(false);
    }
  };

  const handleDesiredVehicleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      desiredVehicleId: e.target.value
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Vehicle Details & Condition
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mileage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Mileage
          </label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-md"
            value={formData.condition.mileage}
            onChange={(e) => updateCondition('mileage', e.target.value)}
            placeholder="Enter current mileage"
            required
          />
        </div>

        {/* Exterior Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exterior Color
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={formData.condition.color}
            onChange={(e) => updateCondition('color', e.target.value)}
            placeholder="e.g., Pearl White"
            required
          />
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transmission
          </label>
          <select
            className="w-full px-4 py-2 border rounded-md"
            value={formData.condition.transmission}
            onChange={(e) => updateCondition('transmission', e.target.value)}
            required
          >
            <option value="">Select Transmission</option>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
            <option value="cvt">CVT</option>
          </select>
        </div>

        {/* Ownership Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ownership Status
          </label>
          <select
            className="w-full px-4 py-2 border rounded-md"
            value={formData.condition.ownershipStatus}
            onChange={(e) => updateCondition('ownershipStatus', e.target.value)}
            required
          >
            <option value="">Select Status</option>
            <option value="owned">Owned/Paid Off</option>
            <option value="financed">Financed</option>
            <option value="leased">Leased</option>
          </select>
        </div>

        {/* Packages/Features */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Packages/Features
          </label>
          <textarea
            className="w-full px-4 py-2 border rounded-md"
            rows="3"
            value={formData.condition.packages.join('\n')}
            onChange={(e) => updateCondition('packages', e.target.value.split('\n'))}
            placeholder="List any additional packages or features (one per line)"
          />
        </div>

        {/* Aftermarket Modifications */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aftermarket Modifications
          </label>
          <textarea
            className="w-full px-4 py-2 border rounded-md"
            rows="3"
            value={formData.condition.aftermarket.join('\n')}
            onChange={(e) => updateCondition('aftermarket', e.target.value.split('\n'))}
            placeholder="List any aftermarket modifications (one per line)"
          />
        </div>

        {/* Desired Vehicle Selection - Conditionally Rendered */}
        {formData.intent === 'trade' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desired Vehicle for Trade-In
            </label>
            {vehiclesLoading ? (
              <p>Loading available vehicles...</p>
            ) : vehiclesError ? (
              <p className="text-red-600">{vehiclesError}</p>
            ) : vehicles.length === 0 ? (
              <p>No available vehicles for trade-in at the moment.</p>
            ) : (
              <select
                className="w-full px-4 py-2 border rounded-md"
                value={formData.desiredVehicleId}
                onChange={handleDesiredVehicleChange}
                required
              >
                <option value="">Select a vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.year} {vehicle.make} {vehicle.model} - #{vehicle.stockNumber}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={formData.intent === 'trade' && !formData.desiredVehicleId}
        >
          Continue to Photos
        </button>
      </div>
    </div>
  );
}
