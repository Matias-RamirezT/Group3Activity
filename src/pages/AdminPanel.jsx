import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

// ── Tokens visuales ────────────────────────────────────────────
const GREEN = '#4c9a2a'
const DARK_BG = '#1a1a1a'
const SIDEBAR_BG = '#111111'
const PANEL_BG = '#2a2a2a'
const BORDER = '#3a3a3a'
const TEXT_PRIMARY = '#e8e8e8'
const TEXT_MUTED = '#888'
const TEXT_LABEL = '#aaa'
const RED = '#c0392b'
const FONT = "'Lucida Grande', 'Helvetica Neue', Helvetica, Arial, sans-serif"

// ── Datos de muestra ───────────────────────────────────────────
const MOCK_USERS = [
  { id: 'u1', email: 'carlos@ejemplo.com',  role: 'user',  joined: '2024-01-10', status: 'activo'   },
  { id: 'u2', email: 'ana@ejemplo.com',     role: 'user',  joined: '2024-02-14', status: 'activo'   },
  { id: 'u3', email: 'luis@ejemplo.com',    role: 'admin', joined: '2023-11-05', status: 'activo'   },
  { id: 'u4', email: 'maria@ejemplo.com',   role: 'user',  joined: '2024-03-22', status: 'inactivo' },
]

const MOCK_SONGS = [
  { id: 's1', title: 'Uninvited',           artist: 'Alanis Morissette', duration: '4:18', plays: 1240 },
  { id: 's2', title: 'Creep',               artist: 'Radiohead',          duration: '3:56', plays: 987  },
  { id: 's3', title: 'One',                 artist: 'U2',                 duration: '4:36', plays: 845  },
  { id: 's4', title: 'No Surprises',        artist: 'Radiohead',          duration: '3:48', plays: 723  },
  { id: 's5', title: 'With or Without You', artist: 'U2',                 duration: '4:56', plays: 612  },
]

const MOCK_PLAYLISTS = [
  { id: 'p1', name: 'Top 2006',      owner: 'carlos@ejemplo.com', tracks: 15 },
  { id: 'p2', name: 'Para el gym',   owner: 'ana@ejemplo.com',    tracks: 8  },
  { id: 'p3', name: 'Chill vibes',   owner: 'ana@ejemplo.com',    tracks: 20 },
  { id: 'p4', name: 'Rock clásico',  owner: 'luis@ejemplo.com',   tracks: 12 },
]

const GLOBAL_STATS = [
  { label: 'Usuarios totales',       value: '4'    },
  { label: 'Canciones en catálogo',  value: '5'    },
  { label: 'Reproducciones totales', value: '4.4K' },
  { label: 'Playlists creadas',      value: '4'    },
]

// ── Componente principal ───────────────────────────────────────
export default function AdminPanel() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab]   = useState('stats')
  const [adminUser, setAdminUser]   = useState(null)
  const [users, setUsers]           = useState(MOCK_USERS)
  const [songs, setSongs]           = useState(MOCK_SONGS)
  const [playlists, setPlaylists]   = useState(MOCK_PLAYLISTS)

  // Formulario nueva canción
  const [newSong, setNewSong] = useState({ title: '', artist: '', duration: '' })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setAdminUser(data?.user ?? null))
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const deleteUser    = (id) => setUsers(prev => prev.filter(u => u.id !== id))
  const deleteSong    = (id) => setSongs(prev => prev.filter(s => s.id !== id))
  const deletePlaylist = (id) => setPlaylists(prev => prev.filter(p => p.id !== id))

  const toggleRole = (id) =>
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u))

  const addSong = () => {
    if (!newSong.title.trim() || !newSong.artist.trim()) return
    setSongs(prev => [...prev, { id: `s${Date.now()}`, ...newSong, plays: 0 }])
    setNewSong({ title: '', artist: '', duration: '' })
  }

  return (
    <div style={{ background: DARK_BG, minHeight: '100vh', fontFamily: FONT, fontSize: '11px', color: TEXT_PRIMARY }}>

      {/* ── Titlebar ── */}
      <div style={{ background: 'linear-gradient(to bottom,#3a3a3a,#2c2c2c)', padding: '0 10px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #111' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {['#ff5f57','#febc2e','#28c840'].map((c,i) => (
            <div key={i} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: '#3d7a22', color: '#fff', fontSize: '9px', padding: '1px 6px', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin</span>
          <span style={{ color: TEXT_MUTED, fontSize: '11px' }}>Spotify — Panel de administración</span>
        </div>
        <button onClick={handleLogout} style={sysBtnStyle}>Cerrar sesión</button>
      </div>

      {/* ── Layout ── */}
      <div style={{ display: 'flex', height: 'calc(100vh - 28px)' }}>

        {/* ── Sidebar ── */}
        <div style={{ width: '180px', background: SIDEBAR_BG, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', padding: '12px 0', flexShrink: 0 }}>
          <div style={{ textAlign: 'center', padding: '0 12px 16px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2a2a2a', border: `2px solid ${GREEN}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', margin: '0 auto 6px' }}>⚙️</div>
            <p style={{ color: TEXT_PRIMARY, fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {adminUser?.email?.split('@')[0] ?? 'Admin'}
            </p>
            <p style={{ color: GREEN, fontSize: '10px', marginTop: '2px' }}>Administrador</p>
          </div>

          <div style={{ marginTop: '8px' }}>
            <SideLabel>ADMINISTRACIÓN</SideLabel>
            {[
              { id: 'stats',     icon: '📊', label: 'Estadísticas'  },
              { id: 'users',     icon: '👥', label: 'Usuarios'       },
              { id: 'songs',     icon: '🎵', label: 'Canciones'      },
              { id: 'playlists', icon: '📋', label: 'Playlists'      },
            ].map(item => (
              <NavItem key={item.id} active={activeTab === item.id} onClick={() => setActiveTab(item.id)}>
                <span style={{ fontSize: '13px' }}>{item.icon}</span> {item.label}
              </NavItem>
            ))}
          </div>
        </div>

        {/* ── Contenido ── */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>

          {/* ESTADÍSTICAS */}
          {activeTab === 'stats' && (
            <Section title="Estadísticas generales">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
                {GLOBAL_STATS.map((s,i) => (
                  <div key={i} style={{ background: PANEL_BG, border: `1px solid ${BORDER}`, borderRadius: '3px', padding: '14px 16px' }}>
                    <p style={{ color: TEXT_MUTED, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{s.label}</p>
                    <p style={{ color: TEXT_PRIMARY, fontSize: '22px', fontWeight: 'bold' }}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {/* Top canciones */}
                <div style={{ background: PANEL_BG, border: `1px solid ${BORDER}`, borderRadius: '3px', padding: '14px 16px' }}>
                  <p style={{ color: TEXT_MUTED, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Top canciones</p>
                  {songs.slice(0,5).map((s,i) => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                      <span style={{ color: TEXT_MUTED, width: '14px', fontSize: '10px' }}>{i+1}</span>
                      <span style={{ color: TEXT_LABEL, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</span>
                      <span style={{ color: GREEN, fontSize: '10px' }}>{s.plays.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Usuarios recientes */}
                <div style={{ background: PANEL_BG, border: `1px solid ${BORDER}`, borderRadius: '3px', padding: '14px 16px' }}>
                  <p style={{ color: TEXT_MUTED, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Usuarios recientes</p>
                  {users.slice(0,4).map(u => (
                    <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                      <span style={{ fontSize: '12px' }}>👤</span>
                      <span style={{ color: TEXT_LABEL, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</span>
                      <span style={{ color: u.status === 'activo' ? GREEN : TEXT_MUTED, fontSize: '10px' }}>{u.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {/* USUARIOS */}
          {activeTab === 'users' && (
            <Section title={`Gestión de usuarios (${users.length})`}>
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 90px 90px 80px', padding: '5px 12px', background: 'linear-gradient(to bottom,#333,#2a2a2a)', color: TEXT_MUTED, fontSize: '10px', borderBottom: `1px solid ${BORDER}` }}>
                  <span>Email</span><span>Rol</span><span>Registro</span><span>Estado</span><span>Acciones</span>
                </div>
                {users.map((u, i) => (
                  <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 90px 90px 80px', padding: '6px 12px', background: i % 2 === 0 ? 'transparent' : '#1f1f1f', borderBottom: `1px solid ${BORDER}`, alignItems: 'center' }}>
                    <span style={{ color: TEXT_PRIMARY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</span>
                    <span>
                      <span style={{ background: u.role === 'admin' ? '#3d7a22' : '#333', color: u.role === 'admin' ? '#fff' : TEXT_MUTED, fontSize: '9px', padding: '1px 6px', borderRadius: '2px', textTransform: 'uppercase' }}>{u.role}</span>
                    </span>
                    <span style={{ color: TEXT_MUTED }}>{u.joined}</span>
                    <span style={{ color: u.status === 'activo' ? GREEN : TEXT_MUTED }}>{u.status}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => toggleRole(u.id)} title="Cambiar rol" style={iconBtnStyle}>⇄</button>
                      <button onClick={() => deleteUser(u.id)} title="Eliminar" style={{ ...iconBtnStyle, color: '#c0392b' }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ color: TEXT_MUTED, fontSize: '10px', marginTop: '8px' }}>⇄ cambia rol entre user/admin &nbsp;·&nbsp; ✕ elimina el usuario</p>
            </Section>
          )}

          {/* CANCIONES */}
          {activeTab === 'songs' && (
            <Section title={`Catálogo de canciones (${songs.length})`}>
              {/* Añadir */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <input value={newSong.title}    onChange={e => setNewSong(p => ({ ...p, title:    e.target.value }))} placeholder="Título"    style={{ ...inputStyle, width: '160px' }} />
                <input value={newSong.artist}   onChange={e => setNewSong(p => ({ ...p, artist:   e.target.value }))} placeholder="Artista"   style={{ ...inputStyle, width: '160px' }} />
                <input value={newSong.duration} onChange={e => setNewSong(p => ({ ...p, duration: e.target.value }))} placeholder="Duración (ej. 3:45)" style={{ ...inputStyle, width: '130px' }} />
                <button onClick={addSong} style={primaryBtnStyle}>+ Agregar</button>
              </div>

              <div style={{ border: `1px solid ${BORDER}`, borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 70px 70px 40px', padding: '5px 12px', background: 'linear-gradient(to bottom,#333,#2a2a2a)', color: TEXT_MUTED, fontSize: '10px', borderBottom: `1px solid ${BORDER}` }}>
                  <span>Título</span><span>Artista</span><span>Duración</span><span>Plays</span><span></span>
                </div>
                {songs.map((s, i) => (
                  <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 70px 70px 40px', padding: '6px 12px', background: i % 2 === 0 ? 'transparent' : '#1f1f1f', borderBottom: `1px solid ${BORDER}`, alignItems: 'center' }}>
                    <span style={{ color: TEXT_PRIMARY }}>{s.title}</span>
                    <span style={{ color: TEXT_LABEL }}>{s.artist}</span>
                    <span style={{ color: TEXT_MUTED }}>{s.duration}</span>
                    <span style={{ color: GREEN }}>{s.plays.toLocaleString()}</span>
                    <button onClick={() => deleteSong(s.id)} style={{ ...iconBtnStyle, color: RED }}>✕</button>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* PLAYLISTS */}
          {activeTab === 'playlists' && (
            <Section title={`Gestión de playlists (${playlists.length})`}>
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 70px 40px', padding: '5px 12px', background: 'linear-gradient(to bottom,#333,#2a2a2a)', color: TEXT_MUTED, fontSize: '10px', borderBottom: `1px solid ${BORDER}` }}>
                  <span>Nombre</span><span>Propietario</span><span>Canciones</span><span></span>
                </div>
                {playlists.map((pl, i) => (
                  <div key={pl.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 70px 40px', padding: '6px 12px', background: i % 2 === 0 ? 'transparent' : '#1f1f1f', borderBottom: `1px solid ${BORDER}`, alignItems: 'center' }}>
                    <span style={{ color: GREEN }}>♪ {pl.name}</span>
                    <span style={{ color: TEXT_LABEL, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl.owner}</span>
                    <span style={{ color: TEXT_MUTED }}>{pl.tracks} tracks</span>
                    <button onClick={() => deletePlaylist(pl.id)} style={{ ...iconBtnStyle, color: RED }}>✕</button>
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

// ── Estilos compartidos ────────────────────────────────────────
const inputStyle = {
  background: '#1a1a1a', border: '1px solid #555', borderRadius: '3px',
  color: TEXT_PRIMARY, fontSize: '11px', padding: '5px 8px', outline: 'none',
  fontFamily: FONT, boxSizing: 'border-box',
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

const iconBtnStyle = {
  background: 'none', border: 'none', color: TEXT_MUTED,
  cursor: 'pointer', fontSize: '12px', padding: '2px 4px',
}
