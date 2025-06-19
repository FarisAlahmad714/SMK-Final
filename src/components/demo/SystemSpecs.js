// src/components/demo/SystemSpecs.js
'use client'
import { Database, Server, Code, Smartphone, Mail, BarChart3 } from 'lucide-react'

export default function SystemSpecs() {
  const specs = [
    {
      category: 'Frontend',
      icon: <Code className="w-6 h-6 text-blue-600" />,
      items: [
        'Next.js 15 with App Router',
        'React 19 with Hooks',
        'Tailwind CSS for styling',
        'Responsive design system',
        'Component-based architecture'
      ]
    },
    {
      category: 'Backend',
      icon: <Server className="w-6 h-6 text-green-600" />,
      items: [
        'Next.js API Routes',
        'RESTful API design',
        'Authentication middleware',
        'File upload handling',
        'Email integration'
      ]
    },
    {
      category: 'Database',
      icon: <Database className="w-6 h-6 text-purple-600" />,
      items: [
        'PostgreSQL database',
        'Prisma ORM',
        'Type-safe queries',
        'Migration system',
        'Seeded demo data'
      ]
    },
    {
      category: 'Features',
      icon: <BarChart3 className="w-6 h-6 text-orange-600" />,
      items: [
        'Real-time analytics dashboard',
        'Customer relationship management',
        'Inventory management system',
        'Appointment scheduling',
        'Automated email workflows'
      ]
    },
    {
      category: 'UI/UX',
      icon: <Smartphone className="w-6 h-6 text-pink-600" />,
      items: [
        'Mobile-first responsive design',
        'Professional admin interface',
        'Loading states and animations',
        'Toast notifications',
        'Accessibility compliant'
      ]
    },
    {
      category: 'Integration',
      icon: <Mail className="w-6 h-6 text-red-600" />,
      items: [
        'SMTP email service',
        'VIN decoder API ready',
        'Google Analytics ready',
        'Environment configuration',
        'Deployment ready'
      ]
    }
  ]

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Technical Specifications</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Built with enterprise-grade technologies and modern development practices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specs.map((spec, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                {spec.icon}
                <h3 className="ml-3 text-lg font-semibold text-gray-900">{spec.category}</h3>
              </div>
              <ul className="space-y-2">
                {spec.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold text-center mb-8">Performance & Scalability</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">&lt;200ms</div>
              <div className="text-sm text-gray-300">Average Response Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">99.5%</div>
              <div className="text-sm text-gray-300">Expected Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">1000+</div>
              <div className="text-sm text-gray-300">Vehicles Supported</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-2">100%</div>
              <div className="text-sm text-gray-300">Customizable</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}