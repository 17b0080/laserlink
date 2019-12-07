import { LINES } from '../settings';

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


    this.lines = LINES.positions;
  }

  init(partnersHeight, commonsHeight) {
    this.lines[7][1] += partnersHeight;
    this.lines[7][3] += partnersHeight;
    this.lines[8][1] += commonsHeight + partnersHeight;
    this.lines[8][3] += commonsHeight + partnersHeight;
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
    // this.context.beginPath();
    // this.context.strokeStyle = 'white';
    // this.context.lineWidth = 2;
    for (let i = 0; i < this.lines.length; i += 1) {
      // console.log(this.lines[i]);
      this.context.beginPath();
      this.context.lineWidth = 2;
      this.context.strokeStyle = LINES.strokeStyle[i];
      this.context.moveTo(
        this.lines[i][0] * this.scale - this.currentX + this.spacing,
        this.lines[i][1] * this.scale - this.currentY
      );
      this.context.lineTo(
        this.lines[i][2] * this.scale - this.currentX + this.spacing,
        this.lines[i][3] * this.scale - this.currentY
      );
      this.context.stroke();
      // this.context.closePath();
    }
    //   this.context.Path();

  }
}

export default Lines;
