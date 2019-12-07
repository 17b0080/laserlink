/* eslint-disable no-undef */
import { GRADIENT } from '../settings';

class Gradient {
  constructor(opts) {
    this.parent = opts.parent;
    this.scale = this.parent.scale;
    this.image = opts.image;
    this.spacing = this.parent.spacing;
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;
    this.alpha = 0;
    this.rotate = opts.rotate;

    this.request = false;

    this.attrs = {
      x: opts.x0,
      y: opts.y0,
      dx: opts.dx,
      dy: opts.dy,
      opacity: 0,
    }

    this.defDots = {
      x0: opts.x0,
      y0: opts.y0,
      x: opts.x,
      y: opts.y,
      dx: opts.dx,
      dy: opts.dy
    };

    this.x = opts.x0;
    this.y = opts.y0;

    this.dots = {
      x: this.defDots.x0 * this.scale + this.defDots.dx,
      y: this.defDots.y0 * this.scale + this.defDots.dy,
      x0: this.defDots.x0 * this.scale,
      y0: this.defDots.y0 * this.scale,
      dx: this.defDots.dx,
      dy: this.defDots.dy
    };

    this.windowHeight = this.parent.windowHeight;
    this.imageWidth = this.image.width;
    this.imageHeight = this.image.height;

    this.canvas = document.createElement('canvas');
    this.canvas.width = 989 * this.scale;
    this.canvas.height = 989 * this.scale;

    this.context = this.canvas.getContext('2d');
    this.context.save();
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.context.rotate((this.rotate * Math.PI) / 180);
    this.context.drawImage(
      this.image,
      -this.canvas.width / 2,
      -this.canvas.height / 2,
      this.canvas.width,
      this.canvas.height
    );
    this.context.restore();
  }

  updateXY() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;
  }

  handleResize() {
    this.scale = this.parent.scale;
    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;

    this.dots = {
      x: this.defDots.x0 * this.scale + this.defDots.dx,
      y: this.defDots.y0 * this.scale + this.defDots.dy,
      x0: this.defDots.x0 * this.scale,
      y0: this.defDots.y0 * this.scale,
      dx: this.defDots.dx,
      dy: this.defDots.dy
    };

    this.dots.x =
      this.spacing + this.dots.x0 + this.dots.dx * (1 - this.g) - this.currentX;
    this.dots.y = this.dots.y0 + this.dots.dy * (1 - this.g) - this.currentY;

    this.spacing = this.parent.spacing;
    this.canvas.width = 989 * this.scale;
    this.canvas.height = 989 * this.scale;
    this.context.save();
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.context.rotate((this.rotate * Math.PI) / 180);
    this.context.drawImage(
      this.image,
      -this.canvas.width / 2,
      -this.canvas.height / 2,
      this.canvas.width,
      this.canvas.height
    );
    this.context.restore();
  }

  newTick() {
    this.g = this.parent.g;
    this.dots.x =
      this.spacing + this.dots.x0 + this.dots.dx * (1 - this.g) - this.currentX;
    this.dots.y = this.dots.y0 + this.dots.dy * (1 - this.g) - this.currentY;
  }

  tick() {
    this.animated = true;
    this.dots.x = this.spacing + this.dots.x0 - this.currentX;
    this.dots.y = this.dots.y0 - this.currentY;
  }

  tl = () => {
    const tl = new TimelineLite();
    tl.to(this.attrs, 0.5, { opacity: 1 }, '0');
    tl.to(this.attrs, 1, { dx: 0, dy: 0 }, '0');
    return tl;
  }

  draw() {
    const { spacing, currentX, currentY, scale } = this;
    const { x, y, dx, dy } = this.attrs;
    // console.log(
    //   'spacing', spacing,
    //   'currentX', currentX,
    //   'currentY', currentY,
    //   'scale', scale,
    //   'x', x, 'y', y, 'dx', dx, 'dy', dy
    // )
    this.parent.context.drawImage(this.canvas,
      spacing - currentX + (x + dx) * scale,
      (y + dy) * scale - currentY
    );
  }
}

class GradientBlock {
  constructor(opts) {
    Object.keys(opts).forEach(opt => this[opt] = opts[opt]);
    this.context = this.parent.context;
    this.scale = this.parent.scale;

    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;
    this.spacing = this.parent.spacing;
    this.alpha = 0;
    this.request = false;

    this.triggered = false;
    this.animated = false;
    this.k = 0;
    this.kStep = 1 / 15;
    this.g = 1;

    this.delay = 450;

    this.init();

    this.tl = new TimelineLite({ paused: true, onStart: () => this.request = true, onComplete: this.request = false });
    this.gradients.forEach(gradient => this.tl.add(gradient.tl(), '0'));

    this.hoverTl = new TimelineLite({ paused: true });
    this.hoverTl.to(this.gradients[0].attrs, 1, { opacity: 0 });
  }

  init() {
    this.gradients = [];
    const { i } = this;
    this.positions.forEach((position, j) => {
      const { image } = this;
      const [x0, y0] = position;
      const rotate = GRADIENT.rotations[i][j];
      const [dx, dy] = GRADIENT.offsets[rotate];
      const gradient = new Gradient({
        parent: this, rotate, x0, y0, dx, dy, image
      })
      this.gradients.push(gradient);
    })
  }

  handleResize() {
    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.scale = this.parent.scale;
    this.spacing = this.parent.spacing;

    this.gradients.forEach(gradient => {
      gradient.handleResize();
    });
  }

  updateXY() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;
    for (let i = 0; i < this.gradients.length; i += 1) {
      this.gradients[i].updateXY();
    }
  }
  draw() {
    for (let i = 0; i < this.gradients.length; i += 1) {
      this.gradients[i].draw();
    }
  }

  untrigger = () => {
    this.triggered = false;
    this.tl.reverse();
  }

  trigger = () => {
    this.tl.play();
    for (let i = 0; i < this.parent.gradients.length; i += 1) {
      if (i !== this.i) {
        if (!((this.i === 0 && i === 1) || (this.i === 1 && i === 0))) {
          this.parent.gradients[i].untrigger();
        }
      }
    }
  }

  render() {
    const { opacity } = this.gradients[0].attrs;
    if (opacity >= 0) {
      this.context.save();
      this.context.globalAlpha = opacity;
      this.draw();
      this.context.restore();
      this.request = true;
    } else if (opacity === 1) {
      this.draw();
      this.request = false;
    }
  }
}

class Gradients {
  constructor({ images, ...opts }) {
    this.images = images;
    window.gradients = this;
    window.trigger = this.trigger.bind(this);
    this.parent = opts.parent;
    this.scale = this.parent.scale;
    this.spacing = this.parent.spacing;
    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.canvas = document.querySelector('canvas.background__shines');
    this.canvas.width = this.windowWidth;
    this.canvas.height = this.windowHeight;
    this.context = this.canvas.getContext('2d');
    this.context.globalAlpha = 1;

    this.request = false;
  }

  isTriggered = (i) => {
    return this.gradients[i].triggered;
  }

  init = (partnersHeight, commonsHeight) => {
    this.gradients = [];
    this.images.forEach((image, i) => {
      const positions = GRADIENT.positions[i];
      if (i === 6) {
        positions[0][1] += partnersHeight;
        positions[1][1] += partnersHeight;
      } else if (i === 7) {
        positions[0][1] += partnersHeight + commonsHeight;
        positions[1][1] += partnersHeight + commonsHeight;
      };
      const gradientBlock = new GradientBlock({ parent: this, i, positions, image })
      this.gradients.push(gradientBlock);
    });
  }

  trigger(index) {
    this.gradients[index].trigger();
  }

  updateXY() {
    this.currentX = this.parent.currentX / 10;
    this.currentY = this.parent.currentY;
    for (let i = 0; i < this.gradients.length; i += 1) this.gradients[i].updateXY();
  }

  handleResize() {
    this.scale = this.parent.scale;
    this.spacing = this.parent.spacing;
    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.canvas.width = this.windowWidth;
    this.canvas.height = this.windowHeight;

    for (let i = 0; i < this.gradients.length; i += 1) {
      this.gradients[i].handleResize();
    }
  }

  render() {
    this.context.clearRect(0, 0, this.windowWidth, this.windowHeight);
    let request = false;

    for (let i = 0; i < this.gradients.length; i += 1) {
      this.gradients[i].render();
      request = request || this.gradients[i].request;
    }

    this.request = request;
  }
}

export default Gradients;
