/* globals document */
function test(scale) {
  const firstBlockY = 828 * scale;
  const spacingTillWorkRhombusHalf = 400 * scale;
  const spacingFromWorkRhombusStartToEnd = 590 * scale;
  const spacingTillA = 590 * scale;
  const spacingFromAToEnd = 400 * scale;
  // Начало Teкст
  const h1 = document.querySelector('h1');
  const pFirst = document.querySelector('p');
  // Работы Текст
  const h2Work = document.querySelectorAll('h2#work');
  const pWork = document.querySelectorAll('p#work');
  const aWork = document.querySelectorAll('a#work');
  // Перед Шоу Текст
  const showH2 = document.querySelector('h2#show');
  const showP = document.querySelector('p#show');
  // Применение стилей
  h1.style.transform = `translate(${154 * scale}px,${720 * scale}px)`;
  pFirst.style.transform = `translate(${420 * scale}px,${(260 + 31 + 60) *
    scale}px)`;
  console.log(scale);
  for (let i = 0; i < h2Work.length; i += 1) {
    let x = 420 * scale;
    let aX = 180 * scale;
    if (i % 2 !== 0) {
      x = 80 * scale;
      aX = 660 * scale;
    }
    const aY = firstBlockY + spacingTillA * (i + 1) + spacingFromAToEnd * i;
    const y =
      firstBlockY +
      spacingTillWorkRhombusHalf * (i + 1) +
      spacingFromWorkRhombusStartToEnd * i;

    h2Work[i].style.transform = `translate(${x}px,${y + 30 * scale}px)`;
    pWork[i].style.transform = `translate(${x}px,${y + (31 + 60) * scale}px)`;
    aWork[i].style.transform = `translate(${aX}px,${aY}px)`;
    aWork[i].style.width = `${160 * scale}px`;
    aWork[i].style.height = `${160 * scale}px`;
    aWork[i].style.lineHeight = `${160 * scale}px`;
  }

  // После работы и перед шоу
  showH2.style.transform = `translate(${(420 + 100) * scale}px,${(828 +
    990 * 4) *
    scale}px)`;
  showP.style.transform = `translate(${(420 + 100) * scale}px,${(828 +
    990 * 4 +
    60) *
    scale}px)`;
}
export default test;
