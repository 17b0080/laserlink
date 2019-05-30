/* globals window, requestAnimationFrame, document */
import Background from '../partials/background';
import Text from './text';

class App {
  constructor() {
    // Выделение памяти под переменные
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.halfWindowWidth = this.windowWidth / 2;
    this.halfWindowHeight = this.windowHeight / 2;

    this.clientHeight = document.body.clientHeight;

    // Скалирование
    this.scale = 1;
    this.counter = 0;
    this.background = undefined;
    this.text = undefined;

    // Движение
    this.clientX = 0;
    this.currentX = this.clientX;
    this.clientY = window.pageYOffset;
    this.currentY = this.clientY;
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

  init() {
    // Получим значение скалирования
    this.recalculateScale();
    this.recalculateSpacing();
    this.background = new Background({ parent: this });
    this.text = new Text({ parent: this });
    this.listen();
    this.render(true);
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

    this.background.updateXY();
    this.text.updateXY();
  }

  render(boolean = false) {
    requestAnimationFrame(this.render.bind(this, false));

    this.counter += 1;
    if (this.counter >= 2 || boolean) {
      this.counter = 0;
      if (this.windowWidth >= 990) {
        if (
          this.clientX !== this.currentX ||
          this.clientY !== this.currentY ||
          boolean
        ) {
          this.updateXY();
          this.background.render();
          this.text.render();
        }
      }
    }
  }
}

export default App;
