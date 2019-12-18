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
    document.body.style.height = `${this.content.clientHeight}px`;
  }

  render() {
    changeTranslate(this.content, this.spacing - this.currentX, -this.currentY);
  }
}

export default Text;
