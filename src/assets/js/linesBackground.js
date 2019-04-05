/* globals window, document */

class Pattern {
  constructor(opts) {
    this.canvas = document.createElement('canvas');
    this.scale = opts.scale;
    this.width = this.canvas.width = this.scale * opts.width;
    this.height = this.canvas.height = this.scale * opts.height;
    this.context = this.canvas.getContext('2d');

    this.create = opts.create;
    this.create();
  }
}

class PatternBackground {
  constructor(opts) {
    this.canvas = document.createElement('canvas');
    this.width = this.canvas.width = opts.width;
    this.height = this.canvas.height = opts.height;
    this.context = this.canvas.getContext('2d');

    this.scale = opts.scale;
    this.pattern = new Pattern({
      width: opts.patternWidth,
      height: opts.patternHeight,
      scale: this.scale,
      create: opts.create
    });
    this.patternsX = Math.round(this.width / this.pattern.width) + 2;
    this.patternsY = Math.round(this.height / this.pattern.height) + 2;
  }

  render() {
    console.log('render pattern');
    for (let x = 0; x < this.patternsX; x += 1) {
      for (let y = 0; y < this.patternsY; y += 1) {
        this.context.drawImage(
          this.pattern.canvas,
          this.pattern.width * x,
          this.pattern.height * y
        );
      }
    }
  }

  update() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.patternsX = Math.round(this.width / this.pattern.width) + 2;
    this.patternsY = Math.round(this.height / this.pattern.height) + 2;
    this.render();
  }
}

class Background {
  constructor(opts) {
    window.background = this;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = 2 * window.innerWidth;
    this.canvas.height = document.body.clientHeight;
    this.scale = opts.scale;

    // Parallax Speeds
    this.lX = opts.linesSpeedX;
    this.lY = opts.linesSpeedY;
    this.uDX = opts.upperDotsSpeedX;
    this.uDY = opts.upperDotsSpeedY;
    this.dDX = opts.downDotsSpeedX;
    this.dDY = opts.downDotsSpeedY;

    this.linesBackground = new PatternBackground({
      width: this.canvas.width,
      height: this.canvas.height,
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
      width: this.canvas.width,
      height: this.canvas.height,
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
      width: this.canvas.width,
      height: this.canvas.height,
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

    // Параллакс
    this.currentX = 0;
    this.clientX = 0;
    this.pageY = window.pageYOffset;
    this.currentY = this.pageY;

    this.init();
    opts.parent.ready();
  }

  init() {
    this.linesBackground.render();
    this.dotsBackground.render();
    this.downDotsBackground.render();
    this.render();
  }

  render() {
    const linesX = this.currentX * this.lX;
    const linesY = this.currentY * this.lY;
    const upperDotsX = this.currentX * this.uDX;
    const upperDotsY = this.currentY * this.uDY;
    const downDotsX = this.currentX * this.dDX;
    const downDotsY = this.currentY * this.dDY;

    this.context.fillStyle = '#0d0a14';
    this.context.clearRect(0, 0, this.canvas.width / 2, window.innerHeight);
    this.context.fillRect(0, 0, this.canvas.width / 2, window.innerHeight);

    this.context.drawImage(
      this.downDotsBackground.canvas,
      this.canvas.width / 2 + downDotsX,
      downDotsY,
      this.canvas.width / 2,
      window.innerHeight,
      0,
      0,
      this.canvas.width / 2,
      window.innerHeight
    );
    this.context.drawImage(
      this.linesBackground.canvas,
      this.canvas.width / 2 + linesX,
      linesY,
      this.canvas.width / 2,
      window.innerHeight,
      0,
      0,
      this.canvas.width / 2,
      window.innerHeight
    );
    this.context.drawImage(
      this.dotsBackground.canvas,
      this.canvas.width / 2 + upperDotsX,
      upperDotsY,
      this.canvas.width / 2,
      window.innerHeight,
      0,
      0,
      this.canvas.width / 2,
      window.innerHeight
    );
  }
}

export default Background;
