// export default class Group extends Object {
//   constructor(opts) {
//     super(opts);
//     Object.keys(opts).forEach(opt => this.opt = opts[opt]);
//     this.children = [];
//     this.cleared = true;
//   }
//   updateXY(currentX = this.currentX, currentY = this.currentY) {
//     const { dx, dy, scale, spacing, children } = this;
//     this.currentX = currentX;
//     this.currentY = currentY;
//     this.x = dx * scale - currentX + spacing;
//     this.y = dy * scale - currentY;
//     children.forEach(child => child.updateXY(this.x, this.y))
//   }
//   handleResize(scale, spacing) {
//     const { children, currentX, currentY, dx, dy } = this;
//     this.scale = scale;
//     this.spacing = spacing;
//     this.x = dx * scale - currentX + spacing;
//     this.y = dy * scale - currentY;
//     children.forEach(child => child.handleResize(this.x, this.y, scale));
//   }
//   clearDirt() {
//     this.context.clearRect(
//       this.dirtDots.x,
//       this.dirtDots.y,
//       this.dirtDots.w,
//       this.dirtDots.h
//     );
//     this.cleared = true;
//   }

//   calculateDirt() {
//     const { children } = this;
//     const indexes = { left: 0, up: 0, down: 0, right: 0 };
//     children.forEach((child, i) => {
//       if (child.attrs.x < child[indexes.left]) indexes.left = i;
//       if (child.attrs.y < child[indexes.up]) indexes.up = i;
//       if (
//         child.attrs.width > child[indexes.right].attrs.width &&
//         child.attrs.x > child[indexes.right].attrs.x
//       ) child[indexes.right]
//     })


//     const x = this.x > 0 ? this.x - 4 : 0;
//     const y = this.y > 0 ? this.y - 4 : 0;
//     const w = this.x > 0 ? 600 * this.scale + 8 : 600 * this.scale + 8 + this.x;
//     const h = this.y > 0 ? 355 * this.scale + 8 : 355 * this.scale + 8 + this.y;
//     this.dirtDots = { x, y, w, h };
//   }

//   checkWindow() {
//     if (
//       (0 > this.y && window.innerHeight < this.y + LOGO.height * this.scale) ||
//       (0 < this.y && window.innerHeight > this.y + LOGO.height * this.scale) ||
//       (0 < this.y && window.innerHeight > this.y) ||
//       (0 < this.y + LOGO.height * this.scale && window.innerHeight > this.y + LOGO.height * this.scale)
//     ) {
//       this.onWindow = true;
//       if (this.tl.progress() === 0) {
//         this.tl.play();
//       }
//     } else {
//       this.onWindow = false;
//     }
//   }

//   render() {
//     if (this.cleared === false) this.clearDirt();
//     this.logoImage.render(this.onWindow);
//     this.rect.render(this.onWindow, this.logoImage.played);
//     this.calculateDirt();
//     this.request = this.logoImage.checkRequest() || this.rect.checkRequest();
//   }
// }