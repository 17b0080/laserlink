/* eslint-disable no-undef */
class Gradient {
  constructor(opts) {
    this.parent = opts.parent;
    this.scale = this.parent.scale;
    this.image = opts.image;
    this.spacing = this.parent.spacing;
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.dots = {
      x: opts.x0 + opts.dx,
      y: opts.y0 + opts.dy,
      x0: opts.x0,
      y0: opts.y0,
      dx: opts.dx,
      dy: opts.dy
    };

    this.windowHeight = this.parent.windowHeight;
    this.imageWidth = this.image.width;
    this.imageHeight = this.image.height;

    this.canvas = document.createElement('canvas');
    this.canvas.width = 989 * this.scale;
    this.canvas.height = 989 * this.scale;

    this.context = this.canvas.getContext('2d');
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.context.rotate((opts.rotate * Math.PI) / 180);
    this.context.drawImage(
      this.image,
      -this.canvas.width / 2,
      -this.canvas.height / 2,
      this.canvas.width,
      this.canvas.height
    );
  }

  updateXY() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;
  }

  handleResize() {
    this.scale = this.parent.scale;
    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;

    this.spacing = this.parent.spacing;
    this.canvas.width = this.windowWidth;
    this.canvas.height = this.windowHeight;
    this.canvas
      .getContext('2d')
      .drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
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

  draw() {
    this.parent.context.drawImage(this.canvas, this.dots.x, this.dots.y);
  }
}

class GradientBlock {
  constructor(opts) {
    this.parent = opts.parent;
    this.context = this.parent.context;
    this.scale = this.parent.scale;

    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;
    this.spacing = this.parent.spacing;

    this.images = opts.images;

    this.dots = opts.dots;

    this.gradients = [
      new Gradient({
        parent: this,
        rotate: 0,
        x0: this.dots.x0,
        y0: this.dots.y0,
        dx: -1000,
        dy: -1000,
        image: this.images[0]
      }),
      new Gradient({
        parent: this,
        rotate: 180,
        x0: this.dots.x1,
        y0: this.dots.y1,
        dx: -1000,
        dy: -1000,
        image: this.images[1]
      }),
      // revert
      new Gradient({
        parent: this,
        rotate: 90,
        x0: this.dots.x2,
        y0: this.dots.y2,
        dx: 1000,
        dy: -1000,
        image: this.images[2]
      })
    ];

    this.triggered = false;
    this.animated = false;
    this.k = 0;
    this.kStep = 1 / 60;
    this.g = 1;
  }

  updateXY() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.gradients[0].updateXY();
    this.gradients[1].updateXY();
    this.gradients[2].updateXY();
  }

  tick() {
    this.gradients[0].tick();
    this.gradients[1].tick();
    this.gradients[2].tick();
  }

  newTick() {
    this.k += 0.01;
    if (this.k > 1) {
      this.k = 1;
      this.animated = true;
    }
    this.g = 1 - (1 - this.k) ** 5;

    this.gradients[0].newTick();
    this.gradients[1].newTick();
    this.gradients[2].newTick();
  }

  draw() {
    this.gradients[0].draw();
    this.gradients[1].draw();
    this.gradients[2].draw();
  }

  render() {
    if (this.triggered === true && this.animated === false) {
      this.newTick();
      this.draw();
    } else if (this.animated === true) {
      this.tick();
      this.draw();
    }
  }
}

class Gradients {
  constructor(opts) {
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
    this.context.globalAlpha = 0.5;

    this.imagesStates = 0;
    this.images = [];

    this.initImages();
  }

  initImages() {
    this.images.push(document.createElement('img')); // gradient 1
    this.images.push(document.createElement('img')); // gradient 2
    this.images.push(document.createElement('img')); // gradient 3
    this.images.push(document.createElement('img')); // gradient 4

    for (let i = 0; i < this.images.length; i += 1) {
      this.images[i].onload = () => {
        this.imagesStates += 1;
        if (this.imagesStates === this.images.length) {
          this.init();
        }
      };
    }

    this.images[0].src =
      'http://192.168.0.16:8000/assets/img/Gradients/gradient1.png';
    this.images[1].src =
      'http://192.168.0.16:8000/assets/img/Gradients/gradient2.png';
    this.images[2].src =
      'http://192.168.0.16:8000/assets/img/Gradients/gradient3.png';
    this.images[3].src =
      'http://192.168.0.16:8000/assets/img/Gradients/gradient4.png';
    this.init();
    this.parent.ready();
  }

  init() {
    this.gradients = [
      new GradientBlock({
        parent: this,
        dots: {
          x0: 55,
          y0: -132,
          x1: -284,
          y1: -30,
          x2: -299.5,
          y2: -133.5
        },
        images: [this.images[3], this.images[3], this.images[3]]
      }),
      new GradientBlock({
        parent: this,
        dots: {
          x0: 64,
          y0: 777,
          x1: -300,
          y1: 860,
          x2: -245,
          y2: 760
        },
        images: [this.images[1], this.images[1], this.images[1]]
      }),
      new GradientBlock({
        parent: this,
        dots: {
          x0: 188,
          y0: 2264,
          x1: -300,
          y1: 2335,
          x2: -178,
          y2: 2203
        },
        images: [this.images[1], this.images[1], this.images[1]]
      })
    ];
  }

  trigger(index) {
    this.gradients[index].triggered = true;
  }

  updateXY() {
    this.currentX = this.parent.currentX / 10;
    this.currentY = this.parent.currentY;
    for (let i = 0; i < this.gradients.length; i += 1) {
      this.gradients[i].updateXY();
    }
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
    for (let i = 0; i < this.gradients.length; i += 1) {
      this.gradients[i].render();
    }
  }
}

export default Gradients;
