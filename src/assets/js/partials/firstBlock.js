/* eslint-disable no-undef */
/* eslint-disable prefer-destructuring */
import { TimelineLite } from 'gsap';
import { LOGO, LOGO_RECT, LOGO_IMAGE, LOGO_MORE } from '../settings';
import Figure from './Figure';

class MoreRhombus extends Figure {
  constructor({ parent, image, ...rest }) {
    super(rest);
    this.width = LOGO_MORE.width * this.scale;
    this.height = LOGO_MORE.height * this.scale;
    this.attrs = {
      x: LOGO_MORE.x * this.scale,
      y: LOGO_MORE.y * this.scale,
      played: { lines: false },
      dots: Array.from({ length: 5 }, () => ([LOGO_MORE.width / 2, 0])).flat()
    };
    this.parent = parent;
    this.width = LOGO_MORE.width * this.scale;
    this.height = LOGO_MORE.height * this.scale;

    this.subCanvas = document.createElement('canvas');
    this.subCanvas.width = LOGO_MORE.width * this.scale;
    this.subCanvas.height = LOGO_MORE.height * this.scale;
    this.subContext = this.subCanvas.getContext('2d');
    this.subContext.lineWidth = 8;
    this.subContext.strokeStyle = 'white';

    this.button = document.querySelector('a.content__button');

  }

  tl = (opts) => {
    const tl = new TimelineLite(opts);
    tl.to(this.attrs.dots, 1, [
      LOGO_MORE.width / 2, 0,
      LOGO_MORE.width, LOGO_MORE.height / 2,
      LOGO_MORE.width, LOGO_MORE.height / 2,
      0, LOGO_MORE.height / 2,
      0, LOGO_MORE.height / 2,
    ]);
    tl.to(this.attrs.dots, 1, [
      LOGO_MORE.width / 2, 0,
      LOGO_MORE.width, LOGO_MORE.height / 2,
      LOGO_MORE.width / 2, LOGO_MORE.height,
      0, LOGO_MORE.height / 2,
      LOGO_MORE.width / 2, LOGO_MORE.height,
    ]);
    tl.fromTo(this.button, .25, { css: { opacity: 0 } }, { css: { opacity: 1 } }, 'text');
    tl.fromTo(this.button, .75, { css: { top: 20 } }, { css: { top: 0 } }, 'text');
    tl.add(() => this.attrs.played.lines = true);
    return tl;
  }

  animate() {
    const { width, height, x: dx, y: dy, scale } = this;
    const { played, x, y, dots } = this.attrs;

    this.context.save();
    this.context.beginPath();
    this.context.moveTo(dx + x + width / 2, dy + y);
    this.context.lineTo(dx + x + width, dy + y + height / 2);
    this.context.lineTo(dx + x + width / 2, dy + y + height);
    this.context.lineTo(dx + x, dy + y + height / 2);
    this.context.closePath();
    this.context.clip();
    // this.context.fillStyle = 'red';
    // this.context.fillRect(dx + x, dy + y, width, height);
    if (!played.lines) {
      this.subContext.moveTo(dots[0] * scale, dots[1] * scale);
      this.subContext.lineTo(dots[2] * scale, dots[3] * scale);
      this.subContext.lineTo(dots[4] * scale, dots[5] * scale);
      this.subContext.moveTo(dots[0] * scale, dots[1] * scale);
      this.subContext.lineTo(dots[6] * scale, dots[7] * scale);
      this.subContext.lineTo(dots[8] * scale, dots[9] * scale);
    } else {
      this.subContext.beginPath();
      this.subContext.moveTo(dots[0] * scale, dots[1] * scale);
      this.subContext.lineTo(dots[2] * scale, dots[3] * scale);
      this.subContext.lineTo(dots[4] * scale, dots[5] * scale);
      this.subContext.lineTo(dots[6] * scale, dots[7] * scale);
      this.subContext.lineWidth = 8;
      this.subContext.strokeStyle = 'white';
      this.subContext.closePath();
    };
    this.subContext.stroke();
    this.context.drawImage(this.subCanvas, dx + x, dy + y, width, height)
    this.context.restore();
    this.parent.cleared = false;

  }

  render(onWindow) {
    if (onWindow) this.animate();
  }

  checkRequest() {
    return true;
  }

  handleResize(x, y, scale) {
    super.handleResize(x, y, scale);
    this.width = LOGO_MORE.width * this.scale;
    this.height = LOGO_MORE.height * this.scale;
    this.subCanvas.width = LOGO_MORE.width * this.scale;
    this.subCanvas.height = LOGO_MORE.height * this.scale;
    this.attrs.x = LOGO_MORE.x * this.scale;
    this.attrs.y = LOGO_MORE.y * this.scale;
  }
};

class Rect extends Figure {
  constructor(opts) {
    super(opts);

    this.request = false;

    this.attrs = {
      x: LOGO_RECT.x * this.scale,
      y: LOGO_RECT.y * this.scale,
      width: LOGO_RECT.w * this.scale,
      height: LOGO_RECT.h * this.scale
    }
    this.ready = false;
  }

  handleResize(x, y, scale) {
    super.handleResize(x, y, scale);
    this.attrs = {
      x: LOGO_RECT.x * this.scale,
      y: LOGO_RECT.y * this.scale,
      width: LOGO_RECT.w * this.scale,
      height: LOGO_RECT.h * this.scale,
    };
  }

  tl = () => {
    const tl = new TimelineLite();
    tl.from(this.attrs, 1, { width: 0 });
    return tl;
  }

  animate() {
    const { x: dx, y: dy } = this;
    const { x, y, width, height } = this.attrs;
    this.context.fillStyle = 'white';
    this.context.beginPath();
    this.context.rect(dx + x, dy + y, width, height);
    this.context.closePath();
    this.context.fill();
  }

  render(onWindow) {
    if (onWindow) {
      // this.updateCounters();
      // this.calculateDots();
      this.animate();
    };
    // else if (this.counter !== 0 && !this.ready) {
    //   this.updateCounters();
    // }
  }

  checkRequest() {
    return !this.played;
  }
}
class LogoImage extends Figure {
  constructor({ parent, image, ...rest }) {
    super(rest);
    this.played = false;
    this.attrs = { opacity: 1 };
    this.image = image;
    this.parent = parent;
    this.width = LOGO_IMAGE.width * this.scale;
    this.height = LOGO_IMAGE.height * this.scale;
  }

  tl = (opts) => {
    const tl = new TimelineLite({ onComplete: () => this.played = true, ...opts });
    tl.from(this.attrs, 1, { opacity: 0 });
    return tl;
  }

  animate() {
    this.context.save();
    this.context.globalAlpha = this.attrs.opacity;
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
      // this.updateCounter();
      this.animate();
    };
    //  else if (this.counter !== 0 && !this.ready) {
    //   this.updateCounter();
    // }
  }

  checkRequest() {
    return !this.played;
  }

  handleResize(x, y, scale) {
    super.handleResize(x, y, scale);
    this.width = LOGO_IMAGE.width * this.scale;
    this.height = LOGO_IMAGE.height * this.scale;
  }
}

class FirstBlock {
  constructor({ text, image, ...opts }) {
    this.text = text;
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

    this.logoImage = new LogoImage({
      parent: this, image, scale: this.scale, context: this.context, x: this.x, y: this.y
    });

    this.rect = new Rect({
      scale: this.scale, context: this.context, x: this.x, y: this.y
    });

    this.more = new MoreRhombus({
      parent: this, scale: this.scale, context: this.context, dx: this.x, dy: this.y
    })

    this.tl = new TimelineLite({ paused: true });
    this.tl.add(this.logoImage.tl());
    this.tl.add(this.more.tl(), 'kek');
    this.tl.add(this.rect.tl(), 'kek');
    this.tl.add(this.textTl(), 'kek+=1');
  }

  textTl = () => {
    const { text } = this;
    const tl = new TimelineLite();
    tl.fromTo(text[0], .25, { css: { opacity: 0 } }, { css: { opacity: 1 } }, 'opacity');
    tl.fromTo(text[0], .75, { css: { left: -50 } }, { css: { left: 0 } }, 'opacity');
    tl.fromTo(text[1], .25, { css: { opacity: 0 } }, { css: { opacity: 1 } }, 'opacity');
    tl.fromTo(text[1], .5, { css: { top: -20 } }, { css: { top: 0 } }, 'opacity');
    tl.fromTo(text[2], .25, { css: { opacity: 0 } }, { css: { opacity: 1 } }, 'opacity');
    tl.fromTo(text[2], .5, { css: { top: 20 } }, { css: { top: 0 } }, 'opacity');
    return tl;
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
    this.rect.updateXY(this.x, this.y);
    this.more.updateXY(this.x, this.y);
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
    this.more.handleResize(this.x, this.y, this.scale);
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
    const x = this.x > 0 ? this.x : 0;
    const y = this.y > 0 ? this.y : 0;
    const w = this.x > 0 ? LOGO.width * this.scale : LOGO.width * this.scale + this.x;
    const h = this.y > 0 ? LOGO.height * this.scale : LOGO.height * this.scale + this.y;
    this.dirtDots = { x, y, w, h };
  }

  checkWindow() {
    if (
      (0 > this.y && window.innerHeight < this.y + LOGO.height * this.scale) ||
      (0 < this.y && window.innerHeight > this.y + LOGO.height * this.scale) ||
      (0 < this.y && window.innerHeight > this.y) ||
      (0 < this.y + LOGO.height * this.scale && window.innerHeight > this.y + LOGO.height * this.scale)
    ) {
      this.onWindow = true;
      if (this.tl.progress() === 0) {
        this.tl.play();
      }
    } else {
      this.onWindow = false;
    }
  }

  render() {
    if (this.cleared === false) this.clearDirt();
    this.logoImage.render(this.onWindow);
    this.rect.render(this.onWindow, this.logoImage.played);
    this.more.render(this.onWindow);
    this.calculateDirt();
    this.request = this.logoImage.checkRequest() || this.rect.checkRequest();
  }
}

export default FirstBlock;