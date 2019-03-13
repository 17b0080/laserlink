import Background from "./linesBackground";

const background = new Background({ scale: 1.5 });
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
