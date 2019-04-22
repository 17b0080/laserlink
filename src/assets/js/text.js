/* globals document, window */
function getShowRhombuses(that) {
  const showText = [];

  const a = document.querySelectorAll('.js-show-block__rhombus__button');
  const p = document.querySelectorAll('.js-show-block__rhombus__text');
  for (let i = 0; i < a.length; i += 1) {
    let line = 0;
    let item = 0;
    if (i !== 0) {
      line = Math.floor(i / 4);
      item = i % 4;
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
      line = Math.floor(i / 3);
      item = i % 3;
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
    this.showLines = this.parent.blocks.showLines;
    this.partnerLines = this.parent.blocks.partnerLines;
    this.productLines = this.parent.blocks.productLines;

    this.halfWindowWidth = this.parent.windowWidth / 2;

    this.showLinesHeight = this.showLines.height;
    this.partnerLinesHeight = this.partnerLines.height;
    this.productLinesHeight = this.productLines.height;

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
    

    this.partnerBlock = {
      h: document.querySelectorAll('.js-partner-block__sub-header'),
      p: document.querySelector('.js-partner-block__text')
    };

    this.productBlock = {
      h: document.querySelectorAll('.js-product-block__sub-header'),
      p: document.querySelector('.js-product-block__text')
    };
    this.productRhombuses = getProductRhombuses(this);

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
      this.workBlocks[i].a.onclick = () => {
        this.parent.projectViewer.open(i);
      };
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
      const dx = this.showLines.showBlocks[j].dx;
      const dy = this.showLines.showBlocks[j].dy;
      const x = dx * this.scale;
      const y = dy * this.scale;
      changeTranslate(
        this.showRhombuses[i].p,
        x + (220 + 36) * k * this.scale,
        y + 220 * this.scale
      );
      this.showRhombuses[i].p.style.width = `${220 * this.scale}px`;
      this.showRhombuses[i].p.style.lineHeight = `${47 * this.scale}px`;
      this.showRhombuses[i].p.style.height = `${47 * this.scale}px`;

      changeTranslate(
        this.showRhombuses[i].a,
        x + (220 + 36) * k * this.scale,
        y
      );
      this.showRhombuses[i].a.onclick = () => {
        this.parent.projectViewer.open(i);
      };
      this.showRhombuses[i].a.style.width = `${220 * this.scale}px`;
      this.showRhombuses[i].a.style.height = `${220 * this.scale}px`;
      this.showRhombuses[i].a.style.lineHeight = `${220 * this.scale}px`;
      k += 1;
    }

    changeTranslate(this.partnerBlock.h[0],114*this.scale,(4593+242+this.showLinesHeight)*this.scale);
    changeTranslate(this.partnerBlock.h[1],427*this.scale,(4593+739+this.showLinesHeight)*this.scale);
    changeTranslate(this.partnerBlock.p,114*this.scale,(4593+307+this.showLinesHeight)*this.scale)


    changeTranslate(this.productBlock.h[0], 114 * this.scale, (this.showLinesHeight + 840 + 4593 + this.partnerLinesHeight + 242)*this.scale)
    changeTranslate(this.productBlock.h[1], 418 * this.scale, (this.showLinesHeight + 840 + 4593 + this.partnerLinesHeight + 748)*this.scale)
    changeTranslate(this.productBlock.p, 114 * this.scale, (this.showLinesHeight + 840 + 4593 + this.partnerLinesHeight + 339)*this.scale)

    for (let i = 0, k = 0, j = 0; i < this.productRhombuses.length; i += 1) {
      if (k === 3) {
        j += 1;
        k = 0;
      }
      const dx = this.productLines.productBlocks[j].dx;
      const dy = this.productLines.productBlocks[j].dy;
      const x = dx * this.scale;
      const y = dy * this.scale;
      
      this.productRhombuses[i].a.onclick = () => {
        this.parent.productViewer.open(i);
      };

      changeTranslate(
        this.productRhombuses[i].p,
        x + (283 + 50) * k * this.scale,
        y + 283 * this.scale
      );
      this.productRhombuses[i].p.style.width = `${283 * this.scale}px`;
      this.productRhombuses[i].p.style.lineHeight = `${71 * this.scale}px`;
      this.productRhombuses[i].p.style.height = `${71 * this.scale}px`;

      changeTranslate(
        this.productRhombuses[i].a,
        x + (283 + 50) * k * this.scale,
        y
      );
      this.productRhombuses[i].a.style.width = `${283 * this.scale}px`;
      this.productRhombuses[i].a.style.height = `${283 * this.scale}px`;
      this.productRhombuses[i].a.style.lineHeight = `${283 * this.scale}px`;
      k += 1;
    }
  }

  render() {
    changeTranslate(this.content, this.spacing - this.currentX, -this.currentY);
  }
}

export default Text;
