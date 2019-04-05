/* globals document */

function changeTranslate(item, x, y) {
  // eslint-disable-next-line no-param-reassign
  item.style.transform = `translate(${x}px, ${y}px)`;
}

function getWorkText() {
  const workBlocks = [];

  const h2 = document.querySelectorAll('h2#work');
  const p = document.querySelectorAll('p#work');
  const a = document.querySelectorAll('a#work');

  for (let i = 0; i < 4; i += 1) {
    workBlocks.push({ h: h2[i], p: p[i], a: a[i] });
  }

  return workBlocks;
}

class Text {
  constructor(opts) {
    window.text = this;
    this.scale = opts.scale;
    this.parent = opts.parent;

    this.firstBlock = {
      h: document.querySelector('h1'),
      p: document.querySelector('p')
    };

    this.workBlocks = getWorkText();

    this.beforeShowBlock = {
      h: document.querySelector('h2#show'),
      p: document.querySelector('p#show')
    };

    this.partners = {
      h: document.querySelector('h2#partners'),
      p: document.querySelector('p#partners')
    };

    this.applyStyles();
  }

  applyStyles() {
    changeTranslate(this.firstBlock.h, 154 * this.scale, 720 * this.scale);
    changeTranslate(this.firstBlock.p, 420 * this.scale, 351 * this.scale);

    for (let i = 0; i < 4; i += 1) {
      let x = 420 * this.scale;
      let aX = 180 * this.scale;
      const y = (828 + 400 * (i + 1) + 590 * i) * this.scale;
      const aY = (828 + 590 * (i + 1) + 400 * i) * this.scale;
      if (i % 2 !== 0) {
        x = 80 * this.scale;
        aX = 660 * this.scale;
      }

      changeTranslate(this.workBlocks[i].h, x, y + 30 * this.scale);
      changeTranslate(this.workBlocks[i].p, x, y + 91 * this.scale);
      changeTranslate(this.workBlocks[i].a, aX, aY);
      this.workBlocks[i].a.style.width = `${160 * this.scale}px`;
      this.workBlocks[i].a.style.height = `${160 * this.scale}px`;
      this.workBlocks[i].a.style.lineHeight = `${160 * this.scale}px`;
    }

    const yAfterWorkBlock = (828 + 990 * 4) * this.scale;
    changeTranslate(this.beforeShowBlock.h, 520 * this.scale, yAfterWorkBlock);
    changeTranslate(
      this.beforeShowBlock.p,
      520 * this.scale,
      yAfterWorkBlock + 60 * this.scale
    );

    this.parent.ready();
  }
}

export default Text;
