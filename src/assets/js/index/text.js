/* globals document, window */
import { PRODUCT, WORK, TEXT } from '../settings';

function translateX(item, x) {
  item.style.transform = `translateX(${x}px)`;
}

function changeTranslate(item, x, y) {
  // eslint-disable-next-line no-param-reassign
  item.style.transform = `translate(${x}px, ${y}px)`;
}

class Text {
  constructor({ projectViewer, productViewer, ...opts }) {
    window.text = this;

    this.parent = opts.parent;
    this.windowWidth = this.parent.windowWidth;
    this.scale = this.parent.scale;
    this.spacing = this.parent.spacing;
    this.projectViewer = projectViewer;
    this.productViewer = productViewer;
    this.currentX = this.parent.currentX;

    this.text = document.querySelectorAll('.js-text');

    this.menu = document.querySelectorAll('.menu__item');
    this.content = document.querySelector('.content');
    this.subMenu = document.querySelectorAll('.sub-menu__item');
    this.form = document.querySelector('.contact-form-wrapper');

    this.logoButton = document.createElement('a');
    this.logoButton.innerHTML = 'Представляем';
    this.logoButton.setAttribute('class', 'content__button');
    document.querySelector('.content').appendChild(this.logoButton);

    this.wA = [];
    for (let i = 0; i < 4; i += 1) {
      const a = document.createElement('a');
      a.innerHTML = 'ПОДРОБНЕЕ';
      document.querySelector('.content').appendChild(a);
      this.wA.push(a);
    };
  }

  init = (blocks, works, partnerLines, showLines, productLines, partnersHeight, commonsHeight) => {
    const { logoButton, projectViewer, productViewer } = this;
    this.paLA = [];
    this.sLA = [];
    this.prLA = [];
    for (let i = 0; i < works.length; i += 1) {
      const { main: { width, height }, handleMouseMove } = works[i];
      const a = this.wA[i];
      a.style.transform = `translate(${WORK.positions[i][0] * this.scale}px, ${WORK.positions[i][1] * this.scale}px)`;
      a.style.width = `${width}px`;
      a.style.height = `${height}px`;
      a.style.lineHeight = `${height}px`;
      a.setAttribute('class', 'content__button work-button');
      a.addEventListener('mousemove', handleMouseMove);
      a.addEventListener('mouseover', () => blocks.handleMouseOverWork(i));
      a.addEventListener('mouseout', () => blocks.handleMouseOutWork(i));
      a.addEventListener('click', () => projectViewer.open(0, WORK.types[i]));
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
        a.setAttribute('class', 'content__button');
        document.querySelector('.content').appendChild(a);
        this.paLA.push(a);
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
        a.setAttribute('class', 'content__button');
        document.querySelector('.content').appendChild(a);
        a.addEventListener('mouseover', () => blocks.handleMouseOverShow(i, j));
        a.addEventListener('mouseout', () => blocks.handleMouseOutShow(i, j));
        a.addEventListener('click', () => projectViewer.open(i + j, 'common'));
        this.sLA.push(a);
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
        a.setAttribute('class', 'content__button');
        document.querySelector('.content').appendChild(a);
        a.addEventListener('mouseover', () => blocks.handleMouseOverProduct(i, j));
        a.addEventListener('mouseout', () => blocks.handleMouseOutProduct(i, j));
        a.addEventListener('click', () => productViewer.open(i + j));
        this.prLA.push(a);
      }
    };
    TEXT.positions[14][1] += partnersHeight;
    TEXT.positions[15][1] += partnersHeight;
    TEXT.positions[16][1] += partnersHeight + commonsHeight;
    TEXT.positions[17][1] += partnersHeight + commonsHeight;

    this.blocks = blocks;
    this.works = works;
    this.showLines = showLines;
    this.partnerLines = partnerLines;
    this.productLines = productLines;


    this.text.forEach((text, i) => changeTranslate(
      text,
      TEXT.positions[i][0] * this.scale,
      TEXT.positions[i][1] * this.scale
    ));

    this.logoButton.style.width = `${132 * this.scale}px`;
    this.logoButton.style.height = `${132 * this.scale}px`;
    this.logoButton.style.lineHeight = `${132 * this.scale}px`;
    changeTranslate(
      this.logoButton,
      471 * this.scale,
      576 * this.scale
    );

  }

  updateXY() {
    this.currentX = this.parent.currentX / 10;
    this.currentY = this.parent.currentY;
  }

  handleResize() {
    const { blocks, works, partnerLines, showLines, productLines, wA, paLA, sLA, prLA } = this;
    this.scale = this.parent.scale;
    this.spacing = this.parent.spacing;


    for (let i = 0; i < works.length; i += 1) {
      const { main: { width, height } } = works[i];
      const a = wA[i];
      a.style.transform = `translate(${WORK.positions[i][0] * this.scale}px, ${WORK.positions[i][1] * this.scale}px)`;
      a.style.width = `${width}px`;
      a.style.height = `${height}px`;
      a.style.lineHeight = `${height}px`;
    };
    for (let i = 0; i < partnerLines.partnerBlocks.length; i += 1) {
      const block = partnerLines.partnerBlocks[i];
      for (let j = 0; j < block.rhombuses.length; j += 1) {
        const rhombus = block.rhombuses[j];
        const { x, y, width, height } = rhombus;
        const a = paLA[i];
        a.style.transform = `translate(${x}px, ${y}px)`;
        a.style.width = `${width}px`;
        a.style.height = `${height}px`;
      }
    };
    for (let i = 0; i < showLines.showBlocks.length; i += 1) {
      const block = showLines.showBlocks[i];
      for (let j = 0; j < block.rhombuses.length; j += 1) {
        const rhombus = block.rhombuses[j];
        const { x, y, width, height } = rhombus;
        const a = sLA[i];
        a.style.transform = `translate(${x}px, ${y}px)`;
        a.style.width = `${width}px`;
        a.style.height = `${height}px`;
      }
    };
    for (let i = 0; i < productLines.productBlocks.length; i += 1) {
      const block = productLines.productBlocks[i];
      for (let j = 0; j < block.rhombuses.length; j += 1) {
        const rhombus = block.rhombuses[j];
        const { x, y, width, height } = rhombus;
        const a = prLA[i];
        a.style.transform = `translate(${x}px, ${y}px)`;
        a.style.width = `${width}px`;
        a.style.height = `${height}px`;
      }
    };



    this.text.forEach((text, i) => changeTranslate(
      text,
      TEXT.positions[i][0] * this.scale,
      TEXT.positions[i][1] * this.scale
    ));

    this.logoButton.style.width = `${132 * this.scale}px`;
    this.logoButton.style.height = `${132 * this.scale}px`;
    this.logoButton.style.lineHeight = `${132 * this.scale}px`;
    changeTranslate(
      this.logoButton,
      471 * this.scale,
      576 * this.scale
    );
  }

  render() {
    changeTranslate(this.content, this.spacing - this.currentX, -this.currentY);
    changeTranslate(
      this.form,
      this.spacing - this.currentX,
      (this.showLines.height +
        this.partnerLines.height +
        this.productLines.height +
        PRODUCT.y) * this.scale -
      this.currentY
    );
  }
}

export default Text;
