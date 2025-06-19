// src/components/common/ImageUpload.js
'use client'
import { useState } from 'react'
import { Upload, X } from 'lucide-react'

export default function ImageUpload({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    const uploadedUrls = []

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!res.ok) throw new Error('Upload failed')

        const data = await res.json()
        uploadedUrls.push(data.url)
      }

      onChange([...images, ...uploadedUrls])
    } catch (error) {
      console.error('Upload error:', error)
      // You might want to show an error message to the user here
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (indexToRemove) => {
    onChange(images.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative group">
            <img
              src={url}
              alt={`Vehicle image ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full 
                       opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 
                         border-2 border-dashed border-gray-300 rounded-lg 
                         cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 text-gray-500 mb-2" />
            <p className="text-sm text-gray-500">
              {uploading ? 'Uploading...' : 'Click to upload vehicle images'}
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  )
}