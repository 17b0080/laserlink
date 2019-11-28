/* globals window, document */
import FirstBlock from '../partials/firstBlock';
import WorkBlock from '../partials/workBlock';
import ShowLines from '../partials/showLines';
import PartnerLines from '../partials/partnerLines';
import ProductLines from '../partials/productLines';
import { LOGO, WORK, PARTNER, SHOW, PRODUCT } from '../settings';

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
    // this.context.imageSmoothingEnabled = false;

    // Движение
    this.clientX = 0;
    this.currentX = this.clientX;
    this.clientY = window.pageYOffset;
    this.currentY = this.clientY;

    this.request = false;

    this.imagesStates = 0;
    this.images = [];

    // Картинки
    this.logoImage = undefined;
    this.workImages = [];
    this.hoverImage = undefined;
    this.showMoreHover = undefined;
    this.showImages = [];
    this.partnerImages = [];
    this.productImages = [];

    //
    this.logoImageSrc = opts.logoImageSrc;
    this.workImagesSrc = opts.workImagesSrc;
    this.hoverImageSrc = opts.hoverImageSrc;
    this.showMoreHoverSrc = opts.showMoreHoverSrc;
    this.showImagesSrc = opts.showImagesSrc;
    this.partnerImagesSrc = opts.partnerImagesSrc;
    this.productImagesSrc = opts.productImagesSrc;

    this.imagesReadyCounter = 0;
    this.imagesCounter =
      1 +
      this.workImagesSrc.length +
      1 +
      1 +
      this.showImagesSrc.length +
      this.partnerImagesSrc.length +
      this.productImagesSrc.length;

    this.initImages();
  }

  handleMouseOverWork(index) {
    console.log(`work ${index} hovered`)
  }

  handleMouseOutWork(index) {
    console.log(`work ${index} unhovered`)
  }

  handleMouseOverShow(i, j) {
    this.showLines.showBlocks[i].rhombuses[j].hovered = true;
    console.log(`show ${i} ${j} hovered`)
  }

  handleMouseOutShow(i, j) {
    this.showLines.showBlocks[i].rhombuses[j].hovered = false;
    console.log(`show ${i} ${j} unhovered`)
  }

  handleMouseOverProduct(i, j) {
    this.productLines.productBlocks[i].rhombuses[j].hovered = true;
    console.log(`product ${i} ${j} hovered`)
  }

  handleMouseOutProduct(i, j) {
    this.productLines.productBlocks[i].rhombuses[j].hovered = false;
    console.log(`product ${i} ${j} unhovered`)
  }

  init() {
    this.first = new FirstBlock({
      parent: this,
      context: this.context,
      dx: LOGO.x,
      dy: LOGO.y,
      image: this.logoImage,
      gradientIndex: 0
    });

    // 1 - большая
    // 2 - снизу
    // 3 - сверху
    // 4 - шум
    this.work1 = new WorkBlock({
      parent: this,
      context: this.context,
      dx: WORK.positions[0][0],
      dy: WORK.positions[0][1],
      images: [
        this.workImages[0][0],
        this.workImages[0][1],
        this.workImages[0][2],
        this.hoverImage
      ],
      gradientIndex: 1
    });
    this.work2 = new WorkBlock({
      parent: this,
      context: this.context,
      dx: WORK.positions[1][0],
      dy: WORK.positions[1][1],
      images: [
        this.workImages[1][0],
        this.workImages[1][1],
        this.workImages[1][2],
        this.hoverImage
      ]
    });
    this.work3 = new WorkBlock({
      parent: this,
      context: this.context,
      dx: WORK.positions[2][0],
      dy: WORK.positions[2][1],
      images: [
        this.workImages[2][0],
        this.workImages[2][1],
        this.workImages[2][2],
        this.hoverImage
      ],
      gradientIndex: 2
    });
    this.work4 = new WorkBlock({
      parent: this,
      context: this.context,
      dx: WORK.positions[3][0],
      dy: WORK.positions[3][1],
      images: [
        this.workImages[3][0],
        this.workImages[3][1],
        this.workImages[3][2],
        this.hoverImage
      ]
    });


    this.partnerLines = new PartnerLines({
      parent: this,
      gradientIndex: 4,
      dy: PARTNER.y,
      rhombusWidth: 220,
      rhombusHeight: 220,
      spaceBetweenRhombuses: 36,
      textHeight: 47,
      images: [this.partnerImages, this.hoverImage]
    });

    // Шоу
    this.showLines = new ShowLines({
      parent: this,
      gradientIndex: 3,
      dy: SHOW.y + this.partnerLines.height,
      rhombusWidth: 220,
      rhombusHeight: 220,
      spaceBetweenRhombuses: 36,
      textHeight: 47,
      images: [this.showImages, this.showMoreHover]
    });

    this.productLines = new ProductLines({
      parent: this,
      gradientIndex: 5,
      dy: PRODUCT.y + this.partnerLines.height + this.showLines.height,
      rhombusWidth: 283,
      rhombusHeight: 283,
      spaceBetweenRhombuses: 50,
      textHeight: 71,
      images: [this.productImages, this.hoverImage, this.showMoreHover]
    });

    this.works = [this.work1, this.work2, this.work3, this.work4];
    this.parent.onBlockReady();
  }

  readyImage() {
    this.imagesReadyCounter += 1;
    if (this.imagesReadyCounter === this.imagesCounter) {
      this.init();
    }
  }

  initImages() {
    this.logoImage = document.createElement('img');
    this.logoImage.onload = () => {
      this.readyImage();
    };
    this.logoImage.src = this.logoImageSrc;

    for (let i = 0; i < this.workImagesSrc.length; i += 1) {
      this.workImages.push([]);
      for (let j = 0; j < this.workImagesSrc[i].length; j += 1) {
        this.workImages[i].push(document.createElement('img'));
        this.workImages[i][j].onload = () => {
          this.readyImage();
        };
        this.workImages[i][j].src = this.workImagesSrc[i][j];
      }
    }

    this.hoverImage = document.createElement('img');
    this.hoverImage.onload = () => {
      this.readyImage();
    };
    this.hoverImage.src = this.hoverImageSrc;

    this.showMoreHover = document.createElement('img');
    this.showMoreHover.onload = () => {
      this.readyImage();
    };
    this.showMoreHover.src = this.showMoreHoverSrc;

    for (let i = 0; i < this.showImagesSrc.length; i += 1) {
      this.showImages.push(document.createElement('img'));
      this.showImages[i].onload = () => {
        this.readyImage();
      };
      this.showImages[i].src = this.showImagesSrc[i];
    }

    for (let i = 0; i < this.partnerImagesSrc.length; i += 1) {
      this.partnerImages.push(document.createElement('img'));
      this.partnerImages[i].onload = () => {
        this.readyImage();
      };
      this.partnerImages[i].src = this.partnerImagesSrc[i];
    }

    for (let i = 0; i < this.productImagesSrc.length; i += 1) {
      this.productImages.push(document.createElement('img'));
      this.productImages[i].onload = () => {
        this.readyImage();
      };
      this.productImages[i].src = this.productImagesSrc[i];
    }
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
}

export default Blocks;
