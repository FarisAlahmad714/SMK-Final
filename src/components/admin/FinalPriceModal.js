'use client'
import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';

export default function FinalPriceModal({ isOpen, onClose, onSave, vehicle }) {
  const [finalPrice, setFinalPrice] = useState(vehicle?.price || '');
  const [customerId, setCustomerId] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modified fetchCustomers to get ALL customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Updated to include source param to get all customers
        const res = await fetch('/api/customers?includeAll=true');
        if (!res.ok) throw new Error('Failed to fetch customers');
        const data = await res.json();
        console.log('Fetched customers:', data); // Debug log
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Error fetching customers');
      }
    };
    fetchCustomers();
  }, []);

  // Calculate profit on the fly
  const calculateProfit = () => {
    const sale = parseFloat(finalPrice) || 0;
    const cost = parseFloat(vehicle?.cost) || 0;
    return sale - cost;
  };

  const profit = calculateProfit();
  const profitMargin = finalPrice ? ((profit / parseFloat(finalPrice)) * 100).toFixed(2) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) {
      setError('Please select a customer');
      return;
    }
    setLoading(true);

    try {
      // Find customer's test drives for this vehicle directly from the customers data
      const customerRes = await fetch('/api/customers');
      if (!customerRes.ok) throw new Error('Failed to fetch customer details');
      const customers = await customerRes.json();
      
      // Find the selected customer
      const selectedCustomer = customers.find(c => c.id === customerId);
      
      // Check if this customer has a website test drive for this vehicle
      const hasWebsiteTestDrive = selectedCustomer?.testDrives.some(drive => 
        drive.vehicleId === vehicle.id && drive.source === 'WEBSITE'
      );

      console.log('Customer test drives:', selectedCustomer?.testDrives);
      console.log('Has website test drive:', hasWebsiteTestDrive);

      // Create transaction with source info
      const transaction = {
        vehicleId: vehicle.id,
        customerId: customerId,
        salePrice: parseFloat(finalPrice),
        profit: profit,
        profitMargin: parseFloat(profitMargin),
        date: new Date().toISOString(),
        source: hasWebsiteTestDrive ? 'WEBSITE' : 'OTHER'
      };

      console.log('Sending transaction data:', transaction);

      const transactionRes = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      if (!transactionRes.ok) {
        const errorData = await transactionRes.json();
        throw new Error(errorData.error || 'Failed to create transaction');
      }

      await onSave(finalPrice, customerId);
      onClose();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError(error.message || 'Failed to complete sale');
    } finally {
      setLoading(false);
    }
};

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Complete Sale</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="mb-6 space-y-3 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between">
            <span className="text-gray-600">Listed Price:</span>
            <span className="font-semibold">${vehicle?.price?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Vehicle Cost:</span>
            <span className="font-semibold">${vehicle?.cost?.toLocaleString()}</span>
          </div>
          {finalPrice && (
            <>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="text-gray-600">Expected Profit:</span>
                <span className={profit >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  ${profit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Profit Margin:</span>
                <span className={profit >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {profitMargin}%
                </span>
              </div>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Final Sale Price ($)
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="w-full border rounded-md px-3 py-2"
              value={finalPrice}
              onChange={(e) => setFinalPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Customer
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full border rounded-md pl-10 pr-3 py-2 mb-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="max-h-40 overflow-y-auto border rounded-md">
              {filteredCustomers.length === 0 ? (
                <div className="p-3 text-gray-500 text-center">No customers found</div>
              ) : (
                filteredCustomers.map((customer) => (
                  <label
                    key={customer.id}
                    className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
                      customerId === customer.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="customer"
                      className="mr-3"
                      value={customer.id}
                      checked={customerId === customer.id}
                      onChange={(e) => setCustomerId(e.target.value)}
                    />
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.email} • {customer.phone}</div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Complete Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}