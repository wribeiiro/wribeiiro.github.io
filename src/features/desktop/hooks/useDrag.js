import { useState, useCallback, useRef, useEffect } from "react";

export const useDrag = (windowId, onUpdatePosition, initialPosition = { x: 50, y: 50 }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    onUpdatePosition?.(windowId, position);
  }, [position, windowId, onUpdatePosition]);

  const handleMouseDown = useCallback((e) => {
    if (e.target.classList.contains("window-control") || 
        e.target.closest(".window-controls") ||
        e.target.closest(".window-content")) {
      return;
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y
    };
    
    // Keep window within viewport
    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 150;
    newPosition.x = Math.max(0, Math.min(newPosition.x, maxX));
    newPosition.y = Math.max(0, Math.min(newPosition.y, maxY));
    
    setPosition(newPosition);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return { position, isDragging, handleMouseDown };
};
