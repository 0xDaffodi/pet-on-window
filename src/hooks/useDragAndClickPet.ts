import { useState, useEffect, useCallback } from 'react';
import { useCursor } from '../providers/CursorProvider';
import { PET_WIDTH } from '../constants/media';
import { LogicalSize } from '@tauri-apps/api/window';

interface Position {
  bottom: number;
  right: number;
}

interface UseDragAndClickOptions {
  dragThreshold?: number;
  initialPosition?: Position;
  onDragStart?: () => void;
  onDragMove?: (deltaX: number, deltaY: number) => void;
  onDragEnd?: (position: Position) => void;
  onClick?: () => void;
}

export const useDragAndClick = (options: UseDragAndClickOptions = {}) => {
  const {
    dragThreshold = 5,
    initialPosition = { bottom: 0, right: 0 },
    onDragStart,
    onDragMove,
    onDragEnd,
    onClick
  } = options;

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState<Position>(initialPosition);

  // reset pet physical position when drag end
  const { 
    petPhyPos, 
    setPetPhyPos, 
    scale, 
    hasDragging, 
    setHasDragging, 
    initPetPhyPos,
    windowLogicalSize
  } = useCursor();

  const handleDocumentMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance > dragThreshold && !hasDragging) {
        setHasDragging(true);
        onDragStart?.();
      }
      
      if (hasDragging) {
        const newPosition = {
          right: position.right - deltaX,
          bottom: position.bottom - deltaY
        };
        setPosition(newPosition);
        setDragStart({
          x: e.clientX,
          y: e.clientY
        });
        onDragMove?.(deltaX, deltaY);
      }
    }
  }, [isDragging, dragStart, dragThreshold, hasDragging, position, onDragStart, onDragMove]);

  const handleDocumentMouseUp = useCallback(() => {
    if (isDragging) {
      if (hasDragging) {
        // console.log(`Final Position: bottom=${position.bottom}, right=${position.right}`);
        // reset position when drag end, pet cannot move out of window
        let correctedRight = position.right;
        let correctedBottom = position.bottom;
        
        if (correctedRight < 0) {
          correctedRight = 0;
        } else if (correctedRight > windowLogicalSize.width - PET_WIDTH) {
          correctedRight = windowLogicalSize.width - PET_WIDTH;
        }
        
        if (correctedBottom < 0) {
          correctedBottom = 0;
        } else if (correctedBottom > windowLogicalSize.height - PET_WIDTH) {
          correctedBottom = windowLogicalSize.height - PET_WIDTH;
        }
        
        const correctedPosition = {
          right: correctedRight,
          bottom: correctedBottom
        };
        setPosition(correctedPosition);
        
        setPetPhyPos({
          ...petPhyPos,
          x: initPetPhyPos.x - correctedPosition.right * scale,
          y: initPetPhyPos.y - correctedPosition.bottom * scale,
        });
        onDragEnd?.(correctedPosition);
      }
      setIsDragging(false);
    }
  }, [isDragging, hasDragging, position, windowLogicalSize, petPhyPos, setPetPhyPos, initPetPhyPos, scale, onDragEnd]);

  // when dragging, bind document mouse move and mouse up event
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDocumentMouseMove);
      document.addEventListener('mouseup', handleDocumentMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleDocumentMouseMove);
        document.removeEventListener('mouseup', handleDocumentMouseUp);
      };
    }
  }, [isDragging, handleDocumentMouseMove, handleDocumentMouseUp]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setHasDragging(false);
      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
      e.preventDefault();
    }
  };

  const handleClick = () => {
    if (!hasDragging) {
      console.log('Pet on Window!');
      onClick?.();
    }
    setHasDragging(false);
  };

  return {
    isDragging,
    position,
    
    mouseHandlers: {
      onMouseDown: handleMouseDown,
      onClick: handleClick,
    },
    
    cursorStyle: isDragging ? 'grabbing' : 'grab',
    
    resetPosition: () => setPosition(initialPosition)
  };
};