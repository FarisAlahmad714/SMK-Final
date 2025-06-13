'use client';
import { X, Calendar, Tag } from 'lucide-react';

export default function CustomerDetailsModal({ customer, onClose, onUpdate }) {
  // Ensure customer exists before trying to access properties
  if (!customer) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h2 className="text-xl font-bold">Customer Details</h2>
              {/* Only show sell/trade badge if the property exists and is true */}
              {customer?.sellTradeRequest === true && (
                <span className="ml-3 flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  <Tag className="w-4 h-4 mr-1" />
                  Sell/Trade Request
                </span>
              )}
            </div>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Source</p>
                  <p className="font-medium">{customer.source || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Test Drives */}
            <div>
              <h3 className="font-semibold mb-3">Test Drive History</h3>
              {customer.testDrives?.length > 0 ? (
                <div className="space-y-3">
                  {customer.testDrives.map((drive) => (
                    <div key={drive.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">
                            {drive.vehicle?.year} {drive.vehicle?.make} {drive.vehicle?.model}
                          </p>
                          <div className="mt-1 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(drive.date).toLocaleDateString()} at {drive.time}
                            </span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          drive.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          drive.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {drive.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  No test drives scheduled yet
                </div>
              )}
            </div>

            {/* Notes Section */}
            {customer.notes && (
              <div>
                <h3 className="font-semibold mb-3">Notes</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{customer.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}