// By @0xDaffodi, Hope you'all like pet-on-window!
import { useDragAndClick } from "../../hooks/useDragAndClickPet";
import { pokemons } from "../../assets"
import { useSystemInfo } from "../../hooks/useSystemInfo"
import { useGifSpeedControl } from "../../hooks/useGifSpeedControl"
import { useMemo, useEffect, useState } from "react"
import { PET_WIDTH } from "../../constants/media";
import { EVENTS, ChangePetSpiritPayload } from "../../constants/event"
import { listen } from "@tauri-apps/api/event"
import "./index.css"


export default function Pet() {
  const [currentSpirit, setCurrentSpirit] = useState(pokemons.find(pokemon => pokemon.index === 25)?.src);
  const { systemInfo } = useSystemInfo();

  // Listen Pet Spirit Event
  useEffect(() => {
    const unlisten = listen(EVENTS.CHANGE_PET_SPIRIT, (event) => {
      if (event.payload) {
        const spirit = (event.payload as ChangePetSpiritPayload).spirit;        
        setCurrentSpirit(spirit);        
      }
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, []);


  const { 
    position, 
    mouseHandlers, 
    cursorStyle 
  } = useDragAndClick({
    dragThreshold: 5,
    initialPosition: { bottom: 0, right: 0 },
    onDragStart: () => {
      // start drag.... meybe add something else logic here @0xDaffodi
    },
    onDragEnd: (finalPosition) => {
      // end drag.... meybe add something else logic here @0xDaffodi
      
    },
    onClick: () => {
      // click pet on window.... meybe add something else logic here @0xDaffodi
      // todo: temporarily disable this logic @0xDaffodi
      // leavePetRoute();
      // navigate('/dashboard');
    }
  });

  // Calculate playback speed based on CPU usage
  const playbackSpeed = useMemo(() => {
    if (!systemInfo?.cpu_usage) return 1.0;
    // CPU 0-100% map to 0.3-4.0x speed
    const normalizedCpu = Math.min(Math.max(systemInfo.cpu_usage, 0), 100) / 100;
    return 0.3 + (4.0 - 0.3) * normalizedCpu;
  }, [systemInfo?.cpu_usage]);

  const { canvasRef, isLoaded, togglePlay } = useGifSpeedControl({
    gifUrl: currentSpirit || "",
    speed: playbackSpeed,
    autoPlay: true
  });

  return (
    <div className="pet-container">
      {isLoaded ? (
        <div 
          className="pet" 
          id="pet" 
          {...mouseHandlers} 
          style={{ 
            cursor: cursorStyle,
            width: PET_WIDTH,
            height: PET_WIDTH,
            bottom: `${position.bottom}px`,
            right: `${position.right}px`,
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ 
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              imageRendering: 'pixelated'
            }}
          />
          <div className="progress" style={{ width: `${systemInfo?.cpu_usage}%` }}></div>
        </div>
        
      ) : (
        <div className="loading">Loading...</div>
      )}
      {/* <img 
        src={pikachu} 
        className="pet" 
        id="pet" 
        {...mouseHandlers}
        style={{ 
          cursor: cursorStyle,
          bottom: `${position.bottom}px`,
          right: `${position.right}px`
        }}
      /> */}
    </div>
  );
}