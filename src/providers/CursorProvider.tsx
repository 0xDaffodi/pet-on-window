// By @0xDaffodi, Hope you'all like pet-on-window!
import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { availableMonitors, primaryMonitor, LogicalPosition, LogicalSize, cursorPosition } from '@tauri-apps/api/window';
import { PET_WIDTH, MARGIN } from '../constants/media';
import { useNavigate } from 'react-router-dom';

interface CursorContextType {
  scale: number;
  hasDragging: boolean;
  setHasDragging: (hasDragging: boolean) => void;
  petPhyPos: {
    x: number;
    y: number;
    petWidth: number;
  };
  setPetPhyPos: (petPhyPos: { x: number; y: number; petWidth: number }) => void;
  initPetPhyPos: {
    x: number;
    y: number;
    petWidth: number;
  };
  setInitPetPhyPos: (initPetPhyPos: { x: number; y: number; petWidth: number }) => void;
  windowLogicalSize: {
    width: number;
    height: number;
  };
  setWindowLogicalSize: (windowLogicalSize: { width: number; height: number }) => void;
  isInPetRoute: boolean;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

interface CursorProviderProps {
  children: ReactNode;
}

export const CursorProvider: React.FC<CursorProviderProps> = ({ children }) => {
  const [petPhyPos, setPetPhyPos] = useState<{ x: number; y: number; petWidth: number }>({ x: 0, y: 0, petWidth: 0 });
  const [hasDragging, setHasDragging] = useState(false);
  const lastIgnoreState = useRef<boolean | null>(null);
  const [initPetPhyPos, setInitPetPhyPos] = useState<{ x: number; y: number; petWidth: number }>({ x: 0, y: 0, petWidth: 0 });
  const [scale, setScale] = useState(1);
  const [windowLogicalSize, setWindowLogicalSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isInPetRoute, setIsInPetRoute] = useState(true);

  
  /**
   * Init Pet Transparent Window to the bottom right corner of the screen
   * @returns 
   */
  const initPetWindow = async () => {
    try {

      // get current window
      const window = getCurrentWindow();
      // get primary monitor
      const monitor = await primaryMonitor();

      if (!monitor) {
        return;
      }
      
      // calculate logical resolution (physical resolution / scale factor)
      const scale = monitor.scaleFactor;
      setScale(scale);

      const logicalWidth = monitor.size.width / scale;
      const logicalHeight = monitor.size.height / scale; // todo: check this
      
      const x = MARGIN;
      const y = MARGIN;
      
      // set window position
      await window.setPosition(new LogicalPosition(x, y));
      await window.setSize(new LogicalSize(logicalWidth - MARGIN*2, logicalHeight - MARGIN*2));
      setWindowLogicalSize({ width: logicalWidth - MARGIN*2, height: logicalHeight - MARGIN*2 });
      
      console.log(`window moved to bottom right corner: (${x}, ${y})`);
      
      // init pet box physical pos
      const petWidth = PET_WIDTH * scale;
      const petX = monitor.size.width - petWidth - MARGIN * 2;
      const petY = monitor.size.height - petWidth - MARGIN * 2;
      console.log(`pet box physical pos: (${petX}, ${petY}), pet width: ${petWidth}`);

      setPetPhyPos({ x: petX, y: petY, petWidth });
      setInitPetPhyPos({ x: petX, y: petY, petWidth });
    } catch (error) {
      console.error('move window failed:', error);
    }
  }

  useEffect(() => {
    const window = getCurrentWindow();
    const label = window.label;
    if (label === 'main') {
      setIsInPetRoute(true);
      initPetWindow();
    } else if (label === 'dashboard') {
      setIsInPetRoute(false);
      window.onCloseRequested((event) => {
        event.preventDefault();
        window.hide();
      });
    }
  }, []);

  /**
   * check Cursor-Ignore-Events
   */
  useEffect(() => {
    if (hasDragging || !isInPetRoute) {
      return;
    }

    const window = getCurrentWindow();
    const interval = setInterval(async () => {
      try {
        const pos = await cursorPosition();
        const isInPetArea = pos.x >= petPhyPos.x && 
                           pos.x <= petPhyPos.x + petPhyPos.petWidth && 
                           pos.y >= petPhyPos.y && 
                           pos.y <= petPhyPos.y + petPhyPos.petWidth;
        
        const shouldIgnore = !isInPetArea;
        
        if (lastIgnoreState.current !== shouldIgnore) {
          lastIgnoreState.current = shouldIgnore;
          await window.setIgnoreCursorEvents(shouldIgnore);
        }
      } catch (error) {
        console.error('Error checking cursor position:', error);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [petPhyPos.x, petPhyPos.y, petPhyPos.petWidth, hasDragging, isInPetRoute]);




  const value: CursorContextType = {
    scale,
    petPhyPos,
    setPetPhyPos,
    hasDragging,
    setHasDragging,
    initPetPhyPos,
    setInitPetPhyPos,
    windowLogicalSize,
    setWindowLogicalSize,
    isInPetRoute,
  };

  return (
    <CursorContext.Provider value={value}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = (): CursorContextType => {
  const context = useContext(CursorContext);
  
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  
  return context;
};
