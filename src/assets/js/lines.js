class Lines {
  constructor(opts) {
    window.lines = this;
    this.parent = opts.parent;
    this.scale = this.parent.scale;
    this.spacing = this.parent.spacing;
    // Выделение памяти под переменные
    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.clientHeight = this.parent.clientHeight;

    this.canvas = document.querySelector('canvas.background__lines-n-shines');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = this.windowWidth;
    this.canvas.height = this.windowHeight / 2;

    this.showLinesHeight = this.parent.blocks.showLines.height;
    this.partnerLinesHeight = this.parent.blocks.partnerLines.height;

    this.lines = [
      { x0: 498, y0: -18, x1: 312, y1: 168 },
      { x0: 296, y0: 583, x1: 542, y1: 829 },
      { x0: 529, y0: 945, x1: 335, y1: 1139 },
      { x0: 414, y0: 1677, x1: 694, y1: 1957 },
      { x0: 626, y0: 2486, x1: 346, y1: 2766 },
      { x0: 420, y0: 3317, x1: 700, y1: 3597 },
      { x0: 601, y0: 4146, x1: 254, y1: 4493 },
      {
        x0: 855,
        y0: 4593 + this.showLinesHeight + 295,
        x1: 325,
        y1: 4593 + this.showLinesHeight + 295 + 530
      },
      {
        x0: 530 + 325,
        y0: 4593 + this.showLinesHeight + 872 + this.partnerLinesHeight + 260,
        x1: 325,
        y1: 5725 + this.showLinesHeight + this.partnerLinesHeight + 530
      }
    ];
  }

  updateXY() {
    this.currentX = this.parent.currentX / 10;
    this.currentY = this.parent.currentY;
  }

  handleResize() {
    this.scale = this.parent.scale;
    this.spacing = this.parent.spacing;

    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.clientHeight = this.parent.clientHeight;

    this.canvas.width = this.windowWidth;
    this.canvas.height = this.windowHeight / 2;
  }

  render() {
    this.context.clearRect(0, 0, this.windowWidth, this.windowHeight / 2);
    this.context.beginPath();
    this.context.strokeStyle = 'white';
    this.context.lineWidth = 2;
    for (let i = 0; i < this.lines.length; i += 1) {
      this.context.moveTo(
        this.lines[i].x0 * this.scale - this.currentX + this.spacing,
        this.lines[i].y0 * this.scale - this.currentY
      );
      this.context.lineTo(
        this.lines[i].x1 * this.scale - this.currentX + this.spacing,
        this.lines[i].y1 * this.scale - this.currentY
      );
    }
    //   this.context.Path();
    this.context.stroke();
  }
}

export default Lines;
