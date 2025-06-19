// src/app/admin/vehicles/page.js
'use client'
import { useState } from 'react'
import VehicleManagement from '@/components/admin/VehicleManagement'

export default function AdminVehiclesPage() {
  return (
    <div className="p-6">
      <VehicleManagement />
    </div>
  )
}