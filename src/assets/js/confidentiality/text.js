/* globals document, window */

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

    this.halfWindowWidth = this.parent.windowWidth / 2;

    this.content = document.querySelector('div.content');
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
      document.body.style.height = `${(4593 +
        this.showLinesHeight +
        872 +
        this.partnerLinesHeight +
        900 +
        this.productLinesHeight +
        900) *
        this.scale}px`;
      this.menu[0].onclick = e => {
        e.preventDefault();
        scrollTo(0);
      };

      this.menu[1].onclick = function(e) {
        e.preventDefault();
      };
      this.menu[1].children[1].children[0].onclick = e => {
        e.preventDefault();
        scrollTo(1013 * this.scale);
      };
      this.menu[1].children[1].children[1].onclick = e => {
        e.preventDefault();
        scrollTo(1740 * this.scale);
      };
      this.menu[1].children[1].children[2].onclick = e => {
        e.preventDefault();
        scrollTo(2600 * this.scale);
      };
      this.menu[1].children[1].children[3].onclick = e => {
        e.preventDefault();
        scrollTo(3400 * this.scale);
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
          (4593 +
            this.showLinesHeight +
            872 +
            this.partnerLinesHeight +
            900 +
            this.productLinesHeight +
            900) *
            this.scale
        );
      };
    }
  }

  render() {
    changeTranslate(this.content, this.spacing - this.currentX, -this.currentY);
  }
}

export default Text;
