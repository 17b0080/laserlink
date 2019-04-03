/* eslint-disable no-param-reassign */
/* global document, window, Image */

function renderLineRhombus(canvas, w, h, dx, dy) {
  const context = canvas.getContext('2d');

  context.strokeStyle = 'white';
  context.lineWidth = 2;

  // context.lineWidth в XY для того, чтобы стыки линий не выходили за canvas
  context.moveTo(dx + w / 2, dy + context.lineWidth);
  context.lineTo(dx + w - context.lineWidth, dy + h / 2);
  context.lineTo(dx + w / 2, dy + h - context.lineWidth);
  context.lineTo(dx + context.lineWidth, dy + h / 2);
  context.lineTo(dx + w / 2, dy + context.lineWidth);
  context.stroke();
}
function renderSideLines(canvas, w, h, dx, dy) {
  const context = canvas.getContext('2d');

  context.strokeStyle = 'white';
  context.lineWidth = 2;

  // context.lineWidth в XY для того, чтобы стыки линий не выходили за canvas
  context.moveTo(dx + 0 + w / 10, dy + h / 2);
  context.lineTo(dx + w / 2, dy + h / 10);
  context.moveTo(dx + w / 2, dy + h - h / 10);
  context.lineTo(dx + w - w / 10, dy + h / 2);
  context.stroke();
}
function renderFillImage(canvas, pattern) {
  const context = canvas.getContext('2d');

  context.fillStyle = pattern;
  context.fill();
}

function renderImage(canvas, image) {
  const context = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  let destinationWidth;
  let destinationHeight;

  if (image.width > image.height) {
    destinationWidth = (w * 3.3) / 6;
    destinationHeight = (image.height * destinationWidth) / image.width;
  } else if (image.height > image.width) {
    destinationHeight = (h * 3.3) / 6;
    destinationWidth = (image.width * destinationHeight) / image.height;
  } else if (image.height === image.width) {
    // eslint-disable-next-line no-multi-assign
    destinationHeight = destinationWidth = (w * 3.3) / 6;
  }

  context.drawImage(
    image,
    (w - destinationWidth) / 2,
    (h - destinationHeight) / 2,
    destinationWidth,
    destinationHeight
  );
}

function getPattern(canvas, image, w, h) {
  const context = canvas.getContext('2d');

  context.drawImage(image, 0, 0, w, h);
  const pattern = context.createPattern(canvas, 'repeat');
  context.clearRect(0, 0, w, h);

  return pattern;
}

class WorkRhombus {
  constructor(opts) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 284;
    this.canvas.height = 400;

    // Картинка обязательно 1х1
    this.image = opts.image;
    this.imagePattern = getPattern(this.canvas, this.image, 284, 284);

    // this.upperImage = opts.upperImage;
    // this.downImage = opts.downImage;

    this.render();
  }

  render() {
    this.canvas.getContext('2d').beginPath();
    renderLineRhombus(this.canvas, 284, 284, 0, 0);
    renderFillImage(this.canvas, this.imagePattern);

    renderLineRhombus(this.canvas, 100, 100, 92, 300);
    renderSideLines(this.canvas, 100, 100, 92, 300);
  }
}

class LogoRhombus {
  constructor(opts) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 284;
    this.canvas.height = 284;

    this.logoImage = opts.logoImage;
    this.render();
  }

  render() {
    renderLineRhombus(this.canvas, 284, 284, 0, 0);
    renderImage(this.canvas, this.logoImage);
  }
}

class ShowRhombus {
  constructor(opts) {
    this.canvas = document.createElement('canvas');
    this.w = this.canvas.width = opts.width;
    this.h = this.canvas.height = opts.height;
    this.context = this.canvas.getContext('2d');

    this.image = opts.image;
    this.rhombus = new LineRhombus({ width: this.w, height: this.h });
  }
}

class FirstBlock {
  constructor(opts) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1024;
    this.canvas.height = 812;
    this.context = this.canvas.getContext('2d');
  }

  init(that) {
    this.prepareImages(that);
  }

  prepareImages(that) {
    this.logoImage = new Image();
    this.logoImage.src =
      'https://pp.userapi.com/c845019/v845019801/1de1e1/hVOnZUfaJSU.jpg';
    this.logoImage.onload = () => {
      this.rhombus = new LogoRhombus({ logoImage: this.logoImage });
      this.render();
      that.ready();
    };
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(this.rhombus.canvas, 142, 194);
  }
}

class WorkBlock {
  constructor(opts) {
    window.workblock = this;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1024;
    this.canvas.height = 716;
    this.context = this.canvas.getContext('2d');

    this.index = opts.index;

    this.imagesSrc = opts.images;
    this.images = [1];
  }

  init(that) {
    this.prepareImages(that);
  }

  prepareImages(that) {
    for (let i = 0; i < this.imagesSrc.length; i += 1) {
      const image = new Image();
      image.src = this.imagesSrc[i];
      this.images.push(image);
    }

    for (let i = 1; i < this.images.length; i += 1) {
      this.images[i].onload = () => {
        this.images[0] += 1;
        if (this.images[0] === this.images.length) {
          this.workRhombus = new WorkRhombus({ image: this.images[1] });
          this.render();
          that.ready();
        }
      };
    }
  }

  render() {
    // this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.index % 2 === 0) {
      this.context.drawImage(this.workRhombus.canvas, 458, 316);
    } else {
      this.context.drawImage(this.workRhombus.canvas, 142, 316);
    }
  }
}

class ShowBlock {
  constructor(opts) {
    this.marginY = 512;
    this.shows = opts.shows;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1024;

    this.prepareLines(this.initLines());
    window.showBlock = this;
    this.h = this.canvas.height = opts.height;
  }

  initLines() {
    let lines = [];
    for (let i = 0, j = 0, c = 0; i < this.shows.length; i++) {
      if (j == 0) {
        lines.push([]);
      }
      if (c % 2 == 0) {
        lines[c].push(this.shows[i]);
        j++;
        if (j == 4) {
          j = 0;
          c++;
        }
      } else {
        lines[c].push(this.shows[i]);
        j++;
        if (j == 3) {
          j = 0;
          c++;
        }
      }
    }
    return lines;
  }
  prepareLines(lines) {
    this.lines = [];
    for (let i = 0; i < lines.length; i++) {
      this.lines.push({
        shows: lines[i],
        margin:
          1024 - 219 * lines[i].length - (29.6 * (lines[i].length - 1)) / 2,
        spaceBetweenLines: 29.6
      });
    }
  }

  render() {
    for (let i = 0; i < this.lines.length; i++) {
      for (let j = 0; j < this.lines[i]; j++) {}
    }
  }
}

class Blocks {
  constructor() {
    window.blocks = this;
    this.canvas = document.querySelector('canvas.blocks');
    this.canvas.width = 1024;
    this.canvas.height = 10000;
    this.context = this.canvas.getContext('2d');

    this.blocks = [
      1,
      new FirstBlock(),
      new WorkBlock({
        index: 1,
        images: [
          'https://i.pinimg.com/originals/cb/13/16/cb13165145b7dcc4c3900f82b4ba365b.jpg'
        ]
      }),
      new WorkBlock({
        index: 2,
        images: [
          'https://cs11.pikabu.ru/post_img/big/2018/04/26/11/152476593216002878.jpg'
        ]
      }),
      new WorkBlock({
        index: 3,
        images: [
          'https://i.pinimg.com/originals/b8/21/dd/b821dde8be37d2b0dded5dc90c3d2bfa.jpg'
        ]
      }),
      new WorkBlock({
        index: 4,
        images: [
          'https://i.pinimg.com/originals/cb/13/16/cb13165145b7dcc4c3900f82b4ba365b.jpg'
        ]
      })
    ];
    this.prepareBlocks();
  }

  prepareBlocks() {
    for (let i = 1; i < this.blocks.length; i += 1) {
      this.blocks[i].init(this);
    }
  }

  ready() {
    this.blocks[0] += 1;
    if (this.blocks[0] === this.blocks.length) {
      this.render();
    }
  }

  render() {
    let y = 0;
    //  х - центровка
    let x = 0;

    if (window.innerWidth > 1024) {
      x = (window.innerWidth - 1024) / 2;
    }
    document.querySelector(
      '.content'
    ).style.transform = `translate(${x}px, 0px)`;

    for (let i = 1; i < this.blocks.length; i += 1) {
      this.context.drawImage(this.blocks[i].canvas, x, y);
      y += this.blocks[i].canvas.height;
    }
  }
}

export default Blocks;
// пересечкние линий - начало градиентов
// выполненные работы скролл к центру ромба. Если у блока есть градиент, то лучше к пересечению линий

// Перывй блок - 2 линии, градиенты, х1 снизу

// Блоки с работой, полоса сверху. Деляится на 2 типа: полоса справа, полоса слева.
// Если полоса справа, то градиент

// Блок примера работ с градиентом и  h2 'сотрудничество'

// Блок партнеры градиенрт, аналог блока сотрудничества

// Блок продукция - аналог примера работ без линий, только градинт
