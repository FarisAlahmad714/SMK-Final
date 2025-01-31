'use client'
import { useState } from 'react';
import { X } from 'lucide-react';

export default function SellTradeModal({ submission, onClose, onStatusUpdate }) {
  const [statusMessage, setStatusMessage] = useState('');
  const [updating, setUpdating] = useState(false);

  // Add null checks for all potentially undefined properties
  const photos = submission?.photoUrls || [];
  const packages = submission?.condition?.packages || [];
  const aftermarket = submission?.condition?.aftermarket || [];
  const desiredVehicle = submission?.desiredVehicle || null;
  const customerInfo = submission?.customerInfo || {};

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    setStatusMessage('');
    
    try {
      // First update the submission status
      await onStatusUpdate(submission?.id, status);
  
      // Only create customer if status is APPROVED
      if (status === 'APPROVED' && submission?.customerInfo) {
        const customerData = {
          name: submission.customerInfo.name,
          email: submission.customerInfo.email,
          phone: submission.customerInfo.phone,
          source: 'WEBSITE',
          sellTradeRequest: true,
          notes: `Added from ${submission.type.toUpperCase()} request - ${new Date().toLocaleDateString()}`
        };
  
        console.log('Creating customer with data:', customerData);
  
        const response = await fetch('/api/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customerData)
        });
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to create customer');
        }
  
        const result = await response.json();
        console.log('Customer created:', result);
      }
  
      setStatusMessage(`Request ${status.toLowerCase()} successfully`);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage(error.message || 'Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {submission?.type === 'sell' ? 'Sell' : 'Trade'} Request Details
            </h2>
            <button onClick={onClose} disabled={updating}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`mb-4 p-3 rounded-md text-sm ${
              statusMessage.includes('Error') 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {statusMessage}
            </div>
          )}

          {/* Content */}
          <div className="space-y-6">
            {/* Status Section */}
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
                      onClick={() => handleStatusUpdate('APPROVED')}
                      disabled={updating}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400"
                    >
                      {updating ? 'Processing...' : 'Approve'}
                    </button>
                  )}
                  {submission?.status !== 'REJECTED' && (
                    <button
                      onClick={() => handleStatusUpdate('REJECTED')}
                      disabled={updating}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400"
                    >
                      {updating ? 'Processing...' : 'Reject'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h3 className="font-semibold mb-3">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{customerInfo.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{customerInfo.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{customerInfo.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submission Date</p>
                  <p className="font-medium">
                    {new Date(submission?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

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
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="font-medium">
                      {desiredVehicle.year} {desiredVehicle.make} {desiredVehicle.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stock Number</p>
                    <p className="font-medium">{desiredVehicle.stockNumber}</p>
                  </div>
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
  );
}