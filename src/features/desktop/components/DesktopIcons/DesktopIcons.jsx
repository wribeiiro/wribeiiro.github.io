import { useState, useCallback, useEffect, useRef } from "react";
import DesktopIcon from "../DesktopIcon/DesktopIcon";
import { contactInfo } from "../../../../data/contactInfo";

const DESKTOP_ICONS = [
  { id: 'about-me', label: 'About Me', icon: '/assets/icons/w98_computer_explorer.ico' },
  { id: 'experience', label: 'Experience', icon: '/assets/icons/w98_write_wordpad.ico' },
  { id: 'contact', label: 'Contact', icon: '/assets/icons/w98_modem.ico' },
  { id: 'github', label: 'GitHub', icon: '/assets/icons/w2k_internet_document.ico', isShortcut: true },
  { id: 'linkedin', label: 'LinkedIn', icon: '/assets/icons/w2k_internet_document.ico', isShortcut: true },
  { id: 'ie', label: 'Internet Explorer', icon: '/assets/icons/w98_msie1.ico' },
  { id: 'wmp', label: 'Media Player', icon: '/assets/icons/w98_wm.ico' },
  { id: 'cs16', label: 'CS', icon: '/assets/icons/cstrike.ico' },
];

const ICON_SIZE = 80;
const ICON_GAP = 16;
const START_TOP = 12;
const START_LEFT = 12;
const ICON_LAYOUT_VERSION = 10; // bump to reset saved layout

const getDefaultPositions = () => {
  const availableWidth = window.innerWidth - START_LEFT * 2;
  const iconsPerRow = Math.max(1, Math.floor(availableWidth / (ICON_SIZE + ICON_GAP)));
  return DESKTOP_ICONS.map((icon, index) => ({
    ...icon,
    position: {
      x: START_LEFT + (index % iconsPerRow) * (ICON_SIZE + ICON_GAP),
      y: START_TOP + Math.floor(index / iconsPerRow) * (ICON_SIZE + ICON_GAP + 20)
    }
  }));
};

const DesktopIcons = ({ handleOpenWindow, handleIconContextMenu }) => {
  const [icons, setIcons] = useState(() => {
    const saved = localStorage.getItem('win98-icon-positions');
    const savedVersion = localStorage.getItem('win98-icon-layout-version');
    const defaultIcons = getDefaultPositions();
    // If version mismatch, ignore saved layout
    if (saved && savedVersion === String(ICON_LAYOUT_VERSION)) {
      try {
        const parsed = JSON.parse(saved);
        // Merge saved positions with current DESKTOP_ICONS (by id) to keep updated icons
        return defaultIcons.map(def => {
          const savedIcon = parsed.find(p => p.id === def.id);
          if (savedIcon && savedIcon.position) {
            return { ...def, position: savedIcon.position };
          }
          return def;
        });
      } catch {
        return defaultIcons;
      }
    }
    // version mismatch or no saved -> use defaults
    return defaultIcons;
  });

  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectionRect, setSelectionRect] = useState(null);
  const selectionStartRef = useRef(null);

  // Recalculate positions on window resize
  useEffect(() => {
    const handleResize = () => {
      setIcons(getDefaultPositions());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('win98-icon-positions', JSON.stringify(icons));
    localStorage.setItem('win98-icon-layout-version', String(ICON_LAYOUT_VERSION));
  }, [icons]);

  const handleIconClick = useCallback((id, e) => {
    if (e.ctrlKey || e.metaKey) {
      setSelectedIcon(prev => {
        if (prev && prev.includes(id)) {
          return prev.filter(i => i !== id);
        }
        return [...(prev || []), id];
      });
    } else {
      setSelectedIcon([id]);
    }
    setSelectionRect(null);
  }, []);

  const handleIconDoubleClick = useCallback((id) => {
    if (id === 'github') {
      window.open(contactInfo.github.link, '_blank', 'noopener,noreferrer');
      return;
    }
    if (id === 'linkedin') {
      window.open(contactInfo.linkedin.link, '_blank', 'noopener,noreferrer');
      return;
    }
    handleOpenWindow?.(id);
  }, [handleOpenWindow]);

  const handleIconRightClick = useCallback((id, e) => {
    setSelectedIcon([id]);
    handleIconContextMenu?.(id, e);
  }, [handleIconContextMenu]);

  const handleIconDragStart = useCallback((id, e) => {
    if (e.button !== 0) return;

    const icon = icons.find(i => i.id === id);
    if (!icon) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = icon.position.x;
    const startTop = icon.position.y;

    const doDrag = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      setIcons(prev => prev.map(i =>
        i.id === id
          ? { ...i, position: { x: startLeft + dx, y: startTop + dy } }
          : i
      ));
    };

    const stopDrag = () => {
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'move';
  }, [icons]);

  const handleDesktopMouseDown = useCallback((e) => {
    if (e.target.closest('.desktop-icon')) return;

    selectionStartRef.current = {
      x: e.clientX,
      y: e.clientY
    };
    setSelectionRect({
      x: e.clientX,
      y: e.clientY,
      width: 0,
      height: 0
    });
    setSelectedIcon([]);
  }, []);

  const handleDesktopMouseMove = useCallback((e) => {
    if (!selectionStartRef.current) return;

    const start = selectionStartRef.current;
    const x = Math.min(start.x, e.clientX);
    const y = Math.min(start.y, e.clientY);
    const width = Math.abs(e.clientX - start.x);
    const height = Math.abs(e.clientY - start.y);

    setSelectionRect({ x, y, width, height });

    // Select icons within rectangle
    setIcons(prev => prev.map(icon => {
      const iconRect = {
        left: icon.position.x,
        top: icon.position.y,
        right: icon.position.x + ICON_SIZE,
        bottom: icon.position.y + ICON_SIZE + 20
      };

      const inSelection = !(
        iconRect.right < x ||
        iconRect.left > x + width ||
        iconRect.bottom < y ||
        iconRect.top > y + height
      );

      return { ...icon, _selected: inSelection };
    }));
  }, []);

  const handleDesktopMouseUp = useCallback(() => {
    if (selectionStartRef.current) {
      selectionStartRef.current = null;
      setSelectionRect(null);
      setIcons(prev => prev.map(icon => {
        const newSelected = icon._selected ? [icon.id] : [];
        return { ...icon, _selected: undefined };
      }));
      setSelectedIcon(prev => {
        const newlySelected = icons.filter(i => i._selected).map(i => i.id);
        return [...new Set([...(prev || []), ...newlySelected])];
      });
    }
  }, [icons]);

  return (
    <div
      className="desktop-icons"
      onMouseDown={handleDesktopMouseDown}
      onMouseMove={handleDesktopMouseMove}
      onMouseUp={handleDesktopMouseUp}
      onClick={() => setSelectedIcon([])}
    >
      {selectionRect && (
        <div
          className="desktop-selection"
          style={{
            left: `${selectionRect.x}px`,
            top: `${selectionRect.y}px`,
            width: `${selectionRect.width}px`,
            height: `${selectionRect.height}px`
          }}
        />
      )}

      {icons.map(icon => (
        <DesktopIcon
          key={icon.id}
          id={icon.id}
          label={icon.label}
          icon={icon.icon}
          position={icon.position}
          isSelected={selectedIcon?.includes(icon.id)}
          isShortcut={icon.isShortcut || false}
          onClick={handleIconClick}
          onDoubleClick={handleIconDoubleClick}
          onRightClick={handleIconRightClick}
          onDragStart={handleIconDragStart}
        />
      ))}
    </div>
  );
};

export default DesktopIcons;