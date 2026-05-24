import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    console.log('DATA:', data)
    console.log('ERROR:', error)

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    alert('Usuario registrado correctamente')

    navigate('/')
  }

  return (
    <div>
      <h1>Registro</h1>

      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Registrarse'}
        </button>
      </form>

      <br />

      <Link to="/">Ir al login</Link>
    </div>
  )
}

export default Register