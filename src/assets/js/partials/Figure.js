export default class Figure extends Object {
  constructor({ parent, scale, context, dx, dy, ...rest }) {
    super(rest);
    this.parent = parent;
    this.scale = scale;
    this.context = context;
    this.x = dx;
    this.y = dy;
  }

  updateXY(x, y) {
    this.ready = false;
    this.x = x;
    this.y = y;
  }
  handleResize(x, y, scale) {
    this.ready = false;
    this.x = x;
    this.y = y;
    this.scale = scale;
  }
}