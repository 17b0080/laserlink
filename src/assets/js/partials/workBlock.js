/* globals document, window */
import Figure from './Figure';
import { WORK } from '../settings';

// 1 - большая
// 2 - снизу
// 3 - сверху

class WorkRhombus extends Figure {
  constructor({ parent, image, ...rest }) {
    super(rest);
    this.parent = parent;
    this.image = image;
    this.width = WORK.width * this.scale;
    this.height = WORK.height * this.scale;

    this.dots = Array.from({ length: 5 }, () => ([this.x + this.width / 2, this.y])).flat();

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

  // calculateDots() {
  //   // Движущие точки расширяются

  //   if (this.counter < 25) this.dots = [
  //     this.x + this.width / 2, this.y,
  //     this.x + this.width / 2 * (1 + this.counter / 25), this.y + this.height / 2 * this.counter / 25,
  //     0, 0,
  //     this.x + this.width / 2 * (1 - this.counter / 25), this.y + this.height / 2 * this.counter / 25,
  //     0, 0,
  //   ];
  //   if (this.counter >= 25 && this.counter <= 50) this.dots = [
  //     this.x + this.width / 2, this.y,
  //     this.x + this.width, this.y + this.height / 2,
  //     this.x + this.width * (1 - (this.counter - 25) / 25 / 2), this.y + this.height / 2 * (1 + (this.counter - 25) / 25),
  //     this.x, this.y + this.height / 2,
  //     this.x + this.width / 2 * (this.counter - 25) / 25, this.y + this.height / 2 * (1 + (this.counter - 25) / 25),
  //   ];

  //   // Движущих точек нет, быстрая вставка
  //   if (this.counter >= 50) this.dots = [
  //     this.x + this.width / 2, this.y,
  //     this.x + this.width, this.y + this.height / 2,
  //     this.x + this.width / 2, this.y + this.height,
  //     this.x, this.y + this.height / 2,
  //   ];
  // }

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

  updateCounters() {
    if (this.counter === 75) this.ready = true;
    if (this.counter === 150) this.counter = 76;
    else this.counter += 1;
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
    if (this.counter < 25) {
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
        this.subContext.globalAlpha = 1 * (this.counter - 50) / 25;
        this.subContext.drawImage(
          this.image,
          0,
          0,
          this.subCanvas.width,
          this.subCanvas.height
        );
        this.subContext.restore();
        this.rendered = true;
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
    return (this.counter !== 0 && !this.ready || this.counter > 75) ? true : false
  }
}


// class HoverRhombus {
//   constructor(opts) {
//     this.parent = opts.parent;
//     this.scale = this.parent.scale;
//     this.context = this.parent.context;

//     // Смещение оси координат для удобства
//     this.x = opts.dx; // скалированная (*)
//     this.y = opts.dy; // скалированная (*)
//     this.request = false;

//     this.width = opts.width;
//     this.height = opts.height;
//     this.scaledWidth = this.width * this.scale;
//     this.halfScaledWidth = this.scaledWidth / 2;
//     this.scaledHeight = this.height * this.scale;
//     this.halfScaledHeight = this.scaledHeight / 2;

//     this.imageAlpha = 0;
//     this.imageCounter = 0;
//     this.imageCounters = 100;
//     this.upCounter = 0;
//     this.downCounter = 0;
//     this.counters = 25;
//     this.speed = this.halfScaledWidth / this.counters;

//     this.hovered = false;
//     this.ready = false;
//     this.upReady = false;
//     this.downReady = false;
//     this.dots = {
//       x0: this.x,
//       y0: this.y + this.halfheight,
//       x1: this.x + this.halfwidth,
//       y1: this.y,
//       x2: this.x + this.width,
//       y2: this.y + this.halfheight,
//       x3: this.x + this.halfwidth,
//       y3: this.y + this.height,
//       moveX0: this.x + this.halfwidth,
//       moveX1: this.x + this.halfwidth,
//       moveY: this.y
//     };

//     this.image = opts.image;
//     this.canvas = document.createElement('canvas');
//     this.canvas.width = this.width;
//     this.canvas.height = this.height;

//     this.imageAlpha = 0;
//     this.imageCounters = 100;
//     this.imageCounter = 0;

//     this.cleared = false;
//   }

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
//     this.spacing = this.parent.spacing;

//     this.x = x;
//     this.y = y;

//     this.speed = this.halfScaledWidth / this.counters;

//     this.calculateDots();
//   }

//   updateCounters() {
//     if (this.upCounter === 25) this.upReady = true;
//     if (this.downCounter === 25) this.downReady = true;
//     if (this.upReady && this.downReady) {
//       this.ready = true;
//     }
//     if (this.imageAlpha === 1) {
//       this.imageReady = true;
//     } else {
//       this.imageReady = false;
//     }

//     if (!this.upReady) {
//       this.upCounter += 1;
//     }

//     if (this.upReady && !this.downReady) {
//       this.downCounter += 1;
//     }

//     if (this.ready && this.hovered && !this.imageReady) {
//       this.imageAlpha += 0.1;
//       if (this.imageAlpha > 1) this.imageAlpha = 1;
//     } else if (this.ready && !this.hovered && this.imageAlpha !== 0) {
//       this.imageAlpha -= 0.1;
//       if (this.imageAlpha < 0) this.imageAlpha = 0;
//     }
//   }

//   animate() {
//     this.context.beginPath();
//     this.context.strokeStyle = 'white';
//     this.context.lineWidth = 2;
//     // Поэтапный верх линий ромба
//     if (!this.upReady) {
//       // this.context.beginPath();
//       // this.context.strokeStyle = 'white';
//       // this.context.lineWidth = 2;
//       this.context.moveTo(this.dots.moveX0, this.dots.moveY);
//       this.context.lineTo(this.dots.x1, this.dots.y1);
//       this.context.lineTo(this.dots.moveX1, this.dots.moveY);
//       // this.context.stroke();
//     }
//     // Верх + поэтапный низ линий ромба
//     else if (this.upReady && !this.downReady) {
//       // this.context.beginPath();
//       // this.context.strokeStyle = 'white';
//       // this.context.lineWidth = 2;
//       this.context.moveTo(this.dots.moveX0, this.dots.moveY);
//       this.context.lineTo(this.dots.x0, this.dots.y0);
//       this.context.lineTo(this.dots.x1, this.dots.y1);
//       this.context.lineTo(this.dots.x2, this.dots.y2);
//       this.context.lineTo(this.dots.moveX1, this.dots.moveY);
//       // this.context.stroke();
//     }
//     // Быстрая вставка линий ромба
//     else if (this.ready) {
//       // this.context.beginPath();
//       // this.context.strokeStyle = 'white';
//       // this.context.strokeWidth = 2;
//       this.context.fillStyle = this.imagePattern;
//       this.context.moveTo(this.dots.x0, this.dots.y0);
//       this.context.lineTo(this.dots.x1, this.dots.y1);
//       this.context.lineTo(this.dots.x2, this.dots.y2);
//       this.context.lineTo(this.dots.x3, this.dots.y3);
//       this.drawImage();
//       this.context.closePath();
//       // this.context.stroke();
//       this.rendered = true;
//     }

//     // this.context.closePath();
//     this.context.stroke();

//     this.parent.cleared = false;
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
//       this.image,
//       this.x,
//       this.y,
//       this.scaledWidth,
//       this.scaledHeight
//     );

//     this.context.restore();
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

//   render(onWindow, ready) {
//     if (onWindow && ready) {
//       this.updateCounters();
//       this.calculateDots();
//       this.animate();
//     } else if (this.upCounter !== 0 && !this.ready && ready) {
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

// 1 - большая
// 2 - сверху
// 3 - снизу
// 4 - шум
class WorkBlock {
  constructor(opts) {
    if (window.works === undefined) window.works = [];
    window.works.push(this);
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
      x: this.x,
      y: this.y,
      image: this.images[1]
    });

    // this.sdx =
    //   this.dx * this.scale + this.main.scaledWidth / 2 - 64 * this.scale;
    // this.sdy = this.dy * this.scale + this.main.scaledHeight + 13 * this.scale;
    // this.sx = this.sdx - this.currentX + this.spacing;
    // this.sy = this.sdy - this.currentY;

    // this.side = new HoverRhombus({
    //   parent: this,
    //   context: this.context,
    //   scale: this.scale,
    //   width: 128,
    //   height: 128,
    //   x: this.sx,
    //   y: this.sy,
    //   image: this.images[3]
    // });
  }

  calculateDirt() {
    this.dirtDots = {
      x: this.x - 4 > 0 ? this.x - 4 : 0,
      y: this.y - 4 > 0 ? this.y - 4 : 0,
      w: this.x - 4 > 0 ? WORK.width * this.scale + 8 : WORK.width * this.scale + this.x + 8,
      h: this.y - 4 > 0 ? WORK.height * this.scale + 8 : WORK.height * this.scale + this.y + 8
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
      (0 > this.y && window.innerHeight < this.y + WORK.height * this.scale) ||
      (0 < this.y && window.innerHeight > this.y + WORK.height * this.scale) ||
      (0 < this.y && window.innerHeight > this.y) ||
      (0 < this.y + WORK.height * this.scale && window.innerHeight > this.y + WORK.height * this.scale)
    ) {
      this.onWindow = true;
    } else {
      this.onWindow = false;
    }
  }

  handleResize() {
    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    // this.halfWindowHeight = this.parent.halfWindowHeight;
    this.spacing = this.parent.spacing;

    this.scale = this.parent.scale;

    this.x = this.dx * this.scale - this.currentX + this.spacing;
    this.y = this.dy * this.scale - this.currentY;

    // this.sx = this.sdx * this.scale - this.currentX + this.spacing;
    // this.sy = this.sdy * this.scale - this.currentY;

    this.main.handleResize(this.x, this.y, this.scale);
    // this.side.handleResize(this.sx, this.sy);
  }

  updateXY() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.x = this.dx * this.scale - this.currentX + this.spacing;
    this.y = this.dy * this.scale - this.currentY;

    this.main.updateXY(this.x, this.y);

    // this.sdx =
    // this.dx * this.scale + this.main.scaledWidth / 2 - 64 * this.scale;
    // this.sdy = this.dy * this.scale + this.main.scaledHeight + 13 * this.scale;
    // this.sx = this.sdx - this.currentX + this.spacing;
    // this.sy = this.sdy - this.currentY;

    // this.side.updateXY(this.sx, this.sy);

    this.checkWindow();
  }

  render() {
    if (!this.cleared && !this.main.ready) this.clearDirt();
    this.main.render(this.onWindow);
    // this.side.render(this.onWindow, this.main.ready);
    this.calculateDirt();
    // if (!this.onWindow && this.cleared === false) this.clearDirt();

    this.request = this.main.checkRequest();
  }
}

export default WorkBlock;
