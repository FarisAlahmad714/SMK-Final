'use client'
import { LayoutDashboard, Car, Calendar,Users, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      if (response.ok) {
        document.cookie = 'admin-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        router.push('/admin') // Redirect to login page
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  // Only show sidebar if not on login page
  if (pathname === '/admin') {
    return children
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900">SMK Auto Admin</h2>
        </div>

        <nav className="mt-6">
          <Link
            href="/admin/dashboard"
            className={`flex items-center px-6 py-3 ${
              pathname === '/admin/dashboard'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>

          <Link
            href="/admin/vehicles"
            className={`flex items-center px-6 py-3 ${
              pathname === '/admin/vehicles'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            <Car className="w-5 h-5 mr-3" />
            Vehicles
          </Link>

          <Link
            href="/admin/test-drives"
            className={`flex items-center px-6 py-3 ${
              pathname === '/admin/test-drives'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            <Calendar className="w-5 h-5 mr-3" />
            Test Drives
          </Link>
          <Link
            href="/admin/customers"
            className={`flex items-center px-6 py-3 ${
              pathname === '/admin/customers'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Customers
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">{children}</main>
    </div>
  )
}
