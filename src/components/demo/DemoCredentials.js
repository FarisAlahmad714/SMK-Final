// src/components/demo/DemoCredentials.js
'use client'
import { useState } from 'react'
import { Eye, EyeOff, Copy, CheckCircle, User, Lock } from 'lucide-react'

export default function DemoCredentials() {
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState({ email: false, password: false })

  const credentials = {
    email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || '',
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || ''
  }

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(prev => ({ ...prev, [type]: true }))
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [type]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-sm z-50">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <User className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Demo Admin Access</h3>
          <p className="text-xs text-gray-500">For evaluation purposes</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="flex items-center bg-gray-50 rounded-md border">
            <input
              type="text"
              value={credentials.email}
              readOnly
              className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-900"
            />
            <button
              onClick={() => copyToClipboard(credentials.email, 'email')}
              className="px-3 py-2 text-gray-400 hover:text-gray-600"
            >
              {copied.email ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="flex items-center bg-gray-50 rounded-md border">
            <input
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              readOnly
              className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-900"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="px-2 py-2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => copyToClipboard(credentials.password, 'password')}
              className="px-3 py-2 text-gray-400 hover:text-gray-600"
            >
              {copied.password ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <a
          href="/admin"
          className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Access Admin Dashboard
        </a>
      </div>
      
      <div className="mt-3 text-xs text-gray-500 text-center">
        🔒 Demo environment only
      </div>
    </div>
  )
}