import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ── Paleta Spotify exacta ────────────────────────── */
const S = {
  green:       "#1db954",
  greenHover:  "#1ed760",
  black:       "#000000",
  bg:          "#121212",
  surface:     "#181818",
  surfaceHov:  "#282828",
  sidebar:     "#000000",
  sidebarItem: "#121212",
  elevated:    "#282828",
  border:      "#282828",
  text:        "#ffffff",
  textMuted:   "#b3b3b3",
  textSubtle:  "#6a6a6a",
  highlight:   "#1db954",
};

const tracks = [
  { id: 1,  title: "Uninvited",           artist: "Alanis Morissette", album: "Supposed Former...", duration: "4:18" },
  { id: 2,  title: "You Oughta Know",     artist: "Alanis Morissette", album: "Jagged Little Pill",  duration: "4:10" },
  { id: 3,  title: "Hand in My Pocket",   artist: "Alanis Morissette", album: "Jagged Little Pill",  duration: "3:42" },
  { id: 4,  title: "Ironic",              artist: "Alanis Morissette", album: "Jagged Little Pill",  duration: "3:50" },
  { id: 5,  title: "One",                 artist: "U2",                album: "Achtung Baby",        duration: "4:36" },
  { id: 6,  title: "With or Without You", artist: "U2",                album: "The Joshua Tree",     duration: "4:56" },
  { id: 7,  title: "Sunday Bloody Sunday",artist: "U2",                album: "War",                 duration: "4:40" },
  { id: 8,  title: "Creep",               artist: "Radiohead",         album: "Pablo Honey",         duration: "3:56" },
  { id: 9,  title: "Fake Plastic Trees",  artist: "Radiohead",         album: "The Bends",           duration: "4:50" },
  { id: 10, title: "No Surprises",        artist: "Radiohead",         album: "OK Computer",         duration: "3:48" },
];

const playlists = ["My Library", "Starred", "Local Files", "Top Tracks", "Recently Played"];
const navMain   = ["What's New", "People", "Inbox", "Play Queue", "Devices"];
const navApps   = ["App Finder", "Top Lists", "Radio"];

/* ── Estilos reutilizables ────────────────────────── */
const css = {
  btn: {
    background: "transparent",
    border: "1px solid #535353",
    borderRadius: "4px",
    color: S.textMuted,
    cursor: "pointer",
    padding: "4px 12px",
    fontSize: "11px",
    letterSpacing: "0.5px",
    transition: "all 0.2s",
  },
  btnGreen: {
    background: S.green,
    border: "none",
    borderRadius: "500px",
    color: "#000",
    cursor: "pointer",
    padding: "8px 20px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },
  check: {
    display: "block",
    color: S.textMuted,
    marginBottom: "6px",
    cursor: "pointer",
    fontSize: "12px",
    userSelect: "none",
  },
};

export default function SpotifyMVP() {
  const navigate = useNavigate();
  const [activeTrack,    setActiveTrack]    = useState(0);
  const [isPlaying,      setIsPlaying]      = useState(true);
  const [activeNav,      setActiveNav]      = useState("What's New");
  const [activePlaylist, setActivePlaylist] = useState("My Library");
  const [progress,       setProgress]       = useState(38);
  const [volume,         setVolume]         = useState(75);
  const [search,         setSearch]         = useState("");
  const [showSettings,   setShowSettings]   = useState(false);
  const [hoveredTrack,   setHoveredTrack]   = useState(null);

  const currentTrack = tracks[activeTrack];

  const filteredTracks = tracks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.artist.toLowerCase().includes(search.toLowerCase())
  );

  /* segundos actuales del progreso */
  const [totalSec] = currentTrack.duration.split(":").map(Number);
  const totalSeconds = (totalSec * 60) + parseInt(currentTrack.duration.split(":")[1]);
  const currentSec   = Math.floor((progress / 100) * totalSeconds);
  const fmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  return (
    <div style={{
      fontFamily: "'Circular', 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: "13px",
      background: S.bg,
      color: S.text,
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      userSelect: "none",
      overflow: "hidden",
    }}>

      {/* ── Barra superior ─────────────────────────── */}
      <div style={{
        background: "#000",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 12px",
        borderBottom: `1px solid #000`,
        flexShrink: 0,
        zIndex: 10,
      }}>
        {/* Semáforo macOS */}
        <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
            <div key={i} style={{
              width: "12px", height: "12px",
              borderRadius: "50%",
              background: c,
              boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.2)",
            }} />
          ))}
        </div>

        {/* Logo Spotify centrado */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={S.green}>
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span style={{ color: S.text, fontSize: "13px", fontWeight: "700", letterSpacing: "0.5px" }}>Spotify</span>
        </div>

        {/* Login / usuario */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={() => navigate("/login")}
            style={{ ...css.btn, fontSize: "11px", padding: "3px 12px" }}
          >LOG IN</button>
          <span style={{ color: S.textMuted, fontSize: "11px" }}>filhippo</span>
        </div>
      </div>

      {/* ── Toolbar con búsqueda ────────────────────── */}
      <div style={{
        background: "#000",
        padding: "6px 12px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        borderBottom: `1px solid #1a1a1a`,
        flexShrink: 0,
      }}>
        {/* Flechas nav */}
        {["◀", "▶"].map((sym, i) => (
          <button key={i} style={{
            ...css.btn,
            width: "28px", height: "28px",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 0,
            fontSize: "12px",
            background: "#282828",
            border: "none",
          }}>{sym}</button>
        ))}

        {/* Search */}
        <div style={{
          background: "#242424",
          border: "1px solid transparent",
          borderRadius: "500px",
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "220px",
          transition: "border-color 0.2s",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={S.textMuted}>
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: S.text,
              fontSize: "13px",
              width: "100%",
              caretColor: S.green,
            }}
          />
        </div>
      </div>

      {/* ── Layout principal ────────────────────────── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── Sidebar ──────────────────────────────── */}
        <div style={{
          width: "200px",
          background: S.sidebar,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flexShrink: 0,
          paddingTop: "8px",
        }}>
          <NavSection label="MAIN">
            {navMain.map(item => (
              <NavItem key={item} label={item}
                active={activeNav === item}
                onClick={() => setActiveNav(item)} />
            ))}
          </NavSection>

          <NavSection label="APPS">
            {navApps.map(item => (
              <NavItem key={item} label={item}
                active={activeNav === item}
                onClick={() => setActiveNav(item)} />
            ))}
          </NavSection>

          <NavSection label="COLLECTION">
            {playlists.map(item => (
              <NavItem key={item} label={item} isPlaylist
                active={activePlaylist === item}
                onClick={() => setActivePlaylist(item)} />
            ))}
            <div style={{ padding: "4px 16px" }}>
              <span style={{ color: S.green, fontSize: "12px", cursor: "pointer", fontWeight: "700" }}>
                + New Playlist
              </span>
            </div>
            <div style={{ padding: "4px 16px 8px" }}>
              <span style={{ color: S.textSubtle, fontSize: "11px", cursor: "pointer" }}>
                ♪ Windows Media Player
              </span>
            </div>
          </NavSection>
        </div>

        {/* ── Contenido central ────────────────────── */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: S.bg,
        }}>
          {showSettings
            ? <SettingsPanel onClose={() => setShowSettings(false)} />
            : <TrackList
                tracks={filteredTracks}
                activeTrack={activeTrack}
                hoveredTrack={hoveredTrack}
                setHoveredTrack={setHoveredTrack}
                setActiveTrack={(idx) => { setActiveTrack(idx); setIsPlaying(true); }}
              />
          }
        </div>

        {/* ── Panel derecho ─────────────────────────── */}
        <div style={{
          width: "190px",
          background: S.surface,
          borderLeft: `1px solid ${S.border}`,
          padding: "16px 12px",
          fontSize: "12px",
          flexShrink: 0,
          overflow: "auto",
        }}>
          {/* Activity Sharing */}
          <SideSection label="Activity Sharing">
            <label style={css.check}>
              <input type="checkbox" style={{ accentColor: S.green, marginRight: "7px" }} />
              Scrobble to Last.fm
            </label>
            <label style={css.check}>
              <input type="checkbox" style={{ accentColor: S.green, marginRight: "7px" }} />
              Show on MSN
            </label>
            <label style={{ ...css.check, color: S.green }}>
              <input type="checkbox" defaultChecked style={{ accentColor: S.green, marginRight: "7px" }} />
              Share on Spotify Social
            </label>
          </SideSection>

          {/* Profile */}
          <SideSection label="Profile">
            <label style={css.check}>
              <input type="checkbox" defaultChecked style={{ accentColor: S.green, marginRight: "7px" }} />
              Auto-publish playlists
            </label>
            <label style={css.check}>
              <input type="checkbox" defaultChecked style={{ accentColor: S.green, marginRight: "7px" }} />
              Top Tracks
            </label>
            <label style={css.check}>
              <input type="checkbox" defaultChecked style={{ accentColor: S.green, marginRight: "7px" }} />
              Top Artists
            </label>
          </SideSection>

          {/* No Favorites card */}
          <div style={{
            background: S.elevated,
            borderRadius: "6px",
            padding: "12px",
            textAlign: "center",
            color: S.textMuted,
            fontSize: "11px",
            marginBottom: "16px",
          }}>
            <div style={{ fontSize: "28px", marginBottom: "6px", opacity: 0.4 }}>👤</div>
            <p style={{ fontWeight: "700", color: S.textMuted, marginBottom: "4px" }}>No Favorites</p>
            <p style={{ fontSize: "10px", lineHeight: "1.4" }}>Add people for quicker access</p>
            <button style={{ ...css.btn, marginTop: "8px", fontSize: "10px" }}>Show People</button>
          </div>

          {/* Language */}
          <SideSection label="Language">
            <select style={{
              background: S.elevated,
              border: `1px solid #535353`,
              color: S.text,
              fontSize: "11px",
              width: "100%",
              padding: "4px 6px",
              borderRadius: "4px",
              outline: "none",
            }}>
              <option>English</option>
              <option>Español</option>
              <option>Français</option>
            </select>
          </SideSection>
        </div>
      </div>

      {/* ── Player bar ───────────────────────────────── */}
      <div style={{
        background: "#181818",
        borderTop: `1px solid #282828`,
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexShrink: 0,
        height: "72px",
        zIndex: 10,
      }}>

        {/* Album art + track info */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "220px", flexShrink: 0 }}>
          <div style={{
            width: "52px", height: "52px",
            background: S.elevated,
            borderRadius: "4px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}>🎵</div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              color: S.text,
              fontWeight: "600",
              fontSize: "13px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>{currentTrack.title}</div>
            <div style={{
              color: S.textMuted,
              fontSize: "11px",
              marginTop: "2px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>{currentTrack.artist}</div>
          </div>
          {/* Heart */}
          <span style={{ color: S.textMuted, fontSize: "16px", cursor: "pointer", marginLeft: "4px", flexShrink: 0 }}>♡</span>
        </div>

        {/* Controls + progress */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: 1 }}>
          {/* Botones */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <CtrlBtn title="Shuffle">⇄</CtrlBtn>
            <CtrlBtn onClick={() => setActiveTrack(Math.max(0, activeTrack - 1))}>⏮</CtrlBtn>

            {/* Play / Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                width: "32px", height: "32px",
                borderRadius: "50%",
                background: S.text,
                border: "none",
                color: "#000",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "transform 0.1s",
                flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >{isPlaying ? "⏸" : "▶"}</button>

            <CtrlBtn onClick={() => setActiveTrack(Math.min(tracks.length - 1, activeTrack + 1))}>⏭</CtrlBtn>
            <CtrlBtn title="Repeat">↻</CtrlBtn>
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", maxWidth: "480px" }}>
            <span style={{ color: S.textMuted, fontSize: "11px", minWidth: "32px", textAlign: "right" }}>
              {fmt(currentSec)}
            </span>
            <div
              style={{ flex: 1, position: "relative", height: "4px", background: "#535353", borderRadius: "2px", cursor: "pointer" }}
              onClick={e => {
                const r = e.currentTarget.getBoundingClientRect();
                setProgress(Math.round(((e.clientX - r.left) / r.width) * 100));
              }}
              onMouseEnter={e => e.currentTarget.querySelector("div").style.background = S.green}
              onMouseLeave={e => e.currentTarget.querySelector("div").style.background = S.text}
            >
              <div style={{
                width: `${progress}%`,
                height: "100%",
                background: S.text,
                borderRadius: "2px",
                transition: "background 0.15s",
                position: "relative",
              }} />
            </div>
            <span style={{ color: S.textMuted, fontSize: "11px", minWidth: "32px" }}>
              {currentTrack.duration}
            </span>
          </div>
        </div>

        {/* Volumen */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "160px", flexShrink: 0, justifyContent: "flex-end" }}>
          <span style={{ color: S.textMuted, fontSize: "14px" }}>🔊</span>
          <div
            style={{ flex: 1, position: "relative", height: "4px", background: "#535353", borderRadius: "2px", cursor: "pointer", maxWidth: "80px" }}
            onClick={e => {
              const r = e.currentTarget.getBoundingClientRect();
              setVolume(Math.round(((e.clientX - r.left) / r.width) * 100));
            }}
          >
            <div style={{ width: `${volume}%`, height: "100%", background: S.text, borderRadius: "2px" }} />
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{ ...css.btn, padding: "4px 8px", fontSize: "13px", border: "none", background: "transparent" }}
          >⚙</button>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-componentes ─────────────────────────────────── */

function NavSection({ label, children }) {
  return (
    <div style={{ marginBottom: "4px" }}>
      <div style={{
        padding: "12px 16px 4px",
        color: S.textSubtle,
        fontSize: "10px",
        textTransform: "uppercase",
        letterSpacing: "1.5px",
        fontWeight: "700",
      }}>{label}</div>
      {children}
    </div>
  );
}

function NavItem({ label, active, onClick, isPlaylist }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "8px 16px",
        cursor: "pointer",
        background: active ? "#282828" : hov ? "#121212" : "transparent",
        color: active ? S.text : hov ? S.text : S.textMuted,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "13px",
        fontWeight: active ? "700" : "400",
        borderLeft: active ? `2px solid ${S.green}` : "2px solid transparent",
        transition: "all 0.1s",
      }}
    >
      {isPlaylist && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      )}
      {label}
    </div>
  );
}

function TrackList({ tracks, activeTrack, hoveredTrack, setHoveredTrack, setActiveTrack }) {
  return (
    <div style={{ flex: 1, overflow: "auto" }}>
      {/* Header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "40px 1fr 1fr 1fr 60px",
        gap: "8px",
        padding: "8px 16px",
        background: S.bg,
        borderBottom: `1px solid ${S.border}`,
        color: S.textSubtle,
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "1px",
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}>
        <span style={{ textAlign: "center" }}>#</span>
        <span>Title</span>
        <span>Artist</span>
        <span>Album</span>
        <span style={{ textAlign: "right" }}>⏱</span>
      </div>

      {tracks.map((track, idx) => {
        const isActive = idx === activeTrack;
        const isHov    = hoveredTrack === idx;
        return (
          <div
            key={track.id}
            onDoubleClick={() => setActiveTrack(idx)}
            onMouseEnter={() => setHoveredTrack(idx)}
            onMouseLeave={() => setHoveredTrack(null)}
            style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr 1fr 1fr 60px",
              gap: "8px",
              padding: "8px 16px",
              background: isActive
                ? "rgba(255,255,255,0.08)"
                : isHov ? "rgba(255,255,255,0.04)" : "transparent",
              cursor: "default",
              color: isActive ? S.green : S.text,
              fontSize: "13px",
              alignItems: "center",
              borderRadius: "4px",
              transition: "background 0.1s",
            }}
          >
            <span style={{ textAlign: "center", color: isActive ? S.green : S.textMuted, fontSize: "13px" }}>
              {isActive ? "▶" : idx + 1}
            </span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: isActive ? "600" : "400" }}>
              {track.title}
            </span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: S.textMuted }}>
              {track.artist}
            </span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: S.textMuted }}>
              {track.album}
            </span>
            <span style={{ textAlign: "right", color: S.textMuted }}>
              {track.duration}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SettingsPanel({ onClose }) {
  return (
    <div style={{ padding: "24px", overflow: "auto", flex: 1, background: S.bg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <span style={{ fontWeight: "700", fontSize: "20px", color: S.text }}>Getting Started</span>
        <button onClick={onClose} style={{ ...css.btn, padding: "4px 10px", fontSize: "14px" }}>✕</button>
      </div>
      <div style={{ background: S.surface, borderRadius: "8px", overflow: "hidden", border: `1px solid ${S.border}` }}>
        {[
          { n: 1, label: "Create an account",  done: true  },
          { n: 2, label: "Install Spotify",     done: true  },
          { n: 3, label: "Make a playlist",     done: false, active: true },
          { n: 4, label: "Spotify Mobile",      done: false, locked: true },
        ].map(step => (
          <div key={step.n} style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "14px 16px",
            background: step.active ? S.green : "transparent",
            borderBottom: `1px solid ${S.border}`,
            color: step.locked ? S.textSubtle : S.text,
            fontSize: "13px",
          }}>
            <span style={{
              width: "22px", height: "22px",
              borderRadius: "50%",
              background: step.done ? S.green : step.active ? "rgba(255,255,255,0.3)" : "transparent",
              border: step.done ? "none" : `2px solid ${step.active ? "#fff" : S.textSubtle}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: "700",
              color: step.done ? "#000" : step.active ? "#fff" : S.textSubtle,
              flexShrink: 0,
            }}>
              {step.locked ? "🔒" : step.done ? "✓" : step.n}
            </span>
            <span>{step.label}</span>
            {step.active && (
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "60px", height: "4px", background: "rgba(255,255,255,0.3)", borderRadius: "2px" }}>
                  <div style={{ width: "66%", height: "100%", background: "#fff", borderRadius: "2px" }} />
                </div>
                <span style={{ color: "#fff", fontSize: "11px" }}>66%</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <div style={{ marginTop: "20px" }}>
        {[["Username", "filhippo", "text"], ["Password", "••••••", "password"]].map(([lbl, val, type]) => (
          <div key={lbl} style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", color: S.textMuted, fontSize: "11px", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>{lbl}</label>
            <input
              type={type}
              defaultValue={val}
              style={{
                background: "#242424",
                border: "1px solid #535353",
                borderRadius: "4px",
                color: S.text,
                fontSize: "13px",
                padding: "8px 12px",
                width: "200px",
                outline: "none",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SideSection({ label, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <p style={{ color: S.textSubtle, marginBottom: "8px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1.2px", fontWeight: "700" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function CtrlBtn({ children, onClick, title }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "none",
        border: "none",
        color: hov ? S.text : S.textMuted,
        cursor: "pointer",
        fontSize: "16px",
        padding: "4px",
        lineHeight: 1,
        transition: "color 0.15s",
      }}
    >{children}</button>
  );
}