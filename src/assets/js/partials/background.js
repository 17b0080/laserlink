/* globals window, document */
function drawLine(context, x1, y1, x2, y2) {
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
}
class Background {
  constructor(opts) {
    window.Background = this;
    this.parent = opts.parent;

    this.scale = 2;

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
    this.lines = document.createElement('canvas');
    this.lines.width = 300 * this.scale;
    this.lines.height = 400 * this.scale;
    this.linesContext = this.lines.getContext('2d');
    this.drawLines();
    this.linesPattern = this.context.createPattern(this.lines, 'repeat');

    this.dots = document.createElement('canvas');
    this.dots.width = 100 * this.scale;
    this.dots.height = 100 * this.scale;
    this.dotsContext = this.dots.getContext('2d');
    this.drawDots();
    this.dotsPattern = this.context.createPattern(this.dots, 'repeat');

    this.microDots = document.createElement('canvas');
    this.microDots.height = 100 * this.scale;
    this.microDots.width = 100 * this.scale;
    this.microDotsContext = this.microDots.getContext('2d');
    this.drawMicroDots();
    this.microDotsPattern = this.context.createPattern(
      this.microDots,
      'repeat'
    );

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

  drawLines() {
    this.linesContext.beginPath();
    this.linesContext.lineWidth = 2;
    this.linesContext.strokeStyle = 'rgba(43, 43, 43, 0.2)';

    // drawLine(this.linesContext, 200 * this.scale, 0, 300 * this.scale, 100 * this.scale);
    // drawLine(this.linesContext, 100 * this.scale, 0, 300 * this.scale, 200 * this.scale);
    // drawLine(this.linesContext, 0, 0, 300 * this.scale, 300 * this.scale);
    // drawLine(this.linesContext, 300 * this.scale, 300 * this.scale, 200 * this.scale, 400) * this.scale;
    // drawLine(this.linesContext, 200 * this.scale, 400 * this.scale, 0, 200 * this.scale);
    // drawLine(this.linesContext, 0, 100 * this.scale, 300 * this.scale, 400 * this.scale);
    // drawLine(this.linesContext, 0, 300 * this.scale, 100 * this.scale, 400 * this.scale);
    // drawLine(this.linesContext, 200 * this.scale, 0, 100 * this.scale, 100 * this.scale);
    // drawLine(this.linesContext, 300 * this.scale, 100 * this.scale, 0, 400 * this.scale);
    // drawLine(this.linesContext, 300 * this.scale, 300 * this.scale, 200 * this.scale, 400 * this.scale);

    // drawLine(this.linesContext, 200 * this.scale, 0, 200 * this.scale, 400 * this.scale);
    // drawLine(this.linesContext, 200 * this.scale, 400 * this.scale, 300 * this.scale, 400 * this.scale);
    // drawLine(this.linesContext, 300 * this.scale, 400 * this.scale, 300 * this.scale, 0);
    // drawLine(this.linesContext, 300 * this.scale, 0, 200 * this.scale, 0);
    // drawLine(this.linesContext, 200 * this.scale, 100 * this.scale, 100 * this.scale, 100 * this.scale);
    // drawLine(this.linesContext, 100 * this.scale, 100 * this.scale, 100 * this.scale, 300 * this.scale);
    // drawLine(this.linesContext, 100 * this.scale, 300 * this.scale, 200 * this.scale, 300 * this.scale);
    // drawLine(this.linesContext, 100 * this.scale, 200 * this.scale, 0, 200 * this.scale);
    // drawLine(this.linesContext, 0, 0, 0, 400 * this.scale);

    drawLine(
      this.linesContext,
      200 * this.scale,
      0,
      300 * this.scale,
      100 * this.scale
    );
    drawLine(
      this.linesContext,
      100 * this.scale,
      0,
      300 * this.scale,
      200 * this.scale
    );
    drawLine(this.linesContext, 0, 0, 300 * this.scale, 300 * this.scale);
    drawLine(
      this.linesContext,
      300 * this.scale,
      300 * this.scale,
      200 * this.scale,
      400 * this.scale
    );
    drawLine(
      this.linesContext,
      200 * this.scale,
      400 * this.scale,
      0,
      200 * this.scale
    );
    drawLine(
      this.linesContext,
      0,
      100 * this.scale,
      300 * this.scale,
      400 * this.scale
    );
    drawLine(
      this.linesContext,
      0,
      300 * this.scale,
      100 * this.scale,
      400 * this.scale
    );
    drawLine(
      this.linesContext,
      200 * this.scale,
      0,
      100 * this.scale,
      100 * this.scale
    );
    drawLine(
      this.linesContext,
      300 * this.scale,
      100 * this.scale,
      0,
      400 * this.scale
    );
    drawLine(
      this.linesContext,
      300 * this.scale,
      300 * this.scale,
      200 * this.scale,
      400 * this.scale
    );

    drawLine(
      this.linesContext,
      200 * this.scale,
      0,
      200 * this.scale,
      400 * this.scale
    );
    drawLine(
      this.linesContext,
      200 * this.scale,
      400 * this.scale,
      300 * this.scale,
      400 * this.scale
    );
    drawLine(
      this.linesContext,
      300 * this.scale,
      400 * this.scale,
      300 * this.scale,
      0
    );
    drawLine(this.linesContext, 300 * this.scale, 0, 200 * this.scale, 0);
    drawLine(
      this.linesContext,
      200 * this.scale,
      100 * this.scale,
      100 * this.scale,
      100 * this.scale
    );
    drawLine(
      this.linesContext,
      100 * this.scale,
      100 * this.scale,
      100 * this.scale,
      300 * this.scale
    );
    drawLine(
      this.linesContext,
      100 * this.scale,
      300 * this.scale,
      200 * this.scale,
      300 * this.scale
    );
    drawLine(
      this.linesContext,
      100 * this.scale,
      200 * this.scale,
      0,
      200 * this.scale
    );
    drawLine(this.linesContext, 0, 0, 0, 400 * this.scale);

    this.linesContext.closePath();
    this.linesContext.stroke();
    console.log('stroke');
  }

  drawDots() {
    console.log('draw dots');
    // this.dotsContext.fillStyle = 'rgba(255, 255, 255, 0.5)';
    // this.dotsContext.beginPath();
    // this.dotsContext.moveTo(0, 0);
    // this.dotsContext.arc(0, 0, 3, 0, 2 * Math.PI, true);

    // this.dotsContext.moveTo(100, 0);
    // this.dotsContext.arc(100, 0, 3, 0, 2 * Math.PI, true);

    // this.dotsContext.moveTo(0, 100);
    // this.dotsContext.arc(0, 100, 3, 0, 2 * Math.PI, true);

    // this.dotsContext.moveTo(100, 100);
    // this.dotsContext.arc(100, 100, 3, 0, 2 * Math.PI, true);

    // this.dotsContext.closePath();
    // this.dotsContext.fill();
    this.dotsContext.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.dotsContext.beginPath();
    this.dotsContext.moveTo(0, 0);
    this.dotsContext.arc(0, 0, 3, 0, 2 * Math.PI, true);

    this.dotsContext.moveTo(100 * this.scale, 0);
    this.dotsContext.arc(100 * this.scale, 0, 3, 0, 2 * Math.PI, true);

    this.dotsContext.moveTo(0, 100 * this.scale);
    this.dotsContext.arc(0, 100 * this.scale, 3, 0, 2 * Math.PI, true);

    this.dotsContext.moveTo(100 * this.scale, 100 * this.scale);
    this.dotsContext.arc(
      100 * this.scale,
      100 * this.scale,
      3,
      0,
      2 * Math.PI,
      true
    );

    this.dotsContext.closePath();
    this.dotsContext.fill();
  }

  drawMicroDots() {
    console.log('draw micro dots');
    this.microDotsContext.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.microDotsContext.beginPath();
    this.microDotsContext.moveTo(0, 50 * this.scale);
    this.microDotsContext.arc(0, 50 * this.scale, 2, 0, 2 * Math.PI, true);

    this.microDotsContext.moveTo(50 * this.scale, 50 * this.scale);
    this.microDotsContext.arc(
      50 * this.scale,
      50 * this.scale,
      2,
      0,
      2 * Math.PI,
      true
    );

    this.microDotsContext.moveTo(100 * this.scale, 50 * this.scale);
    this.microDotsContext.arc(
      100 * this.scale,
      50 * this.scale,
      2,
      0,
      2 * Math.PI,
      true
    );

    this.microDotsContext.closePath();
    this.microDotsContext.fill();
  }

  // renderLines() {
  //   this.context.beginPath();
  //   this.context.lineWidth = 2;
  //   this.context.strokeStyle = 'rgba(43, 43, 43, 0.2)';

  //   const currentX300 = this.currentX % (300 * this.lineScale);
  //   const currentY400 = this.currentY % (400 * this.lineScale);
  //   for (let i = -1; i < this.linePatternsX; i += 1) {
  //     for (let j = -1; j < this.linePatternsY; j += 1) {
  //       const i300 = i * 300;
  //       const j400 = j * 400;
  //       drawLine(
  //         this.context,
  //         (i300 + 200) * this.lineScale - Math.round(currentX300),
  //         (j400 + 0) * this.lineScale - Math.round(currentY400),
  //         (i300 + 300) * this.lineScale - Math.round(currentX300),
  //         (j400 + 100) * this.lineScale - Math.round(currentY400)
  //       );
  //       drawLine(
  //         this.context,
  //         (i300 + 100) * this.lineScale - Math.round(currentX300),
  //         (j400 + 0) * this.lineScale - Math.round(currentY400),
  //         (i300 + 300) * this.lineScale - Math.round(currentX300),
  //         (j400 + 200) * this.lineScale - Math.round(currentY400)
  //       );
  //       drawLine(
  //         this.context,
  //         (i300 + 0) * this.lineScale - Math.round(currentX300),
  //         (j400 + 0) * this.lineScale - Math.round(currentY400),
  //         (i300 + 300) * this.lineScale - Math.round(currentX300),
  //         (j400 + 300) * this.lineScale - Math.round(currentY400)
  //       );
  //       drawLine(
  //         this.context,
  //         (i300 + 300) * this.lineScale - Math.round(currentX300),
  //         (j400 + 300) * this.lineScale - Math.round(currentY400),
  //         (i300 + 200) * this.lineScale - Math.round(currentX300),
  //         (j400 + 400) * this.lineScale - Math.round(currentY400)
  //       );
  //       drawLine(
  //         this.context,
  //         (i300 + 200) * this.lineScale - Math.round(currentX300),
  //         (j400 + 400) * this.lineScale - Math.round(currentY400),
  //         (i300 + 0) * this.lineScale - Math.round(currentX300),
  //         (j400 + 200) * this.lineScale - Math.round(currentY400)
  //       );
  //       drawLine(
  //         this.context,
  //         (i300 + 0) * this.lineScale - Math.round(currentX300),
  //         (j400 + 100) * this.lineScale - Math.round(currentY400),
  //         (i300 + 300) * this.lineScale - Math.round(currentX300),
  //         (j400 + 400) * this.lineScale - Math.round(currentY400)
  //       );
  //       drawLine(
  //         this.context,
  //         (i300 + 0) * this.lineScale - Math.round(currentX300),
  //         (j400 + 300) * this.lineScale - Math.round(currentY400),
  //         (i300 + 100) * this.lineScale - Math.round(currentX300),
  //         (j400 + 400) * this.lineScale - Math.round(currentY400)
  //       );
  //       drawLine(
  //         this.context,
  //         (i300 + 200) * this.lineScale - Math.round(currentX300),
  //         (j400 + 0) * this.lineScale - Math.round(currentY400),
  //         (i300 + 100) * this.lineScale - Math.round(currentX300),
  //         (j400 + 100) * this.lineScale - Math.round(currentY400)
  //       );
  //       drawLine(
  //         this.context,
  //         (i300 + 300) * this.lineScale - Math.round(currentX300),
  //         (j400 + 100) * this.lineScale - Math.round(currentY400),
  //         (i300 + 0) * this.lineScale - Math.round(currentX300),
  //         (j400 + 400) * this.lineScale - Math.round(currentY400)
  //       );
  //       drawLine(
  //         this.context,
  //         (i300 + 300) * this.lineScale - Math.round(currentX300),
  //         (j400 + 300) * this.lineScale - Math.round(currentY400),
  //         (i300 + 200) * this.lineScale - Math.round(currentX300),
  //         (j400 + 400) * this.lineScale - Math.round(currentY400)
  //       );
  //     }
  //   }
  //   this.context.stroke();

  //   this.context.beginPath();
  //   this.context.lineWidth = 1;
  //   this.context.strokeStyle = 'rgba(43, 43, 43, 0.2)';
  //   for (let i = -1; i < this.linePatternsX; i += 1) {
  //     for (let j = -1; j < this.linePatternsY; j += 1) {
  //       const i300 = i * 300;
  //       const j400 = j * 400;
  //       drawLine(
  //         this.context,
  //         (i300 + 200) * this.lineScale - Math.round(currentX300),
  //         (j400 + 0) * this.lineScale - Math.round(currentY400),
  //         (i300 + 200) * this.lineScale - Math.round(currentX300),
  //         (j400 + 400) * this.lineScale - Math.round(currentY400)
  //       );
  //       drawLine(
  //         this.context,
  //         (i300 + 200) * this.lineScale - Math.round(currentX300),
  //         (j400 + 400) * this.lineScale - Math.round(currentY400),
  //         (i300 + 300) * this.lineScale - Math.round(currentX300),
  //         (j400 + 400) * this.lineScale - Math.round(currentY400)
  //       );
  //       drawLine(
  //         this.context,
  //         (i300 + 300) * this.lineScale - Math.round(currentX300),
  //         (j400 + 400) * this.lineScale - Math.round(currentY400),
  //         (i300 + 300) * this.lineScale - Math.round(currentX300),
  //         (j400 + 0) * this.lineScale - Math.round(currentY400)
  //       );
  //       drawLine(
  //         this.context,
  //         (i300 + 300) * this.lineScale - Math.round(currentX300),
  //         (j400 + 0) * this.lineScale - Math.round(currentY400),
  //         (i300 + 200) * this.lineScale - Math.round(currentX300),
  //         (j400 + 0) * this.lineScale - Math.round(currentY400)
  //       );
  //       drawLine(
  //         this.context,
  //         (i300 + 200) * this.lineScale - Math.round(currentX300),
  //         (j400 + 100) * this.lineScale - Math.round(currentY400),
  //         (i300 + 100) * this.lineScale - Math.round(currentX300),
  //         (j400 + 100) * this.lineScale - Math.round(currentY400)
  //       );
  //       drawLine(
  //         this.context,
  //         (i300 + 100) * this.lineScale - Math.round(currentX300),
  //         (j400 + 100) * this.lineScale - Math.round(currentY400),
  //         (i300 + 100) * this.lineScale - Math.round(currentX300),
  //         (j400 + 300) * this.lineScale - Math.round(currentY400)
  //       );
  //       drawLine(
  //         this.context,
  //         (i300 + 100) * this.lineScale - Math.round(currentX300),
  //         (j400 + 300) * this.lineScale - Math.round(currentY400),
  //         (i300 + 200) * this.lineScale - Math.round(currentX300),
  //         (j400 + 300) * this.lineScale - Math.round(currentY400)
  //       );
  //       drawLine(
  //         this.context,
  //         (i300 + 100) * this.lineScale - Math.round(currentX300),
  //         (j400 + 200) * this.lineScale - Math.round(currentY400),
  //         (i300 + 0) * this.lineScale - Math.round(currentX300),
  //         (j400 + 200) * this.lineScale - Math.round(currentY400)
  //       );
  //       drawLine(
  //         this.context,
  //         (i300 + 0) * this.lineScale - Math.round(currentX300),
  //         (j400 + 0) * this.lineScale - Math.round(currentY400),
  //         (i300 + 0) * this.lineScale - Math.round(currentX300),
  //         (j400 + 400) * this.lineScale - Math.round(currentY400)
  //       );
  //     }
  //   }
  //   this.context.stroke();
  // }

  // renderDots(fillStyle, speed) {
  //   this.context.beginPath();
  //   this.context.fillStyle = fillStyle;
  //   const halfCurrentX100 = (this.currentX * speed) % 100;
  //   const halfCurrentY100 = (this.currentY * speed) % 100;

  //   for (let i = -1; i < this.dotsX; i += 1) {
  //     for (let j = -1; j < this.dotsY; j += 1) {
  //       const i100 = i * 100;
  //       const j100 = j * 100;
  //       this.context.moveTo(
  //         (i100 - Math.round(halfCurrentX100)) * this.dotScale,
  //         (j100 - Math.round(halfCurrentY100)) * this.dotScale
  //       );
  //       this.context.arc(
  //         (i100 - Math.round(halfCurrentX100)) * this.dotScale,
  //         (j100 - Math.round(halfCurrentY100)) * this.dotScale,
  //         1.5 * this.dotScale,
  //         0,
  //         2 * Math.PI,
  //         true
  //       );
  //     }
  //   }
  //   this.context.fill();
  // }

  render() {
    this.context.clearRect(0, 0, this.windowWidth, this.windowHeight);

    this.context.save();
    this.context.translate(
      (((-this.currentX * 1) / 3) % 100) * this.scale,
      (-this.currentY % 100) * this.scale
    );
    this.context.fillStyle = this.microDotsPattern;
    this.context.fillRect(
      -100 * this.scale,
      -100 * this.scale,
      this.windowWidth + 200 * this.scale,
      this.windowHeight + 200 * this.scale
    );
    this.context.restore();

    this.context.save();
    this.context.translate(
      (((-this.currentX * 1) / 2) % 300) * this.scale,
      (-this.currentY % 400) * this.scale
    );
    this.context.fillStyle = this.linesPattern;
    this.context.fillRect(
      -300 * this.scale,
      -400 * this.scale,
      this.windowWidth + 600 * this.scale,
      this.windowHeight + 800 * this.scale
    );
    this.context.restore();

    this.context.save();
    this.context.translate(
      (((-this.currentX * 4) / 3) % 100) * this.scale,
      (-this.currentY % 100) * this.scale
    );
    this.context.fillStyle = this.dotsPattern;
    this.context.fillRect(
      -100 * this.scale,
      -100 * this.scale,
      this.windowWidth + 200 * this.scale,
      this.windowHeight + 200 * this.scale
    );
    this.context.restore();
  }
}

export default Background;
