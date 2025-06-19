// src/app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SMK Auto - Professional Dealership Management System',
  description: 'Complete auto dealership solution with inventory management, customer CRM, analytics dashboard, and automated communications. Built with Next.js, PostgreSQL, and modern web technologies.',
  keywords: 'auto dealership software, car dealership management, inventory management, CRM, analytics dashboard, Next.js application',
  authors: [{ name: 'SMK Auto Development Team' }],
  openGraph: {
    title: 'SMK Auto - Professional Dealership Management System',
    description: 'Turn-key auto dealership solution with advanced features and modern technology stack',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}