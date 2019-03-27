import Background from "./linesBackground";
import Switch from "./switcher";
import Project from "./project";
import LogoRhombus from ".";
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

const menu = new Switch({
  button: document.querySelector(".button"),
  item: document.querySelector(".item"),
  open: function() {
    this.item.classList.remove("closed");
    this.item.classList.add("opened");
  },
  close: function() {
    this.item.classList.remove("opened");
    this.item.classList.add("closed");
  }
});
menu.listen();

// const project = new Project({ userCanvas: document.querySelector("canvas") });
// project.render();
const logoImage = new Image();

// высота
// logoImage.src = "https://i.pinimg.com/originals/0d/49/8b/0d498b41c2018d86eddad9b006d98ac0.jpg";
// широкая
logoImage.src =
  "https://cdn.allwallpaper.in/wallpapers/6230x1720/16897/sunrise-night-widescreen-6230x1720-wallpaper.jpg";

const logo = new LogoRhombus({
  width: 500,
  height: 500,
  logoImage: logoImage
});

const canvas = document.querySelector("canvas");
canvas.width = 1000;
canvas.height = 1000;
// canvas.getContext("2d").drawImage(logo.canvas, 10, 10);
