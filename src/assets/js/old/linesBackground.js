/* eslint-disable no-multi-assign */
/* globals window, document */
/**
 * 30-40
 *
 *
 */




class Pattern {
  constructor(opts) {
    this.counter = 0;

    this.canvas = document.createElement('canvas');
    this.scale = opts.scale;
    this.canvas.width = this.scale * opts.width;
    this.canvas.height = this.scale * opts.height;
    this.context = this.canvas.getContext('2d');

    this.create = opts.create;
    this.create();
  }
}

class PatternBackground {
  constructor(opts) {
    this.parent = opts.parent;

    this.canvas = document.createElement('canvas');
    this.canvas.width = opts.width;
    this.canvas.height = opts.height;
    this.context = this.canvas.getContext('2d');

    this.scale = opts.scale;

    // Инициализация паттерна
    this.pattern = new Pattern({
      width: opts.patternWidth,
      height: opts.patternHeight,
      scale: this.scale,
      create: opts.create
    });
    this.patternImage = this.context.createPattern(
      this.pattern.canvas,
      'repeat'
    );

    this.render();
  }

  updateSize() {
    this.canvas.width = 2 * window.innerWidth;
    this.canvas.height = document.body.clientHeight;
    this.render();
  }

  render() {
    this.context.fillStyle = this.patternImage;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

class Background {
  constructor(opts) {
    this.parent = opts.parent;
    this.scale = opts.scale;

    // kkk
    this.counter = 0;

    // Достаём из ДОМ-дерева, чтобы больше к нему не обращаться
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.canvas = document.querySelector('canvas.background');
    this.context = this.canvas.getContext('2d');
    // Аппаратное масштабирование user-холста
    this.canvasWidth = this.canvas.width = this.windowWidth / 2;
    this.canvasHeight = this.canvas.height = this.windowHeight / 2;
    this.canvas.style.width = `${this.windowWidth}px`;
    this.canvas.style.height = `${this.windowHeight}px`;

    this.bufferCanvas = document.createElement('canvas');
    this.bufferContext = this.bufferCanvas.getContext('2d');
    this.bufferWidth = this.bufferCanvas.width = this.windowWidth;
    this.bufferHeight = this.bufferCanvas.height = document.body.clientHeight;

    // Инициализация паттернов
    this.linesBackground = new PatternBackground({
      parent: this,
      width: 2 * this.bufferWidth,
      height: this.bufferHeight,
      scale: this.scale,
      create: function create() {
        const drawLine = (x1, y1, x2, y2) => {
          this.context.moveTo(this.scale * x1, this.scale * y1);
          this.context.lineTo(this.scale * x2, this.scale * y2);
        };

        this.context.lineWidth = opts.hardLinesWidth;
        this.context.strokeStyle = opts.hardLinesStrokeStyle;
        this.context.lineCap = 'square';
        this.context.beginPath();
        drawLine(200, 0, 300, 100);
        drawLine(100, 0, 300, 200);
        drawLine(0, 0, 300, 300);
        drawLine(300, 300, 200, 400);
        drawLine(200, 400, 0, 200);
        drawLine(0, 100, 300, 400);
        drawLine(0, 300, 100, 400);
        drawLine(200, 0, 100, 100);
        drawLine(300, 100, 0, 400);
        drawLine(300, 300, 200, 400);
        this.context.stroke();

        // Горизонтальные и вертикальные
        this.context.beginPath();
        this.context.lineWidth = opts.lightLinesWidth;
        this.context.strokeStyle = opts.lightLinesStrokeStyle;
        drawLine(200, 0, 200, 400);
        drawLine(200, 400, 300, 400);
        drawLine(300, 400, 300, 0);
        drawLine(300, 0, 200, 0);
        drawLine(200, 100, 100, 100);
        drawLine(100, 100, 100, 300);
        drawLine(100, 300, 200, 300);
        drawLine(100, 200, 0, 200);
        drawLine(0, 0, 0, 400);
        this.context.stroke();
      },
      patternWidth: 300,
      patternHeight: 400
    });
    this.dotsBackground = new PatternBackground({
      parent: this,
      width: 2 * this.bufferWidth,
      height: this.bufferHeight,
      scale: this.scale,
      create: function create() {
        const r = opts.dotRadius;
        const drawDotPiece = (
          x0,
          y0,
          x1,
          y1,
          x2,
          y2,
          x3,
          y3,
          dotRadius,
          startAngle,
          endAngle
        ) => {
          this.context.beginPath();
          this.context.fillStyle = opts.upperDotsFill;
          this.context.moveTo(x0 * this.scale, y0 * this.scale);
          this.context.lineTo(x1 * this.scale, y1 * this.scale);
          this.context.lineTo(x2 * this.scale, y2 * this.scale);
          this.context.arc(
            x3 * this.scale,
            y3 * this.scale,
            dotRadius * this.scale,
            startAngle,
            endAngle,
            true
          );
          // x, y, radius, startAngle, endAngle, counterclockwise
          this.context.fill();
        };

        drawDotPiece(0, 0, 0, 0, 0, r, 0, 0, r, Math.PI / 2, 2 * Math.PI); // IV
        drawDotPiece(
          100 - r,
          100,
          100,
          100,
          100,
          100 - r,
          100,
          100,
          r,
          (3 * Math.PI) / 2,
          Math.PI
        ); // II
        drawDotPiece(
          100 - r,
          0,
          100,
          0,
          100,
          r,
          100,
          0,
          r,
          Math.PI,
          Math.PI / 2
        ); // III
        drawDotPiece(
          0,
          100 - r,
          0,
          100,
          r,
          100,
          0,
          100,
          r,
          0,
          (3 * Math.PI) / 2
        ); // I
        // x, y, radius, startAngle, endAngle, counterclockwise
      },
      patternWidth: 100,
      patternHeight: 100
    });

    this.downDotsBackground = new PatternBackground({
      parent: this,
      width: 2 * this.bufferWidth,
      height: this.bufferHeight,
      scale: this.scale,
      create: function create() {
        const r = opts.dotRadius;
        const drawDotPiece = (
          x0,
          y0,
          x1,
          y1,
          x2,
          y2,
          x3,
          y3,
          dotRadius,
          startAngle,
          endAngle
        ) => {
          this.context.beginPath();
          this.context.fillStyle = opts.downDotsFill;
          this.context.moveTo(x0 * this.scale, y0 * this.scale);
          this.context.lineTo(x1 * this.scale, y1 * this.scale);
          this.context.lineTo(x2 * this.scale, y2 * this.scale);
          this.context.arc(
            x3 * this.scale,
            y3 * this.scale,
            dotRadius * this.scale,
            startAngle,
            endAngle,
            true
          );
          // x, y, radius, startAngle, endAngle, counterclockwise
          this.context.fill();
        };

        drawDotPiece(0, 0, 0, 0, 0, r, 0, 0, r, Math.PI / 2, 2 * Math.PI); // IV
        drawDotPiece(
          100 - r,
          100,
          100,
          100,
          100,
          100 - r,
          100,
          100,
          r,
          (3 * Math.PI) / 2,
          Math.PI
        ); // II
        drawDotPiece(
          100 - r,
          0,
          100,
          0,
          100,
          r,
          100,
          0,
          r,
          Math.PI,
          Math.PI / 2
        ); // III
        drawDotPiece(
          0,
          100 - r,
          0,
          100,
          r,
          100,
          0,
          100,
          r,
          0,
          (3 * Math.PI) / 2
        ); // I
      },
      patternWidth: 100,
      patternHeight: 100
    });

    // Скорости паттернов в осях Оху
    this.lX = opts.linesSpeedX;
    this.lY = opts.linesSpeedY;
    this.uDX = opts.upperDotsSpeedX;
    this.uDY = opts.upperDotsSpeedY;
    this.dDX = opts.downDotsSpeedX;
    this.dDY = opts.downDotsSpeedY;

    // Начальные координаты смещения
    this.currentX = 0;
    this.currentY = this.pageY;

    // Начальные координаты смещения паттернов
    this.linesX = this.currentX * this.lX;
    this.linesY = this.currentY * this.lY;
    this.upperDotsX = this.currentX * this.uDX;
    this.upperDotsY = this.currentY * this.dDY;
    this.downDotsX = this.currentX * this.dDX;
    this.downDotsY = this.currentY * this.dDY;

    this.init();
  }

  init() {
    this.render();
    this.parent.ready();
  }

  updateSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.bufferCanvas.width = window.innerWidth;
    this.bufferCanvas.height = document.body.clientHeight;

    this.linesBackground.updateSize();
    this.dotsBackground.updateSize();
    this.downDotsBackground.updateSize();

    this.render();
  }

  updateXY() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.linesX = this.currentX * this.lX;
    this.linesY = this.currentY * this.lY;
    this.upperDotsX = this.currentX * this.uDX;
    this.upperDotsY = this.currentY * this.dDY;
    this.downDotsX = this.currentX * this.dDX;
    this.downDotsY = this.currentY * this.dDY;
  }

  render() {
    this.counter += 1;

    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    if (this.counter > 32) {
      this.context.drawImage(
        this.downDotsBackground.canvas,
        this.windowWidth + this.downDotsX,
        this.downDotsY,
        this.windowWidth,
        this.windowHeight,
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      );
    }
    this.context.drawImage(
      this.downDotsBackground.canvas,
      this.windowWidth + this.upperDotsX,
      this.upperDotsY,
      this.windowWidth,
      this.windowHeight,
      0,
      0,
      this.canvasWidth,
      this.canvasHeight
    );
    if (this.counter > 32) {
      this.counter = 0;
      this.context.drawImage(
        this.linesBackground.canvas,
        this.windowWidth + this.linesX,
        this.linesY,
        this.windowWidth,
        this.windowHeight,
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      );
    }
  }
}

export default Background;
