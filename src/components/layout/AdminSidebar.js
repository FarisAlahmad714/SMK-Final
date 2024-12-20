'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  LogOut 
} from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Vehicles',
      href: '/admin/vehicles',
      icon: Car
    },
    {
      name: 'Test Drives',
      href: '/admin/test-drives',
      icon: Calendar
    }
  ]

  const isActive = (path) => pathname === path

  return (
    <div className="w-64 min-h-screen bg-white shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">
          SMK Auto Admin
        </h2>
      </div>
      
      <nav className="mt-6">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}

        <button
          onClick={() => {
            // Will implement logout later
            console.log('Logging out')
          }}
          className="flex items-center px-6 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 w-full"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </nav>
    </div>
  )
}