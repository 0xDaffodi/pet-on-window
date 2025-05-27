declare module 'sprite-gif' {
  interface SpriteGifOptions {
    sprite: string;
  }

  class SpriteGif {
    constructor(element: HTMLElement | null, options: SpriteGifOptions);
    play(): void;
    pause(): void;
    stop(): void;
    setLoop(loop: boolean): void;
    setSpeed(speed: number): void;
    setFrameRate(frameRate: number): void;
  }

  export default SpriteGif;
}