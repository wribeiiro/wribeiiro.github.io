import { useRef, useState, useCallback } from "react";
import { useDrag } from "../../hooks/useDrag";
import "./DesktopWindow.scss";

const DesktopWindow = ({
  id,
  title,
  icon,
  children,
  isActive,
  isMinimized = false,
  noPadding = false,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  initialPosition = { x: 50, y: 50 },
  initialSize = { width: 1280, height: 768 },
  initialMaximized = false,
  resizable = true,
  maximizable = true,
  minimizable = true,
  closable = true,
  "data-testid": testId
}) => {
  const windowRef = useRef(null);
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isMaximized, setIsMaximized] = useState(initialMaximized);
  const [previousSize, setPreviousSize] = useState(null);
  const [previousPosition, setPreviousPosition] = useState(null);

  const { handleMouseDown: handleTitleDrag } = useDrag(
    id,
    (_, pos) => setPosition(pos),
    position
  );

  const handleResize = useCallback((e, direction) => {
    if (!resizable || isMaximized) return;

    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startLeft = position.x;
    const startTop = position.y;

    const doDrag = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      if (direction.includes('e')) {
        newWidth = Math.max(200, startWidth + dx);
      }
      if (direction.includes('s')) {
        newHeight = Math.max(150, startHeight + dy);
      }
      if (direction.includes('w')) {
        newWidth = Math.max(200, startWidth - dx);
        newLeft = startLeft + (startWidth - newWidth);
      }
      if (direction.includes('n')) {
        newHeight = Math.max(150, startHeight - dy);
        newTop = startTop + (startHeight - newHeight);
      }

      const maxWidth = window.innerWidth - newLeft;
      const maxHeight = window.innerHeight - newTop - 28;
      newWidth = Math.min(newWidth, maxWidth);
      newHeight = Math.min(newHeight, maxHeight);

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newLeft, y: newTop });
    };

    const stopDrag = () => {
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
    document.body.style.userSelect = "none";
    document.body.style.cursor = `${direction}-resize`;
  }, [resizable, isMaximized, size, position]);

  const handleDoubleClickTitle = useCallback(() => {
    if (maximizable) {
      handleMaximize();
    }
  }, [maximizable]);

  const handleMaximize = useCallback(() => {
    if (!maximizable) return;

    if (isMaximized) {
      setSize(previousSize || initialSize);
      setPosition(previousPosition || initialPosition);
      setIsMaximized(false);
    } else {
      setPreviousSize(size);
      setPreviousPosition(position);
      const taskbarHeight = 40;
      setSize({ width: window.innerWidth, height: window.innerHeight - taskbarHeight });
      setPosition({ x: 0, y: 0 });
      setIsMaximized(true);
    }
  }, [maximizable, isMaximized, size, position, initialSize, initialPosition]);

  const handleClose = useCallback(() => {
    onClose?.(id);
  }, [id, onClose]);

  const handleMinimize = useCallback(() => {
    onMinimize?.(id);
  }, [id, onMinimize]);

  const handleTitleClick = useCallback(() => {
    onFocus?.(id);
  }, [id, onFocus]);

  const style = isMaximized
    ? {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: `calc(100vh - 40px)`,
        maxWidth: 'none',
        maxHeight: 'none',
        zIndex: isActive ? 200 : 100,
        display: isMinimized ? 'none' : undefined,
      }
    : {
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: isActive ? 200 : 100,
        display: isMinimized ? 'none' : undefined,
      };

  return (
    <div
      ref={windowRef}
      className={`window ${!isActive ? 'inactive' : ''}`}
      style={style}
      onMouseDown={handleTitleClick}
      data-testid={testId || `window-${id}`}
      role="dialog"
      aria-labelledby={`${id}-title`}
    >
      <div
        className="window-titlebar"
        onMouseDown={handleTitleDrag}
        onDoubleClick={handleDoubleClickTitle}
      >
        {icon && <img className="window-title-icon" src={icon} alt="" />}
        <span id={`${id}-title`} className="window-title-text">{title}</span>
        <div className="window-controls">
          {minimizable && (
            <button
              className="window-control-btn minimize-btn"
              onClick={(e) => { e.stopPropagation(); handleMinimize(); }}
              title="Minimize"
              aria-label="Minimize"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect x="1" y="7" width="8" height="2" fill="currentColor"/>
              </svg>
            </button>
          )}
          {maximizable && (
            <button
              className="window-control-btn maximize-btn"
              onClick={(e) => { e.stopPropagation(); handleMaximize(); }}
              title={isMaximized ? "Restore" : "Maximize"}
              aria-label={isMaximized ? "Restore" : "Maximize"}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                {isMaximized ? (
                  <>
                    <rect x="2" y="2" width="6" height="6" stroke="currentColor" strokeWidth="1"/>
                    <rect x="4" y="4" width="4" height="4" stroke="currentColor" strokeWidth="1" fill="#c0c0c0"/>
                  </>
                ) : (
                  <rect x="2" y="2" width="6" height="6" stroke="currentColor" strokeWidth="1"/>
                )}
              </svg>
            </button>
          )}
          {closable && (
            <button
              className="window-control-btn close-btn"
              onClick={(e) => { e.stopPropagation(); handleClose(); }}
              title="Close"
              aria-label="Close"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="window-content" style={noPadding ? { padding: 0, overflow: 'hidden' } : undefined}>
        {children}
      </div>

      {resizable && !isMaximized && (
        <>
          <div className="window-resize-handle se" onMouseDown={(e) => handleResize(e, 'se')} aria-hidden="true" />
          <div className="window-resize-handle s" onMouseDown={(e) => handleResize(e, 's')} aria-hidden="true" />
          <div className="window-resize-handle e" onMouseDown={(e) => handleResize(e, 'e')} aria-hidden="true" />
        </>
      )}
    </div>
  );
};

export default DesktopWindow;