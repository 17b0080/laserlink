/* eslint-disable no-undef */
/* eslint-disable no-multi-assign */

/**
 *
 * @param {int} w - ширина холста
 * @param {int} h - высота холста
 * @return [canvas, context, width, height]
 */
function createCanvas(w, h) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = w;
  canvas.height = h;
  return [canvas, context];
}

/**
 * @return [window.innerWidth, window.innerHeight]
 */
function getWindowWH() {
  return [window.innerWidth, window.innerHeight];
}

function initCanvas(selector, sw, sh, dw, dh) {
  const canvas = document.querySelector(selector);
  const context = canvas.getContext('2d');
  canvas.width = dw;
  canvas.height = dh;
  canvas.style.width = `${sw}px`;
  canvas.style.height = `${sh}px`;

  return [canvas, context];
}

const [windowWidth, windowHeight] = getWindowWH();
const dw = Math.round((windowWidth / 3) * 2);
const dh = Math.round((windowHeight / 3) * 2);
const [canvas, context] = initCanvas(
  'canvas.background',
  windowWidth,
  windowHeight,
  dw,
  dh
);
const [bufferCanvas, bufferContext] = createCanvas(
  4 * windowWidth,
  4 * windowHeight
);
console.log('working with buffer');
bufferContext.beginPath();
bufferContext.strokeStyle = 'red';
for (let i = 0; i < 2000; i += 1) {
  bufferContext.moveTo(0, i * 10);
  bufferContext.lineTo(i * 2, 100);
}
bufferContext.stroke();

console.log('working with user');
context.fillStyle = 'white';
let i = 0;
let j = 0;
function animate() {
  i += 1;
  j += 2;
  if (i > 10000) {
    i = 0;
  }
  if (j > 10000) {
    j = 0;
  }
  context.fillRect(0, 0, dw, dh);
  // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  context.drawImage(
    bufferCanvas,
    i,
    j,
    windowWidth,
    windowHeight,
    0,
    0,
    dw,
    dh
  );
  context.fillRect(0, 0, dw, dh);
  // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  context.drawImage(
    bufferCanvas,
    i,
    j,
    windowWidth,
    windowHeight,
    0,
    0,
    dw,
    dh
  );
  context.fillRect(0, 0, dw, dh);
  // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  context.drawImage(
    bufferCanvas,
    i,
    j,
    windowWidth,
    windowHeight,
    0,
    0,
    dw,
    dh
  );
  requestAnimationFrame(animate);
}
animate();
