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
    this.scale = opts.scale;
    this.parent = opts.parent;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.innerWidth;
    this.showBlockHeight = this.parent.blocks.blocks[6].canvas.height;
    const spacing = 60;
    this.canvas.height = (6068 + this.showBlockHeight - spacing) * this.scale;

    this.lines = [
      new Line({
        dots: [
          { x: 360 * this.scale, y: 0 },
          { x: (260 + spacing) * this.scale, y: (100 - spacing) * this.scale }
        ]
      }),
      new Line({
        dots: [
          { x: (260 + spacing) * this.scale, y: (420 + spacing) * this.scale },
          { x: 500 * this.scale, y: 660 * this.scale }
        ]
      }),
      // Начало работ y += 510
      new Line({
        dots: [
          { x: 500 * this.scale, y: (660 + 48 + 60 + 60) * this.scale }, // y = 828
          {
            x: (260 + spacing) * this.scale,
            y: (828 + 240 - spacing) * this.scale
          }
        ]
      }),
      new Line({
        dots: [
          {
            x: (260 + spacing) * this.scale,
            y: (1068 + 510 + spacing) * this.scale
          },
          {
            x: (740 - spacing) * this.scale,
            y: (1068 + 510 + 480 - spacing) * this.scale
          }
        ]
      }),
      new Line({
        dots: [
          {
            x: (740 - spacing) * this.scale,
            y: (2058 + 510 + spacing) * this.scale
          },
          {
            x: (260 + spacing) * this.scale,
            y: (2568 + 480 - spacing) * this.scale
          }
        ]
      }),
      new Line({
        dots: [
          {
            x: (260 + spacing) * this.scale,
            y: (3048 + 510 + spacing) * this.scale
          },
          {
            x: (740 - spacing) * this.scale,
            y: (3558 + 480 - spacing) * this.scale
          }
        ]
      }),
      new Line({
        dots: [
          {
            x: (740 - spacing) * this.scale,
            y: (3558 + 480 + 510 + spacing) * this.scale
          },
          {
            x: (260 - 130 + spacing) * this.scale,
            y: (3558 + 130 + 480 + 510 + 480 - spacing) * this.scale
          }
        ]
      }),
      // После работ
      new Line({
        dots: [
          {
            x: (500 + spacing) * this.scale,
            y: (5158 + this.showBlockHeight + spacing) * this.scale
          },
          {
            x: (740 - spacing) * this.scale,
            y: (5158 + 240 + this.showBlockHeight - spacing) * this.scale
          }
        ]
      }),
      new Line({
        dots: [
          {
            x: (740 - spacing) * this.scale,
            y: (5398 + 60 + this.showBlockHeight + spacing) * this.scale
          },
          {
            x: (130 + spacing) * this.scale,
            y: (5518 + 550 + this.showBlockHeight - spacing) * this.scale
          }
        ]
      })
    ];

    this.render();
  }

  render() {
    for (let i = 0; i < this.lines.length; i += 1) {
      this.canvas
        .getContext('2d')
        .drawImage(this.lines[i].canvas, 0, this.lines[i].dots[0].y);
    }
    this.parent.ready();
  }
}

export default Lines;
