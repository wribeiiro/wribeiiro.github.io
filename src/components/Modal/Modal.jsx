const Modal = ({
  isOpen,
  title,
  icon,
  children,
  onClose,
  width = 1024,
  height = 768,
  resizable = false,
  "data-testid": testId
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose?.();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? `${title.replace(/\s+/g, '-').toLowerCase()}-title` : undefined}
    >
      <div
        className="modal"
        style={{ 
          width: `${width}px`, 
          maxWidth: '95vw',
          height: `${height}px`,
          maxHeight: '95vh'
        }}
        data-testid={testId}
      >
        {(title || icon) && (
          <div className="window-titlebar">
            {icon && <img className="window-title-icon" src={icon} alt="" />}
            {title && <span className="window-title-text">{title}</span>}
            <div className="window-controls">
              <button
                className="window-control-btn close-btn"
                onClick={onClose}
                title="Close"
                aria-label="Close"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <div className="window-content" style={{ overflow: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;