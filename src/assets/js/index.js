/* eslint-disable no-param-reassign */
/* global document, window, Image */

/**
 * 1000px       - ширина канваса
 * 10 процентов - ширина отступа
 * 32 процента  - ширина ромба
 * 16 процентов - ширина линии
 */

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
function renderSideLinesWork(canvas, w, h) {
  const context = canvas.getContext('2d');

  context.strokeStyle = 'red';
  context.lineWidth = 2;
  const dy = h / 20;

  context.moveTo(w / 2 - dy + 10, dy);
  context.lineTo(w / 2 + dy - 10, dy);
  context.moveTo(w / 2 - dy + 10, dy + 25);
  context.lineTo(w / 2 + dy - 10, dy + 25);
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

class LogoRhombus {
  constructor(opts) {
    this.scale = opts.scale;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 320 * this.scale;
    this.canvas.height = 320 * this.scale;

    this.logoImage = opts.logoImage;
    this.render();
  }

  render() {
    renderLineRhombus(this.canvas, this.canvas.width, this.canvas.height, 0, 0);
    renderImage(this.canvas, this.logoImage);
  }
}

class WorkRhombus {
  constructor(opts) {
    this.scale = opts.scale;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 320 * this.scale;
    this.canvas.height = 510 * this.scale;

    // Картинка обязательно 1х1
    this.image = opts.image;
    this.imagePattern = getPattern(
      this.canvas,
      this.image,
      this.canvas.width,
      this.canvas.width
    );

    // this.upperImage = opts.upperImage;
    // this.downImage = opts.downImage;

    this.render();
  }

  render() {
    this.canvas.getContext('2d').beginPath();
    renderLineRhombus(this.canvas, this.canvas.width, this.canvas.width, 0, 0);
    renderFillImage(this.canvas, this.imagePattern);
    this.canvas.getContext('2d').beginPath();
    renderSideLinesWork(this.canvas, this.canvas.width, this.canvas.height);

    this.canvas.getContext('2d').beginPath();
    renderLineRhombus(
      this.canvas,
      160 * this.scale,
      160 * this.scale,
      80 * this.scale,
      350 * this.scale
    );
    renderSideLines(
      this.canvas,
      160 * this.scale,
      160 * this.scale,
      80 * this.scale,
      350 * this.scale
    );
  }
}

class ShowRhombus {
  constructor(opts) {
    this.scale = opts.scale;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 212.5 * this.scale;
    this.canvas.height = this.canvas.width;

    this.image = opts.image;
    this.imagePattern = getPattern(
      this.canvas,
      this.image,
      this.canvas.width,
      this.canvas.height
    );

    this.render();
  }

  render() {
    this.canvas.getContext('2d').beginPath();
    renderLineRhombus(this.canvas, this.canvas.width, this.canvas.width, 0, 0);
    renderFillImage(this.canvas, this.imagePattern);
  }
}

class FirstBlock {
  constructor(opts) {
    this.scale = opts.scale;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1000 * this.scale;
    this.canvas.height = 828 * this.scale;
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
      this.rhombus = new LogoRhombus({
        logoImage: this.logoImage,
        scale: this.scale
      });
      this.render();
      that.ready();
    };
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(
      this.rhombus.canvas,
      100 * this.scale,
      100 * this.scale
    );
  }
}

class WorkBlock {
  constructor(opts) {
    this.scale = opts.scale;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1000 * this.scale;
    this.canvas.height = 990 * this.scale;
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
          this.workRhombus = new WorkRhombus({
            image: this.images[i],
            scale: this.scale
          });
          this.render();
          that.ready();
        }
      };
    }
  }

  render() {
    if (this.index % 2 === 0) {
      this.context.drawImage(
        this.workRhombus.canvas,
        580 * this.scale,
        240 * this.scale
      );
    } else {
      this.context.drawImage(
        this.workRhombus.canvas,
        100 * this.scale,
        240 * this.scale
      );
    }
  }
}

class ShowBlock {
  constructor(opts) {
    this.scale = opts.scale;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1000 * this.scale;
    this.context = this.canvas.getContext('2d');

    this.imagesSrc = opts.images;
    this.images = [1];
    this.text = opts.text;

    this.rhombuses = [];
    this.lines = [];
  }

  init(that) {
    this.prepareImages(that);
  }

  createLines() {
    this.lines.push([]);
    for (let i = 0, j = 0, k = 0; i < this.rhombuses.length; i += 1) {
      if (j % 2 === 0 && k === 4) {
        this.lines.push([]);
        j += 1;
        k = 0;
      }
      if (j % 2 !== 0 && k === 3) {
        this.lines.push([]);
        j += 1;
        k = 0;
      }
      this.lines[j].push(this.rhombuses[i]);

      k += 1;
    }

    this.canvas.height =
      this.rhombuses[0].rhombus.canvas.height * this.lines.length +
      60 * (this.lines.length - 1) * this.scale;
  }

  createRhombuses() {
    for (let i = 1; i < this.images.length; i += 1) {
      this.rhombuses.push({
        rhombus: new ShowRhombus({ image: this.images[i], scale: this.scale }),
        text: 'test'
      });
    }
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
          this.createRhombuses();
          this.createLines();
          this.render();
          that.ready();
        }
      };
    }
  }

  render() {
    for (let i = 0; i < this.lines.length; i += 1) {
      const marginX =
        (this.canvas.width -
          this.lines[i].length * this.rhombuses[0].rhombus.canvas.width -
          (this.lines[i].length - 1) * 30 * this.scale) /
        2;
      const marginY =
        i * (60 * this.scale + this.rhombuses[0].rhombus.canvas.height);
      for (let j = 0; j < this.lines[i].length; j += 1) {
        this.canvas
          .getContext('2d')
          .drawImage(
            this.lines[i][j].rhombus.canvas,
            marginX +
              j * (this.lines[i][j].rhombus.canvas.width + 30 * this.scale),
            marginY
          );
      }
    }
  }
}

class Blocks {
  constructor(opts) {
    this.scale = opts.scale;
    this.parent = opts.parent;

    this.canvas = document.querySelector('canvas.blocks');
    this.canvas.width = 1000 * this.scale;
    this.canvas.height = 10000;
    this.context = this.canvas.getContext('2d');

    this.blocks = [
      1,
      new FirstBlock({ scale: this.scale }),
      new WorkBlock({
        index: 1,
        images: [
          'https://i.pinimg.com/originals/cb/13/16/cb13165145b7dcc4c3900f82b4ba365b.jpg'
        ],
        scale: this.scale
      }),
      new WorkBlock({
        index: 2,
        images: [
          'https://cs11.pikabu.ru/post_img/big/2018/04/26/11/152476593216002878.jpg'
        ],
        scale: this.scale
      }),
      new WorkBlock({
        index: 3,
        images: [
          'https://i.pinimg.com/originals/b8/21/dd/b821dde8be37d2b0dded5dc90c3d2bfa.jpg'
        ],
        scale: this.scale
      }),
      new WorkBlock({
        index: 4,
        images: [
          'https://i.pinimg.com/originals/cb/13/16/cb13165145b7dcc4c3900f82b4ba365b.jpg'
        ],
        scale: this.scale
      }),
      new ShowBlock({
        images: [
          'https://i.pinimg.com/originals/cb/13/16/cb13165145b7dcc4c3900f82b4ba365b.jpg',
          'https://i.pinimg.com/originals/cb/13/16/cb13165145b7dcc4c3900f82b4ba365b.jpg',
          'https://i.pinimg.com/originals/cb/13/16/cb13165145b7dcc4c3900f82b4ba365b.jpg',
          'https://i.pinimg.com/originals/cb/13/16/cb13165145b7dcc4c3900f82b4ba365b.jpg',
          'https://i.pinimg.com/originals/cb/13/16/cb13165145b7dcc4c3900f82b4ba365b.jpg',
          'https://i.pinimg.com/originals/cb/13/16/cb13165145b7dcc4c3900f82b4ba365b.jpg',
          'https://i.pinimg.com/originals/cb/13/16/cb13165145b7dcc4c3900f82b4ba365b.jpg',
          'https://i.pinimg.com/originals/cb/13/16/cb13165145b7dcc4c3900f82b4ba365b.jpg',
          'https://i.pinimg.com/originals/cb/13/16/cb13165145b7dcc4c3900f82b4ba365b.jpg',
          'https://i.pinimg.com/originals/cb/13/16/cb13165145b7dcc4c3900f82b4ba365b.jpg',
          'https://i.pinimg.com/originals/cb/13/16/cb13165145b7dcc4c3900f82b4ba365b.jpg',
          'https://i.pinimg.com/originals/cb/13/16/cb13165145b7dcc4c3900f82b4ba365b.jpg'
        ],
        text: [
          'test',
          'test',
          'test',
          'test',
          'test',
          'test',
          'test',
          'test',
          'test',
          'test',
          'test'
        ],
        scale: this.scale
      })
    ];
    this.prepareBlocks();

    window.openWork = this.openWork.bind(this);
  }

  openWork(id) {
    console.log(this.blocks[id]);
  }

  prepareBlocks() {
    for (let i = 1; i < this.blocks.length; i += 1) {
      this.blocks[i].init(this);
    }
  }

  ready() {
    this.blocks[0] += 1;
    if (this.blocks[0] === this.blocks.length) {
      this.parent.ready();
      this.render();
    }
  }

  render() {
    let y = 0;

    for (let i = 1; i < this.blocks.length; i += 1) {
      if (i === 6) {
        y += 380 * this.scale;
      }
      this.context.drawImage(this.blocks[i].canvas, 0, y);
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
