// By @0xDaffodi, Hope you'all like pet-on-window!
import { useRef, useEffect, useState, useCallback } from 'react';
import { PET_WIDTH } from '../constants/media';

interface UseGifSpeedControlProps {
  gifUrl: string;
  speed?: number;
  autoPlay?: boolean;
}

export const useGifSpeedControl = ({ 
  gifUrl, 
  speed = 1.0, 
  autoPlay = true 
}: UseGifSpeedControlProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frames, setFrames] = useState<any[]>([]);
  const [frameDelays, setFrameDelays] = useState<number[]>([]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gifDimensions, setGifDimensions] = useState<{width: number, height: number} | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // load gif
  useEffect(() => {
    const loadGif = async () => {
      try {
        const response = await fetch(gifUrl);
        const buffer = await response.arrayBuffer();
        
        const { parseGIF, decompressFrames } = await import('gifuct-js');
        const gif = parseGIF(buffer);
        const decompressedFrames = decompressFrames(gif, true);
        
        setFrames(decompressedFrames);
        setFrameDelays(decompressedFrames.map((f: any) => f.delay * 1)); 
        
        if (decompressedFrames.length > 0) {
          const firstFrame = decompressedFrames[0];
          setGifDimensions({
            width: firstFrame.dims.width,
            height: firstFrame.dims.height
          });
          console.log('GIF dimensions:', firstFrame.dims.width, firstFrame.dims.height);
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading GIF:', error);
      }
    };

    loadGif();
  }, [gifUrl]);

  useEffect(() => {
    if (canvasRef.current && gifDimensions) {
      canvasRef.current.width = gifDimensions.width;
      canvasRef.current.height = gifDimensions.height;
      console.log('Canvas size set:', gifDimensions.width, gifDimensions.height);
    }
  }, [gifDimensions, isLoaded]);

  const renderFrame = useCallback((index: number) => {
    if (!canvasRef.current || !frames.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frame = frames[index];
    if (!frame) return;

    const imageData = ctx.createImageData(frame.dims.width, frame.dims.height);
    imageData.data.set(frame.patch);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, frame.dims.left, frame.dims.top);
  }, [frames]);

  const play = useCallback(() => {
    if (!frames.length || !isPlaying) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // render current frame
    renderFrame(frameIndex);

    // calculate delay (adjust according to speed)
    let delay = frameDelays[frameIndex] / speed;
    if (delay < 15) delay = 15; // limit minimum frame interval

    // set next frame
    timerRef.current = setTimeout(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, delay);
  }, [frames, frameDelays, frameIndex, speed, isPlaying, renderFrame]);

  // when frame index or play state changes, play
  useEffect(() => {
    if (isLoaded && isPlaying) {
      play();
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [frameIndex, isPlaying, isLoaded, play]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const pause = () => setIsPlaying(false);
  const resume = () => setIsPlaying(true);

  return {
    canvasRef,
    isLoaded,
    isPlaying,
    frameIndex,
    totalFrames: frames.length,
    gifDimensions,
    togglePlay,
    pause,
    resume
  };
};