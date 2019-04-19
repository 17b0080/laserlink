/* globals window document */

function changeTranslateX(item, x) {
  // eslint-disable-next-line no-param-reassign
  item.style.transform = `translateX(${x}px)`;
}

function changeTranslate(item, x, y) {
  // eslint-disable-next-line no-param-reassign
  item.style.transform = `translate(${x}px, ${y}px)`;
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

    // this.context.save();

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
    this.parent.video.play();
    this.openRequest = true;
    this.closed = false;
    this.request = true;
    console.log('vid opening');
  }

  close() {
    this.parent.video.pause();
    this.closeRequest = true;
    this.opened = false;
    this.request = true;
    console.log('vid closing');
  }

  clip() {
    console.log('clipping');
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

    if (this.currentFrame === this.frames) {
      this.opened = true;
      this.openRequest = false;
    }

    this.updateDots();
  }

  nextCloseFrame() {
    this.currentFrame -= 1;

    if (this.currentFrame === 0) {
      this.closeRequest = false;
      this.closed = true;
    }

    this.updateDots();
  }

  drawFrame() {
    this.context.drawImage(this.parent.video, 0, 0);
    this.parent.context.drawImage(
      this.canvas,
      -this.currentX * 1.2 + this.halfWindowWidth - this.halfWidth,
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
    this.closed = false;
    this.request = true;
    console.log('rhombus opening');
  }

  close() {
    this.closeRequest = true;
    this.opened = false;
    this.request = true;
    console.log('rhombus closing');
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

    if (this.currentFrame === this.frames) {
      console.log('opened: true, openRequest: false');
      this.opened = true;
      this.openRequest = false;
      this.parent.onOpened();
    }

    this.updateDots();
  }

  nextCloseFrame() {
    this.currentFrame -= 1;

    if (this.currentFrame === 0) {
      console.log('closed: true: closeRequst: false');
      this.closeRequest = false;
      this.closed = true;
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

    this.windowWidth = this.parent.windowWidth;
    this.halfWindowWidth = this.parent.halfWindowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    this.projectWrapper = document.querySelector('.project-viewer');
    this.content = document.querySelector('.project-viewer__content');
    this.header = document.querySelector('.project-viewer__content__header');
    this.text = document.querySelector('.project-viewer__content__text');
    this.orderButton = document.querySelector('.project-viewer__order-button');
    this.video = document.createElement('video');
    this.background = document.createElement('img');

    this.canvas = document.querySelector('canvas.project-viewer__canvas');
    this.canvas.width = this.windowWidth;
    this.canvas.height = this.windowHeight;
    this.context = this.canvas.getContext('2d');

    this.currentX = this.parent.currentX;

    this.rhombus = new ProjectRhombus({ parent: this });
    this.videoRhombus = new VideoRhombus({ parent: this });

    this.dirtDots = { x: 0, y: 0, w: 0, y0: 0 };

    this.request = false;

    document.querySelector('.js-close').onclick = () => {
      console.log('click');
      this.close();
    };

    this.data = this.parent.projectData;

    this.video.muted = true;
    this.video.loop = true;
    this.video.oncanplaythrough = () => {
      console.log('vid loaded');
      this.onLoadEnd();
    };

    this.background.onload = () => {
      console.log('back loaded');
      this.onLoadEnd();
    };

    this.loadState = 0;
    this.loaded = false;
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
      this.videoRhombus.open();
      this.rhombus.open();
      this.loaded = true;
    }
  }

  loadData(index) {
    this.loadState = 0;
    this.loaded = false;
    this.video.src = this.data[index].video;
    this.background.src = this.data[index].background;
    this.index = index;
  }

  openLoader() {
    console.log('opening loader');
  }

  closeLoader() {
    console.log('closing loader');
  }

  onOpened() {
    this.header.innerHTML = this.data[this.index].header;
    this.text.innerHTML = this.data[this.index].text;
  }

  open(index) {
    if (this.opened) return 0;
    document.body.style.overflow = 'hidden';
    this.projectWrapper.classList.remove('project-viewer--closed');
    console.log('fill background');
    this.openLoader();
    this.loadData(index);
  }

  close() {
    if (this.closed) return 0;
    document.body.style.overflow = '';
    this.projectWrapper.classList.add('project-viewer--closed');
    this.videoRhombus.close();
    this.rhombus.close();
  }

  clearDirt() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {
    if (this.loaded) {
      this.clearDirt();
      changeTranslateX(
        this.content,
        -this.currentX + this.halfWindowWidth - 280
      );

      if (this.halfWindowHeight - 600 >= 166) {
        changeTranslate(
          this.orderButton,
          -this.currentX + this.halfWindowWidth - 83,
          this.halfWindowHeight + 517
        );
      } else {
        changeTranslate(
          this.orderButton,
          -this.currentX + this.halfWindowWidth - 83,
          0
        );
      }

      this.rhombus.render();
      if (this.rhombus.opened || this.rhombus.closeRequest) {
        this.videoRhombus.render();
      }

      if (this.rhombus.closed) {
        this.clearDirt();
      }
    }

    this.request = this.rhombus.request || this.videoRhombus.request;
  }
}

export default ProjectViewer;

/**
 *
 * open -> fillBackground, openLoaderGif, load -> onloadend -> closeLoaderGif, openBackground, openRhombus -> onOpenRhombusEnd -> openVideoRhombus
 *
 *
 */
