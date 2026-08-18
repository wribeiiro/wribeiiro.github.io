import { useMemo, Suspense, lazy } from "react";
import DesktopWindow from "../DesktopWindow/DesktopWindow";

const AboutWindow = lazy(() => import("../../windows/AboutWindow/AboutWindow"));
const ExperienceWindow = lazy(() => import("../../windows/ExperienceWindow/ExperienceWindow"));
const ContactWindow = lazy(() => import("../../windows/ContactWindow/ContactWindow"));
const IEWindow = lazy(() => import("../../windows/IEWindow/IEWindow"));
const WMPWindow = lazy(() => import("../../windows/WMPWindow/WMPWindow"));
const CSWindow = lazy(() => import("../../windows/CSWindow/CSWindow"));

const windowTitles = {
  'about-me': 'About Me',
  'experience': 'Experience',
  'contact': 'Contact',
  'ie': 'Internet Explorer',
  'wmp': 'Media Player',
  'cs16': 'CS',
};

const windowIcons = {
  'about-me': '/assets/icons/w98_computer_explorer.ico',
  'experience': '/assets/icons/w98_write_wordpad.ico',
  'contact': '/assets/icons/w98_modem.ico',
  'ie': '/assets/icons/w98_msie1.ico',
  'wmp': '/assets/icons/w98_wm.ico',
  'cs16': '/assets/icons/cstrike.ico',
};

const windowDefaultSizes = {
  'about-me':    { width: 720, height: 650 },
  'experience':  { width: 640, height: 560 },
  'contact':     { width: 720, height: 650 },
  'ie':       { width: 900, height: 640 },
  'wmp':      { width: 380, height: 440 },
  'cs16':     { width: 900, height: 640 },
};

const getCenteredPosition = (width, height) => {
  const taskbarHeight = 40;
  const availableWidth = window.innerWidth;
  const availableHeight = window.innerHeight - taskbarHeight;
  return {
    x: Math.max(0, Math.round((availableWidth - width) / 2)),
    y: Math.max(0, Math.round((availableHeight - height) / 2)),
  };
};

const Desktop = ({
  windows,
  minimizedWindows = [],
  activeWindow,
  windowPositions,
  windowSizes,
  zIndexes,
  handleOpenWindow,
  handleCloseWindow,
  handleMinimizeWindow,
  handleMaximizeWindow,
  bringToFront,
  updateWindowPosition,
  updateWindowSize,
  children
}) => {
  const sortedWindows = useMemo(() => {
    return [...windows].sort((a, b) => {
      const zA = zIndexes[a] || 100;
      const zB = zIndexes[b] || 100;
      return zA - zB;
    });
  }, [windows, zIndexes]);

  const getWindowComponent = (windowId) => {
    switch (windowId) {
      case 'about-me': return AboutWindow;
      case 'experience': return ExperienceWindow;
      case 'contact': return ContactWindow;
      case 'ie': return IEWindow;
      case 'wmp': return WMPWindow;
      case 'cs16': return CSWindow;
      default:
        return null;
    }
  };

  return (
    <div className="desktop" role="region" aria-label="Desktop">
      {children}

      {sortedWindows.map(windowId => {
        const WindowComponent = getWindowComponent(windowId);

        if (!WindowComponent) return null;

        return (
          <DesktopWindow
            key={windowId}
            id={windowId}
            title={windowTitles[windowId] || windowId}
            icon={windowIcons[windowId] || '/assets/icons/w98_executable.ico'}
            isActive={activeWindow === windowId}
            isMinimized={minimizedWindows.includes(windowId)}
            onClose={handleCloseWindow}
            onMinimize={handleMinimizeWindow}
            onMaximize={handleMaximizeWindow}
            onFocus={bringToFront}
            initialPosition={(() => {
              if (windowPositions[windowId]) return windowPositions[windowId];
              const size = windowSizes[windowId] || windowDefaultSizes[windowId] || { width: 680, height: 520 };
              return getCenteredPosition(size.width, size.height);
            })()}
            initialSize={windowSizes[windowId] || windowDefaultSizes[windowId] || { width: 680, height: 520 }}
            initialMaximized={windowId === 'cs16' || windowId === 'experience'}
            noPadding={windowId === 'ie' || windowId === 'wmp' || windowId === 'cs16' || windowId === 'experience'}
          >
            <Suspense fallback={<div style={{padding: '20px', textAlign: 'center'}}>Loading...</div>}>
              <WindowComponent
                windowId={windowId}
                onClose={handleCloseWindow}
              />
            </Suspense>
          </DesktopWindow>
        );
      })}
    </div>
  );
};

export default Desktop;