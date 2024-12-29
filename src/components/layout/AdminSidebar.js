'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  Users, // Added for customer database
  LogOut 
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Vehicles',
      href: '/admin/vehicles',
      icon: Car,
    },
    {
      name: 'Test Drives',
      href: '/admin/test-drives',
      icon: Calendar,
    },
    {
      name: 'Customer Database',
      href: '/admin/customers',
      icon: Users,
    }
  ];

  const isActive = (path) => pathname === path;

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Clear the cookie
        document.cookie = 'admin-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        // Force a page reload to clear any cached data
        window.location.href = '/admin';
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="w-64 min-h-screen bg-white shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">SMK Auto Admin</h2>
      </div>

      <nav className="mt-6 flex flex-col">
        {navigation.map((item) => {
          const Icon = item.icon;
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
          );
        })}

        <button
          onClick={handleLogout}
          className="flex items-center px-6 py-3 mt-auto text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </nav>
    </div>
  );
}