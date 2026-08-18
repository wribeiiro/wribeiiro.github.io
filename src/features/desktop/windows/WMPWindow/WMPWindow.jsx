import { useSpotify } from "../../../../hooks/useSpotify";

// Transport control icons
const PlayIcon  = () => <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="2,1 9,5 2,9" fill="currentColor"/></svg>;
const PauseIcon = () => <svg width="10" height="10" viewBox="0 0 10 10"><rect x="2" y="1" width="2" height="8" fill="currentColor"/><rect x="6" y="1" width="2" height="8" fill="currentColor"/></svg>;
const StopIcon  = () => <svg width="8" height="8" viewBox="0 0 8 8"><rect x="1" y="1" width="6" height="6" fill="currentColor"/></svg>;
const PrevIcon  = () => <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="2" width="2" height="6" fill="currentColor"/><polygon points="9,2 4,5 9,8" fill="currentColor"/></svg>;
const NextIcon  = () => <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="1,2 6,5 1,8" fill="currentColor"/><rect x="7" y="2" width="2" height="6" fill="currentColor"/></svg>;
const RewIcon   = () => <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,2 1,5 5,8" fill="currentColor"/><polygon points="9,2 5,5 9,8" fill="currentColor"/></svg>;
const FFIcon    = () => <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="1,2 5,5 1,8" fill="currentColor"/><polygon points="5,2 9,5 5,8" fill="currentColor"/></svg>;

const CtrlBtn = ({ children, onClick, active = false, title }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px',
      height: '18px',
      background: active ? '#808080' : '#c0c0c0',
      border: active ? '1px inset #808080' : '1px outset #c0c0c0',
      cursor: 'default',
      color: '#000',
      padding: 0,
      flexShrink: 0,
    }}
  >
    {children}
  </button>
);

const formatTime = (ms) => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

// Display area — album art or Windows logo
const DisplayArea = ({ albumArt, title, isPlaying, loading }) => (
  <div style={{
    flex: 1,
    minHeight: '120px',
    background: '#0a0a0a',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px inset #404040',
  }}>
    {albumArt ? (
      <img
        src={albumArt}
        alt={title || 'Album art'}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          display: 'block',
          opacity: isPlaying ? 1 : 0.5,
          transition: 'opacity 400ms',
        }}
      />
    ) : (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2px',
        transform: 'perspective(200px) rotateY(-15deg) rotateX(5deg)',
        opacity: loading ? 0.3 : 0.85,
      }}>
        {['#e74c3c', '#2ecc71', '#3498db', '#f39c12'].map((color, i) => (
          <div key={i} style={{
            width: '32px',
            height: '32px',
            background: color,
            boxShadow: `inset -2px -2px 4px rgba(0,0,0,0.4), inset 2px 2px 4px rgba(255,255,255,0.2)`,
          }} />
        ))}
      </div>
    )}
    {isPlaying && (
      <div style={{
        position: 'absolute',
        top: '4px',
        right: '4px',
        background: 'rgba(0,0,0,0.75)',
        color: '#00ff00',
        fontSize: '6pt',
        fontFamily: 'monospace',
        padding: '1px 4px',
        border: '1px solid #00ff00',
      }}>
        ▶ WELL PLAYING NOW
      </div>
    )}
  </div>
);

const WMPWindow = () => {
  const { isPlaying, title, artist, album, albumArt, duration, progress, trackUrl, loading, error, refresh } = useSpotify();

  const menuItems = ['File', 'View', 'Play', 'Favorites', 'Go', 'Help'];
  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  const handleTrackClick = () => {
    if (trackUrl) window.open(trackUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#c0c0c0',
      overflow: 'hidden',
      userSelect: 'none',
    }}>

      {/* Menu bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '18px',
        padding: '0 4px',
        background: '#c0c0c0',
        borderBottom: '1px solid #808080',
        flexShrink: 0,
      }}>
        {menuItems.map(item => (
          <span
            key={item}
            style={{ padding: '0 6px', fontSize: '8pt', cursor: 'default' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#000080'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; }}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Nav bar — arrows + Showcase */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '22px',
        padding: '1px 4px',
        background: '#c0c0c0',
        borderBottom: '1px solid #808080',
        flexShrink: 0,
        gap: '2px',
      }}>
        <CtrlBtn title="Back"><span style={{ fontSize: '9pt', lineHeight: 1 }}>←</span></CtrlBtn>
        <CtrlBtn title="Forward"><span style={{ fontSize: '9pt', lineHeight: 1 }}>→</span></CtrlBtn>
        <div style={{ flex: 1 }} />
      </div>

      {/* Display area */}
      <DisplayArea albumArt={albumArt} title={title} isPlaying={isPlaying} loading={loading} />

      {/* Seek bar — simple thin line */}
      <div style={{
        padding: '4px 6px',
        background: '#c0c0c0',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Small position box */}
        <div style={{
          minWidth: '36px',
          height: '14px',
          border: '1px inset #808080',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '4px',
          flexShrink: 0,
          padding: '0 2px',
        }}>
          <span style={{ fontSize: '6pt', color: '#00ff00', fontFamily: 'monospace' }}>
            {formatTime(progress)}
          </span>
        </div>
        {/* Seek track */}
        <div style={{
          flex: 1,
          height: '6px',
          background: '#404040',
          border: '1px inset #808080',
          position: 'relative',
          cursor: 'default',
        }}>
          {/* Progress fill */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${progressPct}%`,
            background: '#000080',
            transition: 'width 500ms linear',
          }} />
          {/* Thumb */}
          <div style={{
            position: 'absolute',
            top: '-3px',
            left: `calc(${progressPct}% - 4px)`,
            width: '8px',
            height: '12px',
            background: '#c0c0c0',
            border: '1px outset #c0c0c0',
          }} />
        </div>
      </div>

      {/* Transport controls row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '2px 6px 3px',
        background: '#c0c0c0',
        borderBottom: '1px solid #808080',
        flexShrink: 0,
        gap: '1px',
      }}>
        <CtrlBtn title="Play" active={isPlaying}><PlayIcon /></CtrlBtn>
        <CtrlBtn title="Pause" active={!isPlaying && progress > 0}><PauseIcon /></CtrlBtn>
        <CtrlBtn title="Stop"><StopIcon /></CtrlBtn>
        {/* Separator */}
        <div style={{ width: '6px' }} />
        <CtrlBtn title="Previous"><PrevIcon /></CtrlBtn>
        <CtrlBtn title="Rewind"><RewIcon /></CtrlBtn>
        <CtrlBtn title="Fast Forward"><FFIcon /></CtrlBtn>
        <CtrlBtn title="Next"><NextIcon /></CtrlBtn>
        {/* Separator */}
        <div style={{ width: '6px' }} />
        {/* Mode buttons */}
        <CtrlBtn title="Playlist">
          <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="2" fill="currentColor"/><rect x="1" y="4" width="8" height="2" fill="currentColor"/><rect x="1" y="7" width="8" height="2" fill="currentColor"/></svg>
        </CtrlBtn>
        {/* Separator */}
        <div style={{ width: '6px' }} />
        {/* Mute / Volume */}
        <CtrlBtn title="Mute">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="1,3 3,3 6,1 6,9 3,7 1,7" fill="#808080"/>
            <polygon points="1,3 3,3 6,1 6,9 3,7 1,7" fill="none" stroke="#000" strokeWidth="0.5"/>
          </svg>
        </CtrlBtn>
        {/* Volume bar */}
        <div style={{
          width: '44px',
          height: '10px',
          background: '#404040',
          border: '1px inset #808080',
          position: 'relative',
          marginLeft: '2px',
        }}>
          <div style={{ width: '70%', height: '100%', background: '#000080' }} />
          {/* Volume indicator */}
          <div style={{
            position: 'absolute',
            top: '-2px',
            left: 'calc(70% - 3px)',
            width: '6px',
            height: '14px',
            background: '#c0c0c0',
            border: '1px outset #c0c0c0',
          }} />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#ffffff', flexShrink: 0 }} />

      {/* Track info — black background like original WMP */}
      <div style={{
        padding: '6px 8px',
        background: '#000000',
        flexShrink: 0,
        fontSize: '7pt',
        lineHeight: 1.8,
        borderTop: '1px solid #404040',
      }}>
        {error ? (
          <div style={{ color: '#cc0000', fontSize: '7pt', padding: '2px 0' }}>
            ⚠ {error === 'Failed to fetch' ? 'Cannot connect to Spotify service' : error}
          </div>
        ) : (
          [
            ['Clip',      loading ? 'Loading...' : (title ?? 'Not playing')],
            ['Author',    loading ? '—' : (artist ?? '—')],
            ['Copyright', loading ? '—' : (album ?? '—')],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', gap: '6px' }}>
              <span style={{ color: '#808080', minWidth: '52px', textAlign: 'right', flexShrink: 0 }}>{label}:</span>
              <span
                style={{
                  color: label === 'Clip' && trackUrl ? '#6699ff' : '#ffffff',
                  cursor: label === 'Clip' && trackUrl ? 'pointer' : 'default',
                  textDecoration: label === 'Clip' && trackUrl ? 'underline' : 'none',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                onClick={label === 'Clip' ? handleTrackClick : undefined}
                title={label === 'Clip' && trackUrl ? 'Open in Spotify' : undefined}
              >
                {value}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WMPWindow;
