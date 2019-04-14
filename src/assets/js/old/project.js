class Rhombus {
  constructor(opts) {
    this.scale = opts.scale;
    this.canvas = document.createElement("canvas");
    this.h = this.canvas.height = 100 * this.scale;
    this.w = this.canvas.width = 100 * this.scale;
    this.context = this.canvas.getContext("2d");
    this.dots = [
      { x: 50, y: 0 },
      { x: 100, y: 50 },
      { x: 50, y: 100 },
      { x: 0, y: 50 }
    ];

    this.render();
  }

  update(scale) {
    this.scale = scale;
    this.h = this.canvas.height = 100 * this.scale;
    this.w = this.canvas.width = 100 * this.scale;
    this.render();
  }

  render() {
    this.context.beginPath();
    this.context.fillStyle = "green";
    this.context.moveTo(
      this.dots[0].x * this.scale,
      this.dots[0].y * this.scale
    );
    for (let i = 1; i < this.dots.length; i++) {
      this.context.lineTo(
        this.dots[i].x * this.scale,
        this.dots[i].y * this.scale
      );
    }
    this.context.clearRect(0, 0, this.w, this.h);
    this.context.fill();
  }
}

class AnimatedRhombus {
  constructor(opts) {
    this.canvas = document.createElement("canvas");
    this.h = this.canvas.height = opts.height;
    this.w = this.canvas.width = opts.width;
    this.context = this.canvas.getContext("2d");

    this.marginX = this.w * 0.1;
    this.marginY = (-this.w + 2 * this.marginX + this.h) / 2;

    // Анимация
    this.counter = Math.round(opts.duration / 16.6); // 16.6мс - время кадра при 60 кадрах в секунду
    this.currentCounter = 0;

    this.startScale = 1;
    this.endScale = this.w / 100 - this.marginX / 50;
    this.startX = this.w / 2 - 50 * this.startScale;
    this.endX = this.marginX;
    this.startY = this.h - 50;
    this.endY = this.marginY;

    this.dx = (this.endX - this.startX) / this.counter;
    this.dy = (this.endY - this.startY) / this.counter;
    this.ds = (this.endScale - this.startScale) / this.counter;

    // Ромб
    this.rhombus = new Rhombus({ scale: this.startScale });
    this.animated = false;
  }
  render() {
    if (this.currentCounter == this.counter) {
      this.animated = true;
      return;
    }

    this.context.clearRect(0, 0, this.w, this.h);
    this.context.drawImage(this.rhombus.canvas, this.startX, this.startY);

    this.startX += this.dx;
    this.startY += this.dy;
    this.startScale += this.ds;
    this.rhombus.update(this.startScale);
    this.currentCounter++;
  }
}

class Project {
  constructor(opts) {
    // Инициализируем холст, который увидит пользователь
    this.userCanvas = opts.userCanvas;
    this.userCanvasWidth = this.userCanvas.width = window.innerWidth;
    this.userCanvasHeight = this.userCanvas.height = window.innerHeight;
    this.userContext = this.userCanvas.getContext("2d");

    // Инициализируем холст, на котором будет происходить вся отрисовка
    this.bufferCanvas = document.createElement("canvas");
    this.bufferCanvasWidth = this.bufferCanvas.width = this.userCanvasWidth;
    this.bufferCanvasHeight = this.bufferCanvas.height = this.userCanvasHeight;
    this.bufferContext = this.bufferCanvas.getContext("2d");

    // Инициализируем ромб на фоне
    this.rhombusMargin = this.userCanvasWidth * 0.1;
    this.rhombusMarginY =
      (this.userCanvasWidth - 2 * this.rhombusMargin - this.userCanvasHeight) /
      2;
    this.animatedRhombus = new AnimatedRhombus({
      width: this.userCanvasWidth,
      height: this.userCanvasHeight,
      duration: 2000
    });
    window.animatedRhombus = this.animatedRhombus;

    requestAnimationFrame(this.render.bind(this));
  }

  render() {
    if (!this.animatedRhombus.animated) {
      this.animatedRhombus.render();
      this.bufferContext.clearRect(
        0,
        0,
        this.bufferCanvasWidth,
        this.bufferCanvasHeight
      );
      this.bufferContext.drawImage(this.animatedRhombus.canvas, 0, 0);
      this.userContext.clearRect(
        0,
        0,
        this.userCanvasWidth,
        this.userCanvasHeight
      );
      this.userContext.drawImage(this.bufferCanvas, 0, 0);
      requestAnimationFrame(this.render.bind(this));
    }
  }
}

export default Project;
