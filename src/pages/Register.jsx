import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

const S = {
  green:      '#1db954',
  bg:         '#121212',
  surface:    '#000000',
  elevated:   '#282828',
  border:     '#282828',
  text:       '#ffffff',
  textMuted:  '#b3b3b3',
  textSubtle: '#6a6a6a',
}
const FONT = "'Circular','Inter','Helvetica Neue',Helvetica,Arial,sans-serif"

function Register() {
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })
    console.log('DATA:', data)
    console.log('ERROR:', error)
    setLoading(false)
    if (error) { alert(error.message); return }
    alert('Usuario registrado correctamente')
    navigate('/')
  }

  return (
    <div style={{
      background: S.bg,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONT,
    }}>
      <div style={{
        background: S.surface,
        borderRadius: '8px',
        width: '340px',
        overflow: 'hidden',
        border: `1px solid ${S.border}`,
      }}>

        {/* Titlebar */}
        <div style={{
          background: '#000',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          borderBottom: `1px solid #1a1a1a`,
          gap: '7px',
        }}>
          {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
            <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
          ))}
          <span style={{ color: S.textSubtle, fontSize: '12px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '31px' }}>
            Spotify — Crear cuenta
          </span>
        </div>

        {/* Logo + tagline */}
        <div style={{ textAlign: 'center', padding: '32px 24px 16px' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill={S.green} style={{ display: 'block', margin: '0 auto 12px' }}>
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <p style={{ color: S.text, fontSize: '22px', fontWeight: '700', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
            Crea tu cuenta
          </p>
          <p style={{ color: S.textMuted, fontSize: '13px', margin: 0 }}>Everyone loves music</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} style={{ padding: '8px 32px 24px' }}>
          <FormField label="Correo electrónico">
            <input
              type="email"
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </FormField>

          <FormField label="Contraseña">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </FormField>

          <button
            type="submit"
            disabled={loading}
            style={{ ...btnGreen, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Cargando...' : 'Registrarse'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ padding: '0 32px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: '#282828' }} />
          <span style={{ color: S.textSubtle, fontSize: '12px' }}>o</span>
          <div style={{ flex: 1, height: '1px', background: '#282828' }} />
        </div>

        {/* Footer */}
        <div style={{
          borderTop: `1px solid ${S.border}`,
          padding: '16px 32px',
          textAlign: 'center',
          background: '#0a0a0a',
        }}>
          <span style={{ color: S.textMuted, fontSize: '13px' }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color: S.text, textDecoration: 'underline', fontWeight: '700' }}>
              Inicia sesión
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Register

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'block',
        color: '#fff',
        fontSize: '13px',
        fontWeight: '700',
        marginBottom: '6px',
      }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  background: '#242424',
  border: '1px solid #535353',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '14px',
  padding: '10px 14px',
  outline: 'none',
  fontFamily: "'Circular','Inter','Helvetica Neue',Helvetica,Arial,sans-serif",
  boxSizing: 'border-box',
  caretColor: '#1db954',
}

const btnGreen = {
  width: '100%',
  background: '#1db954',
  border: 'none',
  borderRadius: '500px',
  color: '#000',
  fontSize: '14px',
  fontWeight: '700',
  padding: '14px 0',
  cursor: 'pointer',
  letterSpacing: '0.5px',
  marginBottom: '24px',
}