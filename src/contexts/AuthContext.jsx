import { createContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      setToken(session?.access_token || null)
      setLoading(false)
    })
  }, [])

  const register = async (email, password, name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }
        }
      })

      if (error) throw new Error(error.message)

      setUser(data.user)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw new Error(error.message)

      setUser(data.user)
      setToken(data.session?.access_token)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
