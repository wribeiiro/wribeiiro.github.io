import { useRef, useEffect } from "react";
import { menuItems } from "../../../../data/menuItems";
import StartMenuItem from "../StartMenuItem/StartMenuItem";

const Start = ({
  showStartMenu,
  setShowStartMenu,
  handleOpenWindow,
  onShutdown
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest('.taskbar-start-btn')) {
        setShowStartMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowStartMenu]);

  const handleItemSelect = (action) => {
    if (action === 'shutdown') {
      onShutdown?.();
      setShowStartMenu(false);
      return;
    }

    handleOpenWindow?.(action);
    setShowStartMenu(false);
  };

  return (
    <>
      {showStartMenu && (
        <div
          ref={menuRef}
          className="start-menu"
          role="menu"
          aria-label="Menu Start"
          style={{ bottom: '28px', left: '0' }}
        >
          <div className="start-menu-header">
            <img className="start-menu-header-icon" src="/assets/icons/w98_windows.ico" alt="" />
            <span className="start-menu-header-text">Start</span>
          </div>

          <div className="start-menu-items" role="menu">
            {menuItems.map((item, index) => (
              <StartMenuItem
                key={item.id || index}
                item={item}
                onSelect={handleItemSelect}
              />
            ))}
          </div>

          <div className="start-menu-footer">
            <button
              className="start-menu-footer-btn"
              onClick={() => handleItemSelect('shutdown')}
              title="Shut down the computer"
            >
              <img className="start-menu-footer-icon" src="/assets/icons/w98_shut_down_normal.ico" alt="" />
              <span>Shut Down</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Start;