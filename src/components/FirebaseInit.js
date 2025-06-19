'use client'
import { useEffect } from 'react'
import { analytics, performance } from '../lib/firebase'

export default function FirebaseInit() {
  useEffect(() => {
    // Firebase is automatically initialized when imported
    // This component ensures client-side initialization
    if (typeof window !== 'undefined') {
      console.log('🔥 Firebase Analytics & Performance initialized for SMK Auto')
      
      // Optional: Track initial page load
      if (analytics) {
        import('firebase/analytics').then(({ logEvent }) => {
          logEvent(analytics, 'page_view', {
            page_title: 'SMK Auto Dealership',
            page_location: window.location.href,
            dealership: 'SMK_Auto'
          })
        })
      }
    }
  }, [])

  // This component doesn't render anything
  return null
}