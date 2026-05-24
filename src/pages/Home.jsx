import { useState } from "react";
import { useNavigate } from "react-router-dom";


const GREEN = "#4c9a2a";
const DARK_BG = "#1a1a1a";
const SIDEBAR_BG = "#111111";
const PANEL_BG = "#2a2a2a";
const BORDER = "#3a3a3a";
const TEXT_PRIMARY = "#e8e8e8";
const TEXT_MUTED = "#888";
const TEXT_LABEL = "#aaa";

const tracks = [
  { id: 1, title: "Uninvited", artist: "Alanis Morissette", album: "Supposed Former...", duration: "4:18", playing: true },
  { id: 2, title: "You Oughta Know", artist: "Alanis Morissette", album: "Jagged Little Pill", duration: "4:10", playing: false },
  { id: 3, title: "Hand in My Pocket", artist: "Alanis Morissette", album: "Jagged Little Pill", duration: "3:42", playing: false },
  { id: 4, title: "Ironic", artist: "Alanis Morissette", album: "Jagged Little Pill", duration: "3:50", playing: false },
  { id: 5, title: "One", artist: "U2", album: "Achtung Baby", duration: "4:36", playing: false },
  { id: 6, title: "With or Without You", artist: "U2", album: "The Joshua Tree", duration: "4:56", playing: false },
  { id: 7, title: "Sunday Bloody Sunday", artist: "U2", album: "War", duration: "4:40", playing: false },
  { id: 8, title: "Creep", artist: "Radiohead", album: "Pablo Honey", duration: "3:56", playing: false },
  { id: 9, title: "Fake Plastic Trees", artist: "Radiohead", album: "The Bends", duration: "4:50", playing: false },
  { id: 10, title: "No Surprises", artist: "Radiohead", album: "OK Computer", duration: "3:48", playing: false },
];

const playlists = [
  "My Library",
  "Starred",
  "Local Files",
  "Top Tracks",
  "Recently Played",
];

const navMain = ["What's New", "People", "Inbox", "Play Queue", "Devices"];
const navApps = ["App Finder", "Top Lists", "Radio"];

export default function SpotifyMVP() {
  const navigate = useNavigate();
  const [activeTrack, setActiveTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeNav, setActiveNav] = useState("What's New");
  const [activePlaylist, setActivePlaylist] = useState("My Library");
  const [progress, setProgress] = useState(38);
  const [volume, setVolume] = useState(75);
  const [search, setSearch] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const currentTrack = tracks[activeTrack];

  const filteredTracks = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.artist.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      fontFamily: "'Lucida Grande', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: "11px",
      background: DARK_BG,
      color: TEXT_PRIMARY,
      height: "600px",
      display: "flex",
      flexDirection: "column",
      userSelect: "none",
      border: `1px solid ${BORDER}`,
      borderRadius: "4px",
      overflow: "hidden",
    }}>

      {/* Title bar */}
      <div style={{
        background: "linear-gradient(to bottom, #3a3a3a, #2c2c2c)",
        padding: "0 8px",
        height: "28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid #111`,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
            <div key={i} style={{ width: "11px", height: "11px", borderRadius: "50%", background: c }} />
          ))}
        </div>
        <span style={{ color: TEXT_MUTED, fontSize: "11px" }}>Spotify</span>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span
            onClick={() => navigate("/login")}
            style={{ color: TEXT_MUTED, fontSize: "10px", cursor: "pointer", padding: "2px 8px", border: `1px solid #555`, borderRadius: "3px" }}
          >
            Login
          </span>
          <span style={{ color: TEXT_MUTED, fontSize: "10px" }}>filhippo</span>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        background: "#222",
        padding: "4px 8px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        borderBottom: `1px solid ${BORDER}`,
        flexShrink: 0,
      }}>
        <button onClick={() => setActiveTrack(Math.max(0, activeTrack - 1))} style={btnStyle}>◀</button>
        <button onClick={() => setActiveTrack(Math.min(tracks.length - 1, activeTrack + 1))} style={btnStyle}>▶</button>
        <div style={{
          background: "#1a1a1a",
          border: `1px solid #555`,
          borderRadius: "10px",
          padding: "2px 8px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          width: "160px",
        }}>
          <span style={{ color: TEXT_MUTED, fontSize: "10px" }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: TEXT_PRIMARY,
              fontSize: "11px",
              width: "100%",
            }}
          />
        </div>
      </div>

      {/* Main area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Sidebar */}
        <div style={{
          width: "155px",
          background: SIDEBAR_BG,
          borderRight: `1px solid ${BORDER}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flexShrink: 0,
        }}>
          <NavSection label="MAIN">
            {navMain.map(item => (
              <NavItem key={item} label={item} active={activeNav === item} onClick={() => setActiveNav(item)} />
            ))}
          </NavSection>

          <NavSection label="APPS">
            {navApps.map(item => (
              <NavItem key={item} label={item} active={activeNav === item} onClick={() => setActiveNav(item)} />
            ))}
          </NavSection>

          <NavSection label="COLLECTION">
            {playlists.map(item => (
              <NavItem
                key={item}
                label={item}
                active={activePlaylist === item}
                onClick={() => setActivePlaylist(item)}
                isPlaylist
              />
            ))}
            <div style={{ padding: "2px 8px" }}>
              <span style={{ color: GREEN, fontSize: "11px", cursor: "pointer" }}>+ New Playlist</span>
            </div>
            <div style={{ padding: "2px 8px 4px" }}>
              <span style={{ color: TEXT_MUTED, fontSize: "11px", cursor: "pointer" }}>♪ Windows Media Player</span>
            </div>
          </NavSection>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {showSettings ? (
            <SettingsPanel onClose={() => setShowSettings(false)} />
          ) : (
            <TrackList
              tracks={filteredTracks}
              activeTrack={activeTrack}
              setActiveTrack={(idx) => { setActiveTrack(idx); setIsPlaying(true); }}
            />
          )}
        </div>

        {/* Right panel */}
        <div style={{
          width: "170px",
          background: "#1e1e1e",
          borderLeft: `1px solid ${BORDER}`,
          padding: "10px",
          fontSize: "11px",
          flexShrink: 0,
          overflow: "auto",
        }}>
          <div style={{ marginBottom: "12px" }}>
            <p style={{ color: TEXT_MUTED, marginBottom: "6px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Activity Sharing</p>
            <label style={checkStyle}><input type="checkbox" style={{ marginRight: "5px" }} />Scrobble to Last.fm</label>
            <label style={checkStyle}><input type="checkbox" style={{ marginRight: "5px" }} />Show on MSN</label>
            <label style={{ ...checkStyle, color: GREEN }}><input type="checkbox" defaultChecked style={{ marginRight: "5px" }} />Share on Spotify Social</label>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <p style={{ color: TEXT_MUTED, marginBottom: "6px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Profile</p>
            <label style={checkStyle}><input type="checkbox" defaultChecked style={{ marginRight: "5px" }} />Auto-publish playlists</label>
            <label style={checkStyle}><input type="checkbox" defaultChecked style={{ marginRight: "5px" }} />Top Tracks</label>
            <label style={checkStyle}><input type="checkbox" defaultChecked style={{ marginRight: "5px" }} />Top Artists</label>
          </div>

          <div style={{
            background: PANEL_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: "3px",
            padding: "8px",
            textAlign: "center",
            color: TEXT_MUTED,
            fontSize: "10px",
          }}>
            <div style={{ fontSize: "22px", marginBottom: "4px", opacity: 0.4 }}>👤</div>
            <p>No Favorites</p>
            <p style={{ marginTop: "2px" }}>Add people for quicker access</p>
            <button style={{ ...btnStyle, marginTop: "6px", fontSize: "10px", padding: "2px 8px" }}>Show People</button>
          </div>

          <div style={{ marginTop: "12px" }}>
            <p style={{ color: TEXT_MUTED, marginBottom: "4px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Language</p>
            <select style={{ background: "#333", border: `1px solid #555`, color: TEXT_PRIMARY, fontSize: "10px", width: "100%", padding: "2px" }}>
              <option>English</option>
              <option>Español</option>
              <option>Français</option>
            </select>
          </div>
        </div>
      </div>

      {/* Player bar */}
      <div style={{
        background: "linear-gradient(to bottom, #252525, #1a1a1a)",
        borderTop: `1px solid #111`,
        padding: "6px 10px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexShrink: 0,
        height: "58px",
      }}>
        {/* Album art placeholder */}
        <div style={{
          width: "40px",
          height: "40px",
          background: "#333",
          border: `1px solid #555`,
          borderRadius: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          flexShrink: 0,
        }}>🎵</div>

        {/* Track info */}
        <div style={{ width: "130px", flexShrink: 0 }}>
          <div style={{ color: TEXT_PRIMARY, fontWeight: "bold", fontSize: "11px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentTrack.title}</div>
          <div style={{ color: TEXT_MUTED, fontSize: "10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentTrack.artist}</div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <PlayerBtn>⇄</PlayerBtn>
            <PlayerBtn onClick={() => setActiveTrack(Math.max(0, activeTrack - 1))}>⏮</PlayerBtn>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                width: "26px", height: "26px",
                borderRadius: "50%",
                background: isPlaying ? GREEN : "#444",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >{isPlaying ? "⏸" : "▶"}</button>
            <PlayerBtn onClick={() => setActiveTrack(Math.min(tracks.length - 1, activeTrack + 1))}>⏭</PlayerBtn>
            <PlayerBtn>↻</PlayerBtn>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%" }}>
            <span style={{ color: TEXT_MUTED, fontSize: "10px", width: "28px", textAlign: "right" }}>
              {Math.floor(progress / 100 * 278)}s
            </span>
            <div style={{ flex: 1, position: "relative", height: "4px", background: "#444", borderRadius: "2px", cursor: "pointer" }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setProgress(Math.round(((e.clientX - rect.left) / rect.width) * 100));
              }}>
              <div style={{ width: `${progress}%`, height: "100%", background: GREEN, borderRadius: "2px" }} />
            </div>
            <span style={{ color: TEXT_MUTED, fontSize: "10px", width: "28px" }}>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Volume & extras */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          <span style={{ color: TEXT_MUTED, fontSize: "10px" }}>🔊</span>
          <div style={{ width: "60px", position: "relative", height: "4px", background: "#444", borderRadius: "2px", cursor: "pointer" }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setVolume(Math.round(((e.clientX - rect.left) / rect.width) * 100));
            }}>
            <div style={{ width: `${volume}%`, height: "100%", background: "#888", borderRadius: "2px" }} />
          </div>
          <button onClick={() => setShowSettings(!showSettings)} style={{ ...btnStyle, fontSize: "10px", padding: "2px 6px" }}>⚙</button>
        </div>
      </div>
    </div>
  );
}

function NavSection({ label, children }) {
  return (
    <div style={{ marginBottom: "2px" }}>
      <div style={{ padding: "6px 8px 2px", color: "#666", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "bold" }}>{label}</div>
      {children}
    </div>
  );
}

function NavItem({ label, active, onClick, isPlaylist }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "3px 8px 3px 14px",
        cursor: "pointer",
        background: active ? "linear-gradient(to bottom, #4c9a2a, #3d7a22)" : "transparent",
        color: active ? "#fff" : "#bbb",
        borderRadius: active ? "2px" : "0",
        margin: active ? "0 2px" : "0",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        fontSize: "11px",
      }}
    >
      {isPlaylist && <span style={{ fontSize: "10px", opacity: 0.6 }}>♪</span>}
      {label}
    </div>
  );
}

function TrackList({ tracks, activeTrack, setActiveTrack }) {
  return (
    <div style={{ flex: 1, overflow: "auto" }}>
      {/* Header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "20px 1fr 1fr 1fr 50px",
        gap: "4px",
        padding: "4px 10px",
        background: "linear-gradient(to bottom, #333, #2a2a2a)",
        borderBottom: `1px solid ${BORDER}`,
        color: TEXT_MUTED,
        fontSize: "10px",
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}>
        <span>#</span>
        <span>Title</span>
        <span>Artist</span>
        <span>Album</span>
        <span>Time</span>
      </div>
      {tracks.map((track, idx) => {
        const realIdx = tracks.indexOf(track);
        const isActive = realIdx === activeTrack || (idx === activeTrack);
        return (
          <div
            key={track.id}
            onDoubleClick={() => setActiveTrack(idx)}
            style={{
              display: "grid",
              gridTemplateColumns: "20px 1fr 1fr 1fr 50px",
              gap: "4px",
              padding: "4px 10px",
              background: isActive
                ? "linear-gradient(to bottom, #4c9a2a22, #3d7a2222)"
                : idx % 2 === 0 ? "transparent" : "#1f1f1f",
              cursor: "default",
              color: isActive ? GREEN : TEXT_PRIMARY,
              borderLeft: isActive ? `2px solid ${GREEN}` : "2px solid transparent",
              fontSize: "11px",
            }}
          >
            <span style={{ color: TEXT_MUTED }}>{isActive ? "▶" : idx + 1}</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.title}</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: isActive ? GREEN : TEXT_LABEL }}>{track.artist}</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: TEXT_MUTED }}>{track.album}</span>
            <span style={{ color: TEXT_MUTED }}>{track.duration}</span>
          </div>
        );
      })}
    </div>
  );
}

function SettingsPanel({ onClose }) {
  return (
    <div style={{ padding: "16px", overflow: "auto", flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <span style={{ fontWeight: "bold", fontSize: "12px" }}>Getting Started</span>
        <button onClick={onClose} style={{ ...btnStyle, padding: "1px 6px" }}>✕</button>
      </div>
      <div style={{ background: PANEL_BG, border: `1px solid ${BORDER}`, borderRadius: "3px", overflow: "hidden" }}>
        {[
          { n: 1, label: "Create an account", done: true },
          { n: 2, label: "Install Spotify", done: true },
          { n: 3, label: "Make a playlist", done: false, active: true },
          { n: 4, label: "Spotify Mobile", done: false, locked: true },
        ].map(step => (
          <div key={step.n} style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 12px",
            background: step.active ? GREEN : "transparent",
            borderBottom: `1px solid ${BORDER}`,
            color: step.locked ? TEXT_MUTED : TEXT_PRIMARY,
          }}>
            {step.locked ? "🔒" : step.done ? "✓" : `${step.n}`}
            <span style={{ fontSize: "11px" }}>{step.label}</span>
            {step.active && (
              <span style={{ marginLeft: "auto", color: "#fff", fontSize: "10px" }}>66%</span>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "12px" }}>
        <p style={{ color: TEXT_MUTED, fontSize: "11px" }}>Username:</p>
        <input style={{ background: "#333", border: `1px solid #555`, color: TEXT_PRIMARY, fontSize: "11px", padding: "2px 6px", width: "120px", marginTop: "3px" }} defaultValue="filhippo" />
        <p style={{ color: TEXT_MUTED, fontSize: "11px", marginTop: "6px" }}>Password:</p>
        <input type="password" style={{ background: "#333", border: `1px solid #555`, color: TEXT_PRIMARY, fontSize: "11px", padding: "2px 6px", width: "80px", marginTop: "3px" }} defaultValue="••••" />
      </div>
    </div>
  );
}

function PlayerBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "none",
      border: "none",
      color: TEXT_MUTED,
      cursor: "pointer",
      fontSize: "13px",
      padding: "2px",
      lineHeight: 1,
    }}>{children}</button>
  );
}

const btnStyle = {
  background: "linear-gradient(to bottom, #4a4a4a, #333)",
  border: `1px solid #555`,
  borderRadius: "3px",
  color: TEXT_PRIMARY,
  cursor: "pointer",
  padding: "2px 10px",
  fontSize: "11px",
};

const checkStyle = {
  display: "block",
  color: TEXT_LABEL,
  marginBottom: "4px",
  cursor: "pointer",
  fontSize: "10px",
};
