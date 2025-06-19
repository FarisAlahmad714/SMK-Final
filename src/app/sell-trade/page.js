'use client';
import { useState } from 'react';
import { ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import IntentSelection from './components/IntentSelection';
import VinStep from './components/VinStep';
import ConditionForm from './components/ConditionForm';
import PhotoUpload from './components/PhotoUpload';
import ReviewSubmit from './components/ReviewSubmit';

export default function SellTradePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    intent: '',
    vin: '',
    vehicleDetails: null,
    desiredVehicleId: '',
    ownership: '',
    condition: {
      color: '',
      mileage: '',
      transmission: '',
      packages: [],
      aftermarket: [],
      ownershipStatus: '',
      generalCondition: ''
    },
    photos: [],
    score: null,
    customerInfo: {
      name: '',
      email: '',
      phone: ''
    }
  });

  const totalSteps = 5;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = (step) => {
    switch (step) {
      case 1:
        return "Select Intent";
      case 2:
        return "Vehicle Information";
      case 3:
        return "Vehicle Condition";
      case 4:
        return "Upload Photos";
      case 5:
        return "Review & Submit";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-md shadow hover:bg-gray-50 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header & Progress */}
          <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {getStepTitle(currentStep)}
              </h1>
              <span className="text-sm font-medium text-gray-500">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {currentStep === 1 && (
              <IntentSelection 
                formData={formData}
                setFormData={setFormData}
                onNext={nextStep}
              />
            )}
            {currentStep === 2 && (
              <VinStep 
                formData={formData}
                setFormData={setFormData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 3 && (
              <ConditionForm 
                formData={formData}
                setFormData={setFormData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 4 && (
              <PhotoUpload 
                formData={formData}
                setFormData={setFormData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 5 && (
              <ReviewSubmit 
                formData={formData}
                onPrev={prevStep}
                onComplete={(data) => {
                  // Handle successful submission
                  // Could redirect to a success page or show a success message
                }}
              />
            )}
          </div>

          {/* Navigation Footer - Only show if not on first or last step */}
          {currentStep !== 1 && currentStep !== totalSteps && (
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}