import Color from "colorjs.io";

class ColorManager {
  constructor() {
    this.supportsOKLCH = this.checkOKLCHSupport();
    this.colorPalette = this.generatePalette(50);
  }

  checkOKLCHSupport() {
    try {
      const testColor = new Color("oklch(0.5 0.1 180)");
      return testColor && testColor.oklch;
    } catch {
      return false;
    }
  }

  generatePalette(steps) {
    const palette = [];
    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const lightness = 0.5 + ratio * 0.3;
      const chroma = 0.1 + ratio * 0.2;
      const hue = 200 - ratio * 180;

      const colorStr = this.supportsOKLCH
        ? `oklch(${lightness} ${chroma} ${hue})`
        : `hsl(${hue}, ${50 + ratio * 30}%, ${50 + ratio * 30})`;

      palette.push(new Color(colorStr));
    }

    return palette;
  }

  getSpeedColor(speed, maxSpeed) {
    const speedRatio = Math.min(speed / maxSpeed, 1);
    const index = Math.floor(speedRatio * (this.colorPalette.length - 1));
    return this.colorPalette[Math.min(index, this.colorPalette.length - 1)];
  }
}

export default ColorManager;
