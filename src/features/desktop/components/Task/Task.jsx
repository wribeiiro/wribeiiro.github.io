const Task = ({
  id,
  title,
  icon,
  isActive,
  isMinimized = false,
  onClick,
  onClose,
  "data-testid": testId
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onClick?.(id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <div
      className={`taskbar-task ${isActive ? 'active' : ''} ${isMinimized ? 'minimized' : ''}`}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onContextMenu={handleClick}
      onKeyDown={handleKeyDown}
      data-testid={testId || `task-${id}`}
      aria-pressed={isActive}
      aria-label={title}
      title={title}
    >
      {icon && <img className="taskbar-task-icon" src={icon} alt="" />}
      <span className="taskbar-task-text">{title}</span>
    </div>
  );
};

export default Task;