import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

/* ── Paleta Spotify ─────────────────────────────────────────── */
const S = {
  green:      '#1db954',
  greenDark:  '#1aa34a',
  black:      '#000000',
  bg:         '#121212',
  surface:    '#181818',
  elevated:   '#282828',
  border:     '#282828',
  borderHov:  '#3e3e3e',
  text:       '#ffffff',
  textMuted:  '#b3b3b3',
  textSubtle: '#6a6a6a',
  red:        '#e5534b',
}
const FONT = "'Circular','Inter','Helvetica Neue',Helvetica,Arial,sans-serif"

/* ── Datos de muestra ───────────────────────────────────────── */
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
  { id: 'p1', name: 'Top 2006',     owner: 'carlos@ejemplo.com', tracks: 15 },
  { id: 'p2', name: 'Para el gym',  owner: 'ana@ejemplo.com',    tracks: 8  },
  { id: 'p3', name: 'Chill vibes',  owner: 'ana@ejemplo.com',    tracks: 20 },
  { id: 'p4', name: 'Rock clásico', owner: 'luis@ejemplo.com',   tracks: 12 },
]
const GLOBAL_STATS = [
  { label: 'Usuarios totales',       value: '4',    icon: '👥' },
  { label: 'Canciones en catálogo',  value: '5',    icon: '🎵' },
  { label: 'Reproducciones totales', value: '4.4K', icon: '▶' },
  { label: 'Playlists creadas',      value: '4',    icon: '📋' },
]

/* ── Componente principal ───────────────────────────────────── */
export default function AdminPanel() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('stats')
  const [adminUser, setAdminUser] = useState(null)
  const [users,     setUsers]     = useState(MOCK_USERS)
  const [songs,     setSongs]     = useState(MOCK_SONGS)
  const [playlists, setPlaylists] = useState(MOCK_PLAYLISTS)
  const [newSong,   setNewSong]   = useState({ title: '', artist: '', duration: '' })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setAdminUser(data?.user ?? null))
  }, [])

  const handleLogout   = async () => { await supabase.auth.signOut(); navigate('/') }
  const deleteUser     = (id) => setUsers(prev     => prev.filter(u => u.id !== id))
  const deleteSong     = (id) => setSongs(prev     => prev.filter(s => s.id !== id))
  const deletePlaylist = (id) => setPlaylists(prev => prev.filter(p => p.id !== id))
  const toggleRole     = (id) => setUsers(prev => prev.map(u =>
    u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u
  ))
  const addSong = () => {
    if (!newSong.title.trim() || !newSong.artist.trim()) return
    setSongs(prev => [...prev, { id: `s${Date.now()}`, ...newSong, plays: 0 }])
    setNewSong({ title: '', artist: '', duration: '' })
  }

  const NAV_ITEMS = [
    { id: 'stats',     icon: '📊', label: 'Estadísticas' },
    { id: 'users',     icon: '👥', label: 'Usuarios'      },
    { id: 'songs',     icon: '🎵', label: 'Canciones'     },
    { id: 'playlists', icon: '📋', label: 'Playlists'     },
  ]

  return (
    <div style={{
      background: S.bg,
      minHeight: '100vh',
      fontFamily: FONT,
      fontSize: '13px',
      color: S.text,
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── Titlebar ── */}
      <div style={{
        background: '#000',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: `1px solid ${S.border}`,
        flexShrink: 0,
        zIndex: 10,
      }}>
        {/* Semáforo */}
        <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
          {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
            <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
          ))}
        </div>

        {/* Centro: logo + badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={S.green}>
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span style={{ color: S.text, fontWeight: '700', fontSize: '13px' }}>Spotify</span>
          <span style={{
            background: S.green,
            color: '#000',
            fontSize: '9px',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '500px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>Admin</span>
        </div>

        {/* Cerrar sesión */}
        <button onClick={handleLogout} style={css.sysBtn}>Cerrar sesión</button>
      </div>

      {/* ── Layout ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 36px)' }}>

        {/* ── Sidebar ── */}
        <div style={{
          width: '220px',
          background: '#000',
          borderRight: `1px solid ${S.border}`,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          paddingTop: '8px',
        }}>
          {/* Avatar admin */}
          <div style={{
            textAlign: 'center',
            padding: '16px 16px 20px',
            borderBottom: `1px solid ${S.border}`,
          }}>
            <div style={{
              width: '60px', height: '60px',
              borderRadius: '50%',
              background: S.elevated,
              border: `2px solid ${S.green}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px',
              margin: '0 auto 10px',
            }}>⚙️</div>
            <p style={{ color: S.text, fontWeight: '700', fontSize: '13px', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '0 8px' }}>
              {adminUser?.email?.split('@')[0] ?? 'Admin'}
            </p>
            <p style={{ color: S.green, fontSize: '11px', margin: 0, fontWeight: '600' }}>Administrador</p>
          </div>

          {/* Nav */}
          <div style={{ padding: '8px 0' }}>
            <p style={{
              color: S.textSubtle,
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: '700',
              padding: '12px 16px 4px',
            }}>Administración</p>
            {NAV_ITEMS.map(item => (
              <SideNavItem
                key={item.id}
                active={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </div>
        </div>

        {/* ── Contenido ── */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '28px 32px',
          background: S.bg,
        }}>

          {/* ESTADÍSTICAS */}
          {activeTab === 'stats' && (
            <Section title="Estadísticas generales">
              {/* Cards métricas */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
                {GLOBAL_STATS.map((s, i) => (
                  <div key={i} style={{
                    background: S.surface,
                    borderRadius: '8px',
                    padding: '20px 16px',
                    border: `1px solid ${S.border}`,
                  }}>
                    <p style={{ color: S.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>{s.label}</p>
                    <p style={{ color: S.text, fontSize: '28px', fontWeight: '700', margin: 0 }}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Top canciones */}
                <div style={{ background: S.surface, borderRadius: '8px', padding: '20px', border: `1px solid ${S.border}` }}>
                  <p style={{ color: S.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px', fontWeight: '700' }}>Top canciones</p>
                  {songs.slice(0, 5).map((s, i) => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <span style={{ color: S.textSubtle, width: '16px', fontSize: '12px', textAlign: 'right' }}>{i + 1}</span>
                      <span style={{ color: S.text, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px' }}>{s.title}</span>
                      <span style={{ color: S.green, fontSize: '12px', fontWeight: '600' }}>{s.plays.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Usuarios recientes */}
                <div style={{ background: S.surface, borderRadius: '8px', padding: '20px', border: `1px solid ${S.border}` }}>
                  <p style={{ color: S.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px', fontWeight: '700' }}>Usuarios recientes</p>
                  {users.slice(0, 4).map(u => (
                    <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: S.elevated, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 }}>👤</div>
                      <span style={{ color: S.textMuted, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px' }}>{u.email}</span>
                      <span style={{
                        color: u.status === 'activo' ? '#000' : S.textMuted,
                        background: u.status === 'activo' ? S.green : S.elevated,
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '500px',
                      }}>{u.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {/* USUARIOS */}
          {activeTab === 'users' && (
            <Section title={`Gestión de usuarios (${users.length})`}>
              <TableWrap>
                <TableHead cols="1fr 80px 100px 100px 90px"
                  headers={['Email', 'Rol', 'Registro', 'Estado', 'Acciones']} />
                {users.map((u, i) => (
                  <TableRow key={u.id} cols="1fr 80px 100px 100px 90px" alt={i % 2 !== 0}>
                    <span style={{ color: S.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</span>
                    <span>
                      <Badge green={u.role === 'admin'}>{u.role}</Badge>
                    </span>
                    <span style={{ color: S.textMuted }}>{u.joined}</span>
                    <span style={{ color: u.status === 'activo' ? S.green : S.textMuted }}>{u.status}</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <IconBtn onClick={() => toggleRole(u.id)} title="Cambiar rol">⇄</IconBtn>
                      <IconBtn onClick={() => deleteUser(u.id)} danger title="Eliminar">✕</IconBtn>
                    </div>
                  </TableRow>
                ))}
              </TableWrap>
              <p style={{ color: S.textSubtle, fontSize: '11px', marginTop: '10px' }}>⇄ cambia rol entre user/admin · ✕ elimina el usuario</p>
            </Section>
          )}

          {/* CANCIONES */}
          {activeTab === 'songs' && (
            <Section title={`Catálogo de canciones (${songs.length})`}>
              {/* Form añadir */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <input value={newSong.title}    onChange={e => setNewSong(p => ({ ...p, title:    e.target.value }))} placeholder="Título"    style={{ ...css.input, width: '180px' }} />
                <input value={newSong.artist}   onChange={e => setNewSong(p => ({ ...p, artist:   e.target.value }))} placeholder="Artista"   style={{ ...css.input, width: '180px' }} />
                <input value={newSong.duration} onChange={e => setNewSong(p => ({ ...p, duration: e.target.value }))} placeholder="Duración (ej. 3:45)" style={{ ...css.input, width: '150px' }} />
                <button onClick={addSong} style={css.btnGreen}>+ Agregar</button>
              </div>

              <TableWrap>
                <TableHead cols="1fr 1fr 80px 80px 48px"
                  headers={['Título', 'Artista', 'Duración', 'Plays', '']} />
                {songs.map((s, i) => (
                  <TableRow key={s.id} cols="1fr 1fr 80px 80px 48px" alt={i % 2 !== 0}>
                    <span style={{ color: S.text }}>{s.title}</span>
                    <span style={{ color: S.textMuted }}>{s.artist}</span>
                    <span style={{ color: S.textMuted }}>{s.duration}</span>
                    <span style={{ color: S.green, fontWeight: '600' }}>{s.plays.toLocaleString()}</span>
                    <IconBtn onClick={() => deleteSong(s.id)} danger>✕</IconBtn>
                  </TableRow>
                ))}
              </TableWrap>
            </Section>
          )}

          {/* PLAYLISTS */}
          {activeTab === 'playlists' && (
            <Section title={`Gestión de playlists (${playlists.length})`}>
              <TableWrap>
                <TableHead cols="1fr 1fr 90px 48px"
                  headers={['Nombre', 'Propietario', 'Canciones', '']} />
                {playlists.map((pl, i) => (
                  <TableRow key={pl.id} cols="1fr 1fr 90px 48px" alt={i % 2 !== 0}>
                    <span style={{ color: S.green, fontWeight: '600' }}>♪ {pl.name}</span>
                    <span style={{ color: S.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl.owner}</span>
                    <span style={{ color: S.textMuted }}>{pl.tracks} tracks</span>
                    <IconBtn onClick={() => deletePlaylist(pl.id)} danger>✕</IconBtn>
                  </TableRow>
                ))}
              </TableWrap>
            </Section>
          )}

        </div>
      </div>
    </div>
  )
}

/* ── Sub-componentes ─────────────────────────────────────────── */
function SideNavItem({ active, onClick, icon, label }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '10px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: active ? '#282828' : hov ? '#121212' : 'transparent',
        color: active || hov ? '#fff' : '#b3b3b3',
        borderLeft: active ? `2px solid #1db954` : '2px solid transparent',
        fontSize: '13px',
        fontWeight: active ? '700' : '400',
        transition: 'all 0.1s',
      }}
    >
      <span style={{ fontSize: '16px' }}>{icon}</span>
      {label}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          color: '#fff',
          fontSize: '22px',
          fontWeight: '700',
          margin: '0 0 4px',
          letterSpacing: '-0.3px',
        }}>{title}</h2>
        <div style={{ height: '1px', background: '#282828', marginTop: '12px' }} />
      </div>
      {children}
    </div>
  )
}

function TableWrap({ children }) {
  return (
    <div style={{
      background: '#181818',
      border: '1px solid #282828',
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  )
}

function TableHead({ cols, headers }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: cols,
      gap: '8px',
      padding: '10px 16px',
      background: '#000',
      borderBottom: '1px solid #282828',
      color: '#6a6a6a',
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '700',
    }}>
      {headers.map((h, i) => <span key={i}>{h}</span>)}
    </div>
  )
}

function TableRow({ cols, children, alt }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: cols,
        gap: '8px',
        padding: '10px 16px',
        background: hov ? 'rgba(255,255,255,0.05)' : alt ? '#1f1f1f' : 'transparent',
        borderBottom: '1px solid #282828',
        alignItems: 'center',
        fontSize: '13px',
        transition: 'background 0.1s',
      }}
    >
      {children}
    </div>
  )
}

function Badge({ children, green }) {
  return (
    <span style={{
      background: green ? '#1db954' : '#282828',
      color: green ? '#000' : '#b3b3b3',
      fontSize: '10px',
      fontWeight: '700',
      padding: '3px 10px',
      borderRadius: '500px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    }}>{children}</span>
  )
}

function IconBtn({ children, onClick, danger, title }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? (danger ? 'rgba(229,83,75,0.15)' : 'rgba(255,255,255,0.1)') : 'transparent',
        border: 'none',
        color: danger ? (hov ? '#e5534b' : '#6a6a6a') : (hov ? '#fff' : '#6a6a6a'),
        cursor: 'pointer',
        fontSize: '14px',
        padding: '4px 8px',
        borderRadius: '4px',
        transition: 'all 0.15s',
      }}
    >{children}</button>
  )
}

/* ── Estilos compartidos ─────────────────────────────────────── */
const css = {
  input: {
    background: '#242424',
    border: '1px solid #535353',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '13px',
    padding: '8px 12px',
    outline: 'none',
    fontFamily: "'Circular','Inter','Helvetica Neue',Helvetica,Arial,sans-serif",
    boxSizing: 'border-box',
  },
  btnGreen: {
    background: '#1db954',
    border: 'none',
    borderRadius: '500px',
    color: '#000',
    fontSize: '13px',
    fontWeight: '700',
    padding: '8px 20px',
    cursor: 'pointer',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
  },
  sysBtn: {
    background: 'transparent',
    border: '1px solid #535353',
    borderRadius: '500px',
    color: '#b3b3b3',
    cursor: 'pointer',
    padding: '5px 16px',
    fontSize: '12px',
    fontFamily: "'Circular','Inter','Helvetica Neue',Helvetica,Arial,sans-serif",
    transition: 'all 0.2s',
  },
}