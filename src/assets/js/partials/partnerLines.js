/* globals document */
import Figure from './Figure';
import { PARTNER } from '../settings';
class PartnerRhombus extends Figure {
  constructor({ image, noise, ...rest }) {
    super(rest);
    if (window.pars === undefined) window.prs = [];
    window.prs.push(this);
    this.width = PARTNER.width;
    this.height = PARTNER.height;
    this.hovered = false;
    console.log(image, noise);
    this.image = image;
    this.noise = noise;

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
      this.subContext.globalAlpha = 1 * (this.counter - 50) / 25 / 8;
      this.subContext.drawImage(
        this.noise,
        0,
        0,
        this.subCanvas.width,
        this.subCanvas.height
      );
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

class PartnerBlock {
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

    [this.images, this.noise] = opts.images;
    this.width = PARTNER.width;
    this.height = PARTNER.height;
    this.marginBetweenX = PARTNER.gapX;

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
        new PartnerRhombus({
          parent: this,
          context: this.context,
          scale: this.scale,
          width: this.width,
          height: this.height,
          dx: this.dots[i].x,
          dy: this.dots[i].y,
          image: this.images[i],
          noise: this.noise
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
      w: this.x - 4 > 0 ? this.dots[this.images.length - 1].x + PARTNER.width * this.scale + 8 : this.dots[this.images.length - 1].x + PARTNER.width * this.scale + 8 + this.x,
      h: this.y - 4 > 0 ? PARTNER.height * this.scale + 4 : PARTNER.height * this.scale + 4 + this.y
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

    this.request = this.rhombuses[0].checkRequest();
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

class PartnerLines {
  constructor(opts) {
    this.gradientIndex = opts.gradientIndex;
    this.parent = opts.parent;
    this.context = this.parent.context;
    this.spacing = this.parent.spacing;
    this.scale = this.parent.scale;
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.dy = opts.dy;

    this.rhombusWidth = PARTNER.width;
    this.rhombusHeight = PARTNER.height;

    this.spaceBetweenRhombuses = PARTNER.gapX;
    this.textHeight = PARTNER.gapY;

    [this.images, this.noise] = opts.images;
    this.linesWithImages = this.getLines();

    if (this.linesWithImages.length > 0) {
      this.height =
        this.linesWithImages.length * this.rhombusHeight +
        (this.linesWithImages.length - 1) * this.textHeight;
    } else {
      this.height = 0;
    }

    this.partnerBlocks = this.getPartnerBlocks();
  }

  updateXY() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    for (let i = 0; i < this.partnerBlocks.length; i += 1) {
      this.partnerBlocks[i].updateXY();
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

    for (let i = 0; i < this.partnerBlocks.length; i += 1) {
      this.partnerBlocks[i].handleResize();
    }
  }

  checkRequest() {
    let request = false;
    for (let i = 0; i < this.partnerBlocks.length; i += 1) {
      request = request || this.partnerBlocks[i].request;
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

  getPartnerBlocks() {
    const partnerBlocks = [];
    for (let i = 0; i < this.linesWithImages.length; i += 1) {
      const dx =
        1024 -
        this.linesWithImages[i].length * this.rhombusWidth -
        (this.linesWithImages[i].length - 1) * this.spaceBetweenRhombuses;
      partnerBlocks.push(
        new PartnerBlock({
          parent: this.parent,
          gradientIndex: this.gradientIndex,
          context: this.context,
          rhombusHeight: this.rhombusHeight,
          rhombusWidth: this.rhombusWidth,
          textHeight: this.textHeight,
          dy: this.dy + (this.rhombusHeight + this.textHeight) * i,
          dx: dx / 2,
          images: [this.linesWithImages[i], this.noise]
        })
      );
    }
    return partnerBlocks;
  }

  render() {
    for (let i = 0; i < this.partnerBlocks.length; i += 1) {
      this.partnerBlocks[i].render();
    }
    this.request = this.checkRequest();
  }
}

export default PartnerLines;
