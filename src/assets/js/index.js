class LineRhombus {
  constructor(opts) {
    this.canvas = document.createElement("canvas");
    this.w = this.canvas.width = opts.width;
    this.h = this.canvas.height = opts.height;
    this.context = this.canvas.getContext("2d");

    this.render();
  }
  update(opts) {
    this.w = this.canvas.width = opts.width;
    this.h = this.canvas.height = opts.scale;
    this.render();
  }
  render() {
    this.context.clearRect(0, 0, this.w, this.h);
    this.context.beginPath();
    this.context.strokeStyle = "red";
    this.context.moveTo(this.w / 2, 0);
    this.context.lineTo(this.w, this.h / 2);
    this.context.lineTo(this.w / 2, this.h);
    this.context.lineTo(0, this.h / 2);
    this.context.lineTo(this.w / 2, 0);
    this.context.stroke();
  }
}

class LogoRhombus {
  constructor(opts) {
    this.canvas = document.createElement("canvas");
    this.w = this.canvas.width = opts.width;
    this.h = this.canvas.height = opts.height;
    this.context = this.canvas.getContext("2d");
    this.logoImage = opts.logoImage;
    this.rhombus = new LineRhombus({ width: this.w, height: this.h });
    window.logo = this;
    this.listen();
  }
  listen() {
    this.logoImage.addEventListener("load", () => {
      this.render();
    });
  }
  render() {
    const maxSide =
      this.logoImage.width > this.logoImage.height ? "width" : "height";
    let dw, dh, dscale;
    switch (maxSide) {
      case "width":
        dw = (this.w * 3) / 5;
        dscale = dw / this.logoImage.width;
        dh = this.logoImage.height * dscale;
        break;
      case "height":
        dh = (this.h * 3) / 5;
        dscale = dh / this.logoImage.height;
        dw = this.logoImage.width * dscale;
        break;
    }
    console.log(dh, dw);
    this.context.clearRect(0, 0, this.w, this.h);
    this.context.drawImage(this.rhombus.canvas, 0, 0);
    this.context.drawImage(
      this.logoImage,
      this.w / 2 - dw / 2,
      this.h / 2 - dh / 2,
      dw,
      dh
    );
    // тестинг
    document
      .querySelector("canvas")
      .getContext("2d")
      .drawImage(this.canvas, 0, 0);
  }
}

class FirstBlock {
  constructor(opts) {
    this.canvas = document.createElement("canvas");
    this.w = this.canvas.width = window.innerWidth;
    this.h = this.canvas.height = window.innerHeight;
  }
}
class ProjectBlock {
  constructor(opts) {}
}

export default LogoRhombus;
// пересечкние линий - начало градиентов
// выполненные работы скролл к центру ромба. Если у блока есть градиент, то лучше к пересечению линий

// Перывй блок - 2 линии, градиенты, х1 снизу

// Блоки с работой, полоса сверху. Деляится на 2 типа: полоса справа, полоса слева.
// Если полоса справа, то градиент

// Блок примера работ с градиентом и  h2 'сотрудничество'

// Блок партнеры градиенрт, аналог блока сотрудничества

// Блок продукция - аналог примера работ без линий, только градинт
