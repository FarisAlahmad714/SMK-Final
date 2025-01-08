// src/app/admin/sell-trade/page.js
'use client'
import { useState } from 'react'
import SellTradeTable from '@/components/admin/SellTradeTable'

export default function SellTradePage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sell/Trade Requests</h1>
      </div>
      <SellTradeTable />
    </div>
  )
}