/* eslint-disable no-undef */
/* eslint-disable prefer-destructuring */

import { LOGO_RECT, LOGO_IMAGE } from '../settings';
import Figure from './Figure';

class Rect extends Figure {
  constructor(opts) {
    super(opts);

    this.request = false;
    this.dots = {
      // x: this.x + LOGO_RECT.x * scale,
      // y: this.y + LOGO_RECT.y * scale,
      x: this.x + LOGO_RECT.x,
      y: this.y + LOGO_RECT.y,
      w: 0,
      h: LOGO_RECT.h * this.scale,
    };
    this.counter = 0;
    this.counters = 25;
    this.ready = false;
  }

  calculateDots() {
    this.dots = {
      x: this.x + LOGO_RECT.x * this.scale,
      y: this.y + LOGO_RECT.y * this.scale,
      // x: this.x + LOGO_RECT.x,
      // y: this.y + LOGO_RECT.y,
      w: LOGO_RECT.w * this.scale / this.counters * this.counter,
      h: LOGO_RECT.h * this.scale,
    }
  }

  animate() {
    this.context.fillStyle = 'white';
    this.context.beginPath();
    this.context.rect(this.dots.x, this.dots.y, this.dots.w, this.dots.h);
    this.context.closePath();
    this.context.fill();
  }

  render(onWindow, bool) {
    if (bool) {
      if (onWindow) {
        this.updateCounters();
        this.calculateDots();
        this.animate();
      } else if (this.counter !== 0 && !this.ready) {
        this.updateCounters();
      }
    }
  }

  updateCounters() {
    if (this.counter === this.counters) return this.ready = true;
    this.counter += 1;
  }

  checkRequest() {
    return (this.counter !== 0 && !this.ready) ? true : false;
  }
}
class LogoImage extends Figure {
  constructor({ parent, image, ...rest }) {
    super(rest);
    this.image = image;
    this.parent = parent;
    this.width = LOGO_IMAGE.width * this.scale;
    this.height = LOGO_IMAGE.height * this.scale;
    this.counters = 25;
    this.counter = 0;
    this.ready = false;
  }

  animate() {
    this.context.save();
    this.context.globalAlpha = 1 * this.counter / this.counters;
    this.context.drawImage(
      this.image,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.context.restore();
  }

  render(onWindow) {
    if (onWindow) {
      this.parent.cleared = false;
      this.updateCounter();
      this.animate();
    } else if (this.counter !== 0 && !this.ready) {
      this.updateCounter();
    }
  }

  updateCounter() {
    if (this.counter === this.counters) return this.ready = true;
    this.counter += 1;
  }

  checkRequest() {
    return (this.counter !== 0 && !this.ready) ? true : false;
  }
  handleResize(x, y, scale) {
    super.handleResize(x, y, scale);
    this.width = LOGO_IMAGE.width * this.scale;
    this.height = LOGO_IMAGE.height * this.scale;
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

    this.logoImage = new LogoImage({
      parent: this, image: this.image, scale: this.scale, context: this.context, x: this.x, y: this.y
    });

    this.rect = new Rect({
      scale: this.scale, context: this.context, x: this.x, y: this.y
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

    this.logoImage.updateXY(this.x, this.y);
    this.rect.updateXY(this.x, this.y)

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

    this.logoImage.handleResize(this.x, this.y, this.scale);
    this.rect.handleResize(this.x, this.y, this.scale);
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
    const w = this.x - 4 > 0 ? 600 * this.scale + 8 : 600 * this.scale + 8 + this.x;
    const h = this.y - 4 > 0 ? 355 * this.scale + 8 : 355 * this.scale + 8 + this.y;
    this.dirtDots = { x, y, w, h };
  }

  checkWindow() {
    if (
      (this.y > -4 && this.y < this.windowHeight + 4) ||
      (this.y + this.logoImage.height > -4 &&
        this.y + this.logoImage.height < this.windowHeight + 4) ||
      (this.y + this.logoImage.height / 2 > -4 &&
        this.y + this.logoImage.height / 2 < this.windowHeight)
    ) {
      this.onWindow = true;
    } else {
      this.onWindow = false;
    }
  }

  render() {
    if (this.cleared === false) this.clearDirt();
    this.logoImage.render(this.onWindow);
    this.rect.render(this.onWindow, this.logoImage.counter > this.logoImage.counters / 2);
    this.calculateDirt();
    this.request = this.logoImage.checkRequest() || this.rect.checkRequest();
  }
}

export default FirstBlock;


// class FirstRhombus {
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

//     this.image = opts.image;
//   }

//   /**
//    * Обработчики событий
//    */

//   updateXY(x, y) {
//     this.rendered = false;
//     this.x = x;
//     this.y = y;
//   }

//   handleResize() {
//     this.scale = this.parent.scale;
//     this.scaledWidth = this.width * this.scale;
//     this.halfScaledWidth = this.scaledWidth / 2;
//     this.scaledHeight = this.height * this.scale;
//     this.halfScaledHeight = this.scaledHeight / 2;

//     this.speed = this.halfScaledWidth / this.counters;

//     this.calculateDots();
//   }

//   drawImage() {
//     this.context.save();
//     this.context.globalAlpha = this.imageAlpha;
//     this.context.drawImage(
//       this.image,
//       this.x,
//       this.y,
//       this.scaledWidth,
//       this.scaledHeight
//     );
//     this.context.restore();
//   }

//   updateCounters() {
//     if (this.upCounter === 25) this.upReady = true;
//     if (this.downCounter === 25) this.downReady = true;
//     if (this.upReady && this.downReady) {
//       this.ready = true;
//     }

//     if (this.imageAlpha === 1) this.imageReady = true;

//     if (!this.upReady) {
//       this.upCounter += 1;
//     }

//     if (this.upReady && !this.downReady) {
//       this.downCounter += 1;
//     }

//     if (this.ready && !this.imageReady) {
//       this.imageAlpha += 0.05;
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
//       this.context.closePath();
//       this.drawImage();
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
//       (this.ready && !this.imageReady)
//     ) {
//       request = true;
//     }
//     return request;
//   }
// }