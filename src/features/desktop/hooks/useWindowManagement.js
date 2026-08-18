import { useState, useCallback } from "react";

export const useWindowManagement = (initialWindows = ["about-me"]) => {
  const [windows, setWindows] = useState(initialWindows);
  const [minimizedWindows, setMinimizedWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(initialWindows[0] || "");
  const [windowPositions, setWindowPositions] = useState({});
  const [windowSizes, setWindowSizes] = useState({});
  const [zIndexes, setZIndexes] = useState({});
  let zIndexCounter = 100;

  const handleOpenWindow = useCallback((windowId) => {
    setWindows((prev) => {
      if (prev.includes(windowId)) return prev;
      return [...prev, windowId];
    });
    setMinimizedWindows((prev) => prev.filter((w) => w !== windowId));
    setActiveWindow(windowId);
    setZIndexes((prev) => ({ ...prev, [windowId]: ++zIndexCounter }));
  }, []);

  const handleCloseWindow = useCallback((windowId) => {
    setWindows((prev) => prev.filter((w) => w !== windowId));
    setMinimizedWindows((prev) => prev.filter((w) => w !== windowId));
    setActiveWindow("");
    setZIndexes((prev) => {
      const next = { ...prev };
      delete next[windowId];
      return next;
    });
  }, []);

  const handleMinimizeWindow = useCallback((windowId) => {
    setMinimizedWindows((prev) =>
      prev.includes(windowId) ? prev : [...prev, windowId]
    );
    setActiveWindow("");
  }, []);

  const handleRestoreWindow = useCallback((windowId) => {
    setMinimizedWindows((prev) => prev.filter((w) => w !== windowId));
    setActiveWindow(windowId);
    setZIndexes((prev) => ({ ...prev, [windowId]: ++zIndexCounter }));
  }, []);

  const handleMaximizeWindow = useCallback((windowId) => {
    // Toggle maximize state - handled internally by DesktopWindow
  }, []);

  const bringToFront = useCallback((windowId) => {
    setActiveWindow(windowId);
    setZIndexes((prev) => ({ ...prev, [windowId]: ++zIndexCounter }));
  }, []);

  const updateWindowPosition = useCallback((windowId, position) => {
    setWindowPositions((prev) => ({ ...prev, [windowId]: position }));
  }, []);

  const updateWindowSize = useCallback((windowId, size) => {
    setWindowSizes((prev) => ({ ...prev, [windowId]: size }));
  }, []);

  return {
    windows,
    minimizedWindows,
    activeWindow,
    windowPositions,
    windowSizes,
    zIndexes,
    handleOpenWindow,
    handleCloseWindow,
    handleMinimizeWindow,
    handleRestoreWindow,
    handleMaximizeWindow,
    bringToFront,
    updateWindowPosition,
    updateWindowSize,
    setActiveWindow
  };
};
