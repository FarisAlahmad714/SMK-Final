'use client';
import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
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
    customerInfo: {  // Add customer info to formData
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

  // Helper function to get step title
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
    <div className="max-w-4xl mx-auto p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium">
            {getStepTitle(currentStep)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Steps */}
      <div className="bg-white rounded-lg shadow-lg p-6">
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
    </div>
  );
}