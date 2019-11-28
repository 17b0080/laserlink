/* globals document, window */
import { PRODUCT, WORK } from '../settings';
function getCoords(elem) {
  // (1)
  const box = elem.getBoundingClientRect();

  const { body } = document;
  const docEl = document.documentElement;

  // (2)
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;

  // (3)
  const clientTop = docEl.clientTop || body.clientTop || 0;

  // (4)
  const top = box.top + scrollTop - clientTop;

  return top;
}

function scrollTo(top) {
  window.scrollTo({
    top,
    behavior: 'smooth'
  });
}

function getShowRhombuses(that) {
  const showText = [];

  const a = document.querySelectorAll('.js-show-block__rhombus__button');
  const p = document.querySelectorAll('.js-show-block__rhombus__text');
  for (let i = 0; i < a.length; i += 1) {
    let line = 0;
    let item = 0;
    if (i !== 0) {
      line = Math.floor(i / 3);
      item = i % 3;
    }

    a[i].onmouseover = () => {
      that.parent.blocks.handleMouseOverShow(line, item);
    };
    a[i].onmouseout = () => {
      that.parent.blocks.handleMouseOutShow(line, item);
    };
    showText.push({ p: p[i], a: a[i] });
  }

  return showText;
}

function getProductRhombuses(that) {
  const productRhombuses = [];

  const p = document.querySelectorAll('.js-product-block__rhombus__text');
  const a = document.querySelectorAll('.js-product-block__rhombus__button');

  for (let i = 0; i < a.length; i += 1) {
    let line = 0;
    let item = 0;
    if (i !== 0) {
      line = Math.floor(i / 2);
      item = i % 2;
    }

    a[i].onmouseover = () => {
      that.parent.blocks.handleMouseOverProduct(line, item);
    };
    a[i].onmouseout = () => {
      that.parent.blocks.handleMouseOutProduct(line, item);
    };
    productRhombuses.push({ p: p[i], a: a[i] });
  }

  return productRhombuses;
}

function getPartnerRhombuses(that) {
  const partnerRhombuses = [];
  that.parent.blocks.partnerLines.partnerBlocks.forEach(partnerBlock => {
    partnerBlock.rhombuses.forEach(
      (partnerBlockRhombus, partnerBlockRhombusIndex) => {
        partnerRhombuses.push({
          dom: document.querySelectorAll('.js-partner-block__rhombus__button')[
            partnerBlockRhombusIndex
          ],
          x: partnerBlockRhombus.x,
          y: partnerBlockRhombus.y
        });
      }
    );
  });
  return partnerRhombuses;
}

function getWorkText() {
  const workBlocks = [];

  const h2 = document.querySelectorAll('.js-work-block__sub-header');
  const p = document.querySelectorAll('.js-work-block__text');
  const a = document.querySelectorAll('.js-work-block__button');

  for (let i = 0; i < 4; i += 1) {
    workBlocks.push({ h: h2[i], p: p[i], a: a[i] });
  }

  return workBlocks;
}

function changeTranslate(item, x, y) {
  // eslint-disable-next-line no-param-reassign
  item.style.transform = `translate(${x}px, ${y}px)`;
}

class Text {
  constructor({ blocks, ...opts }) {
    window.text = this;

    this.parent = opts.parent;
    this.windowWidth = this.parent.windowWidth;
    this.scale = this.parent.scale;
    this.spacing = this.parent.spacing;


    const {
      works,
      partnerLines,
      showLines,
      productLines
    } = blocks;

    this.works = works;
    this.partnerLines = partnerLines;
    this.showLines = showLines;
    this.productLines = productLines;

    for (let i = 0; i < works.length; i += 1) {
      const { main: { width, height } } = works[i];
      const a = document.createElement('a');
      a.style.transform = `translate(${WORK.positions[i][0] * this.scale}px, ${WORK.positions[i][1] * this.scale}px)`;
      a.style.width = `${width}px`;
      a.style.height = `${height}px`;
      a.style.backgroundColor = 'red';
      a.setAttribute('class', 'content__button');
      a.style.opacity = '1';


      a.addEventListener('mouseover', () => blocks.handleMouseOverWork(i));
      a.addEventListener('mouseout', () => blocks.handleMouseOutWork(i));

      document.querySelector('.content').appendChild(a);
    };
    for (let i = 0; i < partnerLines.partnerBlocks.length; i += 1) {
      const block = partnerLines.partnerBlocks[i];

      for (let j = 0; j < block.rhombuses.length; j += 1) {
        const rhombus = block.rhombuses[j];
        const { x, y, width, height } = rhombus;
        const a = document.createElement('a');
        a.style.transform = `translate(${x}px, ${y}px)`;
        a.style.width = `${width}px`;
        a.style.height = `${height}px`;
        a.style.backgroundColor = 'red';
        a.setAttribute('class', 'content__button');
        // a.style.opacity = '1';
        document.querySelector('.content').appendChild(a);



      }
    };
    for (let i = 0; i < showLines.showBlocks.length; i += 1) {
      const block = showLines.showBlocks[i];

      for (let j = 0; j < block.rhombuses.length; j += 1) {
        const rhombus = block.rhombuses[j];
        const { x, y, width, height } = rhombus;
        const a = document.createElement('a');
        a.style.transform = `translate(${x}px, ${y}px)`;
        a.style.width = `${width}px`;
        a.style.height = `${height}px`;
        a.style.backgroundColor = 'red';
        a.setAttribute('class', 'content__button');
        // a.style.opacity = '1';÷
        document.querySelector('.content').appendChild(a);


        a.addEventListener('mouseover', () => blocks.handleMouseOverShow(i, j));
        a.addEventListener('mouseout', () => blocks.handleMouseOutShow(i, j));
      }
    };
    for (let i = 0; i < productLines.productBlocks.length; i += 1) {
      const block = productLines.productBlocks[i];

      for (let j = 0; j < block.rhombuses.length; j += 1) {
        const rhombus = block.rhombuses[j];
        const { x, y, width, height } = rhombus;
        const a = document.createElement('a');
        a.style.transform = `translate(${x}px, ${y}px)`;
        a.style.width = `${width}px`;
        a.style.height = `${height}px`;
        a.style.backgroundColor = 'red';
        a.setAttribute('class', 'content__button');
        // a.style.opacity = '1';
        document.querySelector('.content').appendChild(a);

        a.addEventListener('mouseover', () => blocks.handleMouseOverProduct(i, j));
        a.addEventListener('mouseout', () => blocks.handleMouseOutProduct(i, j));
      }
    };

    this.menu = document.querySelectorAll('.menu__item');
    this.content = document.querySelector('.content');
    this.subMenu = document.querySelectorAll('.sub-menu__item');
    this.form = document.querySelector('.contact-form-wrapper');

    // this.applyStyles();

    document.body.style.height = `${showLines.height + partnerLines.height + productLines.height + PRODUCT.y * this.scale}px`;
  }

  updateXY() {
    this.currentX = this.parent.currentX / 10;
    this.currentY = this.parent.currentY;
  }

  handleResize() {
    this.scale = this.parent.scale;
    this.spacing = this.parent.spacing;
  }

  render() {
    changeTranslate(this.content, this.spacing - this.currentX, -this.currentY);
    changeTranslate(
      this.form,
      this.spacing - this.currentX,
      this.showLines.height +
      this.partnerLines.height +
      this.productLines.height +
      PRODUCT.y * this.scale -
      this.currentY
    );
  }
}

export default Text;
