import { useClock } from "../../../../hooks/useClock";
import Task from "../Task/Task";

const Taskbar = ({
  windows,
  minimizedWindows = [],
  activeWindow,
  setActiveWindow,
  handleCloseWindow,
  handleOpenWindow,
  handleMinimizeWindow,
  handleRestoreWindow,
  setShowStartMenu,
  showStartMenu
}) => {
  const { formattedTime, formattedDate } = useClock();

  const taskIcons = {
    'about-me': '/assets/icons/w98_computer_explorer.ico',
    'experience': '/assets/icons/w98_write_wordpad.ico',
    'contact': '/assets/icons/w98_modem.ico',
    'ie': '/assets/icons/w98_msie1.ico',
    'wmp': '/assets/icons/w98_wm.ico',
    'cs16': '/assets/icons/cstrike.ico',
  };

  const taskTitles = {
    'about-me': 'About Me',
    'experience': 'Experience',
    'contact': 'Contact',
    'ie': 'Internet Explorer',
    'wmp': 'Media Player',
    'cs16': 'CS',
  };

  const handleTaskClick = (windowId) => {
    if (minimizedWindows.includes(windowId)) {
      // está minimizada → restaura
      handleRestoreWindow?.(windowId);
    } else if (activeWindow === windowId) {
      // está ativa e visível → minimiza
      handleMinimizeWindow?.(windowId);
    } else {
      // está aberta mas não ativa → traz para frente
      setActiveWindow(windowId);
    }
  };

  return (
    <div className="taskbar" role="toolbar" aria-label="Taskbar">
      <button
        className={`taskbar-start-btn ${showStartMenu ? 'active' : ''}`}
        onClick={() => setShowStartMenu(!showStartMenu)}
        onContextMenu={(e) => { e.preventDefault(); setShowStartMenu(!showStartMenu); }}
        aria-expanded={showStartMenu}
        aria-haspopup="menu"
        aria-label="Menu Start"
        title="Start"
        style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        <img className="taskbar-start-btn-icon" src="/assets/icons/w98_windows.ico" alt="" style={{ width: '18px', height: '18px' }} />
        <span className="start-btn-text">Start</span>
      </button>

      {/* Quick Launch — Show Desktop + IE */}
      <div className="taskbar-quick-launch" role="toolbar" aria-label="Quick Launch">
        <button
          className="taskbar-quick-launch-btn"
          title="Show Desktop"
          aria-label="Show Desktop"
          onClick={() => {
            windows.forEach(w => {
              if (!minimizedWindows.includes(w)) handleMinimizeWindow?.(w);
            });
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="12" height="10" stroke="#000" strokeWidth="1" fill="#008080"/>
            <rect x="1" y="10" width="12" height="3" fill="#c0c0c0" stroke="#000" strokeWidth="0.5"/>
          </svg>
        </button>
        <button
          className="taskbar-quick-launch-btn"
          title="Internet Explorer"
          aria-label="Internet Explorer"
          onClick={() => handleOpenWindow?.('ie')}
        >
          <img src="/assets/icons/w98_msie1.ico" alt="" width={16} height={16} style={{ imageRendering: 'pixelated' }} />
        </button>
      </div>

      <div className="taskbar-tasks" role="tablist" aria-label="Open windows">
        {windows.map(windowId => (
          <Task
            key={windowId}
            id={windowId}
            title={taskTitles[windowId] || windowId}
            icon={taskIcons[windowId]}
            isActive={activeWindow === windowId && !minimizedWindows.includes(windowId)}
            isMinimized={minimizedWindows.includes(windowId)}
            onClick={handleTaskClick}
            onClose={handleCloseWindow}
          />
        ))}
      </div>

      <div className="taskbar-clock" role="timer" aria-live="polite" aria-label={`${formattedTime}, ${formattedDate}`}>
        <span className="taskbar-time">{formattedTime}</span>
        <span className="taskbar-date">{formattedDate}</span>
      </div>
    </div>
  );
};

export default Taskbar;