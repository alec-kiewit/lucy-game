import { Hotspot } from "../@interfaces/Hotspot";

export const createDoor = (
  inventory: { name: string }[],
  showMessage: (message: string) => void
): Hotspot => {
  return {
    x: 100,
    y: 200,
    width: 80,
    height: 120,
    color: "brown",
    onClick: () => {
      const hasKey = inventory.some((item) => item.name === "Key");
      if (hasKey) {
        showMessage("You opened the door!");
      } else {
        showMessage("The door is locked. You need a key.");
      }
    },
    draw: function (ctx: CanvasRenderingContext2D): void {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(
        this.x + this.width - 10,
        this.y + this.height / 2,
        5,
        0,
        Math.PI * 2
      ); // door knob
      ctx.fill();
    },
  };
};
