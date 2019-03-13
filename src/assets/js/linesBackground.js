class Pattern {
  constructor(opts) {
    this.canvas = document.createElement("canvas");
    this.scale = opts.scale;
    this.width = this.canvas.width = this.scale * opts.width;
    this.height = this.canvas.height = this.scale * opts.height;
    this.context = this.canvas.getContext("2d");

    this.create = opts.create;
    this.create();
  }
}

class PatternBackground {
  constructor(opts) {
    this.canvas = document.createElement("canvas");
    this.width = this.canvas.width = opts.width;
    this.height = this.canvas.height = opts.height;
    this.context = this.canvas.getContext("2d");

    this.scale = opts.scale;
    this.pattern = new Pattern({
      width: opts.patternWidth,
      height: opts.patternHeight,
      scale: this.scale,
      create: opts.create
    });
    this.patternsX = Math.round(this.width / this.pattern.width);
    if (this.patternsX < 2) {
      this.patternsX = 2;
    }
    this.patternsY = Math.round(this.height / this.pattern.height);
  }

  render() {
    for (let x = 0; x < this.patternsX; x++) {
      for (let y = 0; y < this.patternsY; y++) {
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
    this.patternsX = Math.round(this.width / this.pattern.width);
    if (this.patternsX < 2) {
      this.patternsX = 2;
    }
    this.render();
  }
}

class Background {
  constructor(opts) {
    this.canvas = document.querySelector("canvas.background");
    this.context = this.canvas.getContext("2d");
    this.windowWidth = this.canvas.width = window.innerWidth;
    this.windowHeight = this.canvas.height = window.innerHeight;

    this.bufferCanvas = document.createElement("canvas");
    this.bufferContext = this.bufferCanvas.getContext("2d");
    this.bufferCanvas.width = this.windowWidth;
    this.bufferCanvas.height = this.windowHeight;
    this.scale = opts.scale;

    this.margin = this.windowWidth / 2;
    this.bufferWidth = this.windowWidth + this.margin;
    this.bufferHeight = document.body.clientHeight;

    this.linesBackground = new PatternBackground({
      width: this.bufferWidth,
      height: this.bufferHeight,
      scale: this.scale,
      create: function create() {
        this.context.lineWidth = 2;
        this.context.strokeStyle = "rgb(43, 43, 43, 0.2)";
        this.context.lineCap = "square";

        this.context.beginPath();
        this.context.moveTo(this.scale * 200, this.scale * 0);
        this.context.lineTo(this.scale * 300, this.scale * 100);
        //
        this.context.moveTo(this.scale * 100, this.scale * 0);
        this.context.lineTo(this.scale * 300, this.scale * 200);
        //
        this.context.moveTo(this.scale * 0, this.scale * 0);
        this.context.lineTo(this.scale * 300, this.scale * 300);
        this.context.lineTo(this.scale * 200, this.scale * 400);
        this.context.lineTo(this.scale * 0, this.scale * 200);
        //
        this.context.moveTo(this.scale * 0, this.scale * 100);
        this.context.lineTo(this.scale * 300, this.scale * 400);
        //
        this.context.moveTo(this.scale * 0, this.scale * 300);
        this.context.lineTo(this.scale * 100, this.scale * 400);
        //
        this.context.moveTo(this.scale * 200, this.scale * 0);
        this.context.lineTo(this.scale * 100, this.scale * 100);
        //
        this.context.moveTo(this.scale * 300, this.scale * 100);
        this.context.lineTo(this.scale * 0, this.scale * 400);
        //
        this.context.moveTo(this.scale * 300, this.scale * 300);
        this.context.lineTo(this.scale * 200, this.scale * 400);
        this.context.stroke();

        // Горизонтальные и вертикальные
        this.context.beginPath();
        this.context.lineWidth = 1;
        this.context.strokeStyle = "rgb(43, 43, 43, 0.2)";
        this.context.moveTo(this.scale * 200, this.scale * 0);
        this.context.lineTo(this.scale * 200, this.scale * 400);
        this.context.lineTo(this.scale * 300, this.scale * 400);
        this.context.lineTo(this.scale * 300, this.scale * 0);
        this.context.lineTo(this.scale * 200, this.scale * 0);
        //
        this.context.moveTo(this.scale * 200, this.scale * 100);
        this.context.lineTo(this.scale * 100, this.scale * 100);
        this.context.lineTo(this.scale * 100, this.scale * 300);
        this.context.lineTo(this.scale * 200, this.scale * 300);
        //
        this.context.moveTo(this.scale * 100, this.scale * 200);
        this.context.lineTo(this.scale * 0, this.scale * 200);
        //
        this.context.moveTo(this.scale * 0, this.scale * 0);
        this.context.lineTo(this.scale * 0, this.scale * 400);
        this.context.stroke();
      },
      patternWidth: 300,
      patternHeight: 400
    });
    this.dotsBackground = new PatternBackground({
      width: this.bufferWidth,
      height: this.bufferHeight,
      scale: this.scale,
      create: function create() {
        this.context.beginPath();
        this.context.fillStyle = "rgb(255, 255, 255, 0.5)";
        this.context.moveTo(2 * this.scale, 0);
        this.context.lineTo(0, 0);
        this.context.lineTo(0, 2 * this.scale);
        this.context.arc(0, 0, 2 * this.scale, Math.PI / 2, 2 * Math.PI, true); // IV
        // x, y, radius, startAngle, endAngle, counterclockwise
        this.context.fill();

        this.context.beginPath();
        this.context.fillStyle = "rgb(255, 255, 255, 0.6)";
        this.context.moveTo(98 * this.scale, 100 * this.scale);
        this.context.lineTo(100 * this.scale, 100 * this.scale);
        this.context.lineTo(100 * this.scale, 98 * this.scale);
        this.context.arc(
          100 * this.scale,
          100 * this.scale,
          2 * this.scale,
          (3 * Math.PI) / 2,
          Math.PI,
          true
        ); // II
        // x, y, radius, startAngle, endAngle, counterclockwise
        this.context.fill();

        this.context.beginPath();
        this.context.fillStyle = "rgb(255, 255, 255, 0.6)";
        this.context.moveTo(98 * this.scale, 0);
        this.context.lineTo(100 * this.scale, 0 * this.scale);
        this.context.lineTo(100 * this.scale, 2 * this.scale);
        this.context.arc(
          100 * this.scale,
          0,
          2 * this.scale,
          Math.PI,
          Math.PI / 2,
          true
        ); // III
        // x, y, radius, startAngle, endAngle, counterclockwise
        this.context.fill();

        this.context.beginPath();
        this.context.fillStyle = "rgb(255, 255, 255, 0.6)";
        this.context.moveTo(0, 98 * this.scale);
        this.context.lineTo(0, 100 * this.scale);
        this.context.lineTo(2 * this.scale, 100 * this.scale);
        this.context.arc(
          0,
          100 * this.scale,
          2 * this.scale,
          0,
          (3 * Math.PI) / 2,
          true
        ); // I
        // x, y, radius, startAngle, endAngle, counterclockwise
        this.context.fill();
      },
      patternWidth: 100,
      patternHeight: 100
    });

    this.downDotsBackground = new PatternBackground({
      width: this.bufferWidth,
      height: this.bufferHeight,
      scale: this.scale,
      create: function create() {
        this.context.beginPath();
        this.context.fillStyle = "rgb(255, 255, 255, 0.4)";
        this.context.moveTo(2 * this.scale, 0);
        this.context.lineTo(0, 0);
        this.context.lineTo(0, 2 * this.scale);
        this.context.arc(0, 0, 2 * this.scale, Math.PI / 2, 2 * Math.PI, true); // IV
        // x, y, radius, startAngle, endAngle, counterclockwise
        this.context.fill();

        this.context.beginPath();
        this.context.fillStyle = "rgb(255, 255, 255, 0.4)";
        this.context.moveTo(98 * this.scale, 100 * this.scale);
        this.context.lineTo(100 * this.scale, 100 * this.scale);
        this.context.lineTo(100 * this.scale, 98 * this.scale);
        this.context.arc(
          100 * this.scale,
          100 * this.scale,
          2 * this.scale,
          (3 * Math.PI) / 2,
          Math.PI,
          true
        ); // II
        // x, y, radius, startAngle, endAngle, counterclockwise
        this.context.fill();

        this.context.beginPath();
        this.context.fillStyle = "rgb(255, 255, 255, 0.4)";
        this.context.moveTo(98 * this.scale, 0);
        this.context.lineTo(100 * this.scale, 0 * this.scale);
        this.context.lineTo(100 * this.scale, 2 * this.scale);
        this.context.arc(
          100 * this.scale,
          0,
          2 * this.scale,
          Math.PI,
          Math.PI / 2,
          true
        ); // III
        // x, y, radius, startAngle, endAngle, counterclockwise
        this.context.fill();

        this.context.beginPath();
        this.context.fillStyle = "rgb(255, 255, 255, 0.4)";
        this.context.moveTo(0, 98 * this.scale);
        this.context.lineTo(0, 100 * this.scale);
        this.context.lineTo(2 * this.scale, 100 * this.scale);
        this.context.arc(
          0,
          100 * this.scale,
          2 * this.scale,
          0,
          (3 * Math.PI) / 2,
          true
        ); // I
        // x, y, radius, startAngle, endAngle, counterclockwise
        this.context.fill();
      },
      patternWidth: 100,
      patternHeight: 100
    });

    // Параллакс
    this.currentX = 0;
    this.clientX = 0;
    this.pageY = window.pageYOffset;
    this.currentY = this.pageY;
  }

  handleWindowResize() {
    this.windowWidth = this.canvas.width = window.innerWidth;
    this.windowHeight = this.canvas.height = window.innerHeight;

    this.bufferCanvas.width = this.windowWidth;
    this.bufferCanvas.height = this.windowHeight;

    this.margin = this.windowWidth / 2;
    this.downDotsBackground.width = this.dotsBackground.width = this.linesBackground.width = this.bufferWidth =
      this.windowWidth + this.margin;
    this.linesBackground.update();
    this.dotsBackground.update();
    this.downDotsBackground.update();
    this.render(true);
  }
  handleScroll() {
    this.pageY = window.pageYOffset;
    if (this.pageY < 0) {
      this.pageY = 0;
    }
  }
  handleMouseMove(e) {
    this.clientX = e.clientX - this.margin;
  }
  listen() {
    // Добавим обработчики ивентов при изменении каких-либо параметров
    window.addEventListener("resize", this.handleWindowResize.bind(this));
    window.addEventListener("scroll", this.handleScroll.bind(this));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
  }

  render(bool = false) {
    if (this.currentX != this.clientX || this.currentY != this.pageY || bool) {
      this.currentX += (this.clientX - this.currentX) / 10;
      this.currentY += (this.pageY - this.currentY) / 5;
      if (Math.abs(this.clientX - this.currentX) < 1) {
        this.currentX = this.clientX;
      }
      if (Math.abs(this.pageY - this.currentY) < 1) {
        this.currentY = this.pageY;
      }
      const linesX = this.currentX / 20;
      const linesY = this.currentY / 4;
      const upperDotsX = this.currentX / 10;
      const upperDotsY = this.currentY / 2;
      const downDotsX = this.currentX / 25;
      const downDotsY = this.currentY / 5;

      this.bufferContext.fillStyle = "#0d0a14";
      this.bufferContext.clearRect(0, 0, this.windowWidth, this.windowHeight);
      this.bufferContext.fillRect(0, 0, this.windowWidth, this.windowHeight);
      this.bufferContext.drawImage(
        this.downDotsBackground.canvas,
        this.margin / 2 + downDotsX,
        downDotsY,
        this.windowWidth,
        this.windowHeight,
        0,
        0,
        this.windowWidth,
        this.windowHeight
      );
      this.bufferContext.drawImage(
        this.linesBackground.canvas,
        this.margin / 2 + linesX,
        linesY,
        this.windowWidth,
        this.windowHeight,
        0,
        0,
        this.windowWidth,
        this.windowHeight
      );
      this.bufferContext.drawImage(
        this.dotsBackground.canvas,
        this.margin / 2 + upperDotsX,
        upperDotsY,
        this.windowWidth,
        this.windowHeight,
        0,
        0,
        this.windowWidth,
        this.windowHeight
      );
      this.context.drawImage(this.bufferCanvas, 0, 0);
    }
  }
}

export default Background;
