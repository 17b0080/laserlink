/* globals document, window */
import { TimelineLite, TweenLite } from 'gsap';
import Figure from './Figure';
import { NEON_CHAR_DELAY, NEON_CHAR_TIME, WORK, GRADIENT_LINES_TIME } from '../settings';
import ScrollMagic from 'scrollmagic';
// 1 - большая
// 2 - снизу
// 3 - сверху

class WorkRadialGradient extends Figure {
  constructor({ gradient, ...opts }) {
    super(opts);

    this.width = WORK.radial.radius * 2 * this.scale;
    this.height = WORK.radial.radius * 2 * this.scale;
    this.attrs = {
      opacity: 0,
      x: 0,
      y: 0
    }

    this.subCanvas = document.createElement('canvas');
    this.subCanvas.width = WORK.radial.radius * 2;
    this.subCanvas.height = WORK.radial.radius * 2;
    this.subContext = this.subCanvas.getContext('2d');
    this.gradient = this.subContext.createRadialGradient(
      WORK.radial.radius, WORK.radial.radius, 0,
      WORK.radial.radius, WORK.radial.radius, WORK.radial.radius
    );
    gradient.forEach((rgb, i) => this.gradient.addColorStop(i / 2, rgb));

    this.subContext.fillStyle = this.gradient;
    // this.subContext.filter = "blur";
    this.subContext.arc(
      WORK.radial.radius,
      WORK.radial.radius,
      WORK.radial.radius,
      0, -2 * Math.PI
    );
    this.subContext.fill();
  }

  hoverTl = (opts) => {
    const tl = new TimelineLite(opts);
    tl.to(this.attrs, 1, { opacity: 1 });
    return tl;
  }

  animate() {
    const { x: dx, y: dy, subCanvas: image } = this;
    const { opacity, x, y } = this.attrs;
    if (opacity > 0) {
      this.context.save();
      this.context.globalAlpha = opacity;
      this.context.drawImage(
        image,
        dx + x + (WORK.width / 2 - WORK.radial.radius) * this.scale,
        dy + y + (WORK.height / 2 - WORK.radial.radius) * this.scale,
        this.width,
        this.height
      );
      this.context.restore();
    }
  }

  render(onWindow) {
    if (onWindow) this.animate();
  }
}

class WorkRhombus extends Figure {
  constructor({ lColors, parent, image, ...rest }) {
    super(rest);
    this.lColor = lColors;
    this.parent = parent;
    this.image = image;
    this.width = WORK.width * this.scale;
    this.height = WORK.height * this.scale;

    this.attrs = {
      resized: true,
      rendered: { image: false, hover: true },
      played: { lines: false, image: false, hover: true },
      dots: Array.from({ length: 5 }, () => ([WORK.width / 2, 0])).flat(),
      darkenOpacity: 0,
      opacity: 1,
      gradientOffset: 0,
    }

    this.rendered = false;
    this.ready = false;
    this.opacity = 0;
    this.counter = 0;
    this.counters = 100;

    this.subCanvas = document.createElement('canvas');
    this.subCanvas.width = WORK.width * this.scale;
    this.subCanvas.height = WORK.height * this.scale;
    this.subContext = this.subCanvas.getContext('2d');


    this.gradientCanvas = document.createElement('canvas');
    this.gradientCanvas.width = WORK.width * this.scale;
    this.gradientCanvas.height = WORK.height * 3 * this.scale;
    this.gradientContext = this.gradientCanvas.getContext('2d');
    this.gradient = this.gradientContext.createLinearGradient(
      this.gradientCanvas.width / 2, 0,
      this.gradientCanvas.width / 2, this.gradientCanvas.height
    );
    this.lColor.forEach((color, i) => {
      this.gradient.addColorStop(i / this.lColor.length, color)
    })
    this.subContext.strokeStyle = this.gradient;
    this.subContext.lineWidth = 8;
  }

  hoverTl = (opts) => {
    const tl = new TimelineLite(opts);
    tl.to(this.attrs, 1, { darkenOpacity: 1, opacity: 0 });
    return tl;
  }

  tl = (onImageComplete = () => { }, opts) => {
    const tl = new TimelineLite({
      onComplete: () => {
        new TimelineLite().to(this.attrs, GRADIENT_LINES_TIME, {
          gradientOffset: this.gradientCanvas.height * 2/3,
          repeat: -1,
        });
      }, ...opts
    });
    tl.to(this.attrs.dots, 1, [
      WORK.width / 2, 0,
      WORK.width, WORK.height / 2,
      WORK.width, WORK.height / 2,
      0, WORK.height / 2,
      0, WORK.height / 2,
    ]);
    tl.to(this.attrs.dots, 1, [
      WORK.width / 2, 0,
      WORK.width, WORK.height / 2,
      WORK.width / 2, WORK.height,
      0, WORK.height / 2,
      WORK.width / 2, WORK.height,
    ]);
    tl.add(() => this.attrs.played.lines = true)
    tl.from(this.attrs, 1, {
      opacity: 0,
      onComplete: () => {
        this.attrs.played.image = true;
        if (this.attrs.hovered) {
          this.attrs.rendered.hover = false;
          onImageComplete();
        };
      }
    });
    return tl;
  }

  animate() {
    const { resized, rendered, dots, played, opacity, gradientOffset } = this.attrs;
    const { scale, gradient } = this;


    this.context.save();
    this.context.beginPath();
    this.context.moveTo(this.x + this.width / 2, this.y);
    this.context.lineTo(this.x + this.width, this.y + this.height / 2);
    this.context.lineTo(this.x + this.width / 2, this.y + this.height);
    this.context.lineTo(this.x, this.y + this.height / 2);
    this.context.closePath();
    this.context.clip();
    if (!played.lines) {
      this.subContext.moveTo(dots[0] * scale, dots[1] * scale);
      this.subContext.lineTo(dots[2] * scale, dots[3] * scale);
      this.subContext.lineTo(dots[4] * scale, dots[5] * scale);
      this.subContext.moveTo(dots[0] * scale, dots[1] * scale);
      this.subContext.lineTo(dots[6] * scale, dots[7] * scale);
      this.subContext.lineTo(dots[8] * scale, dots[9] * scale);
    } else {
      this.subContext.beginPath();
      this.subContext.strokeStyle = gradient;
      this.subContext.lineWidth = 8;
      this.subContext.moveTo(dots[0] * scale, dots[1] * scale);
      this.subContext.lineTo(dots[2] * scale, dots[3] * scale);
      this.subContext.lineTo(dots[4] * scale, dots[5] * scale);
      this.subContext.lineTo(dots[6] * scale, dots[7] * scale);
      this.subContext.closePath();

      if (!played.image || !rendered.image || !played.hover || !rendered.hover || !resized) {
        if (!resized) this.attrs.resized = true;
        if (played.image) this.attrs.rendered.image = true;
        if (rendered.hover) this.attrs.rendered.hover = true;
        this.subContext.clearRect(0, 0, this.subCanvas.width, this.subCanvas.height);
        this.subContext.save();
        this.subContext.fillStyle = `black`;
        this.subContext.rect(0, 0, this.subCanvas.width, this.subCanvas.height);
        this.subContext.fill();
        this.subContext.globalAlpha = opacity;
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

  handleResize(x, y, scale) {
    super.handleResize(x, y, scale);
    this.attrs.resized = false;
    this.width = this.subCanvas.width = WORK.width * this.scale;
    this.height = this.subCanvas.height = WORK.height * this.scale;
    this.gradientCanvas.width = WORK.width * this.scale;
    this.gradientCanvas.height = WORK.height * 3 * this.scale;
    this.gradient = this.gradientContext.createLinearGradient(
      this.gradientCanvas.width / 2, 0,
      this.gradientCanvas.width / 2, this.gradientCanvas.height
    );
    this.lColor.forEach((color, i) => {
      this.gradient.addColorStop(i / this.lColor.length, color)
    })
    this.subContext.strokeStyle = this.gradient;
    this.subContext.lineWidth = 8;
  }
};

class WorkBlock {
  constructor({ lineColors, radialGradient, text, image, ...opts }) {
    [this.svg, this.text, this.button] = text;
    this.i = opts.i;
    this.lColors = lineColors;
    console.log(this.lColors);
    this.rGradient = radialGradient;
    this.gradients = opts.parent.gradients;
    this.parent = opts.parent;
    this.context = this.parent.context;
    this.scale = this.parent.scale;

    this.attrs = {
      animated: false
    }

    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    this.spacing = this.parent.spacing;
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.onWindow = false;
    this.gradientIndex = opts.gradientIndex;

    this.dx = opts.dx;
    this.dy = opts.dy;
    this.x = this.dx * this.scale - this.currentX + this.spacing;
    this.y = this.dy * this.scale - this.currentY;

    this.main = new WorkRhombus({
      lColors: this.lColors,
      parent: this,
      context: this.context,
      scale: this.scale,
      x: this.x,
      y: this.y,
      image
    });

    this.radials = [
      new WorkRadialGradient({ gradient: this.rGradient[0], context: this.context, scale: this.scale, x: this.x, y: this.y }),
      new WorkRadialGradient({ gradient: this.rGradient[1], context: this.context, scale: this.scale, x: this.x, y: this.y })
    ];

    this.calculateDirt();

    this.tl = new TimelineLite({ paused: true })
      .add(this.main.tl())
      .add(this.svgTl(), 'text')
      .add(this.textTl(), 'text');

    this.hoverTl = new TimelineLite({ paused: true })
      .add(this.main.hoverTl(() => this.hoverTl.play()), 'hover')
      .add(this.radials[0].hoverTl(), 'hover')
      .add(this.radials[1].hoverTl(), 'hover')
      .to(this.svg, 1, { css: { opacity: 0 } }, 'hover')
      .to(this.text, 1, { css: { opacity: 0 } }, 'hover')
      .fromTo(this.button, 1, { css: { opacity: 0 } }, { css: { opacity: 1 } }, 'hover');
  }


  svgTl = () => {
    const { svg } = this;
    // svg.style.width = svg.getAttribute('viewBox').split(' ')[2] + 'px';
    const paths = svg.querySelectorAll('path');
    const images = svg.querySelectorAll('image');
    const tl = new TimelineLite({
      onComplete: () => {
        this.attrs.animated = true
      }
    });
    paths.forEach((path, i) => {
      const pTl = new TimelineLite();
      const length = path.getTotalLength();
      const from = { strokeDasharray: length, strokeDashoffset: length };
      const to = { strokeDasharray: length, strokeDashoffset: 0 };
      pTl.fromTo(path, .01, { css: { opacity: 0 } }, { css: { opacity: 1 } }, 'same')
      pTl.fromTo(path, NEON_CHAR_TIME, { css: from }, { css: to }, 'same');
      tl.add(pTl, `0+=${NEON_CHAR_DELAY * i}`)
    });
    tl.fromTo(images, .5, { css: { opacity: 0 } }, { css: { opacity: 1 } });
    return tl;
  }

  textTl = () => {
    const { text } = this;
    const tl = new TimelineLite();
    tl.fromTo(text, .25, { css: { opacity: 0 } }, { css: { opacity: 1 } }, 'text');
    tl.fromTo(text, .75, { css: { top: 20 } }, { css: { top: 0 } }, 'text');
    return tl;
  }


  handleMouseMove = ({ clientX, clientY }) => {
    const dx = this.x + WORK.width / 2 - clientX;
    const dy = this.y + WORK.height / 2 - clientY;
    this.radials[0].attrs.x = dx / 2;
    this.radials[0].attrs.y = dy / 2;
    this.radials[1].attrs.x = -dx / 2;
    this.radials[1].attrs.y = -dy / 2;
  }

  calculateDirt() {
    const { radials, scale } = this;

    let x = radials[0].attrs.x + radials[0].x + (WORK.width / 2 - WORK.radial.radius) * scale;
    let w = radials[1].attrs.x + radials[1].x - x + WORK.radial.radius * 2 * scale;
    let y = radials[0].attrs.y + radials[0].y + (WORK.height / 2 - WORK.radial.radius);
    let h = radials[1].attrs.y + radials[1].y - y + WORK.radial.radius * 2 * scale;

    if (radials[1].attrs.x + radials[1].x + (WORK.width / 2 - WORK.radial.radius) * scale < x) {
      x = radials[1].attrs.x + radials[1].x + (WORK.width / 2 - WORK.radial.radius) * scale;
      w = radials[0].attrs.x + radials[0].x - x + WORK.radial.radius * 2 * scale;
    }

    if (radials[1].attrs.y + radials[1].y + (WORK.height / 2 - WORK.radial.radius) < y) {
      y = radials[1].attrs.y + radials[1].y + (WORK.height / 2 - WORK.radial.radius);
      h = radials[0].attrs.y + radials[0].y - y + WORK.radial.radius * 2 * scale;
    }

    this.dirtDots = { x: x - 5, y: y - 5, w: w + 10, h: h + 10 };
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
      if (this.triggered) {
        if (this.tl.progress() === 0) this.tl.play();
        if (!this.gradients.isTriggered(this.i + 1)) this.gradients.trigger(this.i + 1)
      }
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
    this.radials[0].handleResize(this.x, this.y, this.scale);
    this.radials[1].handleResize(this.x, this.y, this.scale);
  }

  updateXY() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.x = this.dx * this.scale - this.currentX + this.spacing;
    this.y = this.dy * this.scale - this.currentY;

    this.main.updateXY(this.x, this.y);
    this.radials[0].updateXY(this.x, this.y);
    this.radials[1].updateXY(this.x, this.y);
    this.checkWindow();
  }

  render() {
    const { cleared, radials, main, onWindow } = this;
    if (!cleared && !main.ready) this.clearDirt();
    radials[0].render(onWindow);
    radials[1].render(onWindow);
    main.render(onWindow);
    this.calculateDirt();
    this.request = this.main.checkRequest();
  }

  scene = () => {
    const scene = new ScrollMagic.Scene({
      offset: (this.dy + WORK.height / 2) * this.scale - window.innerHeight / 2
    });
    scene.on('start', () => {
      this.triggered = true;
      scene.destroy();
    });
    return scene;
  }
}

export default WorkBlock;
