/* globals document */

/**
 * main-header - 370
 * work main halfReady - sub-h/p
 * 4147 - show sub
 * show rh p - onReady
 * cooperation sub-h/p - 4539 + showLinesHeight + ...
 * partners sub-h  - onStart
 * hotite-h + p  - 4539 + showLinesH+...+partnerLinesH+..
 * product-h - onStart
 * product-p - onReady rh
 */

class Text {
  constructor(opts) {
    this.parent = opts.parent;
    this.item = opts.item;

    this.dy = opts.dy;
    this.scale = this.parent.scale;
    this.y = this.dy * this.scale;

    this.currentY = this.parent.currentY;

    this.triggered = false;

    this.check = opts.check;
  }

  checkMe() {
    if (!this.triggered && this.check()) this.trigger();
  }

  updateXY() {
    this.currentY = this.parent.currentY;
  }

  trigger() {
    // console.log('trigger');
    this.triggered = true;
    // console.log(this.item.classList[0]);
    this.item.classList.add(`${this.item.classList[0]}--fade-in`);
    // console.log(this.item);
  }
}

class TextTriggers {
  constructor(opts) {
    this.parent = opts.parent;
    this.currentY = this.parent.currentY;
    this.scale = this.parent.scale;
    this.texts = [];
    this.prepareText();
  }

  prepareText() {
    function dyCheck() {
      return this.y < this.currentY && this.y + 100 > this.currentY;
    }

    // Первый блок

    this.texts.push(
      new Text({
        parent: this,
        item: document.querySelector('.js-first-block__text'),
        check: () => {
          // return this.parent.blocks.first.rhombus.downCounter === 25;
          return true;
        }
      })
    );

    this.texts.push(
      new Text({
        // first-block header
        parent: this,
        item: document.querySelector('.js-first-block__main-header'),
        dy: 370,
        check: dyCheck
      })
    );

    // Работы
    const workBlocks = this.parent.blocks.works;
    const workHeaders = document.querySelectorAll('.js-work-block__sub-header');
    const workParagraphs = document.querySelectorAll('.js-work-block__text');
    const workHypers = document.querySelectorAll('.js-work-block__button');

    for (let i = 0; i < workHeaders.length; i += 1) {
      this.texts.push(
        new Text({
          // i work h
          parent: this,
          item: workHeaders[i],
          check: () => {
            return workBlocks[i].main.counter === 75;
          }
        }),
        new Text({
          // i work p
          parent: this,
          item: workParagraphs[i],
          check: () => {
            return workBlocks[i].main.counter === 75;
          }
        })
        , new Text({
          // i work a
          parent: this,
          item: workHypers[i],
          check: () => {
            return workBlocks[i].main.counter === 75;
          }
        })
      );
      // this.texts.push(
      //   new Text({
      //     // i work p
      //     parent: this,
      //     item: workParagraphs[i],
      //     check: () => {
      //       return workBlocks[i].main.counter === 75;
      //     }
      //   })
      // );
      // this.texts.push(
      //   new Text({
      //     // i work a
      //     parent: this,
      //     item: workHypers[i],
      //     check: () => {
      //       return workBlocks[i].main.counter === 75;
      //     }
      //   })
      // );
    }

    // Перед шоу
    this.texts.push(
      new Text({
        // first-block header
        parent: this,
        item: document.querySelector('.js-show-block__sub-header'),
        dy: 4000,
        check: dyCheck
      })
    );
    this.texts.push(
      new Text({
        // first-block header
        parent: this,
        item: document.querySelector('.js-show-block__text'),
        dy: 4000,
        check: dyCheck
      })
    );

    // Шоу
    const { showLines } = this.parent.blocks;
    const showParagraphs = document.querySelectorAll(
      '.js-show-block__rhombus__text'
    );
    for (let i = 0, k = 0, j = 0; i < showParagraphs.length; i += 1, k += 1) {
      if (k === 3) {
        j += 1;
        k = 0;
      }

      // console.log(j, k);
      console.log(showLines);
      this.texts.push(
        new Text({
          // i work h
          parent: this,
          item: showParagraphs[i],
          check: () => {
            return showLines.showBlocks[j].rhombuses[k].counter === 25;
          }
        })
      );
    }

    // Партнёры
    const showLinesHeight = this.parent.blocks.showLines.height;
    this.texts.push(
      new Text({
        parent: this,
        item: document.querySelector('.js-partner-block__sub-header'),
        dy: 4593 + showLinesHeight,
        check: dyCheck
      })
    );
    this.texts.push(
      new Text({
        parent: this,
        item: document.querySelector('.js-partner-block__text'),
        dy: 4593 + showLinesHeight,
        check: dyCheck
      })
    );
    this.texts.push(
      new Text({
        parent: this,
        item: document.querySelectorAll('.js-partner-block__sub-header')[1],
        dy: 4593 + showLinesHeight + 330,
        check: dyCheck
      })
    );

    // Продукты
    const partnerLinesHeight = this.parent.blocks.partnerLines.height;
    const { productLines } = this.parent.blocks;
    const productParagraphs = document.querySelectorAll(
      '.js-product-block__rhombus__text'
    );

    this.texts.push(
      new Text({
        parent: this,
        item: document.querySelector('.js-product-block__sub-header'),
        dy: 4593 + showLinesHeight + 883 + partnerLinesHeight,
        check: dyCheck
      })
    );
    this.texts.push(
      new Text({
        parent: this,
        item: document.querySelector('.js-product-block__text'),
        dy: 4593 + showLinesHeight + 883 + partnerLinesHeight,
        check: dyCheck
      })
    );
    this.texts.push(
      new Text({
        parent: this,
        item: document.querySelectorAll('.js-product-block__sub-header')[1],
        dy: 4593 + showLinesHeight + 883 + partnerLinesHeight + 330,
        check: dyCheck
      })
    );

    for (
      let i = 0, j = 0, k = 0;
      i < productParagraphs.length;
      i += 1, k += 1
    ) {
      if (k === 3) {
        k = 0;
        j += 1;
      }

      this.texts.push(
        new Text({
          parent: this,
          item: productParagraphs[i],
          check: () => {
            return (
              productLines.productBlocks[j].rhombuses[k].downCounter === 25
            );
          }
        })
      );
    }
  }

  updateXY() {
    this.currentY = this.parent.currentY;
  }

  check() {
    // console.log(this.texts);
    // for (let i = 0; i < this.texts.length; i += 1) {
    //   this.texts[i].updateXY();
    //   this.texts[i].checkMe();
    // }
  }
}

export default TextTriggers;
