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
    window.Lines = this;

    this.canvas = document.querySelector('canvas.shines');
    this.canvas.width = 1024;
    // this.canvas.height = window.innerHeight;
    this.canvas.height = 10000;
    this.context = this.canvas.getContext('2d');

    this.bufferCanvas = document.createElement('canvas');
    this.bufferCanvas.width = 1024;
    this.bufferCanvas.height = 10000;
    this.bufferContext = this.bufferCanvas.getContext('2d');

    this.scroll = window.scrollY + window.innerHeight / 2;


    // 196 по y
    this.lines = [
      new Line({ dots: [{ x: 478, y: 0 }, { x: 314, y: 164 }] }),
      new Line({
        dots: [{ x: 344, y: 538 }, { x: 540, y: 734 }]
      }),
      // Начало работ y += 520
      new Line({
        dots: [{ x: 540, y: 872 }, { x: 344, y: 1068 }]
      }),
      new Line({
        dots: [{ x: 344, y: 1588 }, { x: 540, y: 1784 }]
      }),
      new Line({
        dots: [{ x: 540, y: 2304 }, { x: 344, y: 2500 }]
      }),
      new Line({
        dots: [{ x: 344, y: 3020 }, { x: 540, y: 3216 }]
      }),
      new Line({
        dots: [{ x: 540, y: 3736 }, { x: 148, y: 4128 }]
      }),
    ];

    this.preparePattern();
    this.render();
    this.listen();
  }

  preparePattern() {
    for (let i = 0; i < this.lines.length; i += 1) {
      this.bufferContext.drawImage(
        this.lines[i].canvas,
        0,
        this.lines[i].dots[0].y
      );
    }
  }

  listen() {
    document.addEventListener('scroll', () => {
      this.scroll = window.scrollY + window.innerHeight / 2;
      this.render();
    });
  }

  render() {
    this.context.clearRect(0, 0, 1024, 10000);

    // this.context.drawImage(this.bufferCanvas, 0, 0);
    // this.context.drawImage(
    //   this.bufferCanvas,
    //   0,
    //   0,
    //   1024,
    //   this.scroll,
    //   0,
    //   0,
    //   1024,
    //   this.scroll
    // );
    this.context.drawImage(this.bufferCanvas, 0, 0);
  }
}

export default Lines;
