/* globals window, document */

function drawLine(context, x0, y0, x1, y1) {
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
}

class Rhombus {
  constructor(opts) {
    this.parent = opts.parent;

    this.context = this.parent.context;

    this.scale = this.parent.scale;
    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    // Высота и ширина ромба
    this.width = opts.width * this.scale;
    this.halfWidth = this.width / 2;
    this.height = this.width;
    this.halfHeight = this.height / 2;

    // Картинка
    this.image = opts.image;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas
      .getContext('2d')
      .drawImage(this.image, 0, 0, this.width, this.height);
    this.imagePattern = this.context.createPattern(this.canvas, 'repeat');

    // Смещение относительно х и у
    this.dx = opts.dx * this.scale;
    this.dy = opts.dy * this.scale;

    // Текущие значения мыши по х и скролла по у
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    // Анимация
    this.onWindow = false;

    this.counterPart1 = 0;
    this.counterPart2 = 0;
    this.counters = 28; // 464.8ms / 16.6ms = 28 - на линии
    this.speed = this.width / this.counters;

    this.counterPart1Speeded = this.counterPart1 * this.speed;
    this.counterPart2Speeded = this.counterPart1 * this.speed;

    // Инициализация точек:

    // Позиционирование / смещение при рисовании якобы в (0,0)
    this.x = this.dx - this.currentX;
    this.y = this.dy - this.currentY;

    this.upperPartReady = false;
    this.downPartReady = false;

    this.moveX0 = this.x + this.halfWidth;
    this.moveX1 = this.moveX0;

    
    
    this.x00 = this.x + this.halfWidth;
    this.x01 = this.x00 + this.counterPart1Speeded;
    this.x02 = this.x00 - this.counterPart1Speeded;

    this.x10 = this.x;
    this.x11 = this.x + this.width;
    this.x12 = this.x + this.counterPart2Speeded;
    this.x13 = this.x + this.width - this.counterPart2Speeded;

    this.y0 = this.y;
    this.y1 = this.y + this.counterPart1Speeded;
    this.y2 = this.y + this.halfHeight;
    this.y3 = this.y2 + this.counterPart2Speeded;

    // Отчистка грязного ромба
    this.imageAlpha = 0;
    this.cleared = false;
  }

  // Анимации и обновление точек
  calculateDots() {
    // Обновление точек:
    this.x = this.dx - this.currentX;
    this.y = this.dy - this.currentY;
    this.x00 = this.x + this.width / 2;
    this.x01 = this.x00 + this.counterPart1 * this.speed;
    this.x02 = this.x00 - this.counterPart1 * this.speed;

    this.x10 = this.x;
    this.x11 = this.x + this.width;
    this.x12 = this.x + this.counterPart2 * this.speed;
    this.x13 = this.x + this.width - this.counterPart2 * this.speed;

    this.y0 = this.y;
    this.y1 = this.y + this.counterPart1 * this.speed;
    this.y2 = this.y + this.height / 2;
    this.y3 = this.y2 + this.counterPart2 * this.speed;

    //
  }

  // Обновление точек без отрисовки
  silentDraw() {
    this.counterPart1 += 0.1;
    if (this.counterPart1 > 14) {
      this.counterPart1 = 14;
      this.counterPart2 += 0.1;
      if (this.counterPart2 > 14) {
        this.counterPart2 = 14;
        this.imageAlpha += 1 / 100;
        if (this.imageAlpha > 1) {
          this.imageAlpha = 1;
          this.rendered = true;
          this.animating = false;
        }
      }
    }
  }

  // Отрисовка точек и картинки
  drawImage() {
    this.context.save();
    this.context.translate(this.x, this.y);
    this.context.globalAlpha = this.imageAlpha;
    this.context.fillStyle = this.imagePattern;
    // this.context.drawImage(this.image, this.x, this.y);
    this.context.fill();
    this.context.restore();
  }

  draw() {
    this.clearDirt();
    this.calculateDots();
    this.updateDirtyDots();

    this.context.beginPath();
    this.context.lineWidth = 5;
    this.context.strokeStyle = 'white';

    if (this.counterPart2 !== 14) {
      drawLine(this.context, this.x00, this.y0, this.x01, this.y1);
      drawLine(this.context, this.x00, this.y0, this.x02, this.y1);
      drawLine(this.context, this.x10, this.y2, this.x12, this.y3);
      drawLine(this.context, this.x11, this.y2, this.x13, this.y3);
    } else {
      this.context.moveTo(this.x00, this.y0);
      this.context.lineTo(this.x01, this.y1);
      this.context.lineTo(this.x12, this.y3);
      this.context.lineTo(this.x02, this.y1);
      this.context.lineTo(this.x00, this.y0);
      this.drawImage();
    }
    this.context.closePath();
    this.context.stroke();

    this.cleared = false;
  }

  // Быстрая отрисовка точек
  fastDraw() {
    this.clearDirt();
    this.calculateDots();
    this.updateDirtyDots();

    this.context.beginPath();
    this.context.lineWidth = 5;
    this.context.strokeStyle = 'white';
    this.context.moveTo(this.x00, this.y0);
    this.context.lineTo(this.x01, this.y1);
    this.context.lineTo(this.x12, this.y3);
    this.context.lineTo(this.x02, this.y1);
    this.context.lineTo(this.x00, this.y0);
    this.drawImage();
    this.context.closePath();
    this.context.stroke();

    this.cleared = false;
  }

  // Анимация появления
  animate() {
    this.silentDraw();
    this.draw();
  }

  // Обновление точек грязного прямоугольника
  updateDirtyDots() {
    this.dirtyX0 = this.x - 4 > 0 ? this.x - 4 : 0;
    this.dirtyY0 = this.y - 4 > 0 ? this.y - 4 : 0;
    this.dirtyWidth = this.width + 8;
    this.dirtyHeight = this.height + 8;
  }

  // Чистка грязного прямоугольника
  clearDirt() {
    this.context.clearRect(
      this.dirtyX0,
      this.dirtyY0,
      this.dirtyWidth,
      this.dirtyHeight
    );
    this.cleared = true;
  }

  checkRequest() {
    return (!this.onWindow && !this.cleared) || this.animating;
  }

  handleResize() {
    this.scale = this.parent.scale;
    this.width = 355 * this.scale;
    this.height = this.width;

    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;

    this.speed = this.width / this.counters;
    this.counterPart1Speeded = this.counterPart1 * this.speed;
    this.counterPart2Speeded = this.counterPart1 * this.speed;

    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;
  }

  isOnWidnow() {
    if (
      (this.dy > this.currentY - 4 &&
        this.dy < this.currentY + this.windowHeight + 4) ||
      (this.dy + this.height > this.currentY - 4 &&
        this.dy + this.height < this.currentY + this.windowHeight + 4)
    ) {
      this.onWindow = true;
    } else {
      this.onWindow = false;
    }
  }

  updateXY() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.isOnWidnow();
  }

  render() {
    if (this.onWindow) {
      if (this.animating) {
        this.animate();
      } else if (this.rendered) {
        this.fastDraw();
      } else {
        this.animating = true;
        this.animate();
      }
    } else if (this.animating) {
      if (!this.cleared) {
        this.clearDirt();
      }
      this.silentDraw();
    } else if (!this.cleared) {
      this.clearDirt();
    }
  }
}

class WorkRhombus {
  constructor(opts) {
    this.parent = opts.parent;

    this.context = this.parent.context;

    this.scale = this.parent.scale;
    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    // Высота и ширина ромба
    this.width = opts.width * this.scale;
    this.halfWidth = this.width / 2;
    this.height = this.width;
    this.halfHeight = this.height / 2;

    // Высота и ширина кнопки
    this.buttonWidth = 128 * this.scale;
    this.halfButtonWidth = this.buttonWidth / 2;
    this.buttonHeight = this.buttonWidth;
    this.halfButtonHeight = this.buttonHeight / 2;

    // тотал высота и ширина
    this.totalWidth = this.width;
    this.totalHeight = this.height + this.buttonHeight + 13 * this.scale;

    // Картинка
    this.image = opts.image;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas
      .getContext('2d')
      .drawImage(this.image, 0, 0, this.width, this.height);
    this.imagePattern = this.context.createPattern(this.canvas, 'repeat');

    // Инкремент

    // Смещение относительно х и у
    this.dx = opts.dx * this.scale;
    this.dy = opts.dy * this.scale;

    // Текущие значения мыши по х и скролла по у
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    // Анимация
    this.onWindow = false;

    this.counters = 28; // 464.8ms / 16.6ms = 28 - на линии
    this.speed = this.width / this.counters;
    this.counterPart1 = 0;
    this.counterPart2 = 0;

    this.counterPart1Speeded = this.counterPart1 * this.speed;
    this.counterPart2Speeded = this.counterPart1 * this.speed;

    // Анимаця кнопки
    this.buttonSpeed = this.buttonWidth / this.counters;
    this.buttonLinesCounterPart1 = 0;
    this.buttonLinesCounterPart2 = 0;
    this.buttonLinesCounterPart1Speeded =
      this.buttonLinesCounterPart1 * this.buttonSpeed;
    this.buttonLinesCounterPart2Speeded =
      this.buttonLinesCounterPart2 * this.buttonSpeed;

    // Инициализация точек:
    this.x = this.dx - this.currentX;
    this.y = this.dy - this.currentY;
    this.x00 = this.x + this.halfWidth;
    this.x01 = this.x00 + this.counterPart1Speeded;
    this.x02 = this.x00 - this.counterPart1Speeded;

    this.x10 = this.x;
    this.x11 = this.x + this.width;
    this.x12 = this.x + this.counterPart2Speeded;
    this.x13 = this.x + this.width - this.counterPart2Speeded;

    this.y0 = this.y;
    this.y1 = this.y + this.counterPart1Speeded;
    this.y2 = this.y + this.halfHeight;
    this.y3 = this.y2 + this.counterPart2Speeded;

    // Кнопка
    this.xb = this.x + this.halfWidth - this.halfButtonWidth; // центровка
    this.yb = this.y + this.height + 13 * this.scale;
    this.x00b = this.xb + this.halfButtonWidth;
    this.x01b = this.x00b + this.buttonLinesCounterPart1Speeded;
    this.x02b = this.x00b - this.buttonLinesCounterPart1Speeded;

    this.x10b = this.xb;
    this.x11b = this.xb + this.buttonWidth;
    this.x12b = this.xb + this.buttonLinesCounterPart2Speeded;
    this.x13b =
      this.xb + this.buttonWidth - this.buttonLinesCounterPart2Speeded;

    this.y0b = this.yb; // начало ромба по высоте
    this.y1b = this.yb + this.buttonLinesCounterPart1Speeded;
    this.y2b = this.yb + this.halfButtonHeight;
    this.y3b = this.y2b + this.buttonLinesCounterPart2Speeded; // конец ромба по высоте

    // Отчистка грязного ромба
    this.imageAlpha = 0;
    this.cleared = false;
  }

  // Анимации и обновление точек
  calculateDots() {
    // Обновление точек:
    this.x = this.dx - this.currentX;
    this.y = this.dy - this.currentY;
    this.x00 = this.x + this.width / 2;
    this.x01 = this.x00 + this.counterPart1 * this.speed;
    this.x02 = this.x00 - this.counterPart1 * this.speed;

    this.x10 = this.x;
    this.x11 = this.x + this.width;
    this.x12 = this.x + this.counterPart2 * this.speed;
    this.x13 = this.x + this.width - this.counterPart2 * this.speed;

    this.y0 = this.y; // начало ромба по высоте
    this.y1 = this.y + this.counterPart1 * this.speed;
    this.y2 = this.y + this.height / 2;
    this.y3 = this.y2 + this.counterPart2 * this.speed; // конец ромба по высоте

    // Кнопка
    this.xb = this.x + this.halfWidth - this.halfButtonWidth; // центровка
    this.yb = this.y + this.height + 13 * this.scale;
    this.x00b = this.xb + this.halfButtonWidth;
    this.x01b = this.x00b + this.buttonLinesCounterPart1 * this.buttonSpeed;
    this.x02b = this.x00b - this.buttonLinesCounterPart1 * this.buttonSpeed;

    this.x10b = this.xb;
    this.x11b = this.xb + this.buttonWidth;
    this.x12b = this.xb + this.buttonLinesCounterPart2 * this.buttonSpeed;
    this.x13b =
      this.xb +
      this.buttonWidth -
      this.buttonLinesCounterPart2 * this.buttonSpeed;

    this.y0b = this.yb; // начало ромба по высоте
    this.y1b = this.yb + this.buttonLinesCounterPart1 * this.buttonSpeed;
    this.y2b = this.yb + this.halfButtonHeight;
    this.y3b = this.y2b + this.buttonLinesCounterPart2 * this.buttonSpeed; // конец ромба по высоте
    //
  }

  // Обновление точек без отрисовки
  silentDraw() {
    this.counterPart1 += 1;
    if (this.counterPart1 > 14) {
      this.counterPart1 = 14;
      this.counterPart2 += 1;
      if (this.counterPart2 > 14) {
        this.counterPart2 = 14;
        this.imageAlpha += 1 / 20;
        if (this.imageAlpha > 1) {
          this.imageAlpha = 1;
          this.buttonLinesCounterPart1 += 1;
          if (this.buttonLinesCounterPart1 > 14) {
            this.buttonLinesCounterPart1 = 14;
            this.buttonLinesCounterPart2 += 1;
            if (this.buttonLinesCounterPart2 > 14) {
              this.buttonLinesCounterPart2 = 14;
              this.rendered = true;
              this.animating = false;
            }
          }
        }
      }
    }
  }

  // Отрисовка точек и картинки
  drawImage() {
    this.context.save();
    this.context.translate(this.x, this.y);
    this.context.globalAlpha = this.imageAlpha;
    this.context.fillStyle = this.imagePattern;
    // this.context.drawImage(this.image, this.x, this.y);
    this.context.fill();
    this.context.restore();
  }

  draw() {
    this.clearDirt();
    this.calculateDots();
    this.updateDirtyDots();

    this.context.beginPath();
    this.context.lineWidth = 2;
    this.context.strokeStyle = 'white';

    if (this.counterPart2 !== 14) {
      drawLine(this.context, this.x00, this.y0, this.x01, this.y1);
      drawLine(this.context, this.x00, this.y0, this.x02, this.y1);
      drawLine(this.context, this.x10, this.y2, this.x12, this.y3);
      drawLine(this.context, this.x11, this.y2, this.x13, this.y3);
    } else {
      this.context.moveTo(this.x00, this.y0);
      this.context.lineTo(this.x01, this.y1);
      this.context.lineTo(this.x12, this.y3);
      this.context.lineTo(this.x02, this.y1);
      this.context.lineTo(this.x00, this.y0);
      this.drawImage();
    }
    this.context.closePath();
    this.context.stroke();

    this.context.beginPath();
    this.context.lineWidth = 2;
    this.context.strokeStyle = 'white';
    if (this.buttonLinesCounterPart2 !== 14 && this.counterPart2 === 14) {
      drawLine(this.context, this.x00b, this.y0b, this.x01b, this.y1b);
      drawLine(this.context, this.x00b, this.y0b, this.x02b, this.y1b);
      drawLine(this.context, this.x10b, this.y2b, this.x12b, this.y3b);
      drawLine(this.context, this.x11b, this.y2b, this.x13b, this.y3b);
    } else if (this.buttonLinesCounterPart2 === 14) {
      this.context.moveTo(this.x00b, this.y0b);
      this.context.lineTo(this.x01b, this.y1b);
      this.context.lineTo(this.x12b, this.y3b);
      this.context.lineTo(this.x02b, this.y1b);
      this.context.lineTo(this.x00b, this.y0b);
    }
    this.context.closePath();
    this.context.stroke();

    this.cleared = false;
  }

  // Быстрая отрисовка точек
  fastDraw() {
    this.clearDirt();
    this.calculateDots();
    this.updateDirtyDots();

    this.context.beginPath();
    this.context.lineWidth = 2;
    this.context.strokeStyle = 'white';
    this.context.moveTo(this.x00, this.y0);
    this.context.lineTo(this.x01, this.y1);
    this.context.lineTo(this.x12, this.y3);
    this.context.lineTo(this.x02, this.y1);
    this.context.lineTo(this.x00, this.y0);
    this.drawImage();
    this.context.closePath();
    this.context.stroke();

    this.context.beginPath();
    this.context.lineWidth = 2;
    this.context.strokeStyle = 'white';
    this.context.moveTo(this.x00b, this.y0b);
    this.context.lineTo(this.x01b, this.y1b);
    this.context.lineTo(this.x12b, this.y3b);
    this.context.lineTo(this.x02b, this.y1b);
    this.context.lineTo(this.x00b, this.y0b);
    this.context.closePath();
    this.context.stroke();

    this.cleared = false;
  }

  // Анимация появления
  animate() {
    this.silentDraw();
    this.draw();
  }

  // Обновление точек грязного прямоугольника
  updateDirtyDots() {
    const x4 = this.x - 4;
    const y4 = this.y - 4;
    this.dirtyX0 = x4 > 0 ? x4 : 0;
    this.dirtyY0 = y4 > 0 ? y4 : 0;
    this.dirtyWidth = this.width + 8;
    this.dirtyHeight = this.height + 13 * this.scale + this.buttonHeight + 8;
  }

  // Чистка грязного прямоугольника
  clearDirt() {
    this.context.clearRect(
      this.dirtyX0,
      this.dirtyY0,
      this.dirtyWidth,
      this.dirtyHeight
    );
    this.context.clearRect(
      this.dirtyX0b,
      this.dirtyY0b,
      this.dirtyWidthb,
      this.dirtyHeightb
    );
    this.cleared = true;
  }

  checkRequest() {
    return (!this.onWindow && !this.cleared) || this.animating;
  }

  handleResize() {
    this.scale = this.parent.scale;
    // Главный ромб
    this.width = 355 * this.scale;
    this.height = this.width;
    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;

    this.speed = this.width / this.counters;
    this.counterPart1Speeded = this.counterPart1 * this.speed;
    this.counterPart2Speeded = this.counterPart1 * this.speed;

    // Кнопка
    this.buttonWidth = 128 * this.scale;
    this.buttonHeight = this.buttonWidth;
    this.halfButtonWidth = this.buttonWidth / 2;
    this.halfButtonHeight = this.halfButtonWidth;

    this.buttonSpeed = this.buttonWidth / this.counters;
    this.buttonLinesCounterPart1Speeded =
      this.buttonLinesCounterPart1 * this.buttonSpeed;
    this.buttonLinesCounterPart2Speeded =
      this.buttonLinesCounterPart2 * this.buttonSpeed;

    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;
  }

  isOnWidnow() {
    if (
      (this.dy > this.currentY - 4 &&
        this.dy < this.currentY + this.windowHeight + 4) ||
      (this.dy + this.height + 13 * this.scale + this.buttonHeight >
        this.currentY - 4 &&
        this.dy + this.height + 13 * this.scale + this.buttonHeight <
          this.currentY + this.windowHeight + 4)
    ) {
      this.onWindow = true;
    } else {
      this.onWindow = false;
    }
  }

  updateXY() {
    this.currentX = this.parent.currentX;
    this.currentY = this.parent.currentY;

    this.isOnWidnow();
  }

  render() {
    if (this.onWindow) {
      if (this.animating) {
        this.animate();
      } else if (this.rendered) {
        this.fastDraw();
      } else {
        this.animating = true;
        this.animate();
      }
    } else if (this.animating) {
      if (!this.cleared) {
        this.clearDirt();
      }
      this.silentDraw();
    } else if (!this.cleared) {
      this.clearDirt();
    }
  }
}

class Blocks {
  constructor(opts) {
    window.Blocks = this;

    this.parent = opts.parent;
    this.scale = this.parent.scale;
    this.spacing = this.parent.spacing;

    // Выделение памяти под переменные
    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.windowHeight / 2;

    // Создание холста
    this.canvas = document.querySelector('canvas.blocks');
    this.canvas.width = this.windowWidth;
    this.canvas.height = this.windowHeight;
    this.context = this.canvas.getContext('2d');
    this.context.imageSmoothingEnabled = false;

    // Движение
    this.clientX = 0;
    this.currentX = this.clientX;
    this.clientY = window.pageYOffset;
    this.currentY = this.clientY;

    // Выделение памяти под блоки
    this.firstBlock = undefined;
    this.workBlock1 = undefined;
    this.workBlock2 = undefined;
    this.workBlock3 = undefined;
    this.workBlock4 = undefined;
    this.showBlock = undefined;

    this.request = false;

    this.imagesStates = 0;
    this.images = [];

    this.initImages();
  }

  init() {
    this.firstRhombus = new Rhombus({
      parent: this,
      width: 355,
      dx: 93,
      dy: 205.5,
      image: this.images[0]
    });
    this.workBlock1 = new WorkRhombus({
      parent: this,
      width: 355,
      dx: 110,
      dy: 1190,
      image: this.images[1]
    });
    this.workBlock2 = new WorkRhombus({
      parent: this,
      width: 355,
      dx: 456,
      dy: 1897,
      image: this.images[2]
    });
    this.workBlock3 = new WorkRhombus({
      parent: this,
      width: 355,
      dx: 111,
      dy: 2606,
      image: this.images[3]
    });
    this.workBlock4 = new WorkRhombus({
      parent: this,
      width: 355,
      dx: 454,
      dy: 3313,
      image: this.images[4]
    });

    this.parent.ready();
  }

  initImages() {
    this.images.push(document.createElement('img')); // logo 0
    this.images.push(document.createElement('img')); // work 1
    this.images.push(document.createElement('img')); // work 2
    this.images.push(document.createElement('img')); // work 3
    this.images.push(document.createElement('img')); // work 4

    for (let i = 0; i < this.images.length; i += 1) {
      this.images[i].onload = () => {
        this.imagesStates += 1;
        if (this.imagesStates === this.images.length) {
          this.init();
        }
      };
    }

    this.images[0].src =
      'https://ih0.redbubble.net/image.523026213.1540/stf,small,600x600.jpg';
    this.images[1].src =
      'https://ih0.redbubble.net/image.523026213.1540/stf,small,600x600.jpg';
    this.images[2].src =
      'https://ih0.redbubble.net/image.523026213.1540/stf,small,600x600.jpg';
    this.images[3].src =
      'https://ih0.redbubble.net/image.523026213.1540/stf,small,600x600.jpg';
    this.images[4].src =
      'https://ih0.redbubble.net/image.523026213.1540/stf,small,600x600.jpg';
  }

  checkRequest() {
    this.request =
      this.firstRhombus.checkRequest() ||
      this.workBlock1.checkRequest() ||
      this.workBlock2.checkRequest() ||
      this.workBlock3.checkRequest() ||
      this.workBlock4.checkRequest();
  }

  updateXY() {
    this.currentX = this.parent.currentX / 10;
    this.currentY = this.parent.currentY;

    this.firstRhombus.updateXY();
    this.workBlock1.updateXY();
    this.workBlock2.updateXY();
    this.workBlock3.updateXY();
    this.workBlock4.updateXY();
  }

  handleResize() {
    this.scale = this.parent.scale;
    this.windowWidth = this.parent.windowWidth;
    this.halfWindowHeight = this.windowHeight / 2;
    this.windowHeight = this.parent.windowHeight;

    this.canvas.width = this.windowWidth;
    this.canvas.height = this.windowHeight;

    this.spacing = this.parent.spacing;

    this.firstRhombus.handleResize();
    this.workBlock1.handleResize();
    this.workBlock2.handleResize();
    this.workBlock3.handleResize();
    this.workBlock4.handleResize();
  }

  render() {
    this.firstRhombus.render();
    this.workBlock1.render();
    this.workBlock2.render();
    this.workBlock3.render();
    this.workBlock4.render();

    this.checkRequest();
  }
}

export default Blocks;

/**
 * blocks.render(); ->
 * -> block.render();
 * - - > (1)
 *
 *
 */
