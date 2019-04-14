/* eslint-disable no-undef */
/* eslint-disable prefer-destructuring */
class Rhombus {
  constructor(opts) {
    this.parent = opts.parent;
    this.scale = opts.scale;
    // Контекст, в котором будет происходить рисовка
    this.context = opts.context;
    // Скалирование
    this.scale = opts.scale;
    // Смещение оси координат для удобства
    this.x = opts.x;
    this.y = opts.y;
    this.request = false;

    this.init(opts.width, opts.type, opts.images);
  }

  init(width, type, images) {
    // Высота и ширина  основного ромба
    this.defaultWidth = width;

    this.width = width * this.scale;
    this.halfwidth = this.width / 2;
    this.height = this.width;
    this.halfheight = this.height / 2;

    this.upCounter = 0;
    this.downCounter = 0;
    this.counters = 50;
    this.speed = this.width / this.counters / 2;

    this.ready = false;
    this.upReady = false;
    this.downReady = false;

    this.dots = {
      x0: this.x,
      y0: this.y + this.halfheight,
      x1: this.x + this.halfwidth,
      y1: this.y,
      x2: this.x + this.width,
      y2: this.y + this.halfheight,
      x3: this.x + this.halfwidth,
      y3: this.y + this.height,
      moveX0: this.x + this.halfwidth,
      moveX1: this.x + this.halfwidth,
      moveY: this.y
    };

    this.dirtDots = {
      x: this.x > 0 ? this.x : 0,
      y: this.y > 0 ? this.y : 0,
      w: this.width - this.x,
      h: this.dots.moveY - this.y
    };

    if (type === 'soloImage') {
      this.updateCounters = this.updateCountersSolo;
      this.animate = this.animateSolo;

      this.imageReady = false;
      this.image = images[0];
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.canvas
        .getContext('2d')
        .drawImage(this.image, 0, 0, this.width, this.height);
      this.imagePattern = this.context.createPattern(this.canvas, 'repeat');
      this.imageAlpha = 0;
      this.imageCounters = 100;
      this.imageCounter = 0;
    } else if (type === 'multiImage') {
      this.updateCounters = this.updateCountersSolo;
      this.animate = this.animateMulti;

      this.imageReady = false;
      this.image = images[0];
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.canvas
        .getContext('2d')
        .drawImage(this.image, 0, 0, this.width, this.height);
      this.imagePattern = this.context.createPattern(this.canvas, 'repeat');
      this.imageAlpha = 0;
      this.imageCounters = 100;
      this.imageCounter = 0;
    } else if (type === 'hover') {
      this.updateCounters = this.updateCountersHover;
      this.animate = this.animateSolo;

      this.hovered = false;
      this.image = images[1];
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.canvas
        .getContext('2d')
        .drawImage(this.image, 0, 0, this.width, this.height);

      this.imagePattern = this.context.createPattern(this.canvas, 'repeat');
      this.imageAlpha = 0;
      this.imageCounters = 100;
      this.imageCounter = 0;

      this.cleared = false;
    }
  }

  drawImage() {
    this.context.save();
    this.context.translate(this.x, this.y);
    this.context.globalAlpha = this.imageAlpha;
    this.context.fill();
    this.context.globalAlpha = 1;
    this.context.restore();
  }

  updateCountersSolo() {
    if (this.upCounter === 50) this.upReady = true;
    if (this.downCounter === 50) this.downReady = true;
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

  updateCountersMulti() {
    if (this.upCounter === 50) this.upReady = true;
    if (this.downCounter === 50) this.downReady = true;
    if (this.upReady && this.downReady) {
      this.ready = true;
    }

    if (!this.upReady) {
      this.upCounter += 1;
    }

    if (this.upReady && !this.downReady) {
      this.downCounter += 1;
    }
  }

  updateCountersHover() {
    if (this.upCounter === 50) this.upReady = true;
    if (this.downCounter === 50) this.downReady = true;
    if (this.upReady && this.downReady) {
      this.ready = true;
    }
    if (this.imageAlpha === 0.5) {
      this.imageReady = true;
    } else {
      this.imageReady = false;
    }

    if (!this.upReady) {
      this.upCounter += 1;
    }

    if (this.upReady && !this.downReady) {
      this.downCounter += 1;
    }

    if (this.ready && this.hovered && !this.imageReady) {
      this.imageAlpha += 0.05;
      if (this.imageAlpha > 0.5) this.imageAlpha = 0.5;
    } else if (this.ready && !this.hovered && this.imageAlpha !== 0) {
      this.imageAlpha -= 0.05;
      if (this.imageAlpha < 0) this.imageAlpha = 0;
    }
  }

  calculateDots() {
    // Движущие точки расширяются
    if (!this.upReady) {
      this.dots = {
        x0: this.x,
        y0: this.y + this.halfheight,
        x1: this.x + this.halfwidth,
        y1: this.y,
        x2: this.x + this.width,
        y2: this.y + this.halfheight,
        x3: this.x + this.halfwidth,
        y3: this.y + this.height,
        moveX0: this.x + this.halfwidth - this.speed * this.upCounter,
        moveX1: this.x + this.halfwidth + this.speed * this.upCounter,
        moveY: this.y + this.speed * this.upCounter
      };
    }

    // Движущие точки сужаются
    if (this.upReady && !this.downReady) {
      this.dots = {
        x0: this.x,
        y0: this.y + this.halfheight,
        x1: this.x + this.halfwidth,
        y1: this.y,
        x2: this.x + this.width,
        y2: this.y + this.halfheight,
        x3: this.x + this.halfwidth,
        y3: this.y + this.height,
        moveX0: this.x + this.speed * this.downCounter,
        moveX1: this.x + this.width - this.speed * this.downCounter,
        moveY: this.y + this.halfheight + this.speed * this.downCounter
      };
    }

    // Движущих точек нет, быстрая вставка
    if (this.ready) {
      this.dots = {
        x0: this.x,
        y0: this.y + this.halfheight,
        x1: this.x + this.halfwidth,
        y1: this.y,
        x2: this.x + this.width,
        y2: this.y + this.halfheight,
        x3: this.x + this.halfwidth,
        y3: this.y + this.height
      };
    }
  }

  animateMulti() {
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
      this.context.fillStyle = this.imagePattern;
      this.context.moveTo(this.dots.x0, this.dots.y0);
      this.context.lineTo(this.dots.x1, this.dots.y1);
      this.context.lineTo(this.dots.x2, this.dots.y2);
      this.context.lineTo(this.dots.x3, this.dots.y3);
      this.drawImage();
      this.context.closePath();
      this.context.stroke();
      this.rendered = true;
    }

    this.parent.cleared = false;
  }

  animateSolo() {
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
      this.context.fillStyle = this.imagePattern;
      this.context.moveTo(this.dots.x0, this.dots.y0);
      this.context.lineTo(this.dots.x1, this.dots.y1);
      this.context.lineTo(this.dots.x2, this.dots.y2);
      this.context.lineTo(this.dots.x3, this.dots.y3);
      this.drawImage();
      this.context.closePath();
      this.context.stroke();
      this.rendered = true;
    }

    this.parent.cleared = false;
  }

  render(onWindow, ready) {
    if (onWindow && ready) {
      this.updateCounters();
      this.calculateDots();
      this.animate();
    } else if (this.upCounter !== 0 && !this.ready && ready) {
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

  updateXY(x, y) {
    this.rendered = false;
    this.x = x;
    this.y = y;
  }
}

class FirstRhombus {
  constructor(opts) {
    window.firstrhombus = this;
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
    this.counters = 50;
    this.speed = this.halfScaledWidth / this.counters;

    this.ready = false;
    this.upReady = false;
    this.downReady = false;
    this.imageReady = false;

    this.image = opts.image;
    // Скалирование картинки и выдача паттерна
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.scaledWidth;
    this.canvas.height = this.scaledHeight;
    this.canvas
      .getContext('2d')
      .drawImage(this.image, 0, 0, this.scaledWidth, this.scaledHeight);
    this.imagePattern = this.context.createPattern(this.canvas, 'repeat');
    // Конец скалирования и выдачи паттерна
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

    this.canvas
      .getContext('2d')
      .drawImage(this.image, 0, 0, this.scaledWidth, this.scaledHeight);
    this.imagePattern = this.context.createPattern(this.canvas, 'repeat');

    this.speed = this.halfScaledWidth / this.counters;

    this.calculateDots();
  }

  drawImage() {
    this.context.save();
    this.context.translate(this.x, this.y);
    this.context.globalAlpha = this.imageAlpha;
    this.context.fill();
    this.context.globalAlpha = 1;
    this.context.restore();
  }

  updateCounters() {
    if (this.upCounter === 50) this.upReady = true;
    if (this.downCounter === 50) this.downReady = true;
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
      this.context.fillStyle = this.imagePattern;
      this.context.moveTo(this.dots.x0, this.dots.y0);
      this.context.lineTo(this.dots.x1, this.dots.y1);
      this.context.lineTo(this.dots.x2, this.dots.y2);
      this.context.lineTo(this.dots.x3, this.dots.y3);
      this.drawImage();
      this.context.closePath();
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
        this.y + this.rhombus.scaledHeight < this.windowHeight + 4)
    ) {
      this.onWindow = true;
      window.trigger(0);
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

// 1 - большая
// 2 - снизу
// 3 - сверху
class WorkRhombus {
  constructor(opts) {
    window.a1 = this;
    this.parent = opts.parent;
    this.scale = this.parent.scale;
    this.context = this.parent.context;

    // Смещение оси координат для удобства
    this.x = opts.dx; // скалированная (*)
    this.y = opts.dy; // скалированная (*)
    this.request = false;

    this.width = opts.width;
    this.height = opts.height;
    this.scaledWidth = this.width * this.scale;
    this.halfScaledWidth = this.scaledWidth / 2;
    this.scaledHeight = this.height * this.scale;
    this.halfScaledHeight = this.scaledHeight / 2;

    this.imageAlpha = 0;
    this.imageCounter = 0;
    this.imageCounters = 100;
    this.upCounter = 0;
    this.downCounter = 0;
    this.counters = 50;
    this.speed = this.halfScaledWidth / this.counters;

    this.ready = false;
    this.upReady = false;
    this.downReady = false;
    this.imageReady = false;
    this.dots = {
      x0: this.x,
      y0: this.y + this.halfScaledHeight,
      x1: this.x + this.halfScaledWidth,
      y1: this.y,
      x2: this.x + this.scaledWidth,
      y2: this.y + this.halfScaledHeight,
      x3: this.x + this.halfScaledWidth,
      y3: this.y + this.scaledHeight,
      moveX0: this.x + this.halfScaledWidth,
      moveX1: this.x + this.halfScaledWidth,
      moveY: this.y
    };

    this.image = opts.images[0]; // большая
    this.downImage = opts.images[1]; // снизу
    this.upperImage = opts.images[2]; // сверху

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.scaledWidth;
    this.canvas.height = this.scaledHeight;
    this.canvas
      .getContext('2d')
      .drawImage(this.image, 0, 0, this.scaledWidth, this.scaledHeight);
    this.canvas
      .getContext('2d')
      .drawImage(
        this.downImage,
        161 * this.scale,
        302 * this.scale,
        31 * this.scale,
        31 * this.scale
      );
    this.imagePattern = this.context.createPattern(this.canvas, 'repeat');
  }

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

    this.canvas
      .getContext('2d')
      .drawImage(this.image, 0, 0, this.scaledWidth, this.scaledHeight);
    this.imagePattern = this.context.createPattern(this.canvas, 'repeat');

    this.speed = this.halfScaledWidth / this.counters;

    this.calculateDots();
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

  drawImage() {
    this.context.save();
    this.context.translate(this.x, this.y);
    this.context.globalAlpha = this.imageAlpha;
    this.context.fill();
    this.context.globalAlpha = 1;
    this.context.restore();
  }

  updateCounters() {
    if (this.upCounter === 50) this.upReady = true;
    if (this.downCounter === 50) this.downReady = true;
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
      this.context.fillStyle = this.imagePattern;
      this.context.moveTo(this.dots.x0, this.dots.y0);
      this.context.lineTo(this.dots.x1, this.dots.y1);
      this.context.lineTo(this.dots.x2, this.dots.y2);
      this.context.lineTo(this.dots.x3, this.dots.y3);
      this.drawImage();
      this.context.closePath();
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
// 1 - шум
class HoverRhombus {
  constructor(opts) {
    this.parent = opts.parent;
    this.scale = this.parent.scale;
    this.context = this.parent.context;

    // Смещение оси координат для удобства
    this.x = opts.dx; // скалированная (*)
    this.y = opts.dy; // скалированная (*)
    this.request = false;

    this.width = opts.width;
    this.height = opts.height;
    this.scaledWidth = this.width * this.scale;
    this.halfScaledWidth = this.scaledWidth / 2;
    this.scaledHeight = this.height * this.scale;
    this.halfScaledHeight = this.scaledHeight / 2;

    this.imageAlpha = 0;
    this.imageCounter = 0;
    this.imageCounters = 100;
    this.upCounter = 0;
    this.downCounter = 0;
    this.counters = 50;
    this.speed = this.halfScaledWidth / this.counters;

    this.hovered = false;
    this.ready = false;
    this.upReady = false;
    this.downReady = false;
    this.dots = {
      x0: this.x,
      y0: this.y + this.halfheight,
      x1: this.x + this.halfwidth,
      y1: this.y,
      x2: this.x + this.width,
      y2: this.y + this.halfheight,
      x3: this.x + this.halfwidth,
      y3: this.y + this.height,
      moveX0: this.x + this.halfwidth,
      moveX1: this.x + this.halfwidth,
      moveY: this.y
    };

    this.image = opts.image;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas
      .getContext('2d')
      .drawImage(this.image, 0, 0, this.width, this.height);

    this.imagePattern = this.context.createPattern(this.canvas, 'repeat');
    this.imageAlpha = 0;
    this.imageCounters = 100;
    this.imageCounter = 0;

    this.cleared = false;
  }

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

    this.canvas
      .getContext('2d')
      .drawImage(this.image, 0, 0, this.scaledWidth, this.scaledHeight);
    this.imagePattern = this.context.createPattern(this.canvas, 'repeat');

    this.speed = this.halfScaledWidth / this.counters;

    this.calculateDots();
  }

  updateCounters() {
    if (this.upCounter === 50) this.upReady = true;
    if (this.downCounter === 50) this.downReady = true;
    if (this.upReady && this.downReady) {
      this.ready = true;
    }
    if (this.imageAlpha === 0.5) {
      this.imageReady = true;
    } else {
      this.imageReady = false;
    }

    if (!this.upReady) {
      this.upCounter += 1;
    }

    if (this.upReady && !this.downReady) {
      this.downCounter += 1;
    }

    if (this.ready && this.hovered && !this.imageReady) {
      this.imageAlpha += 0.05;
      if (this.imageAlpha > 0.5) this.imageAlpha = 0.5;
    } else if (this.ready && !this.hovered && this.imageAlpha !== 0) {
      this.imageAlpha -= 0.05;
      if (this.imageAlpha < 0) this.imageAlpha = 0;
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
      this.context.fillStyle = this.imagePattern;
      this.context.moveTo(this.dots.x0, this.dots.y0);
      this.context.lineTo(this.dots.x1, this.dots.y1);
      this.context.lineTo(this.dots.x2, this.dots.y2);
      this.context.lineTo(this.dots.x3, this.dots.y3);
      this.drawImage();
      this.context.closePath();
      this.context.stroke();
      this.rendered = true;
    }

    this.parent.cleared = false;
  }

  drawImage() {
    this.context.save();
    this.context.translate(this.x, this.y);
    this.context.globalAlpha = this.imageAlpha;
    this.context.fill();
    this.context.globalAlpha = 1;
    this.context.restore();
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

  render(onWindow, ready) {
    if (onWindow && ready) {
      this.updateCounters();
      this.calculateDots();
      this.animate();
    } else if (this.upCounter !== 0 && !this.ready && ready) {
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

// 1 - большая
// 2 - сверху
// 3 - снизу
// 4 - шум
class WorkBlock {
  constructor(opts) {
    window.workblock = this;
    this.parent = opts.parent;
    this.context = this.parent.context;
    this.scale = this.parent.scale;

    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    this.spacing = this.parent.spacing;
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.onWindow = false;

    this.dx = opts.dx;
    this.dy = opts.dy;
    this.images = opts.images;
    this.x = this.dx * this.scale - this.currentX + this.spacing;
    this.y = this.dy * this.scale - this.currentY;
    this.calculateDirt();

    this.main = new WorkRhombus({
      parent: this,
      context: this.context,
      scale: this.scale,
      width: 355,
      height: 355,
      x: this.x,
      y: this.y,
      images: [this.images[0], this.images[1], this.images[2]]
    });

    this.sdx =
      this.dx * this.scale + this.main.scaledWidth / 2 - 64 * this.scale;
    this.sdy = this.dy * this.scale + this.main.scaledHeight + 13 * this.scale;
    this.sx = this.sdx - this.currentX + this.spacing;
    this.sy = this.sdy - this.currentY;

    this.side = new HoverRhombus({
      parent: this,
      context: this.context,
      scale: this.scale,
      width: 128,
      height: 128,
      x: this.sx,
      y: this.sy,
      image: this.images[3]
    });
  }

  calculateDirt() {
    const x = this.x - 4 > 0 ? this.x - 4 : 0;
    const y = this.y - 4 > 0 ? this.y - 4 : 0;
    this.dirtDots = {
      x,
      y,
      w: 355 * this.scale + 8,
      h: 496 * this.scale + 8
    };
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

  checkWindow() {
    if (
      (this.y > -4 && this.y < this.windowHeight + 4) ||
      (this.sy + 13 * this.scale + this.side.height > -4 &&
        this.sy + 13 * this.scale + this.side.height < this.windowHeight + 4)
    ) {
      this.onWindow = true;
      // this.trigger();
    } else {
      this.onWindow = false;
    }
  }

  updateXY() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.x = this.dx * this.scale - this.currentX + this.spacing;
    this.y = this.dy * this.scale - this.currentY;
    this.sx = this.sdx - this.currentX + this.spacing;
    this.sy = this.sdy - this.currentY;

    this.main.updateXY(this.x, this.y);
    this.side.updateXY(this.sx, this.sy);

    this.checkWindow();
  }

  render() {
    console.log('render');
    this.clearDirt();
    this.main.render(this.onWindow);
    this.side.render(this.onWindow, this.main.ready);
    this.calculateDirt();
    if (!this.onWindow && this.cleared === false) this.clearDirt();

    this.request = this.main.checkRequest() || this.side.checkRequest();
  }
}

class ShowRhombus {
  constructor(opts) {
    window.firstrhombus = this;
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
    this.counters = 50;
    this.speed = this.halfScaledWidth / this.counters;

    this.ready = false;
    this.upReady = false;
    this.downReady = false;
    this.imageReady = false;

    this.image = opts.image;
    // Скалирование картинки и выдача паттерна
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.scaledWidth;
    this.canvas.height = this.scaledHeight;
    this.canvas
      .getContext('2d')
      .drawImage(this.image, 0, 0, this.scaledWidth, this.scaledHeight);
    this.imagePattern = this.context.createPattern(this.canvas, 'repeat');
    // Конец скалирования и выдачи паттерна
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

    this.canvas
      .getContext('2d')
      .drawImage(this.image, 0, 0, this.scaledWidth, this.scaledHeight);
    this.imagePattern = this.context.createPattern(this.canvas, 'repeat');

    this.speed = this.halfScaledWidth / this.counters;

    this.calculateDots();
  }

  drawImage() {
    this.context.save();
    this.context.translate(this.x, this.y);
    this.context.globalAlpha = this.imageAlpha;
    this.context.fill();
    this.context.globalAlpha = 1;
    this.context.restore();
  }

  updateCounters() {
    if (this.upCounter === 50) this.upReady = true;
    if (this.downCounter === 50) this.downReady = true;
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
      this.context.fillStyle = this.imagePattern;
      this.context.moveTo(this.dots.x0, this.dots.y0);
      this.context.lineTo(this.dots.x1, this.dots.y1);
      this.context.lineTo(this.dots.x2, this.dots.y2);
      this.context.lineTo(this.dots.x3, this.dots.y3);
      this.drawImage();
      this.context.closePath();
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

class ShowsBlock {
  constructor(opts) {
    this.parent = opts.parent;
    this.context = opts.context;
    this.scale = opts.scale;

    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    this.spacing = this.parent.spacing;
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.onWindow = false;

    this.gradientIndex = opts.gradientIndex;
    // window.trigger(this.gradientIndex);
  }
}

class PartnersBlock {
  constructor(opts) {
    this.parent = opts.parent;
    this.context = opts.context;
    this.scale = opts.scale;

    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    this.spacing = this.parent.spacing;
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.onWindow = false;

    this.gradientIndex = opts.gradientIndex;
    // window.trigger(this.gradientIndex);
  }
}

class ProductBlock {
  constructor(opts) {
    this.parent = opts.parent;
    this.context = opts.context;
    this.scale = opts.scale;

    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    this.spacing = this.parent.spacing;
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.onWindow = false;

    this.gradientIndex = opts.gradientIndex;
    // window.trigger(this.gradientIndex);
  }
}

class Block {
  constructor(opts) {
    this.parent = opts.parent;
    this.context = this.parent.context;
    this.scale = this.parent.scale;

    // Высота и ширина окна для определения, когда элемент на экране
    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    // Текущие значения мыши по х и скролла по у
    this.spacing = this.parent.spacing;
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.gradientIndex = opts.gradientIndex;

    if (this.gradientIndex !== undefined) {
      this.trigger = () => {
        window.trigger(this.gradientIndex);
      };
    } else {
      this.trigger = () => {
        return 0;
      };
    }

    this.onWindow = undefined;

    if (opts.type === 'solo') {
      this.calculateDirt = this.calculateDirtSolo;
      this.updateXY = this.updateXYSolo;
      this.render = this.renderSolo;
      this.checkWindow = this.checkWindowSolo;
      this.dx = opts.dx;
      this.dy = opts.dy;
      this.images = opts.images;
      // Смещение оси координат
      this.x = this.dx - this.currentX + this.spacing;
      this.y = this.dy - this.currentY;
      this.calculateDirt();
      this.main = new Rhombus({
        type: 'soloImage',
        parent: this,
        scale: this.scale,
        context: this.context,
        width: 355,
        x: this.x,
        y: this.y,
        images: this.images
      });

      //
    } else if (opts.type === 'double') {
      this.calculateDirt = this.calculateDirtDouble;
      this.updateXY = this.updateXYDouble;
      this.render = this.renderDouble;
      this.checkWindow = this.checkWindowDouble;
      this.dx = opts.dx;
      this.dy = opts.dy;
      this.images = opts.images;

      // Смещение оси координат
      const Xspacing = this.currentX - this.spacing;
      this.x = this.dx * this.scale - Xspacing;
      this.y = this.dy * this.scale - this.currentY;
      this.calculateDirt();
      this.main = new Rhombus({
        type: 'multiImage',
        parent: this,
        context: this.context,
        scale: this.scale,
        width: 355,
        x: this.x,
        y: this.y,
        images: this.images
      });

      this.sdx = this.dx * this.scale + this.main.width / 2 - 64 * this.scale;
      this.sdy = this.dy * this.scale + this.main.height + 13 * this.scale;
      this.sx = this.sdx - Xspacing;
      this.sy = this.sdy - this.currentY;

      this.side = new Rhombus({
        type: 'hover',
        parent: this,
        context: this.context,
        scale: this.scale,
        width: 128,
        x: this.sx,
        y: this.sy,
        images: this.images
      });
    } else if (opts.type === 'show line') {
      this.calculateDirt = this.calculateShowDirt;
      this.updateXY = this.updateXYShow;
      this.render = this.renderShow;
      this.checkWindow = this.checkWindowShow;

      this.images = opts.images;
      this.width = 220 * this.scale;
      this.height = 220 * this.scale;
      this.marginBetweenX = 36 * this.scale;

      this.dy = opts.dy;
      this.dx = opts.dx;
      this.x = this.dx * this.scale - this.currentX;
      this.y = this.dy * this.scale - this.currentY;
      this.dots = [];
      this.initShowDots();
      this.calculateShowDirt();
      this.rhombuses = [];
      for (let i = 0; i < this.images.length; i += 1) {
        this.rhombuses.push(
          new Rhombus({
            type: 'soloImage',
            parent: this,
            context: this.context,
            scale: this.scale,
            width: 220,
            x: this.dots[i].x,
            y: this.dots[i].y,
            images: this.images
          })
        );
      }
    }

    this.cleared = true;
  }

  initShowDots() {
    for (let i = 0; i < this.images.length; i += 1) {
      const x = this.x + (this.marginBetweenX + this.width) * i;
      const y = this.y;
      this.dots.push({ x, y });
    }
  }

  calculateShowDirt() {
    const x = this.x - 4 > 0 ? this.x - 4 : 0;
    const y = this.y - 4 > 0 ? this.y - 4 : 0;
    this.dirtDots = {
      x,
      y,
      w: this.dots[this.images.length - 1].x + 220 * this.scale + 8,
      h: 220 * this.scale + 8
    };
  }

  calculateShowDots() {
    for (let i = 0; i < this.images.length; i += 1) {
      this.dots[i].x = this.x + (this.width + this.marginBetweenX) * i;
      this.dots[i].y = this.y;
    }
  }

  checkWindowShow() {
    if (
      (this.y > -4 && this.y < this.windowHeight + 4) ||
      (this.y + this.height > -4 &&
        this.y + this.height < this.windowHeight + 4)
    ) {
      this.onWindow = true;
    } else {
      this.onWindow = false;
    }
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

  calculateDirtSolo() {
    const x = this.x - 4 > 0 ? this.x - 4 : 0;
    const y = this.y - 4 > 0 ? this.y - 4 : 0;
    this.dirtDots = {
      x,
      y,
      w: 355 * this.scale + 8,
      h: 355 * this.scale + 8
    };
  }

  calculateDirtDouble() {
    const x = this.x - 4 > 0 ? this.x - 4 : 0;
    const y = this.y - 4 > 0 ? this.y - 4 : 0;
    this.dirtDots = {
      x,
      y,
      w: 355 * this.scale + 8,
      h: (355 + 13 + 128) * this.scale + 8
    };
  }

  checkWindowSolo() {
    if (
      (this.y > -4 && this.y < this.windowHeight + 4) ||
      (this.y + this.main.height > -4 &&
        this.y + this.main.height < this.windowHeight + 4)
    ) {
      this.onWindow = true;
      this.trigger();
    } else {
      this.onWindow = false;
    }
  }

  updateXYSolo() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;
    this.x = this.dx * this.scale - this.currentX + this.spacing;
    this.y = this.dy * this.scale - this.currentY;

    this.main.updateXY(this.x, this.y);

    this.checkWindow();
  }

  checkWindowDouble() {
    if (
      (this.y > -4 && this.y < this.windowHeight + 4) ||
      (this.sy + 13 * this.scale + this.side.height > -4 &&
        this.sy + 13 * this.scale + this.side.height < this.windowHeight + 4)
    ) {
      this.onWindow = true;
      this.trigger();
    } else {
      this.onWindow = false;
    }
  }

  updateXYDouble() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    const Xspacing = this.currentX - this.spacing;
    this.x = this.dx * this.scale - Xspacing;
    this.y = this.dy * this.scale - this.currentY;
    this.sx = this.sdx - Xspacing;
    this.sy = this.sdy - this.currentY;

    this.main.updateXY(this.x, this.y);
    this.side.updateXY(this.sx, this.sy);

    this.checkWindow();
  }

  updateXYShow() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;
    this.y = this.dy * this.scale - this.currentY;
    this.x = this.spacing + this.dx * this.scale - this.currentX;
    this.calculateShowDots();

    for (let i = 0; i < this.rhombuses.length; i += 1) {
      this.rhombuses[i].updateXY(this.dots[i].x, this.dots[i].y);
    }

    this.checkWindow();
  }

  renderSolo() {
    this.clearDirt();
    this.main.render(this.onWindow, true);
    this.calculateDirt();
    if (!this.onWindow && this.cleared === false) this.clearDirt();
    this.request = this.main.checkRequest();
  }

  renderDouble() {
    this.clearDirt();
    this.main.render(this.onWindow, true);
    this.side.render(this.onWindow, this.main.ready);
    this.calculateDirt();
    if (!this.onWindow && this.cleared === false) this.clearDirt();

    this.request = this.main.checkRequest() || this.side.checkRequest();
  }

  renderShow() {
    this.clearDirt();
    for (let i = 0; i < this.rhombuses.length; i += 1) {
      this.rhombuses[i].render(this.onWindow, true);
    }
    this.calculateDirt();
    if (!this.onWindow && this.cleared === false) this.clearDirt();

    this.request = this.rhombuses[0].checkRequest();
  }
}

export { FirstBlock, WorkBlock, Block };
