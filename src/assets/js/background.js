/* globals window, document */
function drawLine(context, x1, y1, x2, y2) {
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
}
class PatternBackground {
  constructor(opts) {
    this.scale = opts.scale;
    this.windowWidth = opts.windowWidth;
    this.clientHeight = opts.clientHeight;

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d', {
      imageSmoothingEnabled: false
    });

    // Инициализация паттерна
    this.canvas.width = opts.patternWidth;
    this.canvas.height = opts.patternHeight;
    this.create = opts.create;
    this.create();
    this.patternImage = this.context.createPattern(this.canvas, 'repeat');

    // Вернём высоту и ширину канвасу
    this.canvas.width = 2 * this.windowWidth;
    this.canvas.height = this.clientHeight;
  }

  handleResize(windowWidth, clientHeight) {
    this.windowWidth = windowWidth;
    this.clientHeight = clientHeight;

    this.canvas.width = 2 * windowWidth;
    this.canvas.height = clientHeight;

    this.render();
  }

  render() {
    this.context.fillStyle = this.patternImage;
    this.context.fillRect(0, 0, this.windowWidth * 2, this.clientHeight);
  }
}

class Background {
  constructor(opts) {
    window.Background = this;
    this.parent = opts.parent;

    // пропуск кадров
    this.counter = 0;
    // Выделение памяти под переменные
    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.clientHeight = this.parent.clientHeight;

    // Попытка через отрисовку, а не drawImage
    this.lineScale = 3 / 2;
    this.dotScale = 3 / 2;

    this.linePatternsX =
      Math.round(this.windowWidth / 300 / this.lineScale) + 1;
    this.linePatternsY =
      Math.round(this.windowHeight / 400 / this.lineScale) + 1;

    this.dotsX = Math.round(this.windowWidth / 100 / this.dotScale) + 1;
    this.dotsY = Math.round(this.windowHeight / 100 / this.dotScale) + 1;

    // Создание холста
    this.canvas = document.querySelector('canvas.background__patterns');
    this.canvas.width = this.windowWidth;
    this.canvas.height = this.windowHeight;
    this.context = this.canvas.getContext('2d');
    this.context.imageSmoothingEnabled = false;

    // Выделение памяти под паттерны
    this.lines = undefined;
    this.dots = undefined;

    // Движение
    this.clientX = 0;
    this.currentX = this.clientX;
    this.clientY = this.parent.clientY;
    this.currentY = this.clientY;

    //
    this.context.fillStyle = 'black';
    this.context.lineCap = 'square';

    this.render();
  }

  handleResize() {
    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.clientHeight = this.parent.clientHeight;

    this.canvas.width = this.windowWidth;
    this.canvas.height = this.windowHeight;

    this.linePatternsX =
      Math.round(this.windowWidth / 300 / this.lineScale) + 2;
    this.linePatternsY =
      Math.round(this.windowHeight / 400 / this.lineScale) + 2;

    this.dotsX = Math.round(this.windowWidth / 100 / this.dotScale) + 2;
    this.dotsY = Math.round(this.windowHeight / 100 / this.dotScale) + 2;
  }

  updateXY() {
    this.currentX = this.parent.currentX / 15;
    this.currentY = this.parent.currentY / 3;
  }

  renderLines() {
    this.context.beginPath();
    this.context.lineWidth = 2;
    this.context.strokeStyle = 'rgba(43, 43, 43, 0.2)';

    const currentX300 = this.currentX % (300 * this.lineScale);
    const currentY400 = this.currentY % (400 * this.lineScale);
    for (let i = -1; i < this.linePatternsX; i += 1) {
      for (let j = -1; j < this.linePatternsY; j += 1) {
        const i300 = i * 300;
        const j400 = j * 400;
        drawLine(
          this.context,
          (i300 + 200) * this.lineScale - Math.round(currentX300),
          (j400 + 0) * this.lineScale - Math.round(currentY400),
          (i300 + 300) * this.lineScale - Math.round(currentX300),
          (j400 + 100) * this.lineScale - Math.round(currentY400)
        );
        drawLine(
          this.context,
          (i300 + 100) * this.lineScale - Math.round(currentX300),
          (j400 + 0) * this.lineScale - Math.round(currentY400),
          (i300 + 300) * this.lineScale - Math.round(currentX300),
          (j400 + 200) * this.lineScale - Math.round(currentY400)
        );
        drawLine(
          this.context,
          (i300 + 0) * this.lineScale - Math.round(currentX300),
          (j400 + 0) * this.lineScale - Math.round(currentY400),
          (i300 + 300) * this.lineScale - Math.round(currentX300),
          (j400 + 300) * this.lineScale - Math.round(currentY400)
        );
        drawLine(
          this.context,
          (i300 + 300) * this.lineScale - Math.round(currentX300),
          (j400 + 300) * this.lineScale - Math.round(currentY400),
          (i300 + 200) * this.lineScale - Math.round(currentX300),
          (j400 + 400) * this.lineScale - Math.round(currentY400)
        );
        drawLine(
          this.context,
          (i300 + 200) * this.lineScale - Math.round(currentX300),
          (j400 + 400) * this.lineScale - Math.round(currentY400),
          (i300 + 0) * this.lineScale - Math.round(currentX300),
          (j400 + 200) * this.lineScale - Math.round(currentY400)
        );
        drawLine(
          this.context,
          (i300 + 0) * this.lineScale - Math.round(currentX300),
          (j400 + 100) * this.lineScale - Math.round(currentY400),
          (i300 + 300) * this.lineScale - Math.round(currentX300),
          (j400 + 400) * this.lineScale - Math.round(currentY400)
        );
        drawLine(
          this.context,
          (i300 + 0) * this.lineScale - Math.round(currentX300),
          (j400 + 300) * this.lineScale - Math.round(currentY400),
          (i300 + 100) * this.lineScale - Math.round(currentX300),
          (j400 + 400) * this.lineScale - Math.round(currentY400)
        );
        drawLine(
          this.context,
          (i300 + 200) * this.lineScale - Math.round(currentX300),
          (j400 + 0) * this.lineScale - Math.round(currentY400),
          (i300 + 100) * this.lineScale - Math.round(currentX300),
          (j400 + 100) * this.lineScale - Math.round(currentY400)
        );
        drawLine(
          this.context,
          (i300 + 300) * this.lineScale - Math.round(currentX300),
          (j400 + 100) * this.lineScale - Math.round(currentY400),
          (i300 + 0) * this.lineScale - Math.round(currentX300),
          (j400 + 400) * this.lineScale - Math.round(currentY400)
        );
        drawLine(
          this.context,
          (i300 + 300) * this.lineScale - Math.round(currentX300),
          (j400 + 300) * this.lineScale - Math.round(currentY400),
          (i300 + 200) * this.lineScale - Math.round(currentX300),
          (j400 + 400) * this.lineScale - Math.round(currentY400)
        );
      }
    }
    this.context.stroke();

    this.context.beginPath();
    this.context.lineWidth = 1;
    this.context.strokeStyle = 'rgba(43, 43, 43, 0.2)';
    for (let i = -1; i < this.linePatternsX; i += 1) {
      for (let j = -1; j < this.linePatternsY; j += 1) {
        const i300 = i * 300;
        const j400 = j * 400;
        drawLine(
          this.context,
          (i300 + 200) * this.lineScale - Math.round(currentX300),
          (j400 + 0) * this.lineScale - Math.round(currentY400),
          (i300 + 200) * this.lineScale - Math.round(currentX300),
          (j400 + 400) * this.lineScale - Math.round(currentY400)
        );
        drawLine(
          this.context,
          (i300 + 200) * this.lineScale - Math.round(currentX300),
          (j400 + 400) * this.lineScale - Math.round(currentY400),
          (i300 + 300) * this.lineScale - Math.round(currentX300),
          (j400 + 400) * this.lineScale - Math.round(currentY400)
        );
        drawLine(
          this.context,
          (i300 + 300) * this.lineScale - Math.round(currentX300),
          (j400 + 400) * this.lineScale - Math.round(currentY400),
          (i300 + 300) * this.lineScale - Math.round(currentX300),
          (j400 + 0) * this.lineScale - Math.round(currentY400)
        );
        drawLine(
          this.context,
          (i300 + 300) * this.lineScale - Math.round(currentX300),
          (j400 + 0) * this.lineScale - Math.round(currentY400),
          (i300 + 200) * this.lineScale - Math.round(currentX300),
          (j400 + 0) * this.lineScale - Math.round(currentY400)
        );
        drawLine(
          this.context,
          (i300 + 200) * this.lineScale - Math.round(currentX300),
          (j400 + 100) * this.lineScale - Math.round(currentY400),
          (i300 + 100) * this.lineScale - Math.round(currentX300),
          (j400 + 100) * this.lineScale - Math.round(currentY400)
        );
        drawLine(
          this.context,
          (i300 + 100) * this.lineScale - Math.round(currentX300),
          (j400 + 100) * this.lineScale - Math.round(currentY400),
          (i300 + 100) * this.lineScale - Math.round(currentX300),
          (j400 + 300) * this.lineScale - Math.round(currentY400)
        );
        drawLine(
          this.context,
          (i300 + 100) * this.lineScale - Math.round(currentX300),
          (j400 + 300) * this.lineScale - Math.round(currentY400),
          (i300 + 200) * this.lineScale - Math.round(currentX300),
          (j400 + 300) * this.lineScale - Math.round(currentY400)
        );
        drawLine(
          this.context,
          (i300 + 100) * this.lineScale - Math.round(currentX300),
          (j400 + 200) * this.lineScale - Math.round(currentY400),
          (i300 + 0) * this.lineScale - Math.round(currentX300),
          (j400 + 200) * this.lineScale - Math.round(currentY400)
        );
        drawLine(
          this.context,
          (i300 + 0) * this.lineScale - Math.round(currentX300),
          (j400 + 0) * this.lineScale - Math.round(currentY400),
          (i300 + 0) * this.lineScale - Math.round(currentX300),
          (j400 + 400) * this.lineScale - Math.round(currentY400)
        );
      }
    }
    this.context.stroke();
  }

  renderDots(fillStyle, speed) {
    this.context.beginPath();
    this.context.fillStyle = fillStyle;
    const halfCurrentX100 = (this.currentX * speed) % 100;
    const halfCurrentY100 = (this.currentY * speed) % 100;

    for (let i = -1; i < this.dotsX; i += 1) {
      for (let j = -1; j < this.dotsY; j += 1) {
        const i100 = i * 100;
        const j100 = j * 100;
        this.context.moveTo(
          (i100 - Math.round(halfCurrentX100)) * this.dotScale,
          (j100 - Math.round(halfCurrentY100)) * this.dotScale
        );
        this.context.arc(
          (i100 - Math.round(halfCurrentX100)) * this.dotScale,
          (j100 - Math.round(halfCurrentY100)) * this.dotScale,
          1.5 * this.dotScale,
          0,
          2 * Math.PI,
          true
        );
      }
    }
    this.context.fill();
  }

  render() {
    this.context.clearRect(0, 0, this.windowWidth, this.windowHeight);
    // this.renderDots('rgba(255, 255, 255, 0.5)', 1 / 4);
    this.renderLines();
    this.renderDots('rgba(255, 255, 255, 0.5)', 3 / 2);
  }
}

export default Background;
