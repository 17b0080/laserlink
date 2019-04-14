/* globals document, window */
function getShowRhombuses(that) {
  const showText = [];

  const a = document.querySelectorAll('.js-show-block__rhombus__button');
  const p = document.querySelectorAll('.js-show-block__rhombus__text');
  for (let i = 0; i < a.lenght; i += 1) {
    a[i].onmouseover = () => {
      that.parent.blocks.handleMouseOutShow(i);
    };
    a[i].onmouseout = () => {
      that.parent.blocks.handleMouseOverShow(i);
    };
    showText.push({ p: p[i], a: a[i] });
  }

  return showText;
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

    this.showRhombuses = getShowRhombuses(this);

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
    changeTranslate(this.firstBlock.h, 36 * this.scale, 842 * this.scale);
    changeTranslate(this.firstBlock.p, 413 * this.scale, 453 * this.scale);

    changeTranslate(
      this.workBlocks[0].h,
      429.6 * this.scale,
      1439 * this.scale
    );
    changeTranslate(
      this.workBlocks[0].p,
      429.6 * this.scale,
      1495 * this.scale
    );
    changeTranslate(
      this.workBlocks[0].a,
      218.7 * this.scale,
      1558 * this.scale
    );

    changeTranslate(this.workBlocks[1].h, 113 * this.scale, 2257 * this.scale);
    changeTranslate(this.workBlocks[1].p, 113 * this.scale, 2313 * this.scale);
    changeTranslate(
      this.workBlocks[1].a,
      670.2 * this.scale,
      2376 * this.scale
    );

    changeTranslate(
      this.workBlocks[2].h,
      425.6 * this.scale,
      3075 * this.scale
    );
    changeTranslate(
      this.workBlocks[2].p,
      425.6 * this.scale,
      3162 * this.scale
    );
    changeTranslate(this.workBlocks[2].a, 222 * this.scale, 3194 * this.scale);

    changeTranslate(this.workBlocks[3].h, 114 * this.scale, 3893 * this.scale);
    changeTranslate(this.workBlocks[3].p, 114 * this.scale, 3949 * this.scale);
    changeTranslate(
      this.workBlocks[3].a,
      669.8 * this.scale,
      4012 * this.scale
    );

    for (let i = 0; i < 4; i += 1) {
      this.workBlocks[i].a.style.width = `${128 * this.scale}px`;
      this.workBlocks[i].a.style.height = `${128 * this.scale}px`;
      this.workBlocks[i].a.style.lineHeight = `${128 * this.scale}px`;
    }

    changeTranslate(this.showBlock.h, 427 * this.scale, 4350 * this.scale);
    changeTranslate(this.showBlock.p, 427 * this.scale, 4415 * this.scale);

    for (let i = 0, k = 0, j = 0; i < this.showRhombuses.length; i += 1) {
      if (k === 4) {
        j += 1;
        k = 0;
      }
      this.showRhombuses[i].p = ;
      this.showRhombuses[i].a = ;
      k += 1;
    }
  }

  render() {
    changeTranslate(this.content, this.spacing - this.currentX, -this.currentY);
  }
}

export default Text;
