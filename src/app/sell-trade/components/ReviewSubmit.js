'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReviewSubmit({ formData, onPrev }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [desiredVehicle, setDesiredVehicle] = useState(null);
  const [desiredVehicleLoading, setDesiredVehicleLoading] = useState(false);
  const [desiredVehicleError, setDesiredVehicleError] = useState('');
  // Add customer info state
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (formData.intent === 'trade' && formData.desiredVehicleId) {
      fetchDesiredVehicle();
    }
  }, [formData.intent, formData.desiredVehicleId]);

  const fetchDesiredVehicle = async () => {
    setDesiredVehicleLoading(true);
    setDesiredVehicleError('');
    try {
      const res = await fetch(`/api/vehicles/${formData.desiredVehicleId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch desired vehicle details. Status: ${res.status}`);
      }
      const data = await res.json();
      setDesiredVehicle(data);
    } catch (error) {
      console.error('Error fetching desired vehicle:', error);
      setDesiredVehicleError('Failed to load desired vehicle details.');
    } finally {
      setDesiredVehicleLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    // Validate customer info
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      setError('Please fill in all customer information fields');
      setIsSubmitting(false);
      return;
    }

    try {
      setIsSubmitting(true);
      
      // First submit the form data
      const response = await fetch('/api/sell-trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          customerInfo
        })
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'Failed to submit form');
      }
    
      // After successful submission, send emails
      try {
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'sell-trade',
            data: {
              customerName: customerInfo.name,
              email: customerInfo.email,
              type: formData.intent,
              vehicleDetails: formData.vehicleDetails,
              desiredVehicle: formData.intent === 'trade' ? formData.desiredVehicle : null
            }
          })
        });
    
        if (!emailResponse.ok) {
          console.error('Warning: Email notification failed to send');
          // We don't throw here because we still want to show success even if email fails
        }
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Don't throw - continue with success flow even if email fails
      }
    
      setSuccess(true);
      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
          
    } catch (err) {
      setError('There was an error submitting your request. Please try again.');
      console.error('Submission Error:', err);
    } finally {
      setIsSubmitting(false);
    }

  if (success) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-600 mb-2">
            Request Submitted Successfully!
          </h3>
          <p className="text-gray-600 mb-4">
            Thank you for submitting your vehicle information. Our team will review your submission and contact you shortly.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Redirecting you to home page...
          </p>
          <Link href="/">
            <button className="text-blue-600 hover:text-blue-800">
              &larr; Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Review Your Information</h2>

      {/* Customer Information - New Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Your Contact Information</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
            <input
              type="tel"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter your phone number"
            />
          </div>
        </div>
      </div>

      {/* Intent Type */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Request Type</h3>
        <p className="font-medium capitalize">{formData.intent} Vehicle</p>
      </div>

      {/* Rest of your existing sections remain the same */}
      {/* Vehicle Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Year</dt>
            <dd className="font-medium">{formData.vehicleDetails?.year}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Make</dt>
            <dd className="font-medium">{formData.vehicleDetails?.make}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Model</dt>
            <dd className="font-medium">{formData.vehicleDetails?.model}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">VIN</dt>
            <dd className="font-medium">{formData.vin}</dd>
          </div>
        </dl>
      </div>

      {/* Condition Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Condition & Details</h3>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Mileage</dt>
            <dd className="font-medium">{formData.condition.mileage} miles</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Color</dt>
            <dd className="font-medium">{formData.condition.color}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Transmission</dt>
            <dd className="font-medium capitalize">{formData.condition.transmission}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Ownership</dt>
            <dd className="font-medium capitalize">{formData.condition.ownershipStatus}</dd>
          </div>
        </dl>

        {formData.condition.packages.length > 0 && (
          <div className="mt-4">
            <dt className="text-sm text-gray-500 mb-2">Additional Packages/Features</dt>
            <dd>
              <ul className="list-disc pl-4 space-y-1">
                {formData.condition.packages.map((pkg, index) => (
                  <li key={index} className="text-gray-700">{pkg}</li>
                ))}
              </ul>
            </dd>
          </div>
        )}

        {formData.condition.aftermarket.length > 0 && (
          <div className="mt-4">
            <dt className="text-sm text-gray-500 mb-2">Aftermarket Modifications</dt>
            <dd>
              <ul className="list-disc pl-4 space-y-1">
                {formData.condition.aftermarket.map((mod, index) => (
                  <li key={index} className="text-gray-700">{mod}</li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </div>

      {/* Desired Vehicle for Trade-In */}
      {formData.intent === 'trade' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Desired Vehicle for Trade-In</h3>
          {desiredVehicleLoading ? (
            <p>Loading desired vehicle details...</p>
          ) : desiredVehicleError ? (
            <p className="text-red-600">{desiredVehicleError}</p>
          ) : desiredVehicle ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Year</dt>
                <dd className="font-medium">{desiredVehicle.year}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Make</dt>
                <dd className="font-medium">{desiredVehicle.make}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Model</dt>
                <dd className="font-medium">{desiredVehicle.model}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Stock Number</dt>
                <dd className="font-medium">{desiredVehicle.stockNumber}</dd>
              </div>
            </div>
          ) : (
            <p>No desired vehicle selected.</p>
          )}
        </div>
      )}

      {/* Photos Preview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Uploaded Photos ({formData.photos.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.photos.map((photo, index) => (
            <div key={index} className="relative">
              <img 
                src={photo.preview} 
                alt={`Vehicle photo ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <span className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Photos
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 flex items-center"
        >
          {isSubmitting ? (
            'Submitting...'
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Submit Request
            </>
          )}
        </button>
      </div>
    </div>
  );
}
}