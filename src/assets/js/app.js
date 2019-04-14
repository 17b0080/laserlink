/* globals window, requestAnimationFrame, document */
import Background from './background';
import Blocks from './blocks';
import Lines from './lines';
import Text from './text';
import Gradients from './gradients';

// Кросс-браузерная анимация
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = () => {
    return (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame
    );
  };
}

class App {
  constructor() {
    // Выделение памяти под переменные
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.clientHeight = document.body.clientHeight;

    // Скалирование
    this.scale = 1;

    this.counter = 0;

    // Выделение памяти под блоки
    this.readyState = 0;
    this.background = undefined;
    this.blocks = undefined;
    this.lines = undefined;
    this.text = undefined;

    // Движение
    this.clientX = 0;
    this.currentX = this.clientX;
    this.clientY = window.pageYOffset;
    this.currentY = this.clientY;

    this.showImages = [
      'https://pp.userapi.com/c852236/v852236114/f6a19/_8HOc7JZMIo.jpg',
      'https://pp.userapi.com/c852236/v852236114/f6a19/_8HOc7JZMIo.jpg',
      'https://pp.userapi.com/c852236/v852236114/f6a19/_8HOc7JZMIo.jpg',
      'https://pp.userapi.com/c852236/v852236114/f6a19/_8HOc7JZMIo.jpg',
      'https://pp.userapi.com/c852236/v852236114/f6a19/_8HOc7JZMIo.jpg',
      'https://pp.userapi.com/c852236/v852236114/f6a19/_8HOc7JZMIo.jpg',
      'https://pp.userapi.com/c852236/v852236114/f6a19/_8HOc7JZMIo.jpg',
      'https://pp.userapi.com/c852236/v852236114/f6a19/_8HOc7JZMIo.jpg',
      'https://pp.userapi.com/c852236/v852236114/f6a19/_8HOc7JZMIo.jpg'
    ];

    this.partnerImages = [
      'https://ih0.redbubble.net/image.523026213.1540/stf,small,600x600.jpg',
      'https://ih0.redbubble.net/image.523026213.1540/stf,small,600x600.jpg'
    ];

    this.init();
  }

  recalculateScale() {
    // default width = 1000,    <- scale = 1
    // maximum width = 1156.25, <- scale = 1.15625
    // minimum width = 640.     <- scale = 0.64
    this.scale = this.windowWidth / 1024;
    if (this.scale > 1.15625) this.scale = 1.15625;
    else if (this.scale < 0.64) this.scale = 0.64;
  }

  recalculateSpacing() {
    this.spacing = (this.windowWidth - 1024 * this.scale) / 2;
    if (this.spacing < 0) {
      this.spacing = 0;
    }
  }

  /**
   * Обработчики ивентов
   */

  handleResize() {
    // Остановка анимации

    // Пересчёт размеров
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.clientHeight = document.body.clientHeight;
    this.recalculateScale();
    this.recalculateSpacing();
    // Обновление блоков
    this.background.handleResize(
      this.windowWidth,
      this.windowHeight,
      this.clientHeight
    );
    this.blocks.handleResize(this.windowWidth, this.windowHeight, this.scale);
    this.lines.handleResize();
    this.text.handleResize();
  }

  handleScroll() {
    this.clientY = Math.round(window.pageYOffset);
    if (this.clientY < 0) this.clientY = 0;
  }

  handleMouseMove(e) {
    this.clientX = Math.round(e.clientX) - this.windowWidth / 2;
  }

  listen() {
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  ready() {
    console.log('ready');
    this.readyState += 1;
    if (this.readyState === 1) {
      this.gradients = new Gradients({ parent: this });
      this.lines = new Lines({ parent: this });
      this.text = new Text({ parent: this });
      this.listen();
      this.render(true);
    }
  }

  init() {
    // Получим значение скалирования
    this.recalculateScale();
    this.recalculateSpacing();
    this.background = new Background({ parent: this });
    this.blocks = new Blocks({
      parent: this,
      showImages: this.showImages,
      partnerImages: this.partnerImages
    });
  }

  updateXY() {
    this.currentX += (this.clientX - this.currentX) / 10;
    if (Math.abs(this.clientX - this.currentX) < 1) {
      this.currentX = this.clientX;
    }
    this.currentY += (this.clientY - this.currentY) / 5;
    if (Math.abs(this.clientY - this.currentY) < 1) {
      this.currentY = this.clientY;
    }

    // this.background.updateXY();
    this.blocks.updateXY();
    this.gradients.updateXY();
    this.lines.updateXY();
    this.text.updateXY();
  }

  render(boolean = false) {
    requestAnimationFrame(this.render.bind(this, false));

    this.counter += 1;
    // даун до 30 фпс
    if (this.counter === 2 && this.windowWidth > 640) {
      this.counter = 0;
      let blockRendered = false;
      let gradientRendered = false;
      if (
        this.clientX !== this.currentX ||
        this.clientY !== this.currentY ||
        boolean
      ) {
        this.updateXY();
        // this.background.render();
        this.blocks.render();
        this.gradients.render();
        this.lines.render();
        this.text.render();
        blockRendered = true;
        gradientRendered = true;
      }
      if (this.blocks.request && !blockRendered) {
        this.blocks.render();
      }
      if (this.gradients.request && !gradientRendered) {
        this.gradients.render();
      }
    }
  }
}

const app = new App();
window.app = app;
