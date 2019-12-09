/* globals window, document */
import FirstBlock from '../partials/firstBlock';
import WorkBlock from '../partials/workBlock';
import ShowLines from '../partials/showLines';
import PartnerLines from '../partials/partnerLines';
import ProductLines from '../partials/productLines';
import { LOGO, WORK, PARTNER, SHOW, PRODUCT } from '../settings';

class Blocks {
  constructor({ text, images, ...opts }) {
    this.gradients = opts.parent.gradients;
    this.images = images;
    [this.text, this.wA] = text;

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
    // this.context.imageSmoothingEnabled = false;

    // Движение
    this.clientX = 0;
    this.currentX = this.clientX;
    this.clientY = window.pageYOffset;
    this.currentY = this.clientY;

    this.request = false;

    this.init();
  }

  getHeight(blockName) {
    return this[blockName].height;
  }

  handleMouseOverWork(i) {
    const work = this.works[i];
    work.main.attrs.hovered = true;
    if (work.attrs.animated) {
      work.main.attrs.rendered.hover = false;
      work.hoverTl.play();
      this.gradients.gradients[i + 1].hoverTl.play();
    }
  }

  handleMouseOutWork(i) {
    const work = this.works[i];
    work.main.attrs.hovered = false;
    if (work.attrs.animated) {
      work.main.attrs.rendered.hover = false;
      work.hoverTl.reverse();
      this.gradients.gradients[i + 1].hoverTl.reverse();
    }
  }

  handleMouseOverShow(i, j) {
    const rhombus = this.showLines.showBlocks[i].rhombuses[j];
    rhombus.attrs.hovered = true;
    if (rhombus.attrs.rendered.image) {
      rhombus.attrs.rendered.hover = false;
      rhombus.hoverTl.play();
    }

  }

  handleMouseOutShow(i, j) {
    const rhombus = this.showLines.showBlocks[i].rhombuses[j];
    rhombus.attrs.hovered = false;
    if (rhombus.attrs.rendered.image) {
      rhombus.attrs.rendered.hover = false;
      rhombus.hoverTl.reverse();
    }

  }

  handleMouseOverProduct(i, j) {
    const rhombus = this.productLines.productBlocks[i].rhombuses[j];
    rhombus.attrs.hovered = true;
    if (rhombus.attrs.rendered.image) {
      rhombus.attrs.rendered.hover = false;
      rhombus.hoverTl.play();
    }
  }

  handleMouseOutProduct(i, j) {
    const rhombus = this.productLines.productBlocks[i].rhombuses[j];
    rhombus.attrs.hovered = false;
    if (rhombus.attrs.rendered.image) {
      rhombus.attrs.rendered.hover = false;
      rhombus.hoverTl.reverse();
    }
  }

  init() {
    this.first = new FirstBlock({
      gradients: this.gradients,
      text: [
        this.text[0],
        this.text[1],
        this.text[2]
      ],
      parent: this,
      context: this.context,
      dx: LOGO.x,
      dy: LOGO.y,
      image: this.images.logo,
      gradientIndex: 0
    });

    // 1 - большая
    // 2 - снизу
    // 3 - сверху
    // 4 - шум
    for (let i = 0, j = 4; i < 4; i += 1, j += 2) {
      if (this.works === undefined) this.works = [];
      const work = new WorkBlock({
        radialGradient: WORK.radial.gradients[i],
        text: [
          this.text[j],
          this.text[j + 1],
          this.wA[i]
        ],
        gradients: this.gradients,
        i,
        parent: this,
        context: this.context,
        dx: WORK.positions[i][0],
        dy: WORK.positions[i][1],
        image: this.images.works[i],
      });
      this.works.push(work);
    }

    this.partnerLines = new PartnerLines({
      text: [
        this.text[12],
        this.text[13]
      ],
      gradients: this.gradients,
      parent: this,
      gradientIndex: 4,
      dy: PARTNER.y,
      rhombusWidth: 220,
      rhombusHeight: 220,
      spaceBetweenRhombuses: 36,
      textHeight: 47,
      images: this.images.partners,
      noise: this.images.hover
    });

    // Шоу
    this.showLines = new ShowLines({
      text: [
        this.text[14],
        this.text[15]
      ],
      gradients: this.gradients,
      parent: this,
      gradientIndex: 3,
      dy: SHOW.y + this.partnerLines.height,
      rhombusWidth: 220,
      rhombusHeight: 220,
      spaceBetweenRhombuses: 36,
      textHeight: 47,
      images: this.images.shows,
      showMoreHover: this.images.showMoreHover
    });

    this.productLines = new ProductLines({
      text: [
        this.text[16],
        this.text[17]
      ],
      gradients: this.gradients,
      parent: this,
      gradientIndex: 5,
      dy: PRODUCT.y + this.partnerLines.height + this.showLines.height,
      rhombusWidth: 283,
      rhombusHeight: 283,
      spaceBetweenRhombuses: 50,
      textHeight: 71,
      images: this.images.products,
      noise: this.images.hover,
      showMoreHover: this.images.showMoreHover
    });

    this.parent.onBlockReady();
  }

  checkRequest() {
    let workRequest = false;

    for (let i = 0; i < this.works.length; i += 1) {
      workRequest = workRequest || this.works[i].request;
    }

    this.request =
      this.first.request ||
      workRequest ||
      this.showLines.request ||
      this.partnerLines.request ||
      this.productLines.request;
  }

  updateXY() {
    this.currentX = this.parent.currentX / 10;
    this.currentY = this.parent.currentY;

    this.first.updateXY();

    for (let i = 0; i < this.works.length; i += 1) {
      this.works[i].updateXY();
    }

    this.showLines.updateXY();
    this.partnerLines.updateXY();
    this.productLines.updateXY();
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

    for (let i = 0; i < this.works.length; i += 1) {
      this.works[i].handleResize();
    }

    this.showLines.handleResize();
    this.partnerLines.handleResize();
    this.productLines.handleResize();
  }

  render() {
    this.first.render();
    for (let i = 0; i < this.works.length; i += 1) {
      this.works[i].render();
    }

    this.showLines.render();
    this.partnerLines.render();
    this.productLines.render();

    this.checkRequest();
  }

  scenes = () => {
    const scenes = [];
    this.works.forEach(work => {
      scenes.push(work.scene())
    });
    scenes.push(this.partnerLines.scene());
    scenes.push(this.showLines.scene());
    scenes.push(this.productLines.scene());
    return scenes;
  }
}

export default Blocks;
