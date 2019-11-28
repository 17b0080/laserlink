import Figure from './Figure';
import { PRODUCT } from '../settings';
// class ProductRhombus {
//   constructor(opts) {
//     this.parent = opts.parent;
//     this.scale = this.parent.scale;
//     this.context = this.parent.context;

//     // Смещение оси координат для удобства
//     this.x = opts.dx; // скалированная (*)
//     this.y = opts.dy; // скалированная (*)
//     this.request = false;

//     //

//     this.width = opts.width;
//     this.height = opts.height;
//     this.scaledWidth = this.width * this.scale;
//     this.halfScaledWidth = this.scaledWidth / 2;
//     this.scaledHeight = this.height * this.scale;
//     this.halfScaledHeight = this.scaledHeight / 2;

//     this.dots = {
//       x0: this.x,
//       y0: this.y + this.halfScaledWidth,
//       x1: this.x + this.halfScaledWidth,
//       y1: this.y,
//       x2: this.x + this.scaledWidth,
//       y2: this.y + this.halfScaledWidth,
//       x3: this.x + this.halfScaledWidth,
//       y3: this.y + this.scaledHeight,
//       moveX0: this.x + this.halfScaledWidth,
//       moveX1: this.x + this.halfScaledWidth,
//       moveY: this.y
//     };

//     // Анимации
//     this.imageAlpha = 0;
//     this.showMoreAlpha = 0;
//     this.imageCounter = 0;
//     this.imageCounters = 100;
//     this.upCounter = 0;
//     this.downCounter = 0;
//     this.counters = 25;
//     this.speed = this.halfScaledWidth / this.counters;

//     this.ready = false;
//     this.upReady = false;
//     this.downReady = false;
//     this.imageReady = false;
//     this.showMoreReady = false;

//     this.hovered = false;
//     [this.image, this.noise, this.showMore] = opts.images;
//   }

//   /**
//    * Обработчики событий
//    */

//   updateXY(x, y) {
//     this.rendered = false;
//     this.x = x;
//     this.y = y;
//   }

//   handleResize(x, y) {
//     this.scale = this.parent.scale;
//     this.scaledWidth = this.width * this.scale;
//     this.halfScaledWidth = this.scaledWidth / 2;
//     this.scaledHeight = this.height * this.scale;
//     this.halfScaledHeight = this.scaledHeight / 2;
//     this.x = x;
//     this.y = y;

//     this.speed = this.halfScaledWidth / this.counters;

//     this.calculateDots();
//   }

//   drawImage() {
//     this.context.save();

//     this.context.beginPath();
//     this.context.moveTo(this.dots.x0, this.dots.y0);
//     this.context.lineTo(this.dots.x1, this.dots.y1);
//     this.context.lineTo(this.dots.x2, this.dots.y2);
//     this.context.lineTo(this.dots.x3, this.dots.y3);
//     this.context.closePath();
//     this.context.clip();

//     this.context.globalAlpha = this.imageAlpha;
//     this.context.drawImage(
//       this.noise,
//       this.x,
//       this.y,
//       this.scaledWidth,
//       this.scaledHeight
//     );
//     this.context.drawImage(
//       this.image,
//       this.x,
//       this.y,
//       this.scaledWidth,
//       this.scaledHeight
//     );
//     if (this.imageReady && this.showMoreAlpha > 0) {
//       this.context.globalAlpha = this.showMoreAlpha;
//       this.context.drawImage(
//         this.showMore,
//         this.x,
//         this.y,
//         this.scaledWidth,
//         this.scaledHeight
//       );
//     }
//     this.context.restore();
//   }

//   updateCounters() {
//     if (this.upCounter === 25) this.upReady = true;
//     if (this.downCounter === 25) this.downReady = true;
//     if (this.upReady && this.downReady) {
//       this.ready = true;
//     }

//     if (this.imageAlpha === 1) this.imageReady = true;

//     if (this.showMoreAlpha === 1) {
//       this.showMoreReady = true;
//     } else {
//       this.showMoreReady = false;
//     }

//     if (!this.upReady) {
//       this.upCounter += 1;
//     }

//     if (this.upReady && !this.downReady) {
//       this.downCounter += 1;
//     }

//     if (this.ready && !this.imageReady) {
//       this.imageAlpha += 0.05;
//       if (this.imageAlpha > 1) {
//         this.imageAlpha = 1;
//       }
//     }

//     if (this.hovered && this.imageReady && !this.showMoreReady) {
//       this.showMoreAlpha += 0.05;
//       this.imageAlpha -= 0.05;
//       if (this.showMoreAlpha > 1) this.showMoreAlpha = 1;
//       if (this.imageAlpha < 0) this.imageAlpha = 0;
//     } else if (!this.hovered && this.imageReady && this.showMoreAlpha !== 0) {
//       this.showMoreAlpha -= 0.05;
//       this.imageAlpha += 0.05;
//       if (this.imageAlpha > 1) this.imageAlpha = 1;
//       if (this.showMoreAlpha < 0) this.showMoreAlpha = 0;
//     }
//   }

//   calculateDots() {
//     // Движущие точки расширяются
//     if (!this.upReady) {
//       this.dots = {
//         x0: this.x,
//         y0: this.y + this.halfScaledHeight,
//         x1: this.x + this.halfScaledWidth,
//         y1: this.y,
//         x2: this.x + this.scaledWidth,
//         y2: this.y + this.halfScaledHeight,
//         x3: this.x + this.halfScaledWidth,
//         y3: this.y + this.scaledHeight,
//         moveX0: this.x + this.halfScaledWidth - this.speed * this.upCounter,
//         moveX1: this.x + this.halfScaledWidth + this.speed * this.upCounter,
//         moveY: this.y + this.speed * this.upCounter
//       };
//     }

//     // Движущие точки сужаются
//     if (this.upReady && !this.downReady) {
//       this.dots = {
//         x0: this.x,
//         y0: this.y + this.halfScaledHeight,
//         x1: this.x + this.halfScaledWidth,
//         y1: this.y,
//         x2: this.x + this.scaledWidth,
//         y2: this.y + this.halfScaledHeight,
//         x3: this.x + this.halfScaledWidth,
//         y3: this.y + this.scledHeight,
//         moveX0: this.x + this.speed * this.downCounter,
//         moveX1: this.x + this.scaledWidth - this.speed * this.downCounter,
//         moveY: this.y + this.halfScaledHeight + this.speed * this.downCounter
//       };
//     }

//     // Движущих точек нет, быстрая вставка
//     if (this.ready) {
//       this.dots = {
//         x0: this.x,
//         y0: this.y + this.halfScaledHeight,
//         x1: this.x + this.halfScaledWidth,
//         y1: this.y,
//         x2: this.x + this.scaledWidth,
//         y2: this.y + this.halfScaledHeight,
//         x3: this.x + this.halfScaledWidth,
//         y3: this.y + this.scaledHeight
//       };
//     }
//   }

//   animate() {
//     // Поэтапный верх линий ромба
//     if (!this.upReady) {
//       this.context.beginPath();
//       this.context.strokeStyle = 'white';
//       this.context.lineWidth = 2;
//       this.context.moveTo(this.dots.moveX0, this.dots.moveY);
//       this.context.lineTo(this.dots.x1, this.dots.y1);
//       this.context.lineTo(this.dots.moveX1, this.dots.moveY);
//       this.context.stroke();
//     }
//     // Верх + поэтапный низ линий ромба
//     else if (this.upReady && !this.downReady) {
//       this.context.beginPath();
//       this.context.strokeStyle = 'white';
//       this.context.lineWidth = 2;
//       this.context.moveTo(this.dots.moveX0, this.dots.moveY);
//       this.context.lineTo(this.dots.x0, this.dots.y0);
//       this.context.lineTo(this.dots.x1, this.dots.y1);
//       this.context.lineTo(this.dots.x2, this.dots.y2);
//       this.context.lineTo(this.dots.moveX1, this.dots.moveY);
//       this.context.stroke();
//     }
//     // Быстрая вставка линий ромба
//     else if (this.ready) {
//       this.context.beginPath();
//       this.context.strokeStyle = 'white';
//       this.context.strokeWidth = 2;
//       this.context.moveTo(this.dots.x0, this.dots.y0);
//       this.context.lineTo(this.dots.x1, this.dots.y1);
//       this.context.lineTo(this.dots.x2, this.dots.y2);
//       this.context.lineTo(this.dots.x3, this.dots.y3);
//       this.drawImage();
//       this.context.closePath();
//       this.context.stroke();
//       this.rendered = true;
//     }

//     this.parent.cleared = false;
//   }

//   render(onWindow) {
//     if (onWindow) {
//       this.updateCounters();
//       this.calculateDots();
//       this.animate();
//     } else if (this.upCounter !== 0 && !this.ready) {
//       this.updateCounters();
//     }
//   }

//   checkRequest() {
//     let request = false;
//     if (
//       (this.upCounter !== 0 && !this.ready) ||
//       (this.ready && !this.imageReady) ||
//       (this.showMoreAlpha > 0 && this.showMoreAlpha < 1)
//     ) {
//       request = true;
//     }
//     return request;
//   }
// }


class ProductRhombus extends Figure {
  constructor({ image, showMore, ...rest }) {
    super(rest);
    if (window.prs === undefined) window.prs = [];
    window.prs.push(this);
    this.width = PRODUCT.width;
    this.height = PRODUCT.height;
    this.hovered = false;
    // console.log(images);
    this.image = image;
    this.showMore = showMore;

    this.hoverCounter = 0;
    this.hoverRendered = false;
    this.hoverUnrendered = true;
    this.request = false;
    this.rendered = false;
    this.ready = false;
    this.opacity = 0;
    this.counter = 0;
    this.counters = 100;

    this.subCanvas = document.createElement('canvas');
    this.subCanvas.width = 500;
    this.subCanvas.height = 500;
    this.subContext = this.subCanvas.getContext('2d');


    this.gradientCanvas = document.createElement('canvas');
    this.gradientCanvas.width = 500;
    this.gradientCanvas.height = 2000;
    this.gradientContext = this.gradientCanvas.getContext('2d');
    this.gradient = this.gradientContext.createLinearGradient(
      this.gradientCanvas.width / 2, 0,
      this.gradientCanvas.width / 2, this.gradientCanvas.height
    );
    this.gradient.addColorStop(0, "red");
    this.gradient.addColorStop(1 / 11, "orange");
    this.gradient.addColorStop(2 / 11, "yellow");
    this.gradient.addColorStop(3 / 11, "green");
    this.gradient.addColorStop(4 / 11, "blue");
    this.gradient.addColorStop(5 / 11, "purple");
    this.gradient.addColorStop(6 / 11, "red");
    this.gradient.addColorStop(7 / 11, "orange");
    this.gradient.addColorStop(8 / 11, "yellow");
    this.gradient.addColorStop(9 / 11, "green");
    this.gradient.addColorStop(10 / 11, "blue");
    this.gradient.addColorStop(1, "purple");


    this.subContext.strokeStyle = this.gradient;
    this.subContext.lineWidth = 12;
  }

  calculateDots() {
    // Движущие точки расширяются
    if (this.counter > 75) return 0;

    if (this.counter < 25) return this.dots = [
      this.subCanvas.width / 2, 0,
      this.subCanvas.width / 2 * (1 + this.counter / 25), this.subCanvas.height / 2 * this.counter / 25,
      0, 0,
      this.subCanvas.width / 2 * (1 - this.counter / 25), this.subCanvas.height / 2 * this.counter / 25,
      0, 0,
    ];
    if (this.counter >= 25 && this.counter <= 50) return this.dots = [
      this.subCanvas.width / 2, 0,
      this.subCanvas.width, this.subCanvas.height / 2,
      this.subCanvas.width * (1 - (this.counter - 25) / 25 / 2), this.subCanvas.height / 2 * (1 + (this.counter - 25) / 25),
      0, this.subCanvas.height / 2,
      this.subCanvas.width / 2 * (this.counter - 25) / 25, this.subCanvas.height / 2 * (1 + (this.counter - 25) / 25),
    ];

    // Движущих точек нет, быстрая вставка
    if (this.counter >= 50) return this.dots = [
      this.subCanvas.width / 2, 0,
      this.subCanvas.width, this.subCanvas.height / 2,
      this.subCanvas.width / 2, this.subCanvas.height,
      0, this.subCanvas.height / 2,
    ];
  }

  updateCounters() {
    if (this.counter === 75) { this.ready = true; }
    else if (this.counter === 150) { this.counter = 76; }
    this.counter += 1;

    if (this.counter > 75) {
      if (!this.hovered && this.hoverCounter === 0) { return 0; }
      else if (this.hovered && this.hoverCounter === 25) { return 25; }
      else if (this.hovered) { this.hoverCounter += 1; this.hoverProcessing = true; }
      else if (!this.hovered) { this.hoverCounter -= 1; this.hoverProcessing = true; };
    }
  }

  calculateDots() {
    // Движущие точки расширяются

    if (this.counter < 25) this.dots = [
      this.subCanvas.width / 2, 0,
      this.subCanvas.width / 2 * (1 + this.counter / 25), this.subCanvas.height / 2 * this.counter / 25,
      0, 0,
      this.subCanvas.width / 2 * (1 - this.counter / 25), this.subCanvas.height / 2 * this.counter / 25,
      0, 0,
    ];
    if (this.counter >= 25 && this.counter <= 50) this.dots = [
      this.subCanvas.width / 2, 0,
      this.subCanvas.width, this.subCanvas.height / 2,
      this.subCanvas.width * (1 - (this.counter - 25) / 25 / 2), this.subCanvas.height / 2 * (1 + (this.counter - 25) / 25),
      0, this.subCanvas.height / 2,
      this.subCanvas.width / 2 * (this.counter - 25) / 25, this.subCanvas.height / 2 * (1 + (this.counter - 25) / 25),
    ];

    // Движущих точек нет, быстрая вставка
    if (this.counter >= 50) this.dots = [
      this.subCanvas.width / 2, 0,
      this.subCanvas.width, this.subCanvas.height / 2,
      this.subCanvas.width / 2, this.subCanvas.height,
      0, this.subCanvas.height / 2,
    ];
  }

  animate() {
    this.context.save();
    this.context.beginPath();
    this.context.moveTo(this.x + this.width / 2, this.y);
    this.context.lineTo(this.x + this.width, this.y + this.height / 2);
    this.context.lineTo(this.x + this.width / 2, this.y + this.height);
    this.context.lineTo(this.x, this.y + this.height / 2);
    this.context.closePath();
    this.context.clip();

    // Поэтапный верх линий ромба
    if (this.counter <= 25) {
      this.subContext.moveTo(this.dots[0], this.dots[1]);
      this.subContext.lineTo(this.dots[2], this.dots[3]);
      this.subContext.moveTo(this.dots[0], this.dots[1]);
      this.subContext.lineTo(this.dots[6], this.dots[7]);
      this.subContext.stroke();
    }
    // Верх + поэтапный низ линий ромба
    else if (this.counter > 25 && this.counter <= 50) {
      this.subContext.moveTo(this.dots[0], this.dots[1]);
      this.subContext.lineTo(this.dots[2], this.dots[3]);
      this.subContext.lineTo(this.dots[4], this.dots[5]);
      this.subContext.moveTo(this.dots[0], this.dots[1]);
      this.subContext.lineTo(this.dots[6], this.dots[7]);
      this.subContext.lineTo(this.dots[8], this.dots[9]);
      this.subContext.stroke();
    }
    // Быстрая вставка линий ромба + изображение
    else if (this.counter > 50 && this.counter <= 75) {
      this.subContext.beginPath();
      this.subContext.moveTo(this.dots[0], this.dots[1]);
      this.subContext.lineTo(this.dots[2], this.dots[3]);
      this.subContext.lineTo(this.dots[4], this.dots[5]);
      this.subContext.lineTo(this.dots[6], this.dots[7]);
      this.subContext.closePath();
      this.subContext.save();
      this.subContext.globalAlpha = 1 * (this.counter - 50) / 25;
      this.subContext.drawImage(
        this.image,
        0,
        0,
        this.subCanvas.width,
        this.subCanvas.height
      );
      this.subContext.restore();
      this.subContext.stroke();
      if (this.counter === 75) this.rendered = true;
    }

    else if (this.counter > 75) {
      if (!this.rendered) {
        this.subContext.save();
        this.subContext.globalAlpha = 1;
        this.subContext.drawImage(
          this.image,
          0,
          0,
          this.subCanvas.width,
          this.subCanvas.height
        );
        this.subContext.restore();
        this.rendered = true;
      } else if (this.hoverProcessing) {
        if (this.hoverCounter === 25) { this.hoverProcessing = false; }
        else if (this.hoverCounter === 0) { this.hoverProcessing = false; }
        this.subContext.save();
        this.subContext.clearRect(0, 0, this.subCanvas.width, this.subCanvas.height);
        this.subContext.globalAlpha = (25 - this.hoverCounter) / 25;
        this.subContext.drawImage(
          this.image,
          0,
          0,
          this.subCanvas.width,
          this.subCanvas.height
        );
        this.subContext.restore();

        this.subContext.save();
        this.subContext.globalAlpha = this.hoverCounter / 25;
        this.subContext.drawImage(
          this.showMore,
          0,
          0,
          this.subCanvas.width,
          this.subCanvas.height
        );
        this.subContext.restore();
      }
      this.subContext.beginPath();
      this.subContext.moveTo(this.dots[0], this.dots[1]);
      this.subContext.lineTo(this.dots[2], this.dots[3]);
      this.subContext.lineTo(this.dots[4], this.dots[5]);
      this.subContext.lineTo(this.dots[6], this.dots[7]);
      this.subContext.closePath();
      this.subContext.save();
      this.subContext.translate(0, -1000 * (this.counter - 75) / 75);
      this.subContext.stroke();
      this.subContext.restore();
    }

    this.context.drawImage(this.subCanvas, this.x, this.y, this.width, this.height)
    this.context.restore();
    this.parent.cleared = false;
  }

  render(onWindow) {
    if (onWindow) {
      this.updateCounters();
      this.calculateDots();
      this.animate();
    } else if (this.counter !== 0 && !this.ready) {
      this.updateCounters();
    }
  }

  checkRequest() {
    return (
      this.hovered && this.hoverCounter !== 25 ||
      !this.hovered && this.hoverCounter !== 0 ||
      this.counter !== 0 && !this.ready ||
      this.counter > 75
    ) ? true : false
  }
}

class ProductBlock {
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
    [this.images, this.noise, this.showMore] = opts.images;

    this.width = PRODUCT.width;
    this.height = PRODUCT.height;
    this.marginBetweenX = PRODUCT.gapX;

    this.scaledWidth = this.width * this.scale;
    this.scaledHeight = this.height * this.scale;
    this.scaledMarginBetweenX = this.marginBetweenX * this.scale;

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
        new ProductRhombus({
          parent: this,
          context: this.context,
          scale: this.scale,
          width: this.width,
          height: this.height,
          dx: this.dots[i].x,
          dy: this.dots[i].y,
          image: this.images[i],
          showMore: this.showMore
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
    this.dirtDots = {
      x: this.x - 4 > 0 ? this.x - 4 : 0,
      y: this.y - 4 > 0 ? this.y - 4 : 0,
      w: this.x - 4 > 0 ? this.dots[this.images.length - 1].x + PRODUCT.width * this.scale + 8 : this.dots[this.images.length - 1].x + PRODUCT.width * this.scale + 8 + this.x,
      h: this.y - 4 > 0 ? PRODUCT.height * this.scale + 4 : PRODUCT.height * this.scale + 4 + this.y
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

class ProductLines {
  constructor(opts) {
    this.parent = opts.parent;
    this.context = this.parent.context;
    this.spacing = this.parent.spacing;
    this.scale = this.parent.scale;
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.gradientIndex = opts.gradientIndex;

    this.dy = opts.dy;

    this.rhombusWidth = PRODUCT.width;
    this.rhombusHeight = PRODUCT.height;

    this.spaceBetweenRhombuses = PRODUCT.gapX;
    this.textHeight = PRODUCT.gapY;

    [this.images, this.noise, this.showMore] = opts.images;
    this.linesWithImages = this.getLines();

    if (this.linesWithImages.length > 0) {
      this.height =
        this.linesWithImages.length * this.rhombusHeight +
        (this.linesWithImages.length - 1) * this.textHeight;
    } else {
      this.height = 0;
    }

    this.productBlocks = this.getProductBlocks();
  }

  updateXY() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    for (let i = 0; i < this.productBlocks.length; i += 1) {
      this.productBlocks[i].updateXY();
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

    for (let i = 0; i < this.productBlocks.length; i += 1) {
      this.productBlocks[i].handleResize();
    }
  }

  checkRequest() {
    let request = false;
    for (let i = 0; i < this.productBlocks.length; i += 1) {
      request = request || this.productBlocks[i].request;
    }

    return request;
  }

  getLines() {
    const lines = [[]];
    for (let i = 0, k = 0, j = 0; i < this.images.length; i += 1) {
      if (k === 3) {
        lines.push([]);
        j += 1;
        k = 0;
      }
      lines[j].push(this.images[i]);
      k += 1;
    }

    return lines;
  }

  getProductBlocks() {
    const productBlocks = [];
    for (let i = 0; i < this.linesWithImages.length; i += 1) {
      const dx =
        1024 -
        this.linesWithImages[i].length * this.rhombusWidth -
        (this.linesWithImages[i].length - 1) * this.spaceBetweenRhombuses;
      productBlocks.push(
        new ProductBlock({
          gradientIndex: this.gradientIndex,
          parent: this.parent,
          context: this.context,
          rhombusHeight: this.rhombusHeight,
          rhombusWidth: this.rhombusWidth,
          textHeight: this.textHeight,
          dy: this.dy + (this.rhombusHeight + this.textHeight) * i,
          dx: dx / 2,
          images: [this.linesWithImages[i], this.noise, this.showMore]
        })
      );
    }
    return productBlocks;
  }

  render() {
    for (let i = 0; i < this.productBlocks.length; i += 1) {
      this.productBlocks[i].render();
    }
    this.request = this.checkRequest();
  }
}

export default ProductLines;
