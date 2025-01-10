// src/components/admin/SellTradeModal.js
'use client'
import { X } from 'lucide-react'

export default function SellTradeModal({ submission, onClose, onStatusUpdate }) {
  // Add null checks for all potentially undefined properties
  const photos = submission?.photoUrls || [];
  const packages = submission?.condition?.packages || [];
  const aftermarket = submission?.condition?.aftermarket || [];
  const desiredVehicle = submission?.desiredVehicle || null; // Desired Vehicle Details

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {submission?.type === 'sell' ? 'Sell' : 'Trade'} Request Details
            </h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* 
            Status Section 
            */}
            {/*
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">Current Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    submission?.status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                    submission?.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {submission?.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  {submission?.status !== 'APPROVED' && (
                    <button
                      onClick={() => onStatusUpdate(submission?.id, 'APPROVED')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
                  {submission?.status !== 'REJECTED' && (
                    <button
                      onClick={() => onStatusUpdate(submission?.id, 'REJECTED')}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
            */}

            {/* Vehicle Details */}
            <div>
              <h3 className="font-semibold mb-3">Vehicle Information</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">VIN</p>
                  <p className="font-medium">{submission?.vin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-medium">
                    {submission?.vehicleDetails?.year} {submission?.vehicleDetails?.make} {submission?.vehicleDetails?.model}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mileage</p>
                  <p className="font-medium">{submission?.condition?.mileage} miles</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ownership Status</p>
                  <p className="font-medium capitalize">{submission?.condition?.ownershipStatus}</p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            {(packages.length > 0 || aftermarket.length > 0) && (
              <div>
                <h3 className="font-semibold mb-3">Additional Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  {packages.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Packages/Features</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {packages.map((pkg, index) => (
                          <li key={index}>{pkg}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {aftermarket.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Aftermarket Modifications</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {aftermarket.map((mod, index) => (
                          <li key={index}>{mod}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Desired Vehicle for Trade-In */}
            {submission?.type === 'trade' && desiredVehicle && (
              <div>
                <h3 className="font-semibold mb-3">Desired Vehicle for Trade-In</h3>
                <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-medium">{desiredVehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Make</p>
                    <p className="font-medium">{desiredVehicle.make}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Model</p>
                    <p className="font-medium">{desiredVehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stock Number</p>
                    <p className="font-medium">{desiredVehicle.stockNumber}</p>
                  </div>
                  {/* Add more desired vehicle details as needed */}
                  {desiredVehicle.trim && (
                    <div>
                      <p className="text-sm text-gray-500">Trim</p>
                      <p className="font-medium">{desiredVehicle.trim}</p>
                    </div>
                  )}
                  {desiredVehicle.engineSize && (
                    <div>
                      <p className="text-sm text-gray-500">Engine Size</p>
                      <p className="font-medium">{desiredVehicle.engineSize}</p>
                    </div>
                  )}
                  {desiredVehicle.transmission && (
                    <div>
                      <p className="text-sm text-gray-500">Transmission</p>
                      <p className="font-medium capitalize">{desiredVehicle.transmission}</p>
                    </div>
                  )}
                  {desiredVehicle.drivetrain && (
                    <div>
                      <p className="text-sm text-gray-500">Drivetrain</p>
                      <p className="font-medium">{desiredVehicle.drivetrain}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Photos */}
            {photos.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Vehicle Photos</h3>
                <div className="grid grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative aspect-video">
                      <img
                        src={photo}
                        alt={`Vehicle photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <span className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {index + 1}/{photos.length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
