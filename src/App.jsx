import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import SpotifyMVP from "./pages/Home";
import UserPanel from './pages/UserPanerl'
import AdminPanel from './pages/AdminPanel'

function ProtectedRoute({ children, requiredRole }) {
  const [role, setRole] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      // Asumiendo que guardas el role en user_metadata o en una tabla profiles
      setRole(data?.user?.user_metadata?.role ?? 'user')
    })
  }, [])

  if (role !== requiredRole) return <p>Sin acceso</p>
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SpotifyMVP />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user"  element={<ProtectedRoute requiredRole="user"><UserPanel /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPanel /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App