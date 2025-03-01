const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

class Ball {
  x: number;
  y: number;
  radius: number;
  color: string;
  isDragging: boolean;

  constructor(x: number, y: number, radius: number, color: string) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.isDragging = false;

    this.draw();
  }

  draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  isMouseInside(mouseX: number, mouseY: number): boolean {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }

  startDragging() {
    this.isDragging = true;
  }

  stopDragging() {
    this.isDragging = false;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.draw();
  }
}

const ball = new Ball(canvas.width / 2, canvas.height / 2, 30, "blue");

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (ball.isMouseInside(mouseX, mouseY)) {
    ball.startDragging();
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (ball.isDragging) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    ball.setPosition(mouseX, mouseY);
  }
});

canvas.addEventListener("mouseup", () => {
  ball.stopDragging();
});

canvas.addEventListener("mouseleave", () => {
  ball.stopDragging();
});
