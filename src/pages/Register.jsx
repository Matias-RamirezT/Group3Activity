import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

const TEXT_MUTED = "#888"
const TEXT_PRIMARY = "#e8e8e8"
const GREEN = "#4c9a2a"
const BORDER = "#3a3a3a"

function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

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
      background: "#1a1a1a",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Lucida Grande', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      <div style={{
        background: "#111",
        border: `1px solid ${BORDER}`,
        borderRadius: "4px",
        width: "320px",
        overflow: "hidden",
      }}>

        {/* Titlebar */}
        <div style={{
          background: "linear-gradient(to bottom, #3a3a3a, #2c2c2c)",
          padding: "0 10px",
          height: "28px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          borderBottom: "1px solid #111",
        }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
            <div key={i} style={{ width: "11px", height: "11px", borderRadius: "50%", background: c }} />
          ))}
          <span style={{ color: TEXT_MUTED, fontSize: "11px", marginLeft: "auto", marginRight: "auto" }}>
            Spotify — Crear cuenta
          </span>
        </div>

        {/* Logo */}
        <div style={{ textAlign: "center", padding: "24px 0 8px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            background: GREEN,
            borderRadius: "8px",
            fontSize: "26px",
          }}>🎵</div>
          <p style={{ color: TEXT_MUTED, fontSize: "11px", marginTop: "8px" }}>Everyone Loves Music</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} style={{ padding: "16px 24px 24px" }}>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", color: TEXT_MUTED, fontSize: "10px", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: TEXT_MUTED, fontSize: "10px", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...primaryBtnStyle, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? 'Cargando...' : 'Registrarse'}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          borderTop: `1px solid ${BORDER}`,
          padding: "10px 24px",
          display: "flex",
          justifyContent: "center",
          background: "#0e0e0e",
        }}>
          <span style={{ color: TEXT_MUTED, fontSize: "11px" }}>
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" style={{ color: GREEN, textDecoration: "none" }}>
              Ir al login
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Register

const inputStyle = {
  width: "100%",
  background: "#1a1a1a",
  border: "1px solid #555",
  borderRadius: "3px",
  color: "#e8e8e8",
  fontSize: "11px",
  padding: "6px 8px",
  outline: "none",
  fontFamily: "'Lucida Grande', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  boxSizing: "border-box",
}

const primaryBtnStyle = {
  width: "100%",
  background: "linear-gradient(to bottom, #5bb030, #4c9a2a)",
  border: "1px solid #3d7a22",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "12px",
  fontWeight: "bold",
  padding: "7px 0",
  cursor: "pointer",
  fontFamily: "'Lucida Grande', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  letterSpacing: "0.02em",
}