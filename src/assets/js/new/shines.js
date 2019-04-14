/* globals window, document */

class Line {
  constructor(opts) {
    this.dots = opts.dots;

    this.canvas = document.createElement('canvas');
    this.canvas.width = Math.max(
      Math.abs(this.dots[1].x),
      Math.abs(this.dots[0].x)
    );
    this.canvas.height = Math.abs(this.dots[1].y - this.dots[0].y);
    this.context = this.canvas.getContext('2d');

    this.render();
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.beginPath();
    this.context.strokeStyle = 'white';
    this.context.lineWidth = 2;
    this.context.moveTo(this.dots[0].x, 0);
    this.context.lineTo(this.dots[1].x, this.dots[1].y - this.dots[0].y);
    this.context.stroke();
  }
}

class Lines {
  constructor(opts) {
    window.lines = this;
    this.scale = opts.scale;
    this.parent = opts.parent;
    this.showBlockHeight = this.parent.blocks.blocks[6].canvas.height;

    this.canvas = document.querySelector('canvas.shines');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext('2d');

    this.spacing = 60;
    this.linesCanvas = document.createElement('canvas');
    this.linesCanvas.width = 1000 * this.scale;
    this.linesCanvas.height =
      this.showBlockHeight + (6068 - this.spacing) * this.scale;
    this.linesContext = this.linesCanvas.getContext('2d');

    this.lines = undefined;

    this.currentX = 0;
    this.currentY = 0;

    // Центрирование контента
    this.centering = (window.innerWidth - 1000 * this.scale) / 2;

    this.init();
  }

  createLines() {
    this.lines = [
      new Line({
        dots: [
          { x: 360 * this.scale, y: 0 },
          {
            x: (260 + this.spacing) * this.scale,
            y: (100 - this.spacing) * this.scale
          }
        ]
      }),
      new Line({
        dots: [
          {
            x: (260 + this.spacing) * this.scale,
            y: (420 + this.spacing) * this.scale
          },
          { x: 500 * this.scale, y: 660 * this.scale }
        ]
      }),
      // Начало работ y += 510
      new Line({
        dots: [
          { x: 500 * this.scale, y: (660 + 48 + 60 + 60) * this.scale }, // y = 828
          {
            x: (260 + this.spacing) * this.scale,
            y: (828 + 240 - this.spacing) * this.scale
          }
        ]
      }),
      new Line({
        dots: [
          {
            x: (260 + this.spacing) * this.scale,
            y: (1068 + 510 + this.spacing) * this.scale
          },
          {
            x: (740 - this.spacing) * this.scale,
            y: (1068 + 510 + 480 - this.spacing) * this.scale
          }
        ]
      }),
      new Line({
        dots: [
          {
            x: (740 - this.spacing) * this.scale,
            y: (2058 + 510 + this.spacing) * this.scale
          },
          {
            x: (260 + this.spacing) * this.scale,
            y: (2568 + 480 - this.spacing) * this.scale
          }
        ]
      }),
      new Line({
        dots: [
          {
            x: (260 + this.spacing) * this.scale,
            y: (3048 + 510 + this.spacing) * this.scale
          },
          {
            x: (740 - this.spacing) * this.scale,
            y: (3558 + 480 - this.spacing) * this.scale
          }
        ]
      }),
      new Line({
        dots: [
          {
            x: (740 - this.spacing) * this.scale,
            y: (3558 + 480 + 510 + this.spacing) * this.scale
          },
          {
            x: (260 - 130 + this.spacing) * this.scale,
            y: (3558 + 130 + 480 + 510 + 480 - this.spacing) * this.scale
          }
        ]
      }),
      // После работ
      new Line({
        dots: [
          {
            x: (500 + this.spacing) * this.scale,
            y: (5158 + this.showBlockHeight + this.spacing) * this.scale
          },
          {
            x: (740 - this.spacing) * this.scale,
            y: (5158 + 240 + this.showBlockHeight - this.spacing) * this.scale
          }
        ]
      }),
      new Line({
        dots: [
          {
            x: (740 - this.spacing) * this.scale,
            y: (5398 + 60 + this.showBlockHeight + this.spacing) * this.scale
          },
          {
            x: (130 + this.spacing) * this.scale,
            y: (5518 + 550 + this.showBlockHeight - this.spacing) * this.scale
          }
        ]
      })
    ];
  }

  renderLines() {
    this.linesContext.clearRect(
      0,
      0,
      this.linesCanvas.width,
      this.linesCanvas.height
    );
    for (let i = 0; i < this.lines.length; i += 1) {
      this.linesContext.drawImage(
        this.lines[i].canvas,
        0,
        this.lines[i].dots[0].y
      );
    }
  }

  updateSize() {
    this.scale = this.parent.scale;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // Центрирование контента
    this.centering = (window.innerWidth - 1000 * this.scale) / 2;
    this.createLines();
    this.renderLines();
  }

  init() {
    this.createLines();
    this.renderLines();
    this.render();
    this.parent.ready();
  }

  updateXY() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;
  }

  render() {
    // console.log('render shines');
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(
      this.linesCanvas,
      0,
      this.currentY,
      this.canvas.width,
      this.canvas.height / 2,
      this.centering + this.currentX / 100,
      0,
      this.canvas.width,
      this.canvas.height / 2
    );
  }
}

export default Lines;
