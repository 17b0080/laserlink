/* eslint-disable no-console */
/* globals window, document, requestAnimationFrame */

import Background from './linesBackground';
import Switch from './switcher';
import Project from './project';
import Blocks from './index';
import Lines from './shines';
import Text from './text';

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

function calcScale() {
  const maxScale = 1.15625;
  const minScale = 0.64;
  let scale = window.innerWidth / 1000;
  if (scale > maxScale) {
    scale = maxScale;
  } else if (scale < minScale) {
    scale = minScale;
  }
  return scale;
}

class App {
  constructor() {
    this.scale = calcScale();
    // Последовательная инициализация всех скриптов
    this.state = 0;
    this.blocks = undefined;
    this.background = undefined;
    this.shines = undefined;

    // Для плавной прокрутки
    this.margin = window.innerWidth;
    this.currentX = 0;
    this.clientX = 0;
    this.pageY = window.pageYOffset;
    this.currentY = this.pageY;

    this.initBlocks();
    // this.initBackground();
  }

  /**
   * Последовательная инициализация скриптов
   */

  initBlocks() {
    console.log('init blocks');
    this.blocks = new Blocks({ scale: this.scale, parent: this });
  }

  initShines() {
    console.log('init shines');
    this.shines = new Lines({ scale: this.scale, parent: this });
  }

  initText() {
    console.log('init text');
    this.text = new Text({ scale: this.scale, parent: this });
  }

  initBackground() {
    console.log('init background');
    this.background = new Background({
      scale: 1.5,
      // Lines
      hardLinesWidth: 2,
      hardLinesStrokeStyle: 'rgba(43, 43, 43, 0.2)',
      lightLinesWidth: 1,
      lightLinesStrokeStyle: 'rgba(43, 43, 43, 0.2)',
      // Dots
      dotRadius: 2,
      upperDotsFill: 'rgba(255, 255, 255, 0.5)',
      downDotsFill: 'rgba(255, 255, 255, 0.4)',
      // Parallax Speed
      linesSpeedX: 1 / 5,
      linesSpeedY: 1 / 5,
      upperDotsSpeedX: 1 / 3,
      upperDotsSpeedY: 1 / 3,
      downDotsSpeedX: 1 / 8,
      downDotsSpeedY: 1 / 8,
      parent: this
    });
  }

  ready() {
    console.log('ready');
    this.state += 1;
    if (this.state === 1) {
      this.initBackground();
      this.initShines();
      this.initText();
    } else if (this.state === 3) {
      this.listen();
    }
  }

  /**
   * Прослушивание resize, scroll, mousemove
   */

  handleScroll() {
    this.pageY = window.pageYOffset;
    // исключение pageYOffset < 0 для Safari
    if (this.pageY < 0) this.pageY = 0;
  }

  handleMouseMove(e) {
    this.clientX = (e.clientX - window.innerWidth) / 10;
  }

  handleResize() {
    this.scale = calcScale();
    this.states = 0;

    this.background.updateSize();
    this.blocks.updateSize();
    this.text.updateSize();
    this.shines.updateSize();
  }

  listen() {
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  /**
   * Просчёт Х и У координат
   */

  calculateXY() {
    this.currentX += (this.clientX - this.currentX) / 10;
    if (Math.abs(this.clientX - this.currentX) < 5) {
      this.currentX = this.clientX;
    }
    this.currentY += (this.pageY - this.currentY) / 5;
    if (Math.abs(this.pageY - this.currentY) < 5) {
      this.currentY = this.pageY;
    }

    this.background.updateXY();
    this.blocks.updateXY();
    this.text.updateXY();
    this.shines.updateXY();
  }

  checkUpdates() {
    return this.currentX !== this.clientX || this.currentY !== this.pageY;
  }

  render() {
    if (this.checkUpdates()) {
      this.calculateXY();

      this.background.render();
      this.blocks.render();
      this.text.render();
      this.shines.render();
    }
  }
}

const app = new App();

function animate() {
  requestAnimationFrame(animate);
  app.render();
}
animate();
// const menu = new Switch({
//   button: document.querySelector(".button"),
//   item: document.querySelector(".item"),
//   open: function() {
//     this.item.classList.remove("closed");
//     this.item.classList.add("opened");
//   },
//   close: function() {
//     this.item.classList.remove("opened");
//     this.item.classList.add("closed");
//   }
// });
// menu.listen();

// // const project = new Project({ userCanvas: document.querySelector("canvas") });
// // project.render();
// const logoImage = new Image();

// // высота
// // logoImage.src = "https://i.pinimg.com/originals/0d/49/8b/0d498b41c2018d86eddad9b006d98ac0.jpg";
// // широкая
// logoImage.src =
//   "https://pp.userapi.com/c850720/v850720524/ed355/4Hk0KOjLez0.jpg";

// // const logo = new LogoRhombus({
// //   width: 258,
// //   height: 258,
// //   logoImage: logoImage
// // });

/**
 * 32 процента на ромбы
 * 10 процентов на отступы
 * максимальная ширина ромба - 370px => макс ширина области 1156.25
 * 650пх - десктоп
 */
// const maxScale = 1156.25 / 1000;
// const minScale = 650 / 1000;
// let scale = window.innerWidth / 1000;
// if (scale > maxScale) {
//   scale = maxScale;
// }
// if (scale < minScale) {
//   scale = minScale;
// }
// const blocks = new Blocks({ scale: scale });
// const lines = new Lines({ scale: scale });
// test(scale);
// document.querySelector('body').style.background = 'white';
// const fillRhombus = new FillRhombus({
//   width: 258,
//   height: 258,
//   image: image
// });

// // const canvas = document.querySelector("canvas");
// // canvas.width = 1024;
// // canvas.height = 1024;
// // // canvas.getContext("2d").drawImage(logo.canvas, 10, 10);
