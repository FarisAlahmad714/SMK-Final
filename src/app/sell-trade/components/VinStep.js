// src/app/sell-trade/components/VinStep.js
'use client';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function VinStep({ formData, setFormData, onNext, onPrev }) {
  const [isLoading, setIsLoading] = useState(false);
  const [vinError, setVinError] = useState('');
  const [vinDetails, setVinDetails] = useState(null);

  // src/app/sell-trade/components/VinStep.js
const validateAndFetchVin = async () => {
    setIsLoading(true);
    setVinError('');
  
    try {
      console.log('Attempting to validate VIN:', formData.vin); // Debug log
  
      const response = await fetch(`/api/vin-lookup?vin=${formData.vin}`);
      console.log('API Response status:', response.status); // Debug log
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const vehicleInfo = await response.json();
      console.log('Vehicle Info received:', vehicleInfo); // Debug log
  
      setVinDetails(vehicleInfo);
      setFormData(prev => ({
        ...prev,
        vehicleDetails: vehicleInfo
      }));
    } catch (error) {
      console.error('Detailed error:', error); // More detailed error logging
      setVinError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Enter Your Vehicle's VIN
        </h2>
        <p className="text-gray-600 mb-4">
          Your VIN (Vehicle Identification Number) is a 17-character code that can be found in several places:
        </p>
        <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-6">
          <li>Driver's side dashboard, visible through the windshield</li>
          <li>Driver's side door jamb</li>
          <li>Vehicle registration or insurance documents</li>
          <li>Vehicle title</li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              VIN Number
            </label>
            <input
              type="text"
              maxLength="17"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
              value={formData.vin}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, vin: e.target.value.toUpperCase() }));
                setVinError('');
                setVinDetails(null);
              }}
              placeholder="Enter 17-character VIN"
            />
            {vinError && (
              <p className="mt-2 text-sm text-red-600">{vinError}</p>
            )}
          </div>

          <button
            onClick={validateAndFetchVin}
            disabled={formData.vin.length !== 17 || isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Validating...' : 'Validate VIN'}
          </button>
        </div>

        {vinDetails && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Year</label>
                <p className="font-medium">{vinDetails.year}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Make</label>
                <p className="font-medium">{vinDetails.make}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Model</label>
                <p className="font-medium">{vinDetails.model}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Trim</label>
                <p className="font-medium">{vinDetails.trim || 'N/A'}</p>
              </div>
              {vinDetails.engineSize && (
                <div>
                  <label className="text-sm text-gray-500">Engine</label>
                  <p className="font-medium">{vinDetails.engineSize}</p>
                </div>
              )}
              {vinDetails.transmission && (
                <div>
                  <label className="text-sm text-gray-500">Transmission</label>
                  <p className="font-medium">{vinDetails.transmission}</p>
                </div>
              )}
              {vinDetails.drivetrain && (
                <div>
                  <label className="text-sm text-gray-500">Drivetrain</label>
                  <p className="font-medium">{vinDetails.drivetrain}</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={onNext}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Confirm and Continue
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>
      </div>
    </div>
  );
}