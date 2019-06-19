class ShowRhombus {
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
    this.showMoreAlpha = 0;
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
    this.showMoreReady = false;

    this.hovered = false;
    [this.image, this.showMore] = opts.images;
  }

  /**
   * Обработчики событий
   */

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

    if (this.imageReady && this.showMoreAlpha > 0) {
      this.context.globalAlpha = this.showMoreAlpha;
      this.context.drawImage(
        this.showMore,
        this.x,
        this.y,
        this.scaledWidth,
        this.scaledHeight
      );
    }
    this.context.restore();
  }

  updateCounters() {
    if (this.upCounter === 25) this.upReady = true;
    if (this.downCounter === 25) this.downReady = true;
    if (this.upReady && this.downReady) {
      this.ready = true;
    }

    if (this.imageAlpha === 1) this.imageReady = true;

    if (this.showMoreAlpha === 1) {
      this.showMoreReady = true;
    } else {
      this.showMoreReady = false;
    }

    if (!this.upReady) {
      this.upCounter += 1;
    }

    if (this.upReady && !this.downReady) {
      this.downCounter += 1;
    }

    if (this.ready && !this.imageReady) {
      this.imageAlpha += 0.05;
      if (this.imageAlpha > 1) {
        this.imageAlpha = 1;
      }
    }

    if (this.hovered && this.imageReady && !this.showMoreReady) {
      this.showMoreAlpha += 0.05;
      this.imageAlpha -= 0.05;
      if (this.showMoreAlpha > 1) this.showMoreAlpha = 1;
      if (this.imageAlpha < 0) this.imageAlpha = 0;
    } else if (!this.hovered && this.imageReady && this.showMoreAlpha !== 0) {
      this.showMoreAlpha -= 0.05;
      this.imageAlpha += 0.05;
      if (this.showMoreAlpha < 0) this.showMoreAlpha = 0;
      if (this.imageAlpha > 1) this.imageAlpha = 1;
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
      (this.ready && !this.imageReady) ||
      (this.showMoreAlpha > 0 && this.showMoreAlpha < 1)
    ) {
      request = true;
    }
    return request;
  }
}

class ShowBlock {
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
    // window.trigger(this.gradientIndex);

    [this.images, this.showMoreHover] = opts.images;

    this.width = 220;
    this.height = 220;
    this.marginBetweenX = 36;

    this.scaledWidth = this.width * this.scale;
    this.scaledHeight = this.height * this.scale;
    this.scaledMarginBetweenX = 36 * this.scale;

    this.dy = opts.dy;
    this.dx = opts.dx;
    this.x = this.dx * this.scale - this.currentX;
    this.y = this.dy * this.scale - this.currentY;
    this.dots = []; // содержит все х и у ромбов
    this.initDots();
    this.calculateDirt();
    this.rhombuses = [];
    for (let i = 0; i < this.images.length; i += 1) {
      this.rhombuses.push(
        new ShowRhombus({
          parent: this,
          context: this.context,
          scale: this.scale,
          width: this.width,
          height: this.height,
          dx: this.dots[i].x,
          dy: this.dots[i].y,
          images: [this.images[i], this.showMoreHover]
        })
      );
    }
    this.cleared = true;
  }

  updateXY() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;
    this.y = this.dy * this.scale - this.currentY;
    this.x = this.spacing + this.dx * this.scale - this.currentX;

    this.calculateDots();

    for (let i = 0; i < this.rhombuses.length; i += 1) {
      this.rhombuses[i].updateXY(this.dots[i].x, this.dots[i].y);
    }

    this.checkWindow();
  }

  handleResize() {
    this.scale = this.parent.scale;
    this.spacing = this.parent.spacing;
    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    this.y = this.dy * this.scale - this.currentY;
    this.x = this.spacing + this.dx * this.scale - this.currentX;
    this.calculateDots();

    for (let i = 0; i < this.rhombuses.length; i += 1) {
      this.rhombuses[i].handleResize(this.dots[i].x, this.dots[i].y);
    }
  }

  initDots() {
    for (let i = 0; i < this.images.length; i += 1) {
      const x = this.x + (this.marginBetweenX + this.width) * i * this.scale;
      const { y } = this;
      this.dots.push({ x, y });
    }
  }

  calculateDirt() {
    const x = this.x - 4 > 0 ? this.x - 4 : 0;
    const y = this.y - 4 > 0 ? this.y - 4 : 0;
    this.dirtDots = {
      x,
      y,
      w: this.dots[this.images.length - 1].x + 220 * this.scale + 8,
      h: 220 * this.scale + 8
    };
  }

  calculateDots() {
    for (let i = 0; i < this.images.length; i += 1) {
      this.dots[i].x =
        this.x + (this.width + this.marginBetweenX) * i * this.scale;
      this.dots[i].y = this.y;
    }
  }

  render() {
    this.clearDirt();
    for (let i = 0; i < this.rhombuses.length; i += 1) {
      this.rhombuses[i].render(this.onWindow, true);
    }

    this.calculateDirt();
    if (!this.onWindow && this.cleared === false) this.clearDirt();

    this.request = this.checkRequest();
  }

  checkRequest() {
    let request = false;
    for (let i = 0; i < this.rhombuses.length; i += 1) {
      request = request || this.rhombuses[i].checkRequest();
    }
    return request;
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
      (this.y + this.scaledHeight > -4 &&
        this.y + this.scaledHeight < this.windowHeight + 4)
    ) {
      this.onWindow = true;
      // window.trigger(this.gradientIndex);
    } else {
      this.onWindow = false;
    }
  }
}

class ShowLines {
  constructor(opts) {
    this.parent = opts.parent;
    this.context = this.parent.context;
    this.spacing = this.parent.spacing;
    this.scale = this.parent.scale;
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;
    this.gradientIndex = opts.gradientIndex;

    this.dy = opts.dy;

    this.rhombusWidth = opts.rhombusWidth;
    this.rhombusHeight = opts.rhombusHeight;

    this.spaceBetweenRhombuses = opts.spaceBetweenRhombuses;
    this.textHeight = opts.textHeight;

    [this.images, this.showMoreHover] = opts.images;
    this.linesWithImages = this.getLines();

    if (this.linesWithImages.length > 0) {
      this.height =
        this.linesWithImages.length * this.rhombusHeight +
        (this.linesWithImages.length - 1) * this.textHeight;
    } else {
      this.height = 0;
    }

    this.showBlocks = this.getShowBlocks();
  }

  updateXY() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    for (let i = 0; i < this.showBlocks.length; i += 1) {
      this.showBlocks[i].updateXY();
    }
  }

  handleResize() {
    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    this.spacing = this.parent.spacing;
    this.scale = this.parent.scale;

    if (this.linesWithImages.length > 0) {
      this.height =
        this.linesWithImages.length * this.rhombusHeight * this.scale +
        (this.linesWithImages.length - 1) * this.textHeight * this.scale;
    }

    for (let i = 0; i < this.showBlocks.length; i += 1) {
      this.showBlocks[i].handleResize();
    }
  }

  checkRequest() {
    let request = false;
    for (let i = 0; i < this.showBlocks.length; i += 1) {
      request = request || this.showBlocks[i].request;
    }

    return request;
  }

  getLines() {
    const lines = [[]];
    for (let i = 0, k = 0, j = 0; i < this.images.length; i += 1) {
      if (k === 4) {
        lines.push([]);
        j += 1;
        k = 0;
      }
      lines[j].push(this.images[i]);
      k += 1;
    }

    return lines;
  }

  getShowBlocks() {
    const showBlocks = [];
    for (let i = 0; i < this.linesWithImages.length; i += 1) {
      const dx =
        1024 -
        this.linesWithImages[i].length * this.rhombusWidth -
        (this.linesWithImages[i].length - 1) * this.spaceBetweenRhombuses;
      showBlocks.push(
        new ShowBlock({
          parent: this.parent,
          context: this.context,
          gradientIndex: this.gradientIndex,
          rhombusHeight: this.rhombusHeight,
          rhombusWidth: this.rhombusWidth,
          textHeight: this.textHeight,
          dy: this.dy + (this.rhombusHeight + this.textHeight) * i,
          dx: dx / 2,
          images: [this.linesWithImages[i], this.showMoreHover]
        })
      );
    }
    return showBlocks;
  }

  render() {
    for (let i = 0; i < this.showBlocks.length; i += 1) {
      this.showBlocks[i].render();
    }
    this.request = this.checkRequest();
  }
}

export default ShowLines;
