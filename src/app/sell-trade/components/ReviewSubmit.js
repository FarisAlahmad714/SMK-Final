// src/app/sell-trade/components/ReviewSubmit.js
'use client';
import { useState } from 'react';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReviewSubmit({ formData, onPrev }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/sell-trade/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSuccess(true);
      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
      
    } catch (err) {
      setError('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Intent Type */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Request Type</h3>
        <p className="font-medium capitalize">{formData.intent} Vehicle</p>
      </div>

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