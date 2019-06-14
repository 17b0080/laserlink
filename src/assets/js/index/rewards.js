/* globals document */
export default function rewardViewer() {
  const image = document.querySelector('.rewards-fullscreen__image');

  const imagesSrc = JSON.parse(
    document.querySelector('.js-rewards-images').getAttribute('data-src')
  );
  const imagesAlt = JSON.parse(
    document.querySelector('.js-rewards-images').getAttribute('data-alt')
  );

  const thumbnails = document.querySelectorAll('.rewards-frame__hover-wrapper');

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.onclick = () => {
      image.src = imagesSrc[index];
      image.alt = imagesAlt[index];
      document
        .querySelector('.rewards-fullscreen')
        .classList.add('rewards-fullscreen--opened');
    };
  });
  document.querySelector(
    '.rewards-fullscreen__hamburger-menu'
  ).onclick = () => {
    document
      .querySelector('.rewards-fullscreen')
      .classList.remove('rewards-fullscreen--opened');
  };
}
