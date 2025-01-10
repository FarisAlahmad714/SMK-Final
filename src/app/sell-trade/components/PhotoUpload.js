// src/app/sell-trade/components/PhotoUpload.js

'use client';
import { useState, useRef } from 'react';
import { ChevronLeft, Upload, X, Check, AlertCircle } from 'lucide-react';

export default function PhotoUpload({ formData, setFormData, onNext, onPrev }) {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const MIN_PHOTOS = 8;
  const MAX_PHOTOS = 10;
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const photoRequirements = [
    { title: 'Front View', description: 'Straight on, entire car visible' },
    { title: 'Rear View', description: 'Straight on, entire car visible' },
    { title: 'Driver Side', description: 'Full length of vehicle' },
    { title: 'Passenger Side', description: 'Full length of vehicle' },
    { title: 'Interior Dashboard', description: 'Including steering wheel and gauges' },
    { title: 'Front Seats', description: 'Showing condition of seats' },
    { title: 'Rear Seats', description: 'If applicable' },
    { title: 'Odometer', description: 'Clear reading of current mileage' },
    // Add more required photos as needed
  ];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setError('');

    // Validate number of files
    if (uploadedPhotos.length + files.length > MAX_PHOTOS) {
      setError(`You can upload a maximum of ${MAX_PHOTOS} photos.`);
      return;
    }

    // Process each file
    const validFiles = files.filter(file => {
      // Check file size
      if (file.size > MAX_SIZE) {
        setError('Some files were too large (max 5MB each).');
        return false;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.');
        return false;
      }

      return true;
    });

    // Add previews for valid files
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedPhotos(prev => [...prev, {
          file,
          preview: e.target.result,
          name: file.name,
          status: 'uploaded'
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (uploadedPhotos.length < MIN_PHOTOS) {
      setError(`Please upload at least ${MIN_PHOTOS} photos.`);
      return;
    }

    setIsUploading(true);
    try {
      // Here we'll add the AI assessment integration later
      setFormData(prev => ({
        ...prev,
        photos: uploadedPhotos
      }));
      onNext();
    } catch (err) {
      setError('Error processing photos. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Vehicle Photos
        </h2>
        <p className="text-gray-600">
          Please provide clear photos of your vehicle. Upload between {MIN_PHOTOS} and {MAX_PHOTOS} photos.
        </p>
      </div>

      {/* Required Photos Checklist */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-3">Required Photos:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {photoRequirements.map((req, index) => (
            <div 
              key={index}
              className="flex items-start gap-2"
            >
              {uploadedPhotos.length > index ? (
                <Check className="w-5 h-5 text-green-500 mt-1" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-1" />
              )}
              <div>
                <p className="font-medium">{req.title}</p>
                <p className="text-sm text-gray-500">{req.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      <div 
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
        />
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">
          Click or drag photos here to upload
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Upload between {MIN_PHOTOS} and {MAX_PHOTOS} photos, 5MB each
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Photo Previews */}
      {uploadedPhotos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedPhotos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={photo.preview}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isUploading || uploadedPhotos.length < MIN_PHOTOS}
          className={`px-6 py-2 rounded-md flex items-center ${
            isUploading || uploadedPhotos.length < MIN_PHOTOS
              ? 'bg-blue-300 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isUploading ? 'Processing...' : 'Continue to Review'}
        </button>
      </div>
    </div>
  );
}
