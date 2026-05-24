import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

/* ── Paleta Spotify ─────────────────────────────────────────── */
const S = {
  green:      '#1db954',
  bg:         '#121212',
  surface:    '#181818',
  elevated:   '#282828',
  border:     '#282828',
  text:       '#ffffff',
  textMuted:  '#b3b3b3',
  textSubtle: '#6a6a6a',
}
const FONT = "'Circular','Inter','Helvetica Neue',Helvetica,Arial,sans-serif"

/* ── Datos de muestra ───────────────────────────────────────── */
const HISTORY = [
  { title: 'Uninvited',           artist: 'Alanis Morissette', playedAt: 'Hoy, 10:42'    },
  { title: 'Creep',               artist: 'Radiohead',          playedAt: 'Hoy, 09:15'    },
  { title: 'One',                 artist: 'U2',                 playedAt: 'Ayer, 22:30'   },
  { title: 'No Surprises',        artist: 'Radiohead',          playedAt: 'Ayer, 21:00'   },
  { title: 'With or Without You', artist: 'U2',                 playedAt: '23 may, 18:45' },
]
const PLAYLISTS_DEFAULT = [
  { name: 'Mis favoritas', tracks: 12, updated: 'Hoy'    },
  { name: 'Para el gym',   tracks: 8,  updated: 'Ayer'   },
  { name: 'Chill vibes',   tracks: 20, updated: '20 may' },
]
const STATS = [
  { label: 'Canciones escuchadas', value: '284' },
  { label: 'Artistas distintos',   value: '47'  },
  { label: 'Horas totales',        value: '18h' },
  { label: 'Playlists creadas',    value: '3'   },
]
const TOP_ARTISTS = [
  { name: 'Radiohead',         pct: 78 },
  { name: 'U2',                pct: 61 },
  { name: 'Alanis Morissette', pct: 42 },
]

/* ── Componente principal ───────────────────────────────────── */
export default function UserPanel() {
  const navigate = useNavigate()
  const [activeTab,   setActiveTab]   = useState('perfil')
  const [user,        setUser]        = useState(null)
  const [newPlaylist, setNewPlaylist] = useState('')
  const [playlists,   setPlaylists]   = useState(PLAYLISTS_DEFAULT)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
  }, [])

  const handleLogout    = async () => { await supabase.auth.signOut(); navigate('/') }
  const addPlaylist     = () => {
    if (!newPlaylist.trim()) return
    setPlaylists(prev => [...prev, { name: newPlaylist.trim(), tracks: 0, updated: 'Ahora' }])
    setNewPlaylist('')
  }
  const removePlaylist  = (idx) => setPlaylists(prev => prev.filter((_, i) => i !== idx))

  const NAV_ITEMS = [
    { id: 'perfil',       icon: '👤', label: 'Mi perfil'    },
    { id: 'historial',    icon: '🕘', label: 'Historial'    },
    { id: 'playlists',    icon: '🎵', label: 'Playlists'    },
    { id: 'estadisticas', icon: '📊', label: 'Estadísticas' },
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
      }}>
        <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
          {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
            <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={S.green}>
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span style={{ color: S.text, fontWeight: '700', fontSize: '13px' }}>Spotify — Mi cuenta</span>
        </div>
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
          {/* Avatar */}
          <div style={{
            textAlign: 'center',
            padding: '16px 16px 20px',
            borderBottom: `1px solid ${S.border}`,
          }}>
            <div style={{
              width: '64px', height: '64px',
              borderRadius: '50%',
              background: S.elevated,
              border: `1px solid #535353`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px',
              margin: '0 auto 10px',
            }}>👤</div>
            <p style={{ color: S.text, fontWeight: '700', fontSize: '13px', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '0 8px' }}>
              {user?.email?.split('@')[0] ?? 'Usuario'}
            </p>
            <p style={{ color: S.textMuted, fontSize: '11px', margin: 0 }}>Plan gratuito</p>
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
            }}>Mi cuenta</p>
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
        <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px', background: S.bg }}>

          {/* PERFIL */}
          {activeTab === 'perfil' && (
            <Section title="Mi perfil">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '500px', marginBottom: '20px' }}>
                <Field label="Correo electrónico" value={user?.email ?? '—'} />
                <Field label="ID de usuario"       value={user?.id ? user.id.slice(0, 8) + '...' : '—'} />
                <Field label="Creado el"           value={user?.created_at ? new Date(user.created_at).toLocaleDateString('es-CO') : '—'} />
                <Field label="Último acceso"       value={user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('es-CO') : '—'} />
              </div>

              <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: '8px', padding: '20px', maxWidth: '500px' }}>
                <p style={{ color: S.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px', fontWeight: '700' }}>Cambiar contraseña</p>
                <input type="password" placeholder="Nueva contraseña" style={{ ...css.input, width: '260px', display: 'block', marginBottom: '12px' }} />
                <button style={css.btnGreen}>Actualizar</button>
              </div>
            </Section>
          )}

          {/* HISTORIAL */}
          {activeTab === 'historial' && (
            <Section title="Historial de reproducción">
              <TableWrap>
                <TableHead cols="1fr 1fr 140px" headers={['Canción', 'Artista', 'Reproducido']} />
                {HISTORY.map((h, i) => (
                  <TableRow key={i} cols="1fr 1fr 140px" alt={i % 2 !== 0}>
                    <span style={{ color: S.text }}>{h.title}</span>
                    <span style={{ color: S.textMuted }}>{h.artist}</span>
                    <span style={{ color: S.textSubtle }}>{h.playedAt}</span>
                  </TableRow>
                ))}
              </TableWrap>
            </Section>
          )}

          {/* PLAYLISTS */}
          {activeTab === 'playlists' && (
            <Section title="Mis playlists">
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', maxWidth: '440px' }}>
                <input
                  value={newPlaylist}
                  onChange={e => setNewPlaylist(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addPlaylist()}
                  placeholder="Nombre de nueva playlist..."
                  style={{ ...css.input, flex: 1 }}
                />
                <button onClick={addPlaylist} style={css.btnGreen}>+ Crear</button>
              </div>

              <TableWrap>
                <TableHead cols="1fr 90px 110px 48px" headers={['Nombre', 'Canciones', 'Actualizada', '']} />
                {playlists.map((pl, i) => (
                  <TableRow key={i} cols="1fr 90px 110px 48px" alt={i % 2 !== 0}>
                    <span style={{ color: S.green, fontWeight: '600' }}>♪ {pl.name}</span>
                    <span style={{ color: S.textMuted }}>{pl.tracks} tracks</span>
                    <span style={{ color: S.textSubtle }}>{pl.updated}</span>
                    <IconBtn onClick={() => removePlaylist(i)} danger>✕</IconBtn>
                  </TableRow>
                ))}
                {playlists.length === 0 && (
                  <div style={{ padding: '24px', textAlign: 'center', color: S.textMuted, fontSize: '13px' }}>
                    No tienes playlists aún
                  </div>
                )}
              </TableWrap>
            </Section>
          )}

          {/* ESTADÍSTICAS */}
          {activeTab === 'estadisticas' && (
            <Section title="Estadísticas de escucha">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px', maxWidth: '440px', marginBottom: '24px' }}>
                {STATS.map((s, i) => (
                  <div key={i} style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: '8px', padding: '20px 16px' }}>
                    <p style={{ color: S.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>{s.label}</p>
                    <p style={{ color: S.text, fontSize: '28px', fontWeight: '700', margin: 0 }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Artistas más escuchados */}
              <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: '8px', padding: '20px', maxWidth: '440px' }}>
                <p style={{ color: S.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', fontWeight: '700' }}>
                  Artistas más escuchados
                </p>
                {TOP_ARTISTS.map(({ name, pct }) => (
                  <div key={name} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ color: S.text, fontSize: '13px' }}>{name}</span>
                      <span style={{ color: S.textMuted, fontSize: '12px' }}>{pct}%</span>
                    </div>
                    <div style={{ height: '4px', background: S.elevated, borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: S.green, borderRadius: '2px' }} />
                    </div>
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

/* ── Sub-componentes compartidos ─────────────────────────────── */
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
        <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', margin: '0 0 12px', letterSpacing: '-0.3px' }}>
          {title}
        </h2>
        <div style={{ height: '1px', background: '#282828' }} />
      </div>
      {children}
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div style={{ background: '#181818', border: '1px solid #282828', borderRadius: '8px', padding: '14px 16px' }}>
      <p style={{ color: '#6a6a6a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', fontWeight: '700' }}>{label}</p>
      <p style={{ color: '#fff', fontSize: '13px', margin: 0, wordBreak: 'break-all' }}>{value}</p>
    </div>
  )
}

function TableWrap({ children }) {
  return (
    <div style={{ background: '#181818', border: '1px solid #282828', borderRadius: '8px', overflow: 'hidden' }}>
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

function IconBtn({ children, onClick, danger }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
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
    caretColor: '#1db954',
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
  },
}