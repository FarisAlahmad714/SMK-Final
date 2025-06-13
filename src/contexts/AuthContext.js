'use client'
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = async (email, password) => {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@smkauto.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    
    if (email === adminEmail && password === adminPassword) {
      setUser({ email })
      return true
    }
    return false
  }

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      if (response.ok) {
        setUser(null)
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
