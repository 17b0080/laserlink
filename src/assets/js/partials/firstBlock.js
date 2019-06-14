/* eslint-disable no-undef */
/* eslint-disable prefer-destructuring */

class FirstRhombus {
  constructor(opts) {
    this.parent = opts.parent;
    this.scale = this.parent.scale;
    this.context = this.parent.context;

    // Смещение оси координат для удобства
    this.x = opts.dx; // скалированная (*)
    this.y = opts.dy; // скалированная (*)
    this.request = false;

    //

    this.width = opts.width;
    this.height = opts.height;
    this.scaledWidth = this.width * this.scale;
    this.halfScaledWidth = this.scaledWidth / 2;
    this.scaledHeight = this.height * this.scale;
    this.halfScaledHeight = this.scaledHeight / 2;

    this.dots = {
      x0: this.x,
      y0: this.y + this.halfScaledWidth,
      x1: this.x + this.halfScaledWidth,
      y1: this.y,
      x2: this.x + this.scaledWidth,
      y2: this.y + this.halfScaledWidth,
      x3: this.x + this.halfScaledWidth,
      y3: this.y + this.scaledHeight,
      moveX0: this.x + this.halfScaledWidth,
      moveX1: this.x + this.halfScaledWidth,
      moveY: this.y
    };

    // Анимации
    this.imageAlpha = 0;
    this.imageCounter = 0;
    this.imageCounters = 100;
    this.upCounter = 0;
    this.downCounter = 0;
    this.counters = 25;
    this.speed = this.halfScaledWidth / this.counters;

    this.ready = false;
    this.upReady = false;
    this.downReady = false;
    this.imageReady = false;

    this.image = opts.image;
  }

  /**
   * Обработчики событий
   */

  updateXY(x, y) {
    this.rendered = false;
    this.x = x;
    this.y = y;
  }

  handleResize() {
    this.scale = this.parent.scale;
    this.scaledWidth = this.width * this.scale;
    this.halfScaledWidth = this.scaledWidth / 2;
    this.scaledHeight = this.height * this.scale;
    this.halfScaledHeight = this.scaledHeight / 2;

    this.speed = this.halfScaledWidth / this.counters;

    this.calculateDots();
  }

  drawImage() {
    this.context.save();
    this.context.globalAlpha = this.imageAlpha;
    this.context.drawImage(
      this.image,
      this.x,
      this.y,
      this.scaledWidth,
      this.scaledHeight
    );
    this.context.restore();
  }

  updateCounters() {
    if (this.upCounter === 25) this.upReady = true;
    if (this.downCounter === 25) this.downReady = true;
    if (this.upReady && this.downReady) {
      this.ready = true;
    }

    if (this.imageAlpha === 1) this.imageReady = true;

    if (!this.upReady) {
      this.upCounter += 1;
    }

    if (this.upReady && !this.downReady) {
      this.downCounter += 1;
    }

    if (this.ready && !this.imageReady) {
      this.imageAlpha += 0.05;
    }
  }

  calculateDots() {
    // Движущие точки расширяются
    if (!this.upReady) {
      this.dots = {
        x0: this.x,
        y0: this.y + this.halfScaledHeight,
        x1: this.x + this.halfScaledWidth,
        y1: this.y,
        x2: this.x + this.scaledWidth,
        y2: this.y + this.halfScaledHeight,
        x3: this.x + this.halfScaledWidth,
        y3: this.y + this.scaledHeight,
        moveX0: this.x + this.halfScaledWidth - this.speed * this.upCounter,
        moveX1: this.x + this.halfScaledWidth + this.speed * this.upCounter,
        moveY: this.y + this.speed * this.upCounter
      };
    }

    // Движущие точки сужаются
    if (this.upReady && !this.downReady) {
      this.dots = {
        x0: this.x,
        y0: this.y + this.halfScaledHeight,
        x1: this.x + this.halfScaledWidth,
        y1: this.y,
        x2: this.x + this.scaledWidth,
        y2: this.y + this.halfScaledHeight,
        x3: this.x + this.halfScaledWidth,
        y3: this.y + this.scledHeight,
        moveX0: this.x + this.speed * this.downCounter,
        moveX1: this.x + this.scaledWidth - this.speed * this.downCounter,
        moveY: this.y + this.halfScaledHeight + this.speed * this.downCounter
      };
    }

    // Движущих точек нет, быстрая вставка
    if (this.ready) {
      this.dots = {
        x0: this.x,
        y0: this.y + this.halfScaledHeight,
        x1: this.x + this.halfScaledWidth,
        y1: this.y,
        x2: this.x + this.scaledWidth,
        y2: this.y + this.halfScaledHeight,
        x3: this.x + this.halfScaledWidth,
        y3: this.y + this.scaledHeight
      };
    }
  }

  animate() {
    // Поэтапный верх линий ромба
    if (!this.upReady) {
      this.context.beginPath();
      this.context.strokeStyle = 'white';
      this.context.lineWidth = 2;
      this.context.moveTo(this.dots.moveX0, this.dots.moveY);
      this.context.lineTo(this.dots.x1, this.dots.y1);
      this.context.lineTo(this.dots.moveX1, this.dots.moveY);
      this.context.stroke();
    }
    // Верх + поэтапный низ линий ромба
    else if (this.upReady && !this.downReady) {
      this.context.beginPath();
      this.context.strokeStyle = 'white';
      this.context.lineWidth = 2;
      this.context.moveTo(this.dots.moveX0, this.dots.moveY);
      this.context.lineTo(this.dots.x0, this.dots.y0);
      this.context.lineTo(this.dots.x1, this.dots.y1);
      this.context.lineTo(this.dots.x2, this.dots.y2);
      this.context.lineTo(this.dots.moveX1, this.dots.moveY);
      this.context.stroke();
    }
    // Быстрая вставка линий ромба
    else if (this.ready) {
      this.context.beginPath();
      this.context.strokeStyle = 'white';
      this.context.strokeWidth = 2;
      this.context.moveTo(this.dots.x0, this.dots.y0);
      this.context.lineTo(this.dots.x1, this.dots.y1);
      this.context.lineTo(this.dots.x2, this.dots.y2);
      this.context.lineTo(this.dots.x3, this.dots.y3);
      this.context.closePath();
      this.drawImage();
      this.context.stroke();
      this.rendered = true;
    }

    this.parent.cleared = false;
  }

  render(onWindow) {
    if (onWindow) {
      this.updateCounters();
      this.calculateDots();
      this.animate();
    } else if (this.upCounter !== 0 && !this.ready) {
      this.updateCounters();
    }
  }

  checkRequest() {
    let request = false;
    if (
      (this.upCounter !== 0 && !this.ready) ||
      (this.ready && !this.imageReady)
    ) {
      request = true;
    }
    return request;
  }
}

class FirstBlock {
  constructor(opts) {
    this.parent = opts.parent;
    this.context = this.parent.context;
    this.scale = this.parent.scale;

    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    this.spacing = this.parent.spacing;
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    // Смещение оси координат
    this.dx = opts.dx;
    this.dy = opts.dy;
    this.x = this.dx * this.scale - this.currentX + this.spacing;
    this.y = this.dy * this.scale - this.currentY;

    this.calculateDirt();

    this.onWindow = false;

    this.image = opts.image;

    this.rhombus = new FirstRhombus({
      parent: this,
      scale: this.scale,
      context: this.context,
      width: 355,
      height: 355,
      x: this.x,
      y: this.y,
      image: this.image
    });
  }

  /**
   * Обработчики событий
   */

  updateXY() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;
    this.x = this.dx * this.scale - this.currentX + this.spacing;
    this.y = this.dy * this.scale - this.currentY;

    this.rhombus.updateXY(this.x, this.y);

    this.checkWindow();
  }

  handleResize() {
    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    this.scale = this.parent.scale;
    this.spacing = this.parent.spacing;

    this.x = this.dx * this.scale - this.currentX + this.spacing;
    this.y = this.dy * this.scale - this.currentY;

    this.rhombus.handleResize();
  }

  clearDirt() {
    this.context.clearRect(
      this.dirtDots.x,
      this.dirtDots.y,
      this.dirtDots.w,
      this.dirtDots.h
    );
    this.cleared = true;
  }

  calculateDirt() {
    const x = this.x - 4 > 0 ? this.x - 4 : 0;
    const y = this.y - 4 > 0 ? this.y - 4 : 0;
    this.dirtDots = {
      x,
      y,
      w: 355 * this.scale + 8,
      h: 355 * this.scale + 8
    };
  }

  checkWindow() {
    if (
      (this.y > -4 && this.y < this.windowHeight + 4) ||
      (this.y + this.rhombus.scaledHeight > -4 &&
        this.y + this.rhombus.scaledHeight < this.windowHeight + 4) ||
      (this.y + this.rhombus.scaledHeight / 2 > -4 &&
        this.y + this.rhombus.scaledHeight / 2 < this.windowHeight)
    ) {
      this.onWindow = true;
      // window.trigger(0);
    } else {
      this.onWindow = false;
    }
  }

  render() {
    this.clearDirt();
    this.rhombus.render(this.onWindow);
    this.calculateDirt();
    if (!this.onWindow && this.cleared === false) this.clearDirt();
    this.request = this.rhombus.checkRequest();
  }
}

export default FirstBlock;
