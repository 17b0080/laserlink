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
    this.image = undefined;

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
    this.image = this.parent.backgroundImage;

    const { w, h } = getWidthAndHeight(
      this.image.width,
      this.image.height,
      this.windowWidth,
      this.windowHeight
    );

    this.imageWidth = w;
    this.imageHeight = h;

    this.openRequest = true;
    this.closed = false;
    this.request = true;
  }

  close() {
    this.closeRequest = true;
    this.opened = false;
    this.request = true;
  }

  updateAlpha() {
    this.alpha = this.speed * this.currentFrame;
    // console.log(this.alpha);
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
    this.parent.context.drawImage(
      this.image,
      0,
      0,
      this.imageWidth,
      this.imageHeight
    );
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

class VideoRhombus {
  constructor(opts) {
    this.parent = opts.parent;
    this.currentX = this.parent.currentX;

    this.windowWidth = this.parent.windowWidth;
    this.halfWindowWidth = this.parent.halfWindowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    this.width = 700;
    this.halfWidth = this.width / 2;
    this.height = 700;
    this.halfHeight = this.height / 2;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = (this.height * 2) / 3;
    this.context = this.canvas.getContext('2d');

    this.time = 150;
    this.currentFrame = 0;
    this.frames = Math.round(this.time / 16.6); // 16.6ms на кадр при 60 кадрах/с
    this.speed = this.halfWidth / this.frames;

    this.framedDots = {
      x0: this.halfWidth + this.currentFrame * this.speed,
      x1: this.halfWidth - this.currentX,
      x2: this.halfWidth + this.currentFrame * this.speed,
      x3: this.halfWidth + (this.currentFrame * this.speed) / 2,
      x4: this.halfWidth - (this.currentFrame * this.speed) / 2,
      y0: this.halfHeight,
      y1: this.halfHeight - this.currentFrame * this.speed,
      y2: this.halfHeight,
      y3: this.halfHeight + (this.currentFrame * this.speed) / 2,
      y4: this.halfHeight + (this.currentFrame * this.speed) / 2
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
      this.parent.video.videoWidth,
      this.parent.video.videoHeight,
      this.canvas.width,
      this.canvas.height
    );

    this.w = w;
    this.h = h;
    this.parent.video.play();
    this.openRequest = true;
    this.closeRequest = false;
    this.closed = false;
    this.request = true;
  }

  close() {
    this.parent.video.pause();
    this.closeRequest = true;
    this.openRequest = false;
    this.opened = false;
    this.request = true;
  }

  clip() {
    this.context.beginPath();
    this.context.moveTo(this.framedDots.x0, this.framedDots.y0);
    this.context.lineTo(this.framedDots.x1, this.framedDots.y1);
    this.context.lineTo(this.framedDots.x2, this.framedDots.y2);
    this.context.lineTo(this.framedDots.x3, this.framedDots.y3);
    this.context.lineTo(this.framedDots.x4, this.framedDots.y4);
    this.context.closePath();
    this.context.clip();
  }

  updateDots() {
    const x0 =
      this.halfWidth - this.currentFrame * this.speed > 0
        ? this.halfWidth - this.currentFrame * this.speed
        : 0;
    const y1 =
      this.halfHeight - this.currentFrame * this.speed > 0
        ? this.halfHeight - this.currentFrame * this.speed
        : 0;
    this.framedDots = {
      x0,
      x1: this.halfWidth,
      x2: this.halfWidth + this.currentFrame * this.speed,
      x3: this.halfWidth + (this.currentFrame * this.speed) / 2,
      x4: this.halfWidth - (this.currentFrame * this.speed) / 2,
      y0: this.halfHeight,
      y1,
      y2: this.halfHeight,
      y3: this.halfHeight + (this.currentFrame * this.speed) / 2,
      y4: this.halfHeight + (this.currentFrame * this.speed) / 2
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
    this.context.drawImage(this.parent.video, 0, 0, this.w, this.h);
    this.parent.context.drawImage(
      this.canvas,
      -this.currentX * 1.8 + this.halfWindowWidth - this.halfWidth,
      this.halfWindowHeight - 600
    );
  }

  render() {
    if (this.openRequest) {
      this.nextOpenFrame();
    } else if (this.closeRequest) {
      this.nextCloseFrame();
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    } else if (this.opened) {
      this.updateDots();
    }

    this.context.save();
    this.clip();
    this.drawFrame();
    this.context.restore();

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

    this.width = 1200;
    this.halfWidth = 600;
    this.height = 1200;
    this.halfHeight = 600;

    this.time = 500;
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

class ProjectViewer {
  constructor(opts) {
    this.parent = opts.parent;

    // JSON с информацией о всех шоу
    this.data = this.parent.projectData;

    // Смещение по Ох
    this.currentX = this.parent.currentX;

    // Зададим размеры экрана
    this.windowWidth = this.parent.windowWidth;
    this.halfWindowWidth = this.parent.halfWindowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    // Получим все блоки, с которыми будут производиться операции
    this.projectWrapper = document.querySelector('.project-viewer');
    this.content = document.querySelector('.project-viewer__content');
    this.header = document.querySelector('.project-viewer__content__header');
    this.text = document.querySelector('.project-viewer__content__text');
    this.arrowLeft = document.querySelector('.arrow-placeholder--left');
    this.arrowRight = document.querySelector('.arrow-placeholder--right');
    this.orderButton = document.querySelector(
      '.project-viewer__order-button-wrapper'
    );
    this.video = document.createElement('video');
    this.backgroundImage = document.createElement('img');

    document.querySelector('.project-viewer__close-button').onclick = () => {
      this.close();
    };

    // Получим холст, в котором будет производиться отрисовка
    this.canvas = document.querySelector('canvas.project-viewer__canvas');
    this.canvas.width = this.windowWidth;
    this.canvas.height = this.windowHeight;
    this.context = this.canvas.getContext('2d');

    this.background = new Background({ parent: this });
    this.rhombus = new ProjectRhombus({ parent: this });
    this.videoRhombus = new VideoRhombus({ parent: this });

    this.request = false;

    //
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
    this.video.muted = true;
    this.video.loop = true;
    this.video.oncanplaythrough = () => {
      this.onLoadEnd();
    };

    // Привяжем callback загрузки к фотографии заднего фона
    this.backgroundImage.onload = () => {
      this.onLoadEnd();
    };

    this.loadState = 0;
    this.loaded = false;
    this.closed = true;
    this.next = false;
    this.prev = false;
  }

  handleResize() {
    this.background.handleResize();
    this.rhombus.handleResize();
    this.videoRhombus.handleResize();
  }

  updateXY() {
    this.currentX = this.parent.currentX / 20;
    this.rhombus.updateXY();
    this.videoRhombus.updateXY();
  }

  onLoadEnd() {
    this.loadState += 1;

    if (this.loadState === 2) {
      this.closeLoader();

      this.background.open();
      this.videoRhombus.open();
      this.rhombus.open();
      this.loaded = true;
    }
  }

  loadData() {
    this.loadState = 0;
    this.loaded = false;
    this.video.src = this.data[this.index].video;
    this.backgroundImage.src = this.data[this.index].background;
  }

  openLoader() {
    // console.log('opening loader');
  }

  closeLoader() {
    // console.log('closing loader');
  }

  onOpened() {
    this.content.style.visibility = 'hidden';
    this.content.style.height = '';
    this.header.innerHTML = this.data[this.index].header;
    this.text.innerHTML = this.data[this.index].text;
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
      this.projectWrapper.style.visibility = 'visible';
      this.closed = false;
      this.index = index;
      document.body.style.overflow = 'hidden';
      this.projectWrapper.classList.remove('project-viewer--closed');
      this.openLoader();
      this.loadData();
    }
  }

  onClosed() {
    if (!(this.next || this.prev)) {
      this.closed = true;
      this.projectWrapper.style.visibility = 'hidden';
      console.log('hide');
    } else {
      this.next = false;
      this.prev = false;
      this.open(this.indexToOpen);
    }
  }

  close() {
    if (!this.closed) {
      document.body.style.overflow = '';
      // this.projectWrapper.classList.add('project-viewer--closed');
      this.background.close();
      this.videoRhombus.close();
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
    // console.log(this.projectWrapper.style.visibility);
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

      changeTranslateX(
        this.orderButton,
        -this.currentX + this.halfWindowWidth - 58
      );

      // РОМБЫ
      this.rhombus.render();
      if (this.rhombus.opened || this.rhombus.closeRequest) {
        this.videoRhombus.render();
      }

      if (this.rhombus.closed) {
        this.clearDirt();
      }
    }

    this.request =
      this.rhombus.request ||
      this.videoRhombus.request ||
      this.background.request;
  }
}

export default ProjectViewer;

/**
 *
 * open -> fillBackground, openLoaderGif, load -> onloadend -> closeLoaderGif, openBackground, openRhombus -> onOpenRhombusEnd -> openVideoRhombus
 *
 *
 */
