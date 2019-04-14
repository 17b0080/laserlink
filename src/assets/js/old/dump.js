class Line {
  constructor(opts) {
    this.clientY = 0;
    this.dots = opts.dots;
    this.sign = Math.sign(this.dots[1].x - this.dots[0].x);

    this.canvas = document.createElement('canvas');
    this.w = this.canvas.width = Math.abs(this.dots[0].x - this.dots[1].x) * 2;
    this.h = this.canvas.height = Math.abs(this.dots[0].y - this.dots[1].y);
    this.context = this.canvas.getContext('2d');
  }

  update(clientY) {
    if (clientY < this.dots[0].y) {
      this.clientY = this.dots[0].y;
    }
    if (clientY > this.dots[0].y) {
      this.clientY = clientY;
    }
    if (clientY > this.dots[1].y) {
      this.clientY = this.dots[1].y;
    }
    this.render();
  }

  render() {
    this.context.clearRect(0, 0, this.w, this.h);
    this.context.beginPath();
    this.context.strokeStyle = 'blue';
    this.context.lineWidth = 2;
    this.context.moveTo(this.dots[0].x, 0);
    this.context.lineTo(
      this.dots[0].x + (this.clientY - this.dots[0].y) * this.sign,
      this.clientY - this.dots[0].y
    );
    this.context.stroke();
  }
}
