/* globals window document */

class ProjectRhombus {
  constructor(opts) {
    this.parent = opts.parent;
    this.currentX = this.parent.currentX;

    this.windowWidth = this.parent.windowWidth;
    this.halfWindowWidth = this.parent.halfWindowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    this.context = this.parent.context;

    this.width = 990;
    this.halfWidth = 445;
    this.height = 990;
    this.halfHeight = 445;

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

    this.dirtDots = { x: 0, y: 0, w: 0, y0: 0 };

    this.request = false;
    this.open = false;
    this.opened = false;
    this.closed = true;
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

  updateDirtDots() {
    const x = this.framedDots.x0 - 8 > 0 ? this.framedDots.x0 - 8 : 0;
    const y = this.framedDots.y1 - 8 > 0 ? this.framedDots.y1 - 8 : 0;
    this.dirtDots = {
      x,
      y,
      w: this.framedDots.x2 + 16,
      h: this.framedDots.y3 + 16
    };
  }

  clearDirt() {
    this.context.clearRect(
      this.dirtDots.x,
      this.dirtDots.y,
      this.dirtDots.w,
      this.dirtDots.h
    );
  }

  nextOpenFrame() {
    this.currentFrame += 1;
    if (this.currentFrame === this.frames) {
      this.opened = true;
    }
    this.updateDots();
    this.updateDirtDots();
  }

  nextCloseFrame() {
    this.currentFrame -= 1;
    if (this.currentFrame === 0) {
      this.closed = true;
    }
    this.updateDots();
    this.updateDirtDots();
  }

  drawFrame() {
    this.context.fillStyle = 'white';
    this.context.beginPath();
    this.context.moveTo(this.framedDots.x0, this.framedDots.y0);
    this.context.lineTo(this.framedDots.x1, this.framedDots.y1);
    this.context.lineTo(this.framedDots.x2, this.framedDots.y2);
    this.context.lineTo(this.framedDots.x3, this.framedDots.y3);
    this.context.closePath();
    this.context.fill();
  }

  render() {
    this.clearDirt();
    console.log(this.open, this.closed);

    if (this.open && !this.opened) {
      this.nextOpenFrame();
    }
    if (!this.open && !this.closed) {
      console.log('next close frame');
      this.nextCloseFrame();
    }

    if (this.opened) {
      this.updateDots();
    }

    this.drawFrame();

    this.request = (this.open && !this.opened) || (!this.open && !this.closed);
  }
}

class ProjectViewer {
  constructor(opts) {
    this.parent = opts.parent;

    this.windowWidth = this.parent.windowWidth;
    this.halfWindowWidth = this.parent.halfWindowWidth;
    this.windowHeight = this.parent.windowHeight;
    this.halfWindowHeight = this.parent.halfWindowHeight;

    this.canvas = document.querySelector('canvas.background__project');
    this.canvas.width = this.windowWidth;
    this.canvas.height = this.windowHeight;
    this.context = this.canvas.getContext('2d');

    this.currentX = this.parent.currentX;
    this.data = this.parent.projectData;
    /**
     * data = [
     * {type: 'video', text: 'ну какой-то текст', header: 'ну какой-то хеадер', video: 'ну ссылка'},
     * {type: 'gif', text: 'ну какой-то текст 2', header: 'ну какой-то хеадер 2', gif: 'ну ссылка2'},
     * {type: 'img', text: 'ну какой-то текст 3', header: 'ну какой-то хеадер 3', video: 'ну ссылка 3'},
     * {},
     * {}
     * ]
     */

    this.rhombus = new ProjectRhombus({ parent: this });

    this.request = false;
  }

  updateXY() {
    this.currentX = this.parent.currentX / 20;
    this.rhombus.updateXY();
  }

  open(index) {
    this.rhombus.open = true;
    this.rhombus.closed = false;
    console.log(
      `Opening: ${index}, line: ${Math.round(index / 4)}, item: ${index % 4}`
    );
    this.render();
  }

  close() {
    this.rhombus.open = false;
    this.rhombus.opened = false;
    this.render();
  }

  render() {
    this.rhombus.render();

    this.request = this.rhombus.request;
  }
}

export default ProjectViewer;
