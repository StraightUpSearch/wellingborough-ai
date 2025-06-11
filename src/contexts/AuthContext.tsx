'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'business' | 'admin'
  avatar?: string
  joinedDate: string
  preferences?: {
    favoriteBusinesses: string[]
    interestedEvents: string[]
    notifications: boolean
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
  updateUser: (userData: Partial<User>) => void
}

interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role?: 'user' | 'business'
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for MVP - matching seeded database users
const demoUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b2b9?w=150&h=150&fit=crop&crop=face',
    joinedDate: '2024-01-15',
    preferences: {
      favoriteBusinesses: ['1', '3'],
      interestedEvents: ['1', '6'],
      notifications: true
    }
  },
  {
    id: '2',
    name: 'Mike Thompson',
    email: 'mike@castleinn.co.uk',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    joinedDate: '2024-02-01',
    preferences: {
      favoriteBusinesses: [],
      interestedEvents: ['2'],
      notifications: true
    }
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma@techsolutions.co.uk',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    joinedDate: '2024-02-15',
    preferences: {
      favoriteBusinesses: [],
      interestedEvents: [],
      notifications: true
    }
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on load
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const savedUser = localStorage.getItem('wellingborough_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Error loading user session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkExistingSession()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        // For now, simulate successful login with demo user data
        const foundUser = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
        
        if (foundUser) {
          setUser(foundUser)
          localStorage.setItem('wellingborough_user', JSON.stringify(foundUser))
          setIsLoading(false)
          return { success: true }
        }
      }
      
      setIsLoading(false)
      return { success: false, error: 'Invalid email or password.' }
    } catch (error) {
      setIsLoading(false)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          confirmPassword: userData.confirmPassword,
          isBusinessOwner: userData.role === 'business'
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Create user object for frontend
        const newUser: User = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.isBusinessOwner ? 'business' : 'user',
          joinedDate: new Date().toISOString().split('T')[0],
          preferences: {
            favoriteBusinesses: [],
            interestedEvents: [],
            notifications: true
          }
        }

        setUser(newUser)
        localStorage.setItem('wellingborough_user', JSON.stringify(newUser))
        setIsLoading(false)
        return { success: true }
      } else {
        setIsLoading(false)
        return { success: false, error: result.error || 'Registration failed.' }
      }
    } catch (error) {
      setIsLoading(false)
      return { success: false, error: 'Registration failed. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('wellingborough_user')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('wellingborough_user', JSON.stringify(updatedUser))
    }
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 