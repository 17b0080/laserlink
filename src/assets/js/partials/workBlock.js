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
};

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
    this.spacing = this.parent.spacing;

    this.scale = this.parent.scale;

    this.x = this.dx * this.scale - this.currentX + this.spacing;
    this.y = this.dy * this.scale - this.currentY;

    this.main.handleResize(this.x, this.y, this.scale);
  }

  updateXY() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.x = this.dx * this.scale - this.currentX + this.spacing;
    this.y = this.dy * this.scale - this.currentY;

    this.main.updateXY(this.x, this.y);
    this.checkWindow();
  }

  render() {
    if (!this.cleared && !this.main.ready) this.clearDirt();
    this.main.render(this.onWindow);
    this.calculateDirt();
    this.request = this.main.checkRequest();
  }
}

export default WorkBlock;
