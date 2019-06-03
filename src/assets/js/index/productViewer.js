/* globals document */
function getWidthAndHeight(width, height, dW, dH) {
  let scale = 1;
  let w = width;
  let h = height;

  if (h < dH) {
    scale = dH / h;
    h = dH;
    w *= scale;
  }

  if (w < dW) {
    scale = dW / w;
    w = dW;
    h *= scale;
  }

  return { w, h };
}

function changeTranslateX(item, x) {
  // eslint-disable-next-line no-param-reassign
  item.style.transform = `translateX(${x}px)`;
}

function changeTranslate(item, x, y) {
  // eslint-disable-next-line no-param-reassign
  item.style.transform = `translate(${x}px, ${y}px)`;
}

class Background {
  constructor(opts) {
    this.parent = opts.parent;

    this.windowWidth = this.parent.windowWidth;
    this.windowHeight = this.parent.windowHeight;

    this.maxAlpha = 0.5;
    this.alpha = 0;

    this.time = 300;
    this.currentFrame = 0;
    this.frames = Math.round(this.time / 16.6); // 16.6ms на кадр при 60 кадрах/с
    this.speed = this.maxAlpha / this.frames;
  }

  open() {
    this.closeRequest = false;
    this.openRequest = true;
    this.closed = false;
    this.request = true;
  }

  close() {
    this.openRequest = false;
    this.closeRequest = true;
    this.opened = false;
    this.request = true;
  }

  updateAlpha() {
    this.alpha = this.speed * this.currentFrame;
  }

  nextOpenFrame() {
    this.currentFrame += 1;

    if (this.currentFrame >= this.frames) {
      this.currentFrame = this.frames;
      this.opened = true;
      this.openRequest = false;
    }

    this.updateAlpha();
  }

  nextCloseFrame() {
    this.currentFrame -= 1;

    if (this.currentFrame <= 0) {
      this.currentFrame = 0;
      this.closeRequest = false;
      this.closed = true;
    }

    this.updateAlpha();
  }

  drawFrame() {
    this.parent.context.save();
    this.parent.context.globalAlpha = this.alpha;
    this.parent.context.fillStyle = '#222222';
    this.parent.context.rect(0, 0, this.windowWidth, this.windowHeight);
    this.parent.context.fill();
    this.parent.context.restore();
  }

  render() {
    if (this.openRequest) {
      this.nextOpenFrame();
    } else if (this.closeRequest) {
      this.nextCloseFrame();
    }

    this.drawFrame();

    this.request = this.openRequest || this.closeRequest;
  }
}

class ImageRhombus {
  constructor(opts) {
    this.parent = opts.parent;
    this.currentX = this.parent.currentX;

    this.windowWidth = this.parent.windowWidth;
    this.halfWindowWidth = this.parent.halfWindowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    this.width = 550;
    this.halfWidth = this.width / 2;
    this.height = 550;
    this.halfHeight = this.height / 2;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height - 181;
    this.context = this.canvas.getContext('2d');

    this.time = 50;
    this.currentFrame = 0;
    this.frames = Math.round(this.time / 16.6); // 16.6ms на кадр при 60 кадрах/с
    this.speed = this.halfWidth / this.frames;

    this.framedDots = {
      x0: this.halfWidth + this.currentFrame * this.speed,
      x1: this.halfWidth,
      x2: this.halfWidth + this.currentFrame * this.speed,
      x3: this.halfWidth,
      y0: this.halfHeight,
      y1: this.halfHeight - this.currentFrame * this.speed,
      y2: this.halfHeight,
      y3: this.halfHeight + this.currentFrame * this.speed
    };

    // Покажем внутри какой фигуры мы будем рисовать
    // this.clip();

    this.request = false;
    this.openRequest = false;
    this.opened = false;
    this.closeRequest = false;
    this.closed = true;
  }

  updateXY() {
    this.currentX = this.parent.currentX;
  }

  open() {
    const { w, h } = getWidthAndHeight(
      this.parent.image.width,
      this.parent.image.height,
      this.canvas.width,
      this.canvas.height
    );

    this.w = w;
    this.h = h;
    this.openRequest = true;
    this.closeRequest = false;
    this.closed = false;
    this.request = true;
  }

  close() {
    this.closeRequest = true;
    this.openRequest = false;
    this.opened = false;
    this.request = true;
  }

  path() {
    this.parent.context.beginPath();
    this.parent.context.moveTo(this.framedDots.x0, this.framedDots.y0);
    this.parent.context.lineTo(this.framedDots.x1, this.framedDots.y1);
    this.parent.context.lineTo(this.framedDots.x2, this.framedDots.y2);
    this.parent.context.lineTo(this.framedDots.x3, this.framedDots.y3);
    this.parent.context.closePath();
  }

  updateDots() {
    this.framedDots = {
      x0: this.halfWindowWidth - this.currentFrame * this.speed - this.currentX,
      x1: this.halfWindowWidth - this.currentX,
      x2: this.halfWindowWidth + this.currentFrame * this.speed - this.currentX,
      x3: this.halfWindowWidth - this.currentX,
      y0: this.halfWindowHeight + this.halfHeight - 650,
      y1:
        this.halfWindowHeight +
        this.halfHeight -
        this.currentFrame * this.speed -
        650,
      y2: this.halfWindowHeight + this.halfHeight - 650,
      y3:
        this.halfWindowHeight +
        this.halfHeight +
        this.currentFrame * this.speed -
        650
    };
  }

  nextOpenFrame() {
    this.currentFrame += 1;

    if (this.currentFrame >= this.frames) {
      this.currentFrame = this.frames;
      this.opened = true;
      this.openRequest = false;
    }

    this.updateDots();
  }

  nextCloseFrame() {
    this.currentFrame -= 1;

    if (this.currentFrame <= 0) {
      this.currentFrame = 0;
      this.closeRequest = false;
      this.closed = true;
    }

    this.updateDots();
  }

  drawFrame() {
    this.parent.context.save();
    this.path();
    this.parent.context.clip();
    this.parent.context.lineWidth = 4; // половина срезается клипом
    this.parent.context.strokeStyle = '#CCA75C';

    let imageHeight = this.height;
    let dx = this.halfWindowWidth - this.halfWidth - this.currentX;
    let dy = this.halfWindowHeight - 650;

    if (this.windowHeight <= 900) {
      imageHeight -= 100;
      dx += 50;
      dy += 100;
      if (this.windowHeight <= 800) {
        imageHeight -= 100;
        dx += 50;
        dy += 75;
      }
    }

    this.parent.context.drawImage(
      this.parent.image,
      dx,
      dy,
      imageHeight,
      imageHeight
    );
    this.parent.context.stroke();
    this.parent.context.restore();

    this.parent.context.fillStyle = '#CCA75C';
    this.parent.context.beginPath();
    this.parent.context.moveTo(this.framedDots.x3, this.framedDots.y3 - 8);
    this.parent.context.lineTo(
      this.framedDots.x3 - 10,
      this.framedDots.y3 - 18
    );
    this.parent.context.lineTo(this.framedDots.x3, this.framedDots.y3 - 28);
    this.parent.context.lineTo(
      this.framedDots.x3 + 10,
      this.framedDots.y3 - 18
    );
    this.parent.context.closePath();
    this.parent.context.fill();
  }

  render() {
    if (this.openRequest) {
      this.drawFrame();
      this.nextOpenFrame();
    } else if (this.closeRequest) {
      this.drawFrame();
      this.nextCloseFrame();
    } else if (this.opened) {
      this.drawFrame();
      this.updateDots();
    }

    this.request = this.openRequest || this.closeRequest;
  }
}

class ProjectRhombus {
  constructor(opts) {
    this.parent = opts.parent;
    this.currentX = this.parent.currentX;

    this.windowWidth = this.parent.windowWidth;
    this.halfWindowWidth = this.parent.halfWindowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    this.width = 1400;
    this.halfWidth = this.width / 2;
    this.height = 1400;
    this.halfHeight = this.height / 2;

    this.time = 250;
    this.currentFrame = 0;
    this.frames = Math.round(this.time / 16.6); // 16.6ms на кадр при 60 кадрах/с
    this.speed = this.halfWidth / this.frames;
    this.speedY = this.halfWindowHeight / this.frames;

    this.framedDots = {
      x0: this.halfWindowWidth - this.speed * this.currentFrame - this.currentX,
      x1: this.halfWindowWidth - this.currentX,
      x2: this.halfWindowWidth + this.speed * this.currentFrame - this.currentX,
      x3: this.halfWindowWidth - this.currentX,
      y0: this.windowHeight - this.speedY * this.currentFrame,
      y1:
        this.windowHeight -
        this.speedY * this.currentFrame -
        this.currentFrame * this.speed,
      y2: this.windowHeight - this.speedY * this.currentFrame,
      y3:
        this.windowHeight -
        this.speedY * this.currentFrame +
        this.currentFrame * this.speed
    };

    this.request = false;
    this.openRequest = false;
    this.opened = false;
    this.closeRequest = false;
    this.closed = true;
  }

  open() {
    this.openRequest = true;
    this.closeRequest = false;
    this.closed = false;
    this.request = true;
  }

  close() {
    this.closeRequest = true;
    this.openRequest = false;
    this.opened = false;
    this.request = true;
  }

  updateXY() {
    this.currentX = this.parent.currentX;
  }

  updateDots() {
    this.framedDots = {
      x0: this.halfWindowWidth - this.speed * this.currentFrame - this.currentX,
      x1: this.halfWindowWidth - this.currentX,
      x2: this.halfWindowWidth + this.speed * this.currentFrame - this.currentX,
      x3: this.halfWindowWidth - this.currentX,
      y0: this.windowHeight - this.speedY * this.currentFrame,
      y1:
        this.windowHeight -
        this.speedY * this.currentFrame -
        this.currentFrame * this.speed,
      y2: this.windowHeight - this.speedY * this.currentFrame,
      y3:
        this.windowHeight -
        this.speedY * this.currentFrame +
        this.currentFrame * this.speed
    };
  }

  nextOpenFrame() {
    this.currentFrame += 1;

    if (this.currentFrame >= this.frames) {
      this.currentFrame = this.frames;
      this.opened = true;
      this.openRequest = false;
      this.parent.onOpened();
    }

    this.updateDots();
  }

  nextCloseFrame() {
    this.currentFrame -= 1;

    if (this.currentFrame <= 0) {
      this.currentFrame = 0;
      this.closeRequest = false;
      this.closed = true;
      this.parent.onClosed();
    }

    this.updateDots();
  }

  drawFrame() {
    this.parent.context.fillStyle = 'white';
    this.parent.context.beginPath();
    this.parent.context.moveTo(this.framedDots.x0, this.framedDots.y0);
    this.parent.context.lineTo(this.framedDots.x1, this.framedDots.y1);
    this.parent.context.lineTo(this.framedDots.x2, this.framedDots.y2);
    this.parent.context.lineTo(this.framedDots.x3, this.framedDots.y3);
    this.parent.context.closePath();
    this.parent.context.fill();
  }

  render() {
    if (this.openRequest) {
      this.nextOpenFrame();
    } else if (this.closeRequest) {
      this.nextCloseFrame();
    } else if (this.opened) {
      this.updateDots();
    }

    this.drawFrame();
  }
}

class ProductViewer {
  constructor(opts) {
    this.parent = opts.parent;

    // JSON с информацией о всех шоу
    this.data = this.parent.productData;

    //
    this.scale = this.parent.scale;

    // Смещение по Ох
    this.currentX = this.parent.currentX;

    // Зададим размеры экрана
    this.windowWidth = this.parent.windowWidth;
    this.halfWindowWidth = this.parent.halfWindowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    this.loader = document.querySelector('.loader-wrapper');
    // Получим все блоки, с которыми будут производиться операции
    this.productWrapper = document.querySelector('.product-viewer');
    this.content = document.querySelector('.product-viewer__content');
    this.text = document.querySelector('.product-viewer__content__text');
    this.arrowLeft = document.querySelector(
      '.product-viewer__arrow-placeholder.arrow-placeholder--left'
    );
    this.arrowRight = document.querySelector(
      '.product-viewer__arrow-placeholder.arrow-placeholder--right'
    );
    this.orderButton = document.querySelector(
      '.product-viewer__order-button-wrapper'
    );
    this.tbody = document
      .querySelector('.table--desktop')
      .querySelector('tbody');
    // console.log('tbd', this.tbody);
    this.image = document.createElement('img');

    document.querySelector('.product-viewer__close-button').onclick = () => {
      this.close();
    };

    // Получим холст, в котором будет производиться отрисовка
    this.canvas = document.querySelector('canvas.product-viewer__canvas');
    this.canvas.width = this.windowWidth;
    this.canvas.height = this.windowHeight;
    this.context = this.canvas.getContext('2d');

    this.background = new Background({ parent: this });
    this.rhombus = new ProjectRhombus({ parent: this });
    this.imageRhombus = new ImageRhombus({ parent: this });

    this.request = false;

    //
    this.orderButton.onclick = () => {
      console.log('click');
      this.next = false;
      this.prev = false;
      this.order = true;
      this.close();
    };

    this.arrowLeft.onclick = () => {
      this.prev = true;
      this.indexToOpen = (this.index - 1) % this.data.length;
      if (this.indexToOpen < 0) {
        this.indexToOpen = this.data.length - 1;
      }
      this.close();
    };
    this.arrowRight.onclick = () => {
      this.next = true;
      this.indexToOpen = (this.index + 1) % this.data.length;
      this.close();
    };

    // Зададим параметры видео и привяжем callback к его полной загрузке
    this.image.onload = () => {
      this.onLoadEnd();
    };

    this.loadState = 0;
    this.loaded = false;
    this.closed = true;
    this.next = false;
    this.prev = false;
    this.order = false;
  }

  handleResize() {
    this.background.handleResize();
    this.rhombus.handleResize();
    this.imageRhombus.handleResize();
  }

  updateXY() {
    this.currentX = this.parent.currentX / 20;
    this.rhombus.updateXY();
    this.imageRhombus.updateXY();
  }

  onLoadEnd() {
    this.background.open();
    this.imageRhombus.open();
    this.rhombus.open();
    this.loaded = true;
    this.closeLoader();
  }

  loadData() {
    this.loadState = 0;
    this.loaded = false;
    this.image.src = this.data[this.index].image;
  }

  openLoader() {
    this.loader.classList.remove('loader-wrapper--closed');
    // console.log('opening loader');
  }

  closeLoader() {
    this.loader.classList.add('loader-wrapper--closed');
    // console.log('closing loader');
  }

  onOpened() {
    this.content.style.visibility = 'hidden';
    this.content.style.height = '';
    this.text.innerHTML = this.data[this.index].text;
    for (let i = 0; i < this.data[this.index].table.length; i += 1) {
      this.tbody.children[i].innerHTML = `<td class="table__cell">${
        this.data[this.index].table[i]
      }</td>`;
    }
    const contentHeight = this.content.getBoundingClientRect().height;
    this.content.style.height = '0px';
    this.content.style.transition = `height ${contentHeight}ms`;
    this.content.style.visibility = 'visible';
    setTimeout(() => {
      this.content.style.height = `${contentHeight}px`;
    }, 0);

    this.orderButton.style.visibility = 'visible';
    this.arrowLeft.style.visibility = 'visible';
    this.arrowRight.style.visibility = 'visible';
  }

  open(index) {
    if (!this.opened) {
      this.productWrapper.style.visibility = 'visible';
      this.closed = false;
      this.index = index;
      document.body.style.overflow = 'hidden';
      this.productWrapper.classList.remove('product-viewer--closed');
      this.openLoader();
      this.loadData();
    }
  }

  onClosed() {
    if (!(this.next || this.prev) && !this.order) {
      this.closed = true;
      this.productWrapper.style.visibility = 'hidden';
    } else if (this.order) {
      this.productWrapper.style.visibility = 'hidden';
      this.closed = true;
      this.order = false;
      window.scrollTo({
        top:
          (4593 +
            this.parent.blocks.showLines.height +
            892 +
            this.parent.blocks.productLines.height +
            883 +
            this.parent.blocks.partnerLines.height) *
          this.scale,
        behavior: 'smooth'
      });
    } else {
      this.next = false;
      this.prev = false;
      this.open(this.indexToOpen);
    }
  }

  close() {
    if (!this.closed) {
      document.body.style.overflow = '';
      this.background.close();
      this.imageRhombus.close();
      this.rhombus.close();

      this.content.style.visibility = 'hidden';
      this.orderButton.style.visibility = 'hidden';
      this.arrowLeft.style.visibility = 'hidden';
      this.arrowRight.style.visibility = 'hidden';
    }
  }

  clearDirt() {
    this.context.clearRect(0, 0, this.windowWidth, this.windowHeight);
  }

  render() {
    this.context.fillStyle = '#0d0a14';
    this.context.fillRect(0, 0, this.windowWidth, this.windowHeight);
    if (this.loaded) {
      // this.clearDirt();
      // БЭКГРАУНД
      this.background.render();

      // СТРЕЛКИ
      if (this.windowWidth < this.rhombus.width) {
        changeTranslateX(this.arrowLeft, 54 - this.currentX);
        changeTranslateX(
          this.arrowRight,
          this.windowWidth - this.currentX - 54
        );
      } else if (this.windowWidth >= this.rhombus.width) {
        changeTranslateX(
          this.arrowLeft,
          this.halfWindowWidth - this.rhombus.halfWidth + 54 - this.currentX
        );
        changeTranslateX(
          this.arrowRight,
          this.halfWindowWidth + this.rhombus.halfWidth - 54 - this.currentX
        );
      }

      // ТЕКСТ
      changeTranslateX(
        this.content,
        -this.currentX * 2.5 +
          this.halfWindowWidth -
          this.content.getBoundingClientRect().width / 2
      );

      // КНОПКА
      if (this.rhombus.height > this.windowHeight) {
        changeTranslate(
          this.orderButton,
          -this.currentX + this.halfWindowWidth - 58,
          this.windowHeight - 80
        );
      } else {
        changeTranslate(
          this.orderButton,
          -this.currentX + this.halfWindowWidth - 58,
          this.halfWindowHeight + 700 - 116 - 50
        );
      }

      // РОМБЫ
      this.rhombus.render();
      if (this.rhombus.opened || this.rhombus.closeRequest) {
        this.imageRhombus.render();
      }

      if (this.rhombus.closed) {
        this.clearDirt();
      }
    }

    this.request =
      this.rhombus.request ||
      this.imageRhombus.request ||
      this.background.request;
  }
}

export default ProductViewer;

/**
 *
 * open -> fillBackground, openLoaderGif, load -> onloadend -> closeLoaderGif, openBackground, openRhombus -> onOpenRhombusEnd -> openVideoRhombus
 *
 *
 */
