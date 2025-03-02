/*
Example: Simple Point-and-Click Adventure in TypeScript
with Canvas-based vector graphics.

Place this in src/main.ts, and run `npm run dev` with Vite.
Open http://localhost:5173/ to see.
*/

import { createDoor, createKeyItem } from "./Hotspots";

interface Ball {
  x: number;
  y: number;
  radius: number;
  color: string;
  dx: number;
  dy: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
  update: (canvas: HTMLCanvasElement) => void;
}

interface AutonomousObject {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  dx: number;
  dy: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
  update: (canvas: HTMLCanvasElement) => void;
}

const createKittyCat = (): AutonomousObject => {
  return {
    x: 50,
    y: 50,
    width: 60,
    height: 60,
    color: "orange",
    dx: 1,
    dy: 1,
    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(
        this.x,
        this.y,
        this.width / 2,
        this.height / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();

      // Draw ears
      ctx.beginPath();
      ctx.moveTo(this.x - 20, this.y - 30);
      ctx.lineTo(this.x - 10, this.y - 50);
      ctx.lineTo(this.x, this.y - 30);
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.moveTo(this.x + 20, this.y - 30);
      ctx.lineTo(this.x + 10, this.y - 50);
      ctx.lineTo(this.x, this.y - 30);
      ctx.fill();
      ctx.closePath();

      // Draw eyes
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(this.x - 10, this.y - 10, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.arc(this.x + 10, this.y - 10, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      // Draw pupils
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(this.x - 10, this.y - 10, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.arc(this.x + 10, this.y - 10, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      // Draw legs
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(this.x - 20, this.y + 30, 10, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.ellipse(this.x + 20, this.y + 30, 10, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      // Draw nose
      ctx.fillStyle = "pink";
      ctx.beginPath();
      ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    },
    update(canvas: HTMLCanvasElement) {
      this.x += this.dx;
      this.y += this.dy;

      // Bounce off the walls
      if (
        this.x + this.width / 2 > canvas.width ||
        this.x - this.width / 2 < 0
      ) {
        this.dx = -this.dx;
      }
      if (
        this.y + this.height / 2 > canvas.height ||
        this.y - this.height / 2 < 0
      ) {
        this.dy = -this.dy;
      }
    },
  };
};

const createBall = (): Ball => {
  return {
    x: 100,
    y: 100,
    radius: 15,
    color: "red",
    dx: 2,
    dy: 2,
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    },
    update(canvas: HTMLCanvasElement) {
      this.x += this.dx;
      this.y += this.dy;

      // Bounce off the walls
      if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
        this.dx = -this.dx;
      }
      if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
        this.dy = -this.dy;
      }
    },
  };
};

// 1) Define interfaces for hotspots & items.
interface Hotspot {
  draw: (ctx: CanvasRenderingContext2D, x: number, y: number) => void;
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
  draw: (ctx: CanvasRenderingContext2D, x: number, y: number) => void;
}

// 2) Basic Game class.
class PointClickGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private hotspots: Hotspot[] = [];
  private inventory: InventoryItem[] = [];
  lastSpokenMessage: any;

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
    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }

  // 3) Initialize the scene with hotspots.
  initScene() {
    // Example hotspot: a door.
    const door = createDoor(this.inventory, this.showMessage);

    // Example hotspot: an item on the ground.
    const keyItem = createKeyItem(
      this.inventory,
      this.hotspots,
      this.showMessage
    );

    // Add clouds to the scene
    const clouds = [
      { x: 100, y: 50, width: 60, height: 30 },
      { x: 300, y: 80, width: 80, height: 40 },
      { x: 500, y: 60, width: 70, height: 35 },
    ];

    // Draw clouds
    const drawCloud = (
      ctx: CanvasRenderingContext2D,
      cloud: { x: number; y: number; width: number; height: number }
    ) => {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.ellipse(
        cloud.x,
        cloud.y,
        cloud.width / 2,
        cloud.height / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();
    };

    // Add clouds to the game loop
    const originalGameLoopWithClouds = this.gameLoop.bind(this);
    this.gameLoop = () => {
      originalGameLoopWithClouds();
      clouds.forEach((cloud) => drawCloud(this.ctx, cloud));
    };

    // Add the sun to the scene
    const sun = {
      x: 700,
      y: 100,
      radius: 50,
      color: "yellow",
    };

    const drawSun = (
      ctx: CanvasRenderingContext2D,
      sun: { x: number; y: number; radius: number; color: string }
    ) => {
      ctx.fillStyle = sun.color;
      ctx.beginPath();
      ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    };

    // Add sun to the game loop
    const originalGameLoopWithSun = this.gameLoop.bind(this);
    this.gameLoop = () => {
      originalGameLoopWithSun();
      drawSun(this.ctx, sun);
    };

    // Add them
    this.hotspots.push(door);
    this.hotspots.push(keyItem);

    const kittyCat = createKittyCat();
    // Create a ball
    const ball = createBall();

    // Add ball to the game loop
    const originalGameLoop = this.gameLoop.bind(this);
    this.gameLoop = () => {
      originalGameLoop();
      ball.update(this.canvas);
      ball.draw(this.ctx);
      kittyCat.update(this.canvas);
      kittyCat.draw(this.ctx);

      // Make the kitty chase the ball
      const chaseSpeed = 0.5;
      const angleToBall = Math.atan2(ball.y - kittyCat.y, ball.x - kittyCat.x);
      kittyCat.dx = Math.cos(angleToBall) * chaseSpeed;
      kittyCat.dy = Math.sin(angleToBall) * chaseSpeed;

      // Check for collision between ball and kittyCat
      const distX = ball.x - kittyCat.x;
      const distY = ball.y - kittyCat.y;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < ball.radius + kittyCat.width / 2) {
        // Ball flies off in a random direction
        const randomAngle = Math.random() * Math.PI * 2;
        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        ball.dx = Math.cos(randomAngle) * (speed + 1); // Ensure non-zero speed
        ball.dy = Math.sin(randomAngle) * (speed + 1);
      }
    };

    // Handle ball dragging
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    const frameBuffer: { x: number; y: number }[] = [];
    const bufferSize = 5;

    this.canvas.addEventListener("mousedown", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (
        mouseX >= ball.x - ball.radius &&
        mouseX <= ball.x + ball.radius &&
        mouseY >= ball.y - ball.radius
      ) {
        isDragging = true;
        offsetX = mouseX - ball.x;
        offsetY = mouseY - ball.y;
        ball.dx = 0; // Stop ball movement when dragging starts
        ball.dy = 0;
        frameBuffer.length = 0; // Clear the buffer
      }
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const rect = this.canvas.getBoundingClientRect();
        ball.x = e.clientX - rect.left - offsetX;
        ball.y = e.clientY - rect.top - offsetY;

        // Record the current position in the buffer
        frameBuffer.push({ x: ball.x, y: ball.y });
        if (frameBuffer.length > bufferSize) {
          frameBuffer.shift(); // Remove the oldest frame if buffer is full
        }
      }
    });

    this.canvas.addEventListener("mouseup", () => {
      if (isDragging) {
        if (frameBuffer.length > 1) {
          const lastFrame = frameBuffer[frameBuffer.length - 1];
          const firstFrame = frameBuffer[0];
          const dx = (lastFrame.x - firstFrame.x) / frameBuffer.length;
          const dy = (lastFrame.y - firstFrame.y) / frameBuffer.length;
          ball.dx = dx * 2; // Adjust the multiplier as needed for desired speed
          ball.dy = dy * 2;
        } else {
          ball.dx = 2; // Default speed if not enough frames
          ball.dy = 2;
        }
      }
      isDragging = false;
    });

    // Slow down the ball over time
    const originalUpdate = ball.update.bind(ball);
    ball.update = (canvas: HTMLCanvasElement) => {
      originalUpdate(canvas);
      ball.dx *= 0.99; // Adjust the factor as needed for desired deceleration
      ball.dy *= 0.99;
    };

    // Update ball to bounce off hotspots
    const originalBallUpdate = ball.update.bind(ball);
    ball.update = (canvas: HTMLCanvasElement) => {
      originalBallUpdate(canvas);

      for (const hotspot of this.hotspots) {
        if (
          ball.x + ball.radius > hotspot.x &&
          ball.x - ball.radius < hotspot.x + hotspot.width &&
          ball.y + ball.radius > hotspot.y &&
          ball.y - ball.radius < hotspot.y + hotspot.height
        ) {
          // Determine the side of collision and reverse direction accordingly
          const overlapX =
            Math.min(
              ball.x + ball.radius - hotspot.x,
              hotspot.x + hotspot.width - (ball.x - ball.radius)
            ) < ball.radius;
          const overlapY =
            Math.min(
              ball.y + ball.radius - hotspot.y,
              hotspot.y + hotspot.height - (ball.y - ball.radius)
            ) < ball.radius;

          if (overlapX) {
            ball.dx = -ball.dx;
          }
          if (overlapY) {
            ball.dy = -ball.dy;
          }
        }
      }
    };

    // Add birds to the scene
    const birds = [
      { x: 200, y: 150, width: 20, height: 10, dx: 1, dy: 0.5 },
      { x: 400, y: 200, width: 20, height: 10, dx: 1.5, dy: 0.7 },
    ];

    const drawBird = (
      ctx: CanvasRenderingContext2D,
      bird: { x: number; y: number; width: number; height: number }
    ) => {
      ctx.fillStyle = "gray";
      ctx.beginPath();
      ctx.ellipse(
        bird.x,
        bird.y,
        bird.width / 2,
        bird.height / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();

      // Draw beak
      ctx.fillStyle = "orange";
      ctx.beginPath();
      ctx.moveTo(bird.x + bird.width / 2, bird.y);
      ctx.lineTo(bird.x + bird.width / 2 + 10, bird.y - 5);
      ctx.lineTo(bird.x + bird.width / 2 + 10, bird.y + 5);
      ctx.fill();
      ctx.closePath();

      // Draw eyes
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(
        bird.x - bird.width / 4,
        bird.y - bird.height / 4,
        3,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(
        bird.x - bird.width / 4,
        bird.y - bird.height / 4,
        1,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();

      // Draw wings
      ctx.fillStyle = "darkgray";
      ctx.beginPath();
      ctx.moveTo(bird.x - bird.width / 2, bird.y);
      ctx.lineTo(bird.x - bird.width / 2 - 10, bird.y - 10);
      ctx.lineTo(bird.x - bird.width / 2 - 10, bird.y + 10);
      ctx.fill();
      ctx.closePath();
    };

    const updateBird = (
      bird: {
        x: number;
        y: number;
        width: number;
        height: number;
        dx: number;
        dy: number;
      },
      canvas: HTMLCanvasElement
    ) => {
      bird.x += bird.dx;
      bird.y += bird.dy;

      // Wrap around the screen
      if (bird.x > canvas.width) bird.x = 0;
      if (bird.y > canvas.height) bird.y = 0;
      if (bird.x < 0) bird.x = canvas.width;
      if (bird.y < 0) bird.y = canvas.height;
    };

    // Add birds to the game loop
    const originalGameLoopWithBirds = this.gameLoop.bind(this);
    this.gameLoop = () => {
      originalGameLoopWithBirds();
      birds.forEach((bird) => {
        updateBird(bird, this.canvas);
        drawBird(this.ctx, bird);
      });
    };

    // Add beep sound when ball bumps into something
    const beep = () => {
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 note
      oscillator.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1); // Beep duration
    };

    // Update ball to beep on collision
    const originalBallUpdateWithBeep = ball.update.bind(ball);
    ball.update = (canvas: HTMLCanvasElement) => {
      originalBallUpdateWithBeep(canvas);

      for (const hotspot of this.hotspots) {
        if (
          ball.x + ball.radius > hotspot.x &&
          ball.x - ball.radius < hotspot.x + hotspot.width &&
          ball.y + ball.radius > hotspot.y &&
          ball.y - ball.radius < hotspot.y + hotspot.height
        ) {
          // Determine the side of collision and reverse direction accordingly
          const overlapX =
            Math.min(
              ball.x + ball.radius - hotspot.x,
              hotspot.x + hotspot.width - (ball.x - ball.radius)
            ) < ball.radius;
          const overlapY =
            Math.min(
              ball.y + ball.radius - hotspot.y,
              hotspot.y + hotspot.height - (ball.y - ball.radius)
            ) < ball.radius;

          if (overlapX) {
            ball.dx = -ball.dx;
            beep();
          }
          if (overlapY) {
            ball.dy = -ball.dy;
            beep();
          }
        }
      }
    };

    // Score counter
    let score = 0;

    const drawScore = () => {
      this.ctx.fillStyle = "black";
      this.ctx.font = "20px Arial";
      this.ctx.fillText(`Score: ${score}`, 10, 30);
    };

    // Update game loop to include score and bird chasing
    const originalGameLoopWithScore = this.gameLoop.bind(this);
    this.gameLoop = () => {
      originalGameLoopWithScore();
      drawScore();

      // Update and draw birds
      birds.forEach((bird, index) => {
        updateBird(bird, this.canvas);
        drawBird(this.ctx, bird);

        // Make the kitty chase the birds
        const chaseSpeed = 0.5;
        const angleToBird = Math.atan2(
          bird.y - kittyCat.y,
          bird.x - kittyCat.x
        );
        kittyCat.dx = Math.cos(angleToBird) * chaseSpeed;
        kittyCat.dy = Math.sin(angleToBird) * chaseSpeed;

        // Check for collision between kittyCat and bird
        const distX = bird.x - kittyCat.x;
        const distY = bird.y - kittyCat.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < kittyCat.width / 2 + bird.width / 2) {
          // Bird is caught, remove it and increase score
          birds.splice(index, 1);
          score++;
        }
      });
    };

    // Function to spawn a new bird
    const spawnBird = () => {
      const newBird = {
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        width: 20,
        height: 10,
        dx: Math.random() * 2 + 1,
        dy: Math.random() * 1 - 0.5,
      };
      birds.push(newBird);
    };

    // Function to set a random interval for spawning birds
    const setRandomBirdSpawnInterval = () => {
      const interval = Math.random() * 59000 + 1000; // Random interval between 1 and 60 seconds
      setTimeout(() => {
        spawnBird();
        setRandomBirdSpawnInterval(); // Set the next random interval
      }, interval);
    };

    // Start the first random interval
    setRandomBirdSpawnInterval();

    // Change scene to inside of a bathroom when door is opened
    door.onClick = () => {
      const hasKey = this.inventory.some((item) => item.name === "Key");
      if (!hasKey) {
        this.showMessage("The door is locked. You need a key to open it.");
        return;
      }

      this.hotspots = []; // Clear current hotspots

      // Add bathroom-specific hotspots
      const sink = {
        x: 100,
        y: 200,
        width: 80,
        height: 40,
        color: "lightgray",
        draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
          ctx.fillStyle = this.color;

          // Draw the basin
          ctx.beginPath();
          ctx.rect(x, y, this.width, this.height);
          ctx.fill();
          ctx.closePath();

          // Draw the faucet
          ctx.fillStyle = "silver";
          ctx.beginPath();
          ctx.rect(x + this.width / 2 - 5, y - 20, 10, 20);
          ctx.fill();
          ctx.closePath();

          // Draw the handles
          ctx.beginPath();
          ctx.arc(x + this.width / 2 - 15, y - 10, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();

          ctx.beginPath();
          ctx.arc(x + this.width / 2 + 15, y - 10, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();
        },
        onClick: () => this.showMessage("You turned on the sink."),
      };

      const toilet = {
        x: 300,
        y: 200,
        width: 60,
        height: 60,
        color: "white",
        draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
          ctx.fillStyle = this.color;

          // Draw the base of the toilet
          ctx.beginPath();
          ctx.ellipse(
            x + this.width / 2,
            y + this.height / 2,
            this.width / 2,
            this.height / 4,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
          ctx.closePath();

          // Draw the tank of the toilet
          ctx.fillRect(x + this.width / 4, y, this.width / 2, this.height / 2);

          // Draw the toilet seat
          ctx.strokeStyle = "black";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(
            x + this.width / 2,
            y + this.height / 2,
            this.width / 2.5,
            this.height / 5,
            0,
            0,
            Math.PI * 2
          );
          ctx.stroke();
          ctx.closePath();
        },
        onClick: () => {
          this.showMessage("You pooped on the floor.");

          // Create multiple brown blobs
          const brownBlob = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            width: 20,
            height: 10,
            color: "brown",
            draw(ctx: CanvasRenderingContext2D) {
              ctx.fillStyle = this.color;
              ctx.beginPath();
              ctx.ellipse(
                this.x,
                this.y,
                this.width / 2,
                this.height / 2,
                0,
                0,
                Math.PI * 2
              );
              ctx.fill();
              ctx.closePath();

              // Draw additional blobs to make it more poop shaped
              ctx.beginPath();
              ctx.ellipse(
                this.x - 10,
                this.y - 5,
                this.width / 3,
                this.height / 3,
                0,
                0,
                Math.PI * 2
              );
              ctx.fill();
              ctx.closePath();

              ctx.beginPath();
              ctx.ellipse(
                this.x + 10,
                this.y - 5,
                this.width / 3,
                this.height / 3,
                0,
                0,
                Math.PI * 2
              );
              ctx.fill();
              ctx.closePath();

              ctx.beginPath();
              ctx.ellipse(
                this.x,
                this.y - 10,
                this.width / 4,
                this.height / 4,
                0,
                0,
                Math.PI * 2
              );
              ctx.fill();
              ctx.closePath();
            },
            onClick: () => {
              // Play squishy noise
              const audioCtx = new (window.AudioContext ||
                window.webkitAudioContext)();
              const oscillator = audioCtx.createOscillator();
              oscillator.type = "square";
              oscillator.frequency.setValueAtTime(300, audioCtx.currentTime); // Squishy sound frequency
              oscillator.connect(audioCtx.destination);
              oscillator.start();
              oscillator.stop(audioCtx.currentTime + 0.1); // Squishy sound duration

              // Remove the blob from the hotspots
              this.hotspots = this.hotspots.filter(
                (hotspot) => hotspot !== brownBlob
              );
            },
          };

          this.hotspots.push(brownBlob);

          // Add brown blob to the game loop
          const originalGameLoop = this.gameLoop.bind(this);
          this.gameLoop = () => {
            originalGameLoop();
            brownBlob.draw(this.ctx);
          };
        },
      };

      const backDoor = {
        x: 400,
        y: 200,
        width: 80,
        height: 40,
        color: "green",
        draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
          ctx.fillStyle = this.color;
          ctx.fillRect(x, y, this.width, this.height);

          // Draw door handle
          ctx.fillStyle = "gold";
          ctx.beginPath();
          ctx.arc(x + this.width - 10, y + this.height / 2, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();
        },
        onClick: () => {
          this.hotspots = []; // Clear current hotspots
          this.initScene(); // Reinitialize the original scene
        },
      };

      this.hotspots.push(backDoor);

      this.hotspots.push(sink);
      this.hotspots.push(toilet);

      // Update game loop to draw bathroom background
      const originalGameLoop = this.gameLoop.bind(this);
      this.gameLoop = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw bathroom background
        this.ctx.fillStyle = "lightblue";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw hotspots
        for (const hotspot of this.hotspots) {
          hotspot.draw(this.ctx, hotspot.x, hotspot.y);
        }

        // Draw inventory bar
        this.drawInventoryBar();

        // Draw message box
        this.drawMessages();

        // Request next frame
        requestAnimationFrame(() => this.gameLoop());
      };
    };
  }

  private messages: string[] = [];
  private maxMessages: number = 5;

  showMessage = (message: string) => {
    this.messages = [...this.messages, message];
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(1);
    }
    this.drawMessages();
  };

  private drawMessages() {
    const barHeight = 60;
    const messageHeight = 20;
    const y = this.canvas.height - barHeight - this.maxMessages * messageHeight;

    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(
      0,
      y,
      this.canvas.width,
      this.maxMessages * messageHeight
    );

    this.ctx.fillStyle = "white";
    this.ctx.font = "14px sans-serif";
    for (let i = 0; i < this.messages.length; i++) {
      this.ctx.fillText(this.messages[i], 10, y + (i + 1) * messageHeight - 5);
    }

    // Use the Web Speech API to read the latest message aloud
    if (this.messages.length > 0) {
      const latestMessage = this.messages[this.messages.length - 1];
      if (!this.lastSpokenMessage || this.lastSpokenMessage !== latestMessage) {
        const utterance = new SpeechSynthesisUtterance(latestMessage);
        window.speechSynthesis.speak(utterance);
        this.lastSpokenMessage = latestMessage;
      }
    }
  }

  private animationFrameId: number = 0;

  // 4) Main game loop: update + draw.
  private gameLoop() {
    // Clear screen
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background (just a solid color for simplicity)
    this.ctx.fillStyle = "skyblue";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw hotspots
    for (const hotspot of this.hotspots) {
      hotspot.draw(this.ctx, hotspot.x, hotspot.y);
    }

    // Draw inventory bar at bottom
    this.drawInventoryBar();

    // Draw message box
    this.drawMessages();

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
      item.draw(this.ctx, offsetX, y + 10);
      offsetX += 30;
    }
  }
}

// 7) Instantiate + run
const game = new PointClickGame("gameCanvas");
// Initialize scene hotspots
game.initScene();
