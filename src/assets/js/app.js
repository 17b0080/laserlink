import Background from "./linesBackground";
import Switch from "./switcher";
import Project from "./project";
// import FillRhombus from "./index";
import ShowBlock from "./index";
import Line from "./shines";
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

const image = new Image();
image.src =
  "https://i.pinimg.com/originals/cb/13/16/cb13165145b7dcc4c3900f82b4ba365b.jpg";
const image2 = new Image();
image2.src = "https://pp.userapi.com/c850020/v850020426/159c35/75c0BevSbAM.jpg";

console.log(new Date(), "init images");
const images = [0, image, image2];

// В цикле навесим обработчик окончания загрузки картинок.
// Если картинка загружена, то 0 элемент массива images
// увеличится на 1. После проверим: загружены ли все картинки
// если да, то запускаем
for (let i = 1; i < images.length; i++) {
  images[i].onload = () => {
    images[0]++;
    console.log(images[0]);
    if (images[0] == images.length - 1) {
      start();
    }
  };
}

function start() {
  // console.log(new Date(), "start");
  // const canvas = document.querySelector("canvas"),
  //   w = (canvas.width = 820),
  //   h = (canvas.height = 3000),
  //   ctx = canvas.getContext("2d"),
  //   fillRhombus = new FillRhombus({
  //     width: 258,
  //     height: 258,
  //     image: images[1]
  //   });

  // ctx.drawImage(fillRhombus.canvas, 0, 0);
  const showBlock = new ShowBlock({
    shows: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    width: 100,
    height: 100
  });
}
// const fillRhombus = new FillRhombus({
//   width: 258,
//   height: 258,
//   image: image
// });

// // const canvas = document.querySelector("canvas");
// // canvas.width = 1024;
// // canvas.height = 1024;
// // // canvas.getContext("2d").drawImage(logo.canvas, 10, 10);

// const line = new Line({ dots: [{ x: 512, y: 0 }, { x: 0, y: 512 }] });
// const line2 = new Line({ dots: [{ x: 0, y: 600 }, { x: 600, y: 1200 }] });
// const line3 = new Line({ dots: [{ x: 500, y: 100 }, { x: 0, y: 1200 }] });
// const line4 = new Line({ dots: [{ x: 0, y: 600 }, { x: 600, y: 1200 }] });
// window.lines = [line, line2, line3];

// const canvas = document.querySelector("canvas"),
//   w = (canvas.width = 820),
//   h = (canvas.height = 3000),
//   ctx = canvas.getContext("2d");

// ctx.drawImage(fillRhombus.canvas, 0, 0);
// window.addEventListener("scroll", () => {
//   const scroll =
//     window.scrollY > 0
//       ? window.scrollY + window.innerWidth / 4
//       : window.innerWidth / 4;
//   line.update(scroll);
//   line2.update(scroll);
//   line3.update(scroll);
//   ctx.clearRect(0, 0, w, h);
//   ctx.drawImage(line.canvas, 100, 0 + line.dots[0].y);
//   ctx.drawImage(line2.canvas, 100, 0 + line2.dots[0].y);
//   ctx.drawImage(line3.canvas, 100, 0 + line3.dots[0].y);
// });
