'use client'
import React, { useState, useEffect } from 'react'
import { DollarSign, Calendar, Users, Car, Eye, X, Trash2, Download } from 'lucide-react'
import FinalPriceModal from '../../../components/admin/FinalPriceModal'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions?limit=100')
      if (!res.ok) throw new Error('Failed to fetch transactions')
      const data = await res.json()
      setTransactions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedTransaction(null)
    setIsModalOpen(false)
  }

  const downloadCSV = () => {
    // Format transactions for CSV
    const csvData = transactions.map(tx => ({
      'Date': new Date(tx.date).toLocaleDateString(),
      'Vehicle': `${tx.vehicle.year} ${tx.vehicle.make} ${tx.vehicle.model}`,
      'Stock Number': tx.vehicle.stockNumber,
      'Customer': tx.customer.name,
      'Customer Email': tx.customer.email,
      'Customer Phone': tx.customer.phone,
      'Sale Price': tx.salePrice.toFixed(2),
      'Vehicle Cost': tx.vehicle.cost.toFixed(2),
      'Profit': tx.profit.toFixed(2),
      'Profit Margin': `${tx.profitMargin.toFixed(2)}%`
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0]);
    const csvString = [
      headers.join(','), // Header row
      ...csvData.map(row => 
        headers.map(header => 
          // Handle commas in data by wrapping in quotes
          `"${String(row[header]).replace(/"/g, '""')}"` // Escape existing quotes
        ).join(',')
      )
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `SMK_Auto_Transactions_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-6">Loading transactions...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Vehicle</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Sale Price</th>
              <th className="py-2 px-4 border-b">Cost</th>
              <th className="py-2 px-4 border-b">Profit</th>
              <th className="py-2 px-4 border-b">Profit Margin</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {tx.vehicle.make} {tx.vehicle.model} ({tx.vehicle.year})
                </td>
                <td className="py-2 px-4 border-b">
                  {tx.customer.name}
                </td>
                <td className="py-2 px-4 border-b text-right">
                  ${tx.salePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-4 border-b text-right">
                  ${tx.vehicle.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-4 border-b text-right">
                  ${tx.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-4 border-b text-right">
                  {tx.profitMargin.toFixed(2)}%
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(tx.date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => openModal(tx)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {isModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Transaction Details</h2>
              <button onClick={closeModal}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">Vehicle Details</h3>
                  <p>{selectedTransaction.vehicle.make} {selectedTransaction.vehicle.model}</p>
                  <p>Year: {selectedTransaction.vehicle.year}</p>
                  <p>Stock #: {selectedTransaction.vehicle.stockNumber}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700">Customer Details</h3>
                  <p>{selectedTransaction.customer.name}</p>
                  <p>Email: {selectedTransaction.customer.email}</p>
                  <p>Phone: {selectedTransaction.customer.phone}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Sale Price:</span>
                  <span className="font-medium">
                    ${selectedTransaction.salePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Vehicle Cost:</span>
                  <span className="font-medium">
                    ${selectedTransaction.vehicle.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Profit:</span>
                  <span className="font-medium text-green-600">
                    ${selectedTransaction.profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Profit Margin:</span>
                  <span className="font-medium text-green-600">
                    {selectedTransaction.profitMargin.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Transaction Date</h3>
                <p>{new Date(selectedTransaction.date).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}