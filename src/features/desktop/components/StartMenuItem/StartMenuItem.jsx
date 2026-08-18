import { useState, useRef, useEffect } from "react";

const StartMenuItem = ({
  item,
  onSelect,
  level = 0
}) => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });
  const itemRef = useRef(null);
  const submenuRef = useRef(null);

  useEffect(() => {
    if (showSubmenu && itemRef.current && submenuRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      const submenuRect = submenuRef.current.getBoundingClientRect();
      
      let left = rect.right;
      let top = rect.top;

      if (left + submenuRect.width > window.innerWidth) {
        left = rect.left - submenuRect.width;
      }

      if (top + submenuRect.height > window.innerHeight) {
        top = window.innerHeight - submenuRect.height;
      }

      setSubmenuPosition({ top, left });
    }
  }, [showSubmenu]);

  const handleClick = (e) => {
    e.stopPropagation();
    
    if (item.type === 'separator') return;
    if (item.submenu && item.submenu.length > 0) {
      setShowSubmenu(!showSubmenu);
      return;
    }
    
    if (item.action === 'shutdown') {
      onSelect?.('shutdown');
      return;
    }
    
    if (item.window) {
      onSelect?.(item.window);
    }
  };

  const handleMouseEnter = () => {
    if (item.submenu && item.submenu.length > 0) {
      setShowSubmenu(true);
    }
  };

  const handleMouseLeave = (e) => {
    if (!e.relatedTarget || !e.relatedTarget.closest('.start-menu-submenu')) {
      setShowSubmenu(false);
    }
  };

  if (item.type === 'separator') {
    return <div className="start-menu-separator" role="separator" />;
  }

  return (
    <>
      <div
        ref={itemRef}
        className="start-menu-item"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="menuitem"
        aria-haspopup={item.submenu && item.submenu.length > 0 ? 'true' : 'false'}
        aria-expanded={showSubmenu}
      >
        {item.icon && (
          <img className="start-menu-item-icon" src={item.icon} alt="" />
        )}
        <span className="start-menu-item-text">{item.label}</span>
        {item.submenu && item.submenu.length > 0 && (
          <span className="start-menu-arrow" aria-hidden="true" />
        )}
        {item.shortcut && (
          <span className="start-menu-item-shortcut">{item.shortcut}</span>
        )}
      </div>

      {showSubmenu && item.submenu && item.submenu.length > 0 && (
        <div
          ref={submenuRef}
          className="start-menu-submenu"
          role="menu"
          style={{ top: submenuPosition.top, left: submenuPosition.left }}
          onMouseLeave={handleMouseLeave}
        >
          {item.submenu.map((subItem, index) => (
            <StartMenuItem
              key={`${item.id}-${subItem.id}-${index}`}
              item={subItem}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default StartMenuItem;