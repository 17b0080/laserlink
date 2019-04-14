/* globals document, window */

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
  constructor(opts) {
    window.text = this;
    this.parent = opts.parent;
    this.scale = this.parent.scale;
    this.spacing = this.parent.spacing;

    this.content = document.querySelector('div.content');

    this.firstBlock = {
      h: document.querySelector('.js-first-block__main-header'),
      p: document.querySelector('.js-first-block__text')
    };

    this.workBlocks = getWorkText();

    this.showBlock = {
      h: document.querySelector('.js-show-block__sub-header'),
      p: document.querySelector('.js-show-block__text')
    };

    this.Partners = {
      h: document.querySelector('.js-partners-block__sub-header'),
      p: document.querySelector('.js-partners-block__text')
    };

    this.applyStyles();
  }

  updateXY() {
    this.currentX = this.parent.currentX / 10;
    this.currentY = this.parent.currentY;
  }

  handleResize() {
    this.scale = this.parent.scale;
    this.spacing = this.parent.spacing;

    this.applyStyles();
  }

  applyStyles() {
    changeTranslate(this.firstBlock.h, 36 * this.scale, 858 * this.scale);
    changeTranslate(this.firstBlock.p, 413 * this.scale, 453 * this.scale);

    changeTranslate(this.workBlocks[0].h, 413 * this.scale, 1438 * this.scale);
    changeTranslate(this.workBlocks[0].p, 413 * this.scale, 1505 * this.scale);
    changeTranslate(this.workBlocks[0].a, 223 * this.scale, 1557 * this.scale);

    changeTranslate(this.workBlocks[1].h, 141 * this.scale, 2146 * this.scale);
    changeTranslate(this.workBlocks[1].p, 141 * this.scale, 2213 * this.scale);
    changeTranslate(this.workBlocks[1].a, 569 * this.scale, 2264 * this.scale);

    changeTranslate(this.workBlocks[2].h, 413 * this.scale, 2854 * this.scale);
    changeTranslate(this.workBlocks[2].p, 413 * this.scale, 2911 * this.scale);
    changeTranslate(this.workBlocks[2].a, 224 * this.scale, 2973 * this.scale);

    changeTranslate(this.workBlocks[3].h, 141 * this.scale, 3562 * this.scale);
    changeTranslate(this.workBlocks[3].p, 141 * this.scale, 3619 * this.scale);
    changeTranslate(this.workBlocks[3].a, 567 * this.scale, 3680 * this.scale);

    for (let i = 0; i < 4; i += 1) {
      this.workBlocks[i].a.style.width = `${128 * this.scale}px`;
      this.workBlocks[i].a.style.height = `${128 * this.scale}px`;
      this.workBlocks[i].a.style.lineHeight = `${128 * this.scale}px`;
    }

    changeTranslate(this.showBlock.h, 141 * this.scale, 3562 * this.scale);
    changeTranslate(this.showBlock.p, 141 * this.scale, 3619 * this.scale);
  }

  render() {
    changeTranslate(this.content, this.spacing - this.currentX, -this.currentY);
  }
}

export default Text;
