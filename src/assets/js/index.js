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
    this.h = this.canvas.height = opts.height;
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

class FillRhombus {
  constructor(opts) {
    window.FillRhombus = this;
    this.canvas = document.createElement("canvas");
    this.w = this.canvas.width = opts.width;
    this.h = this.canvas.height = opts.height;
    this.context = this.canvas.getContext("2d");

    this.image = opts.image;
    this.context.drawImage(this.image, 0, 0, this.w, this.h);
    this.pattern = this.context.createPattern(this.canvas, "repeat");
    this.render();
  }

  update(opts) {
    this.w = this.canvas.width = opts.width;
    this.h = this.canvas.height = opts.height;
    this.render();
  }

  render() {
    this.context.clearRect(0, 0, this.w, this.h);
    this.context.beginPath();

    this.context.strokeStyle = "red";
    this.context.lineWidth = 2;
    this.context.fillStyle = this.pattern;

    this.context.moveTo(this.w / 2, 0);
    this.context.lineTo(this.w, this.h / 2);
    this.context.lineTo(this.w / 2, this.h);
    this.context.lineTo(0, this.h / 2);
    this.context.lineTo(this.w / 2, 0);

    this.context.fill();
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
        dw = (this.w * 3.4) / 6;
        dscale = dw / this.logoImage.width;
        dh = this.logoImage.height * dscale;
        break;
      case "height":
        dh = (this.h * 3.4) / 6;
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

class ShowRhombus {
  constructor(opts) {
    this.canvas = document.createElement("canvas");
    this.w = this.canvas.width = opts.width;
    this.h = this.canvas.height = opts.height;
    this.context = this.canvas.getContext("2d");

    this.image = opts.image;
    this.rhombus = new LineRhombus({ width: this.w, height: this.h });
  }
}

class FirstBlock {
  constructor(opts) {
    this.canvas = document.createElement("canvas");
    this.w = this.canvas.width = window.innerWidth;
    this.h = this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext("2d");

    this.line = "line"; // отсутпы по 50пх
    this.rhobmus = "rhombus";
    this.text = "text";
  }
}

class ProjectBlock {
  constructor(opts) {
    this.projects = opts.projects;
    // project = {title: 'title', image: 'image'}
  }
}

class ShowBlock {
  constructor(opts) {
    this.marginY = opts.marginY;
    this.shows = opts.shows;
    // shows = [{image, date, href}, {image, date, href}]
    this.canvas = document.createElement("canvas");
    this.w = this.canvas.width = opts.width;

    this.prepareLines(this.initLines());
    window.showBlock = this;
    this.h = this.canvas.height = opts.height;
  }

  initLines() {
    let lines = [];
    for (let i = 0, j = 0, c = 0; i < this.shows.length; i++) {
      if (j == 0) {
        lines.push([]);
      }
      if (c % 2 == 0) {
        lines[c].push(this.shows[i]);
        j++;
        if (j == 4) {
          j = 0;
          c++;
        }
      } else {
        lines[c].push(this.shows[i]);
        j++;
        if (j == 3) {
          j = 0;
          c++;
        }
      }
    }
    return lines;
  }
  prepareLines(lines) {
    this.lines = [];
    for (let i = 0; i < lines.length; i++) {
      this.lines.push({
        shows: lines[i],
        margin:
          1024 - 219 * lines[i].length - (29.6 * (lines[i].length - 1)) / 2,
        spaceBetweenLines: 29.6
      });
    }
  }

  render(){
    for(let i = 0; i < this.lines.length; i++){
      for(let j = 0; j < this.lines[i]; j++){
        
      }
    }
  }
}

export default ShowBlock;
// пересечкние линий - начало градиентов
// выполненные работы скролл к центру ромба. Если у блока есть градиент, то лучше к пересечению линий

// Перывй блок - 2 линии, градиенты, х1 снизу

// Блоки с работой, полоса сверху. Деляится на 2 типа: полоса справа, полоса слева.
// Если полоса справа, то градиент

// Блок примера работ с градиентом и  h2 'сотрудничество'

// Блок партнеры градиенрт, аналог блока сотрудничества

// Блок продукция - аналог примера работ без линий, только градинт
