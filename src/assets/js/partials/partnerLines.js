/* globals document */
import Figure from './Figure';
import { PARTNER, GRADIENT_LINES_TIME } from '../settings';
import { TimelineLite } from 'gsap';
import ScrollMagic from 'scrollmagic';

class PartnerRhombus extends Figure {
  constructor({ image, noise, ...rest }) {
    super(rest);
    this.width = PARTNER.width;
    this.height = PARTNER.height;
    this.hovered = false;
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

    this.attrs = {
      rendered: { image: false },
      played: { lines: false, image: false },
      dots: Array.from({ length: 5 }, () => ([PARTNER.width / 2, 0])).flat(),
      opacity: 1,
      gradientOffset: 0,
    }


    this.subCanvas = document.createElement('canvas');
    this.subCanvas.width = PARTNER.width;
    this.subCanvas.height = PARTNER.height;
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

  tl = () => {
    const tl = new TimelineLite();
    tl.to(this.attrs.dots, 1, [
      PARTNER.width / 2, 0,
      PARTNER.width, PARTNER.height / 2,
      PARTNER.width, PARTNER.height / 2,
      0, PARTNER.height / 2,
      0, PARTNER.height / 2,
    ]);
    tl.to(this.attrs.dots, 1, [
      PARTNER.width / 2, 0,
      PARTNER.width, PARTNER.height / 2,
      PARTNER.width / 2, PARTNER.height,
      0, PARTNER.height / 2,
      PARTNER.width / 2, PARTNER.height,
    ]);
    tl.add(() => this.attrs.played.lines = true)
    tl.from(this.attrs, 1, {
      opacity: 0,
      onComplete: () => this.attrs.played.image = true
    });
    tl.to(this.attrs, GRADIENT_LINES_TIME, {
      gradientOffset: 1500,
      repeat: -1,
    });
    return tl;
  }

  animate() {
    const { rendered, dots, played, opacity, gradientOffset } = this.attrs;

    this.context.save();
    this.context.beginPath();
    this.context.moveTo(this.x + this.width / 2, this.y);
    this.context.lineTo(this.x + this.width, this.y + this.height / 2);
    this.context.lineTo(this.x + this.width / 2, this.y + this.height);
    this.context.lineTo(this.x, this.y + this.height / 2);
    this.context.closePath();
    this.context.clip();

    if (!played.lines) {
      this.subContext.moveTo(dots[0], dots[1]);
      this.subContext.lineTo(dots[2], dots[3]);
      this.subContext.lineTo(dots[4], dots[5]);
      this.subContext.moveTo(dots[0], dots[1]);
      this.subContext.lineTo(dots[6], dots[7]);
      this.subContext.lineTo(dots[8], dots[9]);
    } else {
      this.subContext.beginPath();
      this.subContext.moveTo(dots[0], dots[1]);
      this.subContext.lineTo(dots[2], dots[3]);
      this.subContext.lineTo(dots[4], dots[5]);
      this.subContext.lineTo(dots[6], dots[7]);
      this.subContext.closePath();

      if (!played.image || !rendered.image) {
        if (played.image) this.attrs.rendered.image = true;
        this.subContext.clearRect(0, 0, this.subCanvas.width, this.subCanvas.height);
        this.subContext.save();
        this.subContext.globalAlpha = opacity;
        this.subContext.drawImage(
          this.noise,
          0,
          0,
          this.subCanvas.width,
          this.subCanvas.height
        );
        this.subContext.drawImage(
          this.image,
          0,
          0,
          this.subCanvas.width,
          this.subCanvas.height
        );
        this.subContext.restore();
      }
    };

    this.subContext.save();
    this.subContext.translate(0, -gradientOffset);
    this.subContext.stroke();
    this.subContext.restore();

    this.context.drawImage(this.subCanvas, this.x, this.y, this.width, this.height)
    this.context.restore();
    this.parent.cleared = false;
  }

  render(onWindow) {
    if (onWindow) this.animate();
  }

  checkRequest() {
    return true;
  }
}

class PartnerBlock {
  constructor(opts) {
    this.triggered = false;
    this.gradients = opts.gradients;
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

    this.tl = new TimelineLite({ paused: true });


    for (let i = 0; i < this.images.length; i += 1) {
      const pr = new PartnerRhombus({
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
      this.rhombuses.push(pr);
      this.tl.add(pr.tl(), "0");
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
    const { triggered } = this;
    if (
      (this.y > -4 && this.y < this.windowHeight + 4) ||
      (this.y + this.scaledHeight > -4 &&
        this.y + this.scaledHeight < this.windowHeight + 4)
    ) {
      this.onWindow = true;
      if (triggered) {
        if (this.tl.progress() === 0) this.tl.play();
        if (!this.gradients.isTriggered(5)) this.gradients.trigger(5);
      }
    } else {
      this.onWindow = false;
    }
  }
}

class PartnerLines {
  constructor({ text, gradients, images, noise, ...opts }) {
    [this.svg, this.text] = text;
    this.gradients = gradients;
    this.images = images;
    this.noise = noise;
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

  svgTl = () => {
    const { svg } = this;
    // svg.style.width = svg.getAttribute('viewBox').split(' ')[2] + 'px';
    const paths = svg.querySelectorAll('path');
    const image = svg.querySelector('image');
    const tl = new TimelineLite();
    paths.forEach((path, i) => {
      const pTl = new TimelineLite();
      const length = path.getTotalLength();
      // console.log(length)
      const from = { strokeDasharray: length, strokeDashoffset: length };
      const to = { strokeDasharray: length, strokeDashoffset: 0 };
      pTl.fromTo(path, .01, { css: { opacity: 0 } }, { css: { opacity: 1 } }, 'same')
      pTl.fromTo(path, 1, { css: from }, { css: to }, 'same');
      tl.add(pTl, `0+=${.25 * i}`)
    });
    tl.fromTo(image, .5, { css: { opacity: 0 } }, { css: { opacity: 1 } });
    return tl;
  }

  textTl = () => {
    const { text } = this;
    const tl = new TimelineLite();
    tl.fromTo(text, .5, { css: { opacity: 0 } }, { css: { opacity: 1 } }, 'text');
    tl.fromTo(text, 1, { css: { top: 20 } }, { css: { top: 0 } }, 'text');
    return tl;
  }

  scene = () => {
    const { partnerBlocks, svgTl, textTl } = this;
    const tl = new TimelineLite({ paused: true }).add(svgTl(), 'text').add(textTl(), 'text');
    const scene = new ScrollMagic.Scene({
      offset: this.dy * this.scale - window.innerHeight / 2
    });

    scene.on('start', () => {
      partnerBlocks.forEach(block => block.triggered = true);
      tl.play();
      scene.destroy();
    });
    return scene;
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
          gradients: this.gradients,
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
