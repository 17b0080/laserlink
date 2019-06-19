/* globals document, window */

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
  constructor(opts) {
    window.text = this;
    this.parent = opts.parent;
    this.windowWidth = this.parent.windowWidth;
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

    this.menu = document.querySelectorAll('.menu__item');
    this.subMenu = document.querySelectorAll('.sub-menu__item');

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

    this.partnerRhombuses = getPartnerRhombuses(this);

    this.partnerBlock = {
      h: document.querySelectorAll('.js-partner-block__sub-header'),
      p: document.querySelector('.js-partner-block__text')
    };

    this.productBlock = {
      h: document.querySelectorAll('.js-product-block__sub-header'),
      p: document.querySelector('.js-product-block__text')
    };
    this.productRhombuses = getProductRhombuses(this);

    this.form = document.querySelector('.contact-form-wrapper');

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
    if (this.windowWidth >= 990) {
      document.body.style.height = `${this.showLines.height +
        this.partnerLines.height +
        this.productLines.height +
        (4593 + 892 + 883 + 300 + 900 + 35) * this.scale}px`;
      this.menu[0].onclick = e => {
        e.preventDefault();
        scrollTo(0);
      };

      this.menu[1].children[1].children[0].onclick = e => {
        e.preventDefault();
        this.menu[1].children[0].onclick(e);
        scrollTo(1013 * this.scale);
      };
      this.menu[1].children[1].children[1].onclick = e => {
        e.preventDefault();
        this.menu[1].children[0].onclick(e);
        scrollTo(1740 * this.scale);
      };
      this.menu[1].children[1].children[2].onclick = e => {
        e.preventDefault();
        this.menu[1].children[0].onclick(e);
        scrollTo(2600 * this.scale);
      };
      this.menu[1].children[1].children[3].onclick = e => {
        e.preventDefault();
        this.menu[1].children[0].onclick(e);
        scrollTo(3400 * this.scale);
      };
      this.menu[1].children[1].children[4].onclick = e => {
        e.preventDefault();
        this.menu[1].children[0].onclick(e);
        scrollTo(4146 * this.scale);
      };

      this.menu[2].onclick = e => {
        e.preventDefault();
        scrollTo((4593 + this.showLinesHeight + 572) * this.scale);
      };

      this.menu[3].onclick = e => {
        e.preventDefault();
        scrollTo(
          (4593 + this.showLinesHeight + 872 + this.partnerLinesHeight + 530) *
            this.scale
        );
      };

      this.menu[4].onclick = e => {
        e.preventDefault();
        scrollTo(
          this.showLinesHeight +
            this.partnerLinesHeight +
            this.productLinesHeight +
            (4593 + 892 + 883 + 300) * this.scale
        );
      };
    } else if (this.windowWidth >= 640 && this.windowWidth < 990) {
      this.menu[0].onclick = e => {
        e.preventDefault();
        if (this.menu[1].children[1].classList.contains('sub-menu--opened')) {
          this.menu[1].children[0].onclick(e);
        }
        scrollTo(0);
      };
      this.menu[1].children[1].children[0].onclick = e => {
        e.preventDefault();
        this.menu[1].children[0].onclick(e);
        scrollTo(
          getCoords(document.querySelector('div.show-wrapper').children[1]) -
            100
        );
      };
      this.menu[1].children[1].children[1].onclick = e => {
        e.preventDefault();
        this.menu[1].children[0].onclick(e);
        scrollTo(
          getCoords(document.querySelector('div.show-wrapper').children[2]) -
            100
        );
      };
      this.menu[1].children[1].children[2].onclick = e => {
        e.preventDefault();
        this.menu[1].children[0].onclick(e);
        scrollTo(
          getCoords(document.querySelector('div.show-wrapper').children[3]) -
            100
        );
      };
      this.menu[1].children[1].children[3].onclick = e => {
        e.preventDefault();
        this.menu[1].children[0].onclick(e);
        scrollTo(
          getCoords(document.querySelector('div.show-wrapper').children[4]) -
            100
        );
      };
      this.menu[1].children[1].children[4].onclick = e => {
        e.preventDefault();
        this.menu[1].children[0].onclick(e);
        scrollTo(
          getCoords(document.querySelectorAll('div.show-wrapper')[1]) - 45
        );
      };
      // партнеры - 2
      this.menu[2].onclick = e => {
        e.preventDefault();
        if (this.menu[1].children[1].classList.contains('sub-menu--opened')) {
          this.menu[1].children[0].onclick(e);
        }
        scrollTo(getCoords(document.querySelector('div.partners')) - 100);
      };
      // оборудование - 3
      this.menu[3].onclick = e => {
        e.preventDefault();
        if (this.menu[1].children[1].classList.contains('sub-menu--opened')) {
          this.menu[1].children[0].onclick(e);
        }
        scrollTo(getCoords(document.querySelector('div.products')) - 100);
      };
      // контакты - 4
      this.menu[4].onclick = e => {
        e.preventDefault();
        if (this.menu[1].children[1].classList.contains('sub-menu--opened')) {
          this.menu[1].children[0].onclick(e);
        }
        scrollTo(
          getCoords(document.querySelector('div.contact-form-wrapper')) - 100
        );
      };
    } else {
      this.menu[0].onclick = e => {
        e.preventDefault();
        if (this.menu[1].children[1].classList.contains('sub-menu--opened')) {
          this.menu[1].children[0].onclick(e);
        }
        document.querySelector('.hamburger-wrapper').onclick(e);
        scrollTo(0);
      };
      this.menu[1].children[1].children[0].onclick = e => {
        e.preventDefault();
        this.menu[1].children[0].onclick(e);
        document.querySelector('.hamburger-wrapper').onclick(e);
        scrollTo(
          getCoords(document.querySelector('div.show-wrapper').children[1]) -
            100
        );
      };
      this.menu[1].children[1].children[1].onclick = e => {
        e.preventDefault();
        this.menu[1].children[0].onclick(e);
        document.querySelector('.hamburger-wrapper').onclick(e);
        scrollTo(
          getCoords(document.querySelector('div.show-wrapper').children[2]) -
            100
        );
      };
      this.menu[1].children[1].children[2].onclick = e => {
        e.preventDefault();
        this.menu[1].children[0].onclick(e);
        document.querySelector('.hamburger-wrapper').onclick(e);
        scrollTo(
          getCoords(document.querySelector('div.show-wrapper').children[3]) -
            100
        );
      };
      this.menu[1].children[1].children[3].onclick = e => {
        e.preventDefault();
        this.menu[1].children[0].onclick(e);
        document.querySelector('.hamburger-wrapper').onclick(e);
        scrollTo(
          getCoords(document.querySelector('div.show-wrapper').children[4]) -
            100
        );
      };
      this.menu[1].children[1].children[4].onclick = e => {
        e.preventDefault();
        this.menu[1].children[0].onclick(e);
        document.querySelector('.hamburger-wrapper').onclick(e);
        scrollTo(
          getCoords(document.querySelectorAll('div.show-wrapper')[1]) - 45
        );
      };
      // партнеры - 2
      this.menu[2].onclick = e => {
        e.preventDefault();
        if (this.menu[1].children[1].classList.contains('sub-menu--opened')) {
          this.menu[1].children[0].onclick(e);
        }
        document.querySelector('.hamburger-wrapper').onclick(e);
        scrollTo(getCoords(document.querySelector('div.partners')) - 100);
      };
      // оборудование - 3
      this.menu[3].onclick = e => {
        e.preventDefault();
        if (this.menu[1].children[1].classList.contains('sub-menu--opened')) {
          this.menu[1].children[0].onclick(e);
        }
        document.querySelector('.hamburger-wrapper').onclick(e);
        scrollTo(getCoords(document.querySelector('div.products')) - 100);
      };
      // контакты - 4
      this.menu[4].onclick = e => {
        e.preventDefault();
        if (this.menu[1].children[1].classList.contains('sub-menu--opened')) {
          this.menu[1].children[0].onclick(e);
        }
        document.querySelector('.hamburger-wrapper').onclick(e);
        scrollTo(
          getCoords(document.querySelector('div.contact-form-wrapper')) - 100
        );
      };
    }

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

    const types = [
      'video-mapping',
      'laser-show',
      'multimedia-show',
      'staging-numbers'
    ];
    for (let i = 0; i < 4; i += 1) {
      this.workBlocks[i].a.onclick = () => {
        this.parent.projectViewer.open(0, types[i]);
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
      const { dx } = this.showLines.showBlocks[j];
      const { dy } = this.showLines.showBlocks[j];
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
        this.parent.projectViewer.open(i, 'common');
      };
      this.showRhombuses[i].a.style.width = `${220 * this.scale}px`;
      this.showRhombuses[i].a.style.height = `${220 * this.scale}px`;
      this.showRhombuses[i].a.style.lineHeight = `${220 * this.scale}px`;
      k += 1;
    }

    changeTranslate(
      this.partnerBlock.h[0],
      114 * this.scale,
      (4593 + 242 + this.showLinesHeight) * this.scale
    );
    changeTranslate(
      this.partnerBlock.h[1],
      427 * this.scale,
      (4593 + 739 + this.showLinesHeight) * this.scale
    );
    changeTranslate(
      this.partnerBlock.p,
      114 * this.scale,
      (4593 + 307 + this.showLinesHeight) * this.scale
    );
    this.partnerRhombuses.forEach(rhombus => {
      rhombus.dom.style.width = `${220 * this.scale}px`;
      rhombus.dom.style.height = `${220 * this.scale}px`;
      changeTranslate(rhombus.dom, rhombus.x, rhombus.y);
    });

    changeTranslate(
      this.productBlock.h[0],
      114 * this.scale,
      (this.showLinesHeight + 840 + 4593 + this.partnerLinesHeight + 242) *
        this.scale
    );
    changeTranslate(
      this.productBlock.h[1],
      418 * this.scale,
      (this.showLinesHeight + 840 + 4593 + this.partnerLinesHeight + 748) *
        this.scale
    );
    changeTranslate(
      this.productBlock.p,
      114 * this.scale,
      (this.showLinesHeight + 840 + 4593 + this.partnerLinesHeight + 339) *
        this.scale
    );

    for (let i = 0, k = 0, j = 0; i < this.productRhombuses.length; i += 1) {
      if (k === 3) {
        j += 1;
        k = 0;
      }
      const { dx } = this.productLines.productBlocks[j];
      const { dy } = this.productLines.productBlocks[j];
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
    // console.log(this.form);
    // console.log(this.scale);
    // console.log(this.showLines.height);
    changeTranslate(
      this.form,
      this.spacing - this.currentX,
      this.showLines.height +
        this.partnerLines.height +
        this.productLines.height +
        (4593 + 892 + 883 + 300) * this.scale -
        this.currentY
    );
  }
}

export default Text;
