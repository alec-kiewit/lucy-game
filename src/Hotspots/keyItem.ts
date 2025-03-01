import { Hotspot } from "../@interfaces";

export const createKeyItem = (
  inventory: any[],
  hotspots: any[],
  showMessage: (message: string) => void
): Hotspot => {
  const keyItem: Hotspot = {
    x: 400,
    y: 300,
    width: 20,
    height: 20,
    color: "yellow",
    onClick: () => {
      showMessage("You picked up a key!");
      inventory.push({
        name: "Key",
        color: "yellow",
        draw: keyItem.draw,
      });
      // Remove hotspot so item disappears.
      const index = hotspots.indexOf(keyItem);
      if (index > -1) {
        hotspots.splice(index, 1);
      }
    },
    draw: function (this: Hotspot, ctx: CanvasRenderingContext2D): void {
      ctx.fillStyle = this.color;

      // 1) Draw the circular “ring” of the key
      ctx.beginPath();
      // Center the ring around (this.x + 10, this.y + 10) and use a radius of 10
      ctx.arc(this.x + 10, this.y + 10, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      // 2) Draw the key shaft with notches
      ctx.beginPath();
      // Start at the right edge of the ring
      ctx.moveTo(this.x + 20, this.y + 7);

      // Move to the right, going outward for the shaft
      ctx.lineTo(this.x + 35, this.y + 7);
      ctx.lineTo(this.x + 35, this.y + 3);
      ctx.lineTo(this.x + 40, this.y + 3);
      ctx.lineTo(this.x + 40, this.y + 7);

      // A small notch
      ctx.lineTo(this.x + 45, this.y + 7);
      ctx.lineTo(this.x + 45, this.y + 13);
      ctx.lineTo(this.x + 40, this.y + 13);

      // Another notch
      ctx.lineTo(this.x + 40, this.y + 17);
      ctx.lineTo(this.x + 35, this.y + 17);
      ctx.lineTo(this.x + 35, this.y + 13);

      // Close the shaft and fill
      ctx.lineTo(this.x + 20, this.y + 13);
      ctx.closePath();
      ctx.fill();
    },
  };

  return keyItem;
};
