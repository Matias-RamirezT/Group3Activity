import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

// ── Tokens visuales ────────────────────────────────────────────
const GREEN = '#4c9a2a'
const DARK_BG = '#1a1a1a'
const SIDEBAR_BG = '#111111'
const PANEL_BG = '#2a2a2a'
const BORDER = '#3a3a3a'
const TEXT_PRIMARY = '#e8e8e8'
const TEXT_MUTED = '#888'
const TEXT_LABEL = '#aaa'
const FONT = "'Lucida Grande', 'Helvetica Neue', Helvetica, Arial, sans-serif"

// ── Datos de muestra ───────────────────────────────────────────
const HISTORY = [
  { title: 'Uninvited',           artist: 'Alanis Morissette', playedAt: 'Hoy, 10:42' },
  { title: 'Creep',               artist: 'Radiohead',          playedAt: 'Hoy, 09:15' },
  { title: 'One',                 artist: 'U2',                 playedAt: 'Ayer, 22:30' },
  { title: 'No Surprises',        artist: 'Radiohead',          playedAt: 'Ayer, 21:00' },
  { title: 'With or Without You', artist: 'U2',                 playedAt: '23 may, 18:45' },
]

const PLAYLISTS = [
  { name: 'Mis favoritas',   tracks: 12, updated: 'Hoy' },
  { name: 'Para el gym',     tracks: 8,  updated: 'Ayer' },
  { name: 'Chill vibes',     tracks: 20, updated: '20 may' },
]

const STATS = [
  { label: 'Canciones escuchadas', value: '284' },
  { label: 'Artistas distintos',   value: '47'  },
  { label: 'Horas totales',        value: '18h' },
  { label: 'Playlists creadas',    value: '3'   },
]

// ── Componente principal ───────────────────────────────────────
export default function UserPanel() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('perfil')
  const [user, setUser]           = useState(null)
  const [newPlaylist, setNewPlaylist] = useState('')
  const [playlists, setPlaylists] = useState(PLAYLISTS)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const addPlaylist = () => {
    if (!newPlaylist.trim()) return
    setPlaylists(prev => [...prev, { name: newPlaylist.trim(), tracks: 0, updated: 'Ahora' }])
    setNewPlaylist('')
  }

  const removePlaylist = (idx) => setPlaylists(prev => prev.filter((_, i) => i !== idx))

  return (
    <div style={{ background: DARK_BG, minHeight: '100vh', fontFamily: FONT, fontSize: '11px', color: TEXT_PRIMARY }}>

      {/* ── Titlebar ── */}
      <div style={{ background: 'linear-gradient(to bottom,#3a3a3a,#2c2c2c)', padding: '0 10px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #111' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {['#ff5f57','#febc2e','#28c840'].map((c,i) => (
            <div key={i} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />
          ))}
        </div>
        <span style={{ color: TEXT_MUTED, fontSize: '11px' }}>Spotify — Panel de usuario</span>
        <button onClick={handleLogout} style={sysBtnStyle}>Cerrar sesión</button>
      </div>

      {/* ── Layout ── */}
      <div style={{ display: 'flex', height: 'calc(100vh - 28px)' }}>

        {/* ── Sidebar ── */}
        <div style={{ width: '180px', background: SIDEBAR_BG, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', padding: '12px 0', flexShrink: 0 }}>
          {/* Avatar */}
          <div style={{ textAlign: 'center', padding: '0 12px 16px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2a2a2a', border: `1px solid #555`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', margin: '0 auto 6px' }}>👤</div>
            <p style={{ color: TEXT_PRIMARY, fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email?.split('@')[0] ?? 'Usuario'}
            </p>
            <p style={{ color: TEXT_MUTED, fontSize: '10px', marginTop: '2px' }}>Plan gratuito</p>
          </div>

          {/* Nav */}
          <div style={{ marginTop: '8px' }}>
            <SideLabel>MI CUENTA</SideLabel>
            {[
              { id: 'perfil',      icon: '👤', label: 'Mi perfil'   },
              { id: 'historial',   icon: '🕘', label: 'Historial'   },
              { id: 'playlists',   icon: '🎵', label: 'Playlists'   },
              { id: 'estadisticas',icon: '📊', label: 'Estadísticas'},
            ].map(item => (
              <NavItem key={item.id} active={activeTab === item.id} onClick={() => setActiveTab(item.id)}>
                <span style={{ fontSize: '13px' }}>{item.icon}</span> {item.label}
              </NavItem>
            ))}
          </div>
        </div>

        {/* ── Contenido ── */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>

          {/* PERFIL */}
          {activeTab === 'perfil' && (
            <Section title="Mi perfil">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '480px' }}>
                <Field label="Correo electrónico" value={user?.email ?? '—'} />
                <Field label="ID de usuario"       value={user?.id?.slice(0,8) + '...' ?? '—'} />
                <Field label="Creado el"           value={user?.created_at ? new Date(user.created_at).toLocaleDateString('es-CO') : '—'} />
                <Field label="Último acceso"       value={user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('es-CO') : '—'} />
              </div>
              <div style={{ marginTop: '20px', padding: '12px 16px', background: PANEL_BG, border: `1px solid ${BORDER}`, borderRadius: '3px', maxWidth: '480px' }}>
                <p style={{ color: TEXT_MUTED, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Cambiar contraseña</p>
                <input type="password" placeholder="Nueva contraseña" style={inputStyle} />
                <button style={{ ...primaryBtnStyle, marginTop: '8px', padding: '5px 16px', width: 'auto' }}>Actualizar</button>
              </div>
            </Section>
          )}

          {/* HISTORIAL */}
          {activeTab === 'historial' && (
            <Section title="Historial de reproducción">
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', padding: '5px 12px', background: 'linear-gradient(to bottom,#333,#2a2a2a)', color: TEXT_MUTED, fontSize: '10px', borderBottom: `1px solid ${BORDER}` }}>
                  <span>Canción</span><span>Artista</span><span>Reproducido</span>
                </div>
                {HISTORY.map((h, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', padding: '6px 12px', background: i % 2 === 0 ? 'transparent' : '#1f1f1f', borderBottom: `1px solid ${BORDER}`, fontSize: '11px' }}>
                    <span style={{ color: TEXT_PRIMARY }}>{h.title}</span>
                    <span style={{ color: TEXT_LABEL }}>{h.artist}</span>
                    <span style={{ color: TEXT_MUTED }}>{h.playedAt}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* PLAYLISTS */}
          {activeTab === 'playlists' && (
            <Section title="Mis playlists">
              {/* Crear */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', maxWidth: '400px' }}>
                <input
                  value={newPlaylist}
                  onChange={e => setNewPlaylist(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addPlaylist()}
                  placeholder="Nombre de nueva playlist..."
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button onClick={addPlaylist} style={primaryBtnStyle}>+ Crear</button>
              </div>

              <div style={{ border: `1px solid ${BORDER}`, borderRadius: '3px', overflow: 'hidden', maxWidth: '500px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 40px', padding: '5px 12px', background: 'linear-gradient(to bottom,#333,#2a2a2a)', color: TEXT_MUTED, fontSize: '10px', borderBottom: `1px solid ${BORDER}` }}>
                  <span>Nombre</span><span>Canciones</span><span>Actualizada</span><span></span>
                </div>
                {playlists.map((pl, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 40px', padding: '6px 12px', background: i % 2 === 0 ? 'transparent' : '#1f1f1f', borderBottom: `1px solid ${BORDER}`, alignItems: 'center' }}>
                    <span style={{ color: GREEN }}>♪ {pl.name}</span>
                    <span style={{ color: TEXT_MUTED }}>{pl.tracks} tracks</span>
                    <span style={{ color: TEXT_MUTED }}>{pl.updated}</span>
                    <button onClick={() => removePlaylist(i)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '12px' }}>✕</button>
                  </div>
                ))}
                {playlists.length === 0 && (
                  <div style={{ padding: '16px', textAlign: 'center', color: TEXT_MUTED }}>No tienes playlists aún</div>
                )}
              </div>
            </Section>
          )}

          {/* ESTADÍSTICAS */}
          {activeTab === 'estadisticas' && (
            <Section title="Estadísticas de escucha">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px', maxWidth: '400px', marginBottom: '20px' }}>
                {STATS.map((s, i) => (
                  <div key={i} style={{ background: PANEL_BG, border: `1px solid ${BORDER}`, borderRadius: '3px', padding: '14px 16px' }}>
                    <p style={{ color: TEXT_MUTED, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{s.label}</p>
                    <p style={{ color: TEXT_PRIMARY, fontSize: '22px', fontWeight: 'bold' }}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: PANEL_BG, border: `1px solid ${BORDER}`, borderRadius: '3px', padding: '14px 16px', maxWidth: '400px' }}>
                <p style={{ color: TEXT_MUTED, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Artistas más escuchados</p>
                {[['Radiohead','████████░░','78%'],['U2','██████░░░░','61%'],['Alanis Morissette','████░░░░░░','42%']].map(([name, bar, pct]) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ color: TEXT_LABEL, width: '140px', fontSize: '11px' }}>{name}</span>
                    <span style={{ color: GREEN, fontFamily: 'monospace', fontSize: '11px', letterSpacing: '-1px' }}>{bar}</span>
                    <span style={{ color: TEXT_MUTED, fontSize: '10px' }}>{pct}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Subcomponentes ─────────────────────────────────────────────
function SideLabel({ children }) {
  return <p style={{ color: '#666', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 'bold', padding: '6px 14px 2px' }}>{children}</p>
}

function NavItem({ active, onClick, children }) {
  return (
    <div onClick={onClick} style={{ padding: '4px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', background: active ? 'linear-gradient(to bottom,#4c9a2a,#3d7a22)' : 'transparent', color: active ? '#fff' : '#bbb', borderLeft: active ? `2px solid #6bcc44` : '2px solid transparent', margin: active ? '0 2px' : '0', borderRadius: active ? '2px' : '0', fontSize: '11px' }}>
      {children}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <div style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: '8px', marginBottom: '16px' }}>
        <h2 style={{ color: TEXT_PRIMARY, fontSize: '13px', fontWeight: 'bold', margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div style={{ background: PANEL_BG, border: `1px solid ${BORDER}`, borderRadius: '3px', padding: '10px 12px' }}>
      <p style={{ color: TEXT_MUTED, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</p>
      <p style={{ color: TEXT_PRIMARY, fontSize: '11px', wordBreak: 'break-all' }}>{value}</p>
    </div>
  )
}

// ── Estilos compartidos ────────────────────────────────────────
const inputStyle = {
  background: '#1a1a1a', border: '1px solid #555', borderRadius: '3px',
  color: TEXT_PRIMARY, fontSize: '11px', padding: '5px 8px', outline: 'none',
  fontFamily: FONT, width: '100%', boxSizing: 'border-box',
}

const primaryBtnStyle = {
  background: 'linear-gradient(to bottom,#5bb030,#4c9a2a)', border: '1px solid #3d7a22',
  borderRadius: '3px', color: '#fff', fontSize: '11px', fontWeight: 'bold',
  padding: '5px 14px', cursor: 'pointer', fontFamily: FONT, whiteSpace: 'nowrap',
}

const sysBtnStyle = {
  background: 'linear-gradient(to bottom,#4a4a4a,#333)', border: '1px solid #555',
  borderRadius: '3px', color: TEXT_PRIMARY, cursor: 'pointer',
  padding: '2px 10px', fontSize: '10px', fontFamily: FONT,
}
