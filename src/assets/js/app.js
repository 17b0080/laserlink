/* globals window, document, requestAnimationFrame, requestRender, cancelAnimationFrame */

import Background from './linesBackground';
import Switch from './switcher';
import Project from './project';
// import FillRhombus from "./index";
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

window.cancelAnimationFrame =
  window.cancelAnimationFrame || window.mozCancelAnimationFrame;

// const background = new Background({
//   scale: 1.5,
//   // Lines
//   hardLinesWidth: 2,
//   hardLinesStrokeStyle: "rgba(43, 43, 43, 0.2)",
//   lightLinesWidth: 1,
//   lightLinesStrokeStyle: "rgba(43, 43, 43, 0.2)",
//   // Dots
//   dotRadius: 2,
//   upperDotsFill: "rgba(255, 255, 255, 0.5)",
//   downDotsFill: "rgba(255, 255, 255, 0.4)",
//   // Parallax Speed
//   linesSpeedX: 1 / 5,
//   linesSpeedY: 1 / 5,
//   upperDotsSpeedX: 1 / 3,
//   upperDotsSpeedY: 1 / 3,
//   downDotsSpeedX: 1 / 8,
//   downDotsSpeedY: 1 / 8
// });

// background.listen();
// background.linesBackground.render();
// background.dotsBackground.render();
// background.downDotsBackground.render();
// background.render(true);
// function animate() {
//   background.render();
//   requestAnimationFrame(animate);
// }
// requestAnimationFrame(animate);
// window.background = background;

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
    window.app = this;

    this.blocksCavnas = document.querySelector('canvas.blocks');
    this.blocksCavnas.width = window.innerWidth;
    this.blocksCavnas.height = window.innerHeight;

    this.shinesCanvas = document.querySelector('canvas.shines');
    this.shinesCanvas.width = window.innerWidth;
    this.shinesCanvas.height = window.innerHeight;

    this.backgroundCanvas = document.querySelector('canvas.background');
    this.backgroundCanvas.width = window.innerWidth;
    this.backgroundCanvas.height = window.innerHeight;

    this.scale = calcScale();
    // this.states === 3 -> ready
    this.states = 0;

    // Для анимаций скролла и мотания мыши
    this.margin = window.innerWidth;
    this.currentX = 0;
    this.clientX = 0;
    this.pageY = window.pageYOffset;
    this.currentY = this.pageY;

    this.initBlocks();

    this.counter = 0;
  }

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

  handleWindowResize() {
    this.blocksCavnas.width = window.innerWidth;
    this.blocksCavnas.height = window.innerHeight;
    this.shinesCanvas.width = window.innerWidth;
    this.shinesCanvas.height = window.innerHeight;
    this.backgroundCanvas.width = window.innerWidth;
    this.backgroundCanvas.height = window.innerHeight;
    this.scale = calcScale();
    this.states = 0;
  }

  handleScroll() {
    this.pageY = window.pageYOffset;
    if (this.pageY < 0) {
      this.pageY = 0;
    }
  }

  handleMouseMove(e) {
    this.clientX = e.clientX - this.margin;
  }

  listen() {
    window.addEventListener('resize', this.handleWindowResize.bind(this));
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  ready() {
    this.states += 1;
    if (this.states === 1) {
      this.initShines();
      this.initText();
      this.initBackground();
    } else if (this.states === 4) {
      this.listen();
    }
  }

  updateXY() {
    let needAnotherUpdateX = false;
    let needAnotherUpdateY = false;
    if (this.currentX !== this.clientX) {
      console.log('1');
      this.currentX += (this.clientX - this.currentX) / 10;
      needAnotherUpdateX = true;
      if (Math.abs(this.clientX - this.currentX) < 1) {
        this.currentX = this.clientX;
        needAnotherUpdateX = false;
      }
      this.background.currentX = this.currentX;
    }
    if (this.currentY !== this.pageY) {
      console.log('2');
      this.currentY += (this.pageY - this.currentY) / 5;
      needAnotherUpdateY = true;
      if (Math.abs(this.pageY - this.currentY) < 1) {
        this.currentY = this.pageY;
        needAnotherUpdateY = false;
      }
      this.background.currentY = this.currentY;
    }
    const needUpdate = needAnotherUpdateX || needAnotherUpdateY;
    if (needUpdate) {
      console.log('background render');
      this.background.render();
    }
    return needUpdate;
  }

  render() {
    const needUpdate = this.updateXY();
    if (needUpdate) {
      this.backgroundContext = this.backgroundCanvas.getContext('2d');
      this.backgroundContext.clearRect(
        0,
        0,
        this.backgroundCanvas.width,
        this.backgroundCanvas.height
      );

      this.backgroundContext.drawImage(this.background.canvas, 0, 0);
    }
  }
}

const app = new App();

function animate() {
  app.render();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
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
