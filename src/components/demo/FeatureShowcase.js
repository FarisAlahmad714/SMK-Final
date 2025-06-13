// src/components/demo/FeatureShowcase.js
'use client'
import { BarChart3, Users, Car, Calendar, Mail, TrendingUp, Shield, Zap } from 'lucide-react'

export default function FeatureShowcase() {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: 'Advanced Analytics',
      description: 'Real-time dashboard with sales metrics, profit tracking, and business intelligence',
      highlight: 'ROI Tracking'
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: 'Customer CRM', 
      description: 'Complete customer management with lead tracking and communication history',
      highlight: 'Lead Generation'
    },
    {
      icon: <Car className="w-8 h-8 text-purple-600" />,
      title: 'Inventory Management',
      description: 'Full vehicle lifecycle management from acquisition to sale',
      highlight: 'Profit Optimization'
    },
    {
      icon: <Calendar className="w-8 h-8 text-orange-600" />,
      title: 'Appointment System',
      description: 'Automated test drive scheduling with conflict prevention and reminders',
      highlight: 'Automation'
    },
    {
      icon: <Mail className="w-8 h-8 text-red-600" />,
      title: 'Email Automation',
      description: 'Professional email templates for all customer touchpoints',
      highlight: 'Professional Touch'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-teal-600" />,
      title: 'Revenue Tracking',
      description: 'Detailed financial analytics with profit margins and cost analysis',
      highlight: 'Financial Insights'
    }
  ]

  const techStack = [
    { name: 'Next.js 15', description: 'Modern React framework' },
    { name: 'PostgreSQL', description: 'Enterprise database' },
    { name: 'Prisma ORM', description: 'Type-safe database access' },
    { name: 'Tailwind CSS', description: 'Responsive design system' },
    { name: 'Email Integration', description: 'Automated communications' },
    { name: 'Real-time Dashboard', description: 'Live business metrics' }
  ]

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-4">
            <Zap className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">Complete Business Solution</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Run a Modern Auto Dealership
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional-grade system that handles leads, inventory, customers, and analytics - all in one platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                {feature.icon}
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    {feature.highlight}
                  </span>
                </div>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full mb-4">
              <Shield className="w-4 h-4 text-gray-600 mr-2" />
              <span className="text-gray-800 font-medium">Built with Modern Technology</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Enterprise-Grade Tech Stack</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">{tech.name}</h4>
                  <p className="text-sm text-gray-600">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Value */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready for Immediate Deployment</h3>
            <p className="text-xl mb-6 opacity-90">
              Turn-key solution that can be customized and deployed for any auto dealership
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-80">System Availability</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm opacity-80">Customizable Branding</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">∞</div>
                <div className="text-sm opacity-80">Scalable Growth</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}