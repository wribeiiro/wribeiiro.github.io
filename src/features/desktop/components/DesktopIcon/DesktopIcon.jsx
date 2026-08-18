import { useRef, useEffect, useState } from "react";

const DesktopIcon = ({
  id,
  label,
  icon,
  position,
  isSelected,
  isShortcut = false,
  onClick,
  onDoubleClick,
  onRightClick,
  onDragStart,
  "data-testid": testId
}) => {
  const iconRef = useRef(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (position && iconRef.current) {
      iconRef.current.style.left = `${position.x}px`;
      iconRef.current.style.top = `${position.y}px`;
    }
  }, [position]);

  const handleClick = (e) => {
    e.stopPropagation();
    onClick?.(id, e);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    onDoubleClick?.(id, e);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRightClick?.(id, e);
  };

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      e.stopPropagation();
      onDragStart?.(id, e);
    }
  };

  return (
    <div
      ref={iconRef}
      className={`desktop-icon ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      data-testid={testId || `icon-${id}`}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={isSelected}
      style={{ position: 'absolute' }}
    >
      {!imgError && icon ? (
        <div style={{ position: 'relative', width: '32px', height: '32px' }}>
          <img
            className="desktop-icon-image"
            src={icon}
            alt=""
            onError={() => setImgError(true)}
            draggable={false}
          />
          {isShortcut && (
            <svg
              width="10" height="10"
              viewBox="0 0 10 10"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                filter: 'drop-shadow(0 0 1px #000)',
              }}
            >
              <polygon points="1,1 9,1 9,3 3,3 3,9 1,9" fill="#ffffff"/>
              <polygon points="2,2 8,2 8,5 6,3 3,3 3,6 5,8 2,8" fill="#000000"/>
              <polygon points="1,4 1,9 6,9 4,7 4,4" fill="#ffffff"/>
              <path d="M1,3 L1,9 L7,9" fill="none" stroke="#000" strokeWidth="0.5"/>
            </svg>
          )}
        </div>
      ) : (
        <div className="desktop-icon-image" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#c0c0c0',
          border: '1px inset #c0c0c0',
          fontSize: '16px'
        }}>
          📄
        </div>
      )}
      <span className="desktop-icon-label">{label}</span>
    </div>
  );
};

export default DesktopIcon;