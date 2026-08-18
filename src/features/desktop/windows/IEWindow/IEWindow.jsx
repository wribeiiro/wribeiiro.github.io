import { useState, useRef } from "react";

const DEFAULT_URL = "/google98.html";

// Only use icons confirmed to exist in /public/assets/icons/
const ICONS = {
  back:      '/assets/icons/w98_netshow_arrow.ico',
  forward:   '/assets/icons/w98_netshow_arrow.ico',
  stop:      '/assets/icons/w2k_stop.ico',
  refresh:   '/assets/icons/w98_directory_open_refresh.ico',
  home:      '/assets/icons/w98_homepage.ico',
  search:    '/assets/icons/w98_search_web.ico',
  favorites: '/assets/icons/w98_help_book_cool.ico',
  history:   '/assets/icons/w98_history.ico',
  mail:      '/assets/icons/w98_outlook_express.ico',
  print:     '/assets/icons/w98_printer.ico',
  ie:        '/assets/icons/w98_msie1.ico',
  internet:  '/assets/icons/w98_world.ico',
};

const ToolbarBtn = ({ icon, label, disabled = false, onClick, flipX = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={label}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1px',
      padding: '2px 6px',
      background: 'transparent',
      border: '1px solid transparent',
      cursor: 'default',
      minWidth: '38px',
      opacity: disabled ? 0.4 : 1,
    }}
    onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.border = '1px outset #c0c0c0'; }}
    onMouseLeave={(e) => { e.currentTarget.style.border = '1px solid transparent'; }}
    onMouseDown={(e) => { if (!disabled) e.currentTarget.style.border = '1px inset #c0c0c0'; }}
    onMouseUp={(e) => { if (!disabled) e.currentTarget.style.border = '1px outset #c0c0c0'; }}
  >
    <img
      src={icon}
      alt={label}
      width={22}
      height={22}
      style={{ imageRendering: 'pixelated', transform: flipX ? 'scaleX(-1)' : 'none' }}
    />
    <span style={{ fontSize: '7pt', color: disabled ? '#808080' : '#000', whiteSpace: 'nowrap' }}>{label}</span>
  </button>
);

const Separator = () => (
  <div style={{ width: '1px', height: '32px', background: '#808080', margin: '0 2px', flexShrink: 0 }} />
);

// Page shown when the site blocks iframe embedding
const BlockedPage = ({ url, onOpenExternal }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    background: '#ffffff',
    fontFamily: 'Microsoft Sans Serif, Tahoma, sans-serif',
    padding: '24px',
    textAlign: 'center',
  }}>
    <img src="/assets/icons/w98_msg_error.ico" alt="" width={48} height={48} style={{ imageRendering: 'pixelated', marginBottom: '16px' }} />
    <h2 style={{ fontSize: '12pt', marginBottom: '8px', color: '#000080' }}>
      This page cannot be displayed
    </h2>
    <p style={{ fontSize: '8pt', marginBottom: '8px', color: '#444', maxWidth: '360px', lineHeight: 1.5 }}>
      The website at <strong>{url}</strong> does not allow itself to be displayed inside another page (X-Frame-Options restriction).
    </p>
    <p style={{ fontSize: '8pt', marginBottom: '16px', color: '#444' }}>
      Please try one of the following:
    </p>
    <ul style={{ fontSize: '8pt', textAlign: 'left', color: '#000', marginBottom: '20px', lineHeight: 2 }}>
      <li>Click <strong>Open in new window</strong> below to view the page directly</li>
      <li>Click <strong>Refresh</strong> in the toolbar to try again</li>
    </ul>
    <button
      onClick={onOpenExternal}
      style={{
        padding: '4px 16px',
        background: '#c0c0c0',
        border: '2px outset #c0c0c0',
        fontSize: '8pt',
        cursor: 'default',
      }}
      onMouseDown={(e) => { e.currentTarget.style.border = '2px inset #c0c0c0'; }}
      onMouseUp={(e) => { e.currentTarget.style.border = '2px outset #c0c0c0'; }}
    >
      Open in new window
    </button>
  </div>
);

const IEWindow = ({ windowId, onClose }) => {
  const [url, setUrl] = useState(DEFAULT_URL);
  const [inputUrl, setInputUrl] = useState("https://www.google.com");
  const [status, setStatus] = useState("Done");
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [history, setHistory] = useState([DEFAULT_URL]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const iframeRef = useRef(null);

  const navigate = (target) => {
    let finalUrl = target.trim();
    if (
      !finalUrl.startsWith('http://') &&
      !finalUrl.startsWith('https://') &&
      !finalUrl.startsWith('/')
    ) {
      finalUrl = 'https://' + finalUrl;
    }
    setUrl(finalUrl);
    setInputUrl(finalUrl.startsWith('/') ? 'https://www.google.com' : finalUrl);
    setStatus("Connecting to " + finalUrl + "...");
    setLoading(true);
    setBlocked(false);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(finalUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleGo = () => {
    let target = inputUrl.trim();
    // Map google.com to local page
    if (
      target === 'https://www.google.com' ||
      target === 'http://www.google.com' ||
      target === 'www.google.com' ||
      target === 'google.com'
    ) {
      navigate('/google98.html');
    } else {
      navigate(target);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleGo();
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
      setLoading(true);
      setBlocked(false);
      setStatus("Connecting...");
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
      setLoading(true);
      setBlocked(false);
      setStatus("Connecting...");
    }
  };

  const handleStop = () => {
    setLoading(false);
    setStatus("Done");
  };

  const handleRefresh = () => {
    setLoading(true);
    setBlocked(false);
    setStatus("Refreshing...");
    // force reload by toggling key
    setUrl(prev => prev);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  };

  const handleHome = () => navigate(DEFAULT_URL);

  const handleLoad = () => {
    setLoading(false);
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc && doc.getElementById('q')) {
        doc.getElementById('q').focus();
      }
      setStatus("Done");
    } catch {
      setBlocked(true);
      setStatus("Error");
    }
  };

  const handleError = () => {
    setLoading(false);
    setBlocked(true);
    setStatus("Done");
  };

  const canBack = historyIndex > 0;
  const canForward = historyIndex < history.length - 1;

  const menuItems = ['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#c0c0c0',
      overflow: 'hidden',
    }}>

      {/* Menu bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '20px',
        padding: '0 4px',
        background: '#c0c0c0',
        borderBottom: '1px solid #808080',
        flexShrink: 0,
      }}>
        {menuItems.map(item => (
          <span
            key={item}
            style={{ padding: '0 6px', fontSize: '8pt', cursor: 'default', userSelect: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#000080'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; }}
          >
            {item}
          </span>
        ))}
        <div style={{ marginLeft: 'auto', marginRight: '2px', display: 'flex', alignItems: 'center' }}>
          <img src={ICONS.ie} alt="IE" width={20} height={20} style={{ imageRendering: 'pixelated' }} />
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '2px 2px',
        background: '#c0c0c0',
        borderBottom: '1px solid #808080',
        flexShrink: 0,
        flexWrap: 'nowrap',
        overflow: 'hidden',
      }}>
        <ToolbarBtn icon={ICONS.refresh} label="Refresh"   onClick={handleRefresh} />
        <Separator />
        <ToolbarBtn icon={ICONS.search}    label="Search"    onClick={() => navigate('/google98.html')} />
        <Separator />
        <ToolbarBtn icon={ICONS.mail}  label="Mail" onClick={() => window.location.href = 'mailto:welleh10@gmail.com'} />
        <ToolbarBtn icon={ICONS.print} label="Print" onClick={() => window.print()} />
      </div>

      {/* Address bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '26px',
        padding: '2px 4px',
        background: '#c0c0c0',
        borderBottom: '2px groove #808080',
        flexShrink: 0,
        gap: '4px',
      }}>
        <span style={{ fontSize: '8pt', userSelect: 'none', whiteSpace: 'nowrap' }}>Address</span>
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            height: '18px',
            border: '2px inset #c0c0c0',
            background: '#ffffff',
            padding: '0 4px',
            fontSize: '8pt',
            fontFamily: 'Microsoft Sans Serif, Tahoma, sans-serif',
            outline: 'none',
          }}
        />
        <button
          onClick={handleGo}
          style={{
            height: '20px',
            padding: '0 8px',
            background: '#c0c0c0',
            border: '2px outset #c0c0c0',
            fontSize: '8pt',
            cursor: 'default',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            whiteSpace: 'nowrap',
          }}
          onMouseDown={(e) => { e.currentTarget.style.border = '2px inset #c0c0c0'; }}
          onMouseUp={(e) => { e.currentTarget.style.border = '2px outset #c0c0c0'; }}
        >
          Go
        </button>
        <button
          style={{
            height: '20px',
            padding: '0 6px',
            background: '#c0c0c0',
            border: '2px outset #c0c0c0',
            fontSize: '8pt',
            cursor: 'default',
          }}
        >
          Links »
        </button>
      </div>

      {/* Content: iframe or blocked page */}
      <div style={{ flex: 1, overflow: 'hidden', background: '#ffffff', position: 'relative' }}>
        {blocked ? (
          <BlockedPage url={url} onOpenExternal={() => window.open(url, '_blank', 'noopener,noreferrer')} />
        ) : (
          <iframe
            ref={iframeRef}
            key={url}
            src={url}
            title="Internet Explorer"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>

      {/* Status bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '18px',
        padding: '0 4px',
        background: '#c0c0c0',
        borderTop: '1px solid #808080',
        flexShrink: 0,
      }}>
        <div style={{
          flex: 1,
          border: '1px inset #c0c0c0',
          padding: '0 4px',
          fontSize: '7pt',
          height: '14px',
          display: 'flex',
          alignItems: 'center',
          marginRight: '4px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}>
          {loading ? `Opening page ${url}...` : status}
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: '50px', height: '14px', border: '1px inset #c0c0c0' }} />
          ))}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            border: '1px inset #c0c0c0',
            padding: '0 4px',
            height: '14px',
          }}>
            <img src={ICONS.internet} alt="" width={12} height={12} style={{ imageRendering: 'pixelated' }} />
            <span style={{ fontSize: '7pt' }}>Internet</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IEWindow;
