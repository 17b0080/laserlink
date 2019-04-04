/* globals window, document */

import Background from './linesBackground';
import Switch from './switcher';
import Project from './project';
// import FillRhombus from "./index";
import Blocks from './index';
import Lines from './shines';

import test from './text.js';
// if (!window.requestAnimationFrame) {
//   window.requestAnimationFrame = (function() {
//     return (
//       window.webkitRequestAnimationFrame ||
//       window.mozRequestAnimationFrame ||
//       window.oRequestAnimationFrame ||
//       window.msRequestAnimationFrame ||
//       function(
//         /* function FrameRequestCallback */ callback,
//         /* DOMElement Element */ element
//       ) {
//         window.setTimeout(callback, 1000 / 60);
//       }
//     );
//   })();
// }

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
const maxScale = 1156.25 / 1000;
const minScale = 650 / 1000;
let scale = window.innerWidth / 1000;
if (scale > maxScale) {
  scale = maxScale;
}
if (scale < minScale) {
  scale = minScale;
}
const blocks = new Blocks({ scale: scale });
const lines = new Lines({ scale: scale });
test(scale);
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
