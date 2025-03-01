/*
Example: Simple Point-and-Click Adventure in TypeScript
with Canvas-based vector graphics.

Place this in src/main.ts, and run `npm run dev` with Vite.
Open http://localhost:5173/ to see.
*/

// 1) Define interfaces for hotspots & items.
interface Hotspot {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  onClick: () => void;
}

interface InventoryItem {
  name: string;
  color: string;
}

// 2) Basic Game class.
class PointClickGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private hotspots: Hotspot[] = [];
  private inventory: InventoryItem[] = [];

  constructor(canvasId: string) {
    const canvasEl = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvasEl) throw new Error("Canvas not found");
    this.canvas = canvasEl;

    const ctx2d = this.canvas.getContext("2d");
    if (!ctx2d) throw new Error("2D context not available");
    this.ctx = ctx2d;

    // Bind event
    this.canvas.addEventListener("click", (e) => this.onCanvasClick(e));

    // Start the game loop
    requestAnimationFrame(() => this.gameLoop());
  }

  // 3) Initialize the scene with hotspots.
  initScene() {
    // Example hotspot: a door.
    const door: Hotspot = {
      x: 100,
      y: 200,
      width: 80,
      height: 120,
      color: "brown",
      onClick: () => {
        alert("You opened the door!");
      },
    };

    // Example hotspot: an item on the ground.
    const keyItem: Hotspot = {
      x: 400,
      y: 300,
      width: 20,
      height: 20,
      color: "yellow",
      onClick: () => {
        alert("You picked up a key!");
        this.inventory.push({ name: "Key", color: "yellow" });
        // Remove hotspot so item disappears.
        this.hotspots = this.hotspots.filter((h) => h !== keyItem);
      },
    };

    // Add them
    this.hotspots.push(door);
    this.hotspots.push(keyItem);
  }

  // 4) Main game loop: update + draw.
  private gameLoop() {
    // Clear screen
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background (just a solid color for simplicity)
    this.ctx.fillStyle = "skyblue";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw hotspots
    for (const hotspot of this.hotspots) {
      this.ctx.fillStyle = hotspot.color;
      this.ctx.fillRect(hotspot.x, hotspot.y, hotspot.width, hotspot.height);
    }

    // Draw inventory bar at bottom
    this.drawInventoryBar();

    // Request next frame
    requestAnimationFrame(() => this.gameLoop());
  }

  // 5) Handle clicks
  private onCanvasClick(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check hotspots
    for (const hotspot of this.hotspots) {
      if (
        mouseX >= hotspot.x &&
        mouseX <= hotspot.x + hotspot.width &&
        mouseY >= hotspot.y &&
        mouseY <= hotspot.y + hotspot.height
      ) {
        hotspot.onClick();
        return;
      }
    }
  }

  // 6) Draw inventory bar
  private drawInventoryBar() {
    // Basic bar
    const barHeight = 60;
    const y = this.canvas.height - barHeight;

    this.ctx.fillStyle = "#222";
    this.ctx.fillRect(0, y, this.canvas.width, barHeight);

    // Draw items in inventory
    let offsetX = 10;
    for (const item of this.inventory) {
      this.ctx.fillStyle = item.color;
      this.ctx.fillRect(offsetX, y + 10, 40, 40);
      this.ctx.fillStyle = "white";
      this.ctx.font = "12px sans-serif";
      this.ctx.fillText(item.name, offsetX, y + 9);
      offsetX += 60;
    }
  }
}

// 7) Instantiate + run
const game = new PointClickGame("gameCanvas");
// Initialize scene hotspots
game.initScene();
