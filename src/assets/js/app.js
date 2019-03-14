import Background from "./linesBackground";

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (function() {
    return (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(
        /* function FrameRequestCallback */ callback,
        /* DOMElement Element */ element
      ) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();
}

const background = new Background({
  scale: 1.5,
  // Lines
  hardLinesWidth: 2,
  hardLinesStrokeStyle: "rgba(43, 43, 43, 0.2)",
  lightLinesWidth: 1,
  lightLinesStrokeStyle: "rgba(43, 43, 43, 0.2)",
  // Dots
  dotRadius: 2,
  upperDotsFill: "rgba(255, 255, 255, 0.5)",
  downDotsFill: "rgba(255, 255, 255, 0.4)",
  // Parallax Speed
  linesSpeedX: 1 / 5,
  linesSpeedY: 1 / 5,
  upperDotsSpeedX: 1 / 3,
  upperDotsSpeedY: 1 / 3,
  downDotsSpeedX: 1 / 8,
  downDotsSpeedY: 1 / 8
});

background.listen();
background.linesBackground.render();
background.dotsBackground.render();
background.downDotsBackground.render();
background.render(true);
function animate() {
  background.render();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
window.background = background;
