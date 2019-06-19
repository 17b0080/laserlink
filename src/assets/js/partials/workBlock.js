/* globals document, window */

// 1 - большая
// 2 - снизу
// 3 - сверху

class WorkRhombus {
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
    this.counters = 25;
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

    [this.upperImage, this.image, this.downImage] = opts.images;
  }

  updateXY(x, y) {
    this.rendered = false;
    this.x = x;
    this.y = y;
  }

  handleResize(x, y) {
    this.scale = this.parent.scale;
    this.scaledWidth = this.width * this.scale;
    this.halfScaledWidth = this.scaledWidth / 2;
    this.scaledHeight = this.height * this.scale;
    this.halfScaledHeight = this.scaledHeight / 2;
    this.spacing = this.parent.spacing;

    this.x = x;
    this.y = y;

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

    this.context.beginPath();
    this.context.moveTo(this.dots.x0, this.dots.y0);
    this.context.lineTo(this.dots.x1, this.dots.y1);
    this.context.lineTo(this.dots.x2, this.dots.y2);
    this.context.lineTo(this.dots.x3, this.dots.y3);
    this.context.closePath();
    this.context.clip();

    this.context.globalAlpha = this.imageAlpha;
    this.context.drawImage(
      this.image,
      this.x,
      this.y,
      this.scaledWidth,
      this.scaledHeight
    );

    // затемнение
    this.context.globalAlpha = 0.35;
    this.context.fillStyle = '#0D0A14';
    this.context.fillRect(this.x, this.y, this.scaledWidth, this.scaledHeight);

    this.context.globalAlpha = this.imageAlpha;
    this.context.drawImage(
      this.downImage,
      this.x + 161 * this.scale,
      this.y + 302 * this.scale,
      31 * this.scale,
      31 * this.scale
    );
    this.context.drawImage(
      this.upperImage,
      this.x + 165 * this.scale,
      this.y + 28 * this.scale,
      24 * this.scale,
      24 * this.scale
    );

    this.context.restore();
  }

  updateCounters() {
    if (this.upCounter === 25) this.upReady = true;
    if (this.downCounter === 25) this.downReady = true;
    if (this.upReady && this.downReady) {
      this.ready = true;
    }

    if (this.imageAlpha >= 1) {
      this.imageAlpha = 1;
      this.imageReady = true;
    }

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
    this.counters = 25;
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

  handleResize(x, y) {
    this.scale = this.parent.scale;
    this.scaledWidth = this.width * this.scale;
    this.halfScaledWidth = this.scaledWidth / 2;
    this.scaledHeight = this.height * this.scale;
    this.halfScaledHeight = this.scaledHeight / 2;
    this.spacing = this.parent.spacing;

    this.x = x;
    this.y = y;

    this.speed = this.halfScaledWidth / this.counters;

    this.calculateDots();
  }

  updateCounters() {
    if (this.upCounter === 25) this.upReady = true;
    if (this.downCounter === 25) this.downReady = true;
    if (this.upReady && this.downReady) {
      this.ready = true;
    }
    if (this.imageAlpha === 1) {
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
      this.imageAlpha += 0.1;
      if (this.imageAlpha > 1) this.imageAlpha = 1;
    } else if (this.ready && !this.hovered && this.imageAlpha !== 0) {
      this.imageAlpha -= 0.1;
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

    this.context.beginPath();
    this.context.moveTo(this.dots.x0, this.dots.y0);
    this.context.lineTo(this.dots.x1, this.dots.y1);
    this.context.lineTo(this.dots.x2, this.dots.y2);
    this.context.lineTo(this.dots.x3, this.dots.y3);
    this.context.closePath();
    this.context.clip();

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
    this.gradientIndex = opts.gradientIndex;
    if (this.gradientIndex !== undefined) {
      this.trigger = index => {
        window.trigger(index);
      };
    } else {
      this.trigger = () => {
        return 0;
      };
    }

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
        this.sy + 13 * this.scale + this.side.height < this.windowHeight + 4) ||
      (this.y + (13 * this.scale + this.side.height + this.main.height) / 2 >
        0 &&
        this.y + (13 * this.scale + this.side.height + this.main.height) / 2 <
          this.windowHeight)
    ) {
      this.onWindow = true;
      // this.trigger(this.gradientIndex);
    } else {
      this.onWindow = false;
    }
  }

  handleResize() {
    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;
    this.spacing = this.parent.spacing;

    this.scale = this.parent.scale;

    this.x = this.dx * this.scale - this.currentX + this.spacing;
    this.y = this.dy * this.scale - this.currentY;

    this.sx = this.sdx * this.scale - this.currentX + this.spacing;
    this.sy = this.sdy * this.scale - this.currentY;

    this.main.handleResize(this.x, this.y);
    this.side.handleResize(this.sx, this.sy);
  }

  updateXY() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.x = this.dx * this.scale - this.currentX + this.spacing;
    this.y = this.dy * this.scale - this.currentY;

    this.main.updateXY(this.x, this.y);

    this.sdx =
      this.dx * this.scale + this.main.scaledWidth / 2 - 64 * this.scale;
    this.sdy = this.dy * this.scale + this.main.scaledHeight + 13 * this.scale;
    this.sx = this.sdx - this.currentX + this.spacing;
    this.sy = this.sdy - this.currentY;

    this.side.updateXY(this.sx, this.sy);

    this.checkWindow();
  }

  render() {
    this.clearDirt();
    this.main.render(this.onWindow);
    this.side.render(this.onWindow, this.main.ready);
    this.calculateDirt();
    if (!this.onWindow && this.cleared === false) this.clearDirt();

    this.request = this.main.checkRequest() || this.side.checkRequest();
  }
}

export default WorkBlock;
