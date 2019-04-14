/* globals window, document */
import { FirstBlock, WorkBlock, Block } from './rhombus';

class Blocks {
  constructor(opts) {
    window.Blocks = this;
    window.handleMouseOverWork = this.handleMouseOverWork.bind(this);
    window.handleMouseOutWork = this.handleMouseOutWork.bind(this);
    this.parent = opts.parent;
    this.scale = this.parent.scale;
    this.spacing = this.parent.spacing;

    // Выделение памяти под переменные
    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.windowHeight / 2;

    // Создание холста
    this.canvas = document.querySelector('canvas.background__blocks');
    this.canvas.width = this.windowWidth;
    this.canvas.height = this.windowHeight;
    this.context = this.canvas.getContext('2d');
    this.context.imageSmoothingEnabled = false;

    // Движение
    this.clientX = 0;
    this.currentX = this.clientX;
    this.clientY = window.pageYOffset;
    this.currentY = this.clientY;

    this.request = false;

    this.imagesStates = 0;
    this.images = [];

    this.showImages = opts.showImages;
    this.partnerImages = opts.partnerImages;

    this.initImages();
  }

  handleMouseOverWork(index) {
    this.works[index].side.hovered = true;
  }

  handleMouseOutWork(index) {
    this.works[index].side.hovered = false;
  }

  init() {
    this.first = new FirstBlock({
      parent: this,
      context: this.context,
      dx: 93,
      dy: 205.5,
      image: this.images[0],
      gradientIndex: 0
    });

    // 1 - большая
    // 2 - сверху
    // 3 - снизу
    // 4 - шум
    this.work1 = new WorkBlock({
      parent: this,
      context: this.context,
      dx: 107.5,
      dy: 1191,
      images: [this.images[1], this.images[5], this.images[0], this.images[2]],
      gradientIndex: 1
    });
    this.work2 = new WorkBlock({
      parent: this,
      context: this.context,
      dx: 556.5,
      dy: 2009,
      images: [this.images[2], this.images[6], this.images[0], this.images[2]]
    });
    this.work3 = new WorkBlock({
      parent: this,
      context: this.context,
      dx: 111.5,
      dy: 2827,
      images: [this.images[3], this.images[7], this.images[0], this.images[2]],
      gradientIndex: 2
    });
    this.work4 = new WorkBlock({
      parent: this,
      context: this.context,
      dx: 556.5,
      dy: 3645,
      images: [this.images[4], this.images[8], this.images[0], this.images[2]]
    });

    // Подсчитаем количество линий
    this.showsHeight = 0;
    const showLines = [];
    this.shows = [];
    showLines.push([]); // пустая линия, подготовка
    for (let i = 0, j = 0, k = 0; i < this.showImages.length; i += 1) {
      if (k === 4) {
        showLines.push([]);
        j += 1;
        k = 0;
      }
      // i - обходим каждую картинку,
      // а значит и ромб
      showLines[j].push(this.images[i + 5]);
      k += 1;
    }
    for (let i = 0; i < showLines.length; i += 1) {
      const dx =
        1024 - showLines[i].length * 220 - (showLines[i].length - 1) * 36;
      this.shows.push(
        new Block({
          parent: this,
          type: 'show line',
          context: this.context,
          dy: 4593 + (47 + 220) * i,
          dx: (dx - 18) / 2,
          images: showLines[i]
        })
      );
    }
    if (this.showImages.length > 0) {
      this.showsHeight = showLines.length * 220 + (showLines.length - 1) * 47;
    }

    this.partnersHeight = 0;
    const partnersLines = [];
    this.partners = [];
    partnersLines.push([]); // пустая линия, подготовка
    for (let i = 0, j = 0, k = 0; i < this.partnerImages.length; i += 1) {
      if (k === 4) {
        partnersLines.push([]);
        j += 1;
        k = 0;
      }
      // i - обходим каждую картинку,
      // а значит и ромб
      partnersLines[j].push(this.images[5 + i + this.showImages.length]);
      k += 1;
    }
    for (let i = 0; i < partnersLines.length; i += 1) {
      const dx =
        1024 -
        partnersLines[i].length * 220 -
        (partnersLines[i].length - 1) * 36;
      this.partners.push(
        new Block({
          parent: this,
          type: 'show line',
          context: this.context,
          dy: 4593 + 872 + this.showsHeight + (47 + 220) * i,
          dx: (dx - 18) / 2,
          images: partnersLines[i]
        })
      );
    }
    if (this.partnerImages.length > 0) {
      this.partnersHeight =
        partnersLines.length * 220 + (partnersLines.length - 1) * 47;
    }
    this.works = [this.work1, this.work2, this.work3, this.work4];
    this.parent.ready();
  }

  initImages() {
    this.images.push(document.createElement('img')); // logo 0
    this.images.push(document.createElement('img')); // work 1
    this.images.push(document.createElement('img')); // work 2
    this.images.push(document.createElement('img')); // work 3
    this.images.push(document.createElement('img')); // work 4
    this.images.push(document.createElement('img')); // work 1 down
    this.images.push(document.createElement('img')); // work 2 down
    this.images.push(document.createElement('img')); // work 3 down
    this.images.push(document.createElement('img')); // work 4 down

    let j = 9;

    for (let i = 0; i < this.showImages.length; i += 1, j += 1) {
      this.images.push(document.createElement('img')); // show i
    }

    let k = j;

    for (let i = 0; i < this.partnerImages.length; i += 1, k += 1) {
      this.images.push(document.createElement('img')); // partner i
    }

    for (let i = 0; i < this.images.length; i += 1) {
      this.images[i].onload = () => {
        this.imagesStates += 1;
        if (this.imagesStates === this.images.length) {
          this.init();
        }
      };
    }

    // first - work[1-4]
    this.images[0].src =
      'https://ih0.redbubble.net/image.523026213.1540/stf,small,600x600.jpg';
    this.images[1].src =
      'https://pp.userapi.com/c852236/v852236114/f6a19/_8HOc7JZMIo.jpg';
    this.images[2].src =
      'https://ih0.redbubble.net/image.523026213.1540/stf,small,600x600.jpg';
    this.images[3].src =
      'https://ih0.redbubble.net/image.523026213.1540/stf,small,600x600.jpg';
    this.images[4].src =
      'https://ih0.redbubble.net/image.523026213.1540/stf,small,600x600.jpg';

    this.images[5].src = 'http://localhost:8000/assets/img/works/cube31px.png';
    this.images[6].src = 'http://localhost:8000/assets/img/works/stars31px.png';
    this.images[7].src =
      'http://localhost:8000/assets/img/works/dancer31px.png';
    this.images[8].src = 'http://localhost:8000/assets/img/works/laser31px.png';

    // show[1-i]
    for (let i = 9; i < this.images.length; i += 1) {
      this.images[i].src = this.showImages[i - 9]; // show i - 5
    }
    // partner[5-i]
    for (let i = j; i < this.images.length; i += 1) {
      this.images[i].src = this.partnerImages[i - j]; // show i - 5
    }
  }

  checkRequest() {
    this.request =
      this.first.request ||
      this.work1.request ||
      this.work2.request ||
      this.work3.request ||
      this.work4.request;
  }

  updateXY() {
    this.currentX = this.parent.currentX / 10;
    this.currentY = this.parent.currentY;

    this.first.updateXY();

    this.work1.updateXY();
    this.work2.updateXY();
    this.work3.updateXY();
    this.work4.updateXY();

    for (let i = 0; i < this.shows.length; i += 1) {
      this.shows[i].updateXY();
    }
    for (let i = 0; i < this.partners.length; i += 1) {
      this.partners[i].updateXY();
    }
  }

  handleResize() {
    this.scale = this.parent.scale;
    this.windowWidth = this.parent.windowWidth;
    this.halfWindowHeight = this.windowHeight / 2;
    this.windowHeight = this.parent.windowHeight;

    this.canvas.width = this.windowWidth;
    this.canvas.height = this.windowHeight;

    this.spacing = this.parent.spacing;

    this.first.handleResize();
    this.work1.handleResize();
    this.work2.handleResize();
    this.work3.handleResize();
    this.work4.handleResize();

    for (let i = 0; i < this.shows.length; i += 1) {
      this.shows[i].handleResize();
    }
  }

  render() {
    this.first.render();
    this.work1.render();
    this.work2.render();
    this.work3.render();
    this.work4.render();
    for (let i = 0; i < this.shows.length; i += 1) {
      this.shows[i].render();
    }
    for (let i = 0; i < this.partners.length; i += 1) {
      this.partners[i].render();
    }
    this.checkRequest();
  }
}

export default Blocks;

/**
 * blocks.render(); ->
 * -> block.render();
 * - - > (1)
 *
 *
 */
