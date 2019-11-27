/* globals window, requestAnimationFrame, document */
import Background from '../partials/background';
import Blocks from './blocks';
import Lines from './lines';
import Text from './text';
import Gradients from './gradients';
import ProjectViewer from './projectViewer';
import ProductViewer from './productViewer';
import TextTriggers from './textTrigger';
import Input from './Input';
import InputSwitcher from './InputSwitcher';
import StateSwitcher from './stateSwitcher';
import rewardViewer from './rewards';

function getCoords(elem) {
  // (1)
  const box = elem.getBoundingClientRect();

  const { body } = document;
  const docEl = document.documentElement;

  // (2)
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;

  // (3)
  const clientTop = docEl.clientTop || body.clientTop || 0;

  // (4)
  const top = box.top + scrollTop - clientTop;

  return top;
}

function scrollTo(top) {
  window.scrollTo({
    top,
    behavior: 'smooth'
  });
}

function get(str) {
  return document.querySelector(str);
}
function getChildren(item, i) {
  return item.children[i];
}

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

class App {
  constructor() {
    // rewards opener
    // StateSwitcher({
    //  itemList: [
    //    document.querySelector('.rewards-frame-wrapper'),
    //    document.querySelector('.rewards__icon')
    //  ],
    //  itemClassList: ['opened', 'rotated'],
    //  buttonList: [document.querySelector('.rewards')],
    //  state: true,
    //  onTrue(itemList, itemClassList) {
    //    itemList.forEach((item, index) => {
    //      item.classList.add(itemClassList[index]);
    //    });
    //  },
    //  onFalse(itemList, itemClassList) {
    //    itemList.forEach((item, index) => {
    //      item.classList.remove(itemClassList[index]);
    //    });
    //  }
    // });

    // menu opener [mob]
    StateSwitcher({
      itemList: [
        document.querySelector('.header'),
        document.querySelector('.hamburger'),
        document.querySelector('.menu')
      ],
      itemClassList: ['opened', 'animated', 'opened'],
      buttonList: [document.querySelector('.hamburger-wrapper')],
      state: true,
      onTrue(itemList, itemClassList) {
        itemList.forEach((item, index) => {
          item.classList.add(itemClassList[index]);
        });
      },
      onFalse(itemList, itemClassList) {
        itemList.forEach((item, index) => {
          item.classList.remove(itemClassList[index]);
        });
      }
    });

    // dropdown aka submenu
    StateSwitcher({
      itemList: [
        document.querySelector('.menu').children[1].children[1],
        // document.querySelector('.menu').children[1].children[0],
        document.querySelector('.menu').children[1].children[0].children[0]
      ],
      buttonList: [document.querySelector('.menu').children[1].children[0]],
      state: true,
      itemClassList: ['opened', 'rotated'],
      onTrue(itemList, itemClassList) {
        itemList.forEach((item, index) => {
          item.classList.add(itemClassList[index]);
        });
      },
      onFalse(itemList, itemClassList) {
        itemList.forEach((item, index) => {
          item.classList.remove(itemClassList[index]);
        });
      }
    });

    // rewardViewer();

    // eslint-disable-next-line no-new
    new Input([
      {
        input: getChildren(get('label[for=email-name]'), 0),
        placeholder: getChildren(get('label[for=email-name]'), 2)
      },
      {
        input: getChildren(get('label[for=email-mail]'), 0),
        placeholder: getChildren(get('label[for=email-mail]'), 2)
      },
      {
        input: getChildren(get('div.email-form__textarea'), 0),
        placeholder: getChildren(get('div.email-form__textarea'), 2)
      },
      {
        input: getChildren(get('label[for=phone-number]'), 0),
        placeholder: getChildren(get('label[for=phone-number]'), 2)
      }
    ]);

    // eslint-disable-next-line no-new
    new InputSwitcher({
      phone: getChildren(get('.contact__buttons'), 0),
      mail: getChildren(get('.contact__buttons'), 1)
    });

    // Выделение памяти под переменные
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.halfWindowWidth = this.windowWidth / 2;
    this.halfWindowHeight = this.windowHeight / 2;

    this.clientHeight = document.body.clientHeight;

    // Скалирование
    this.scale = 1;

    this.counter = 0;
    this.request = false;

    this.loader = document.querySelector('.loader-wrapper');

    // Выделение памяти под блоки
    this.readyState = 0;
    this.background = undefined;
    this.gradients = undefined;
    this.blocks = undefined;
    this.lines = undefined;
    this.text = undefined;

    // Движение
    this.clientX = 0;
    this.currentX = this.clientX;
    this.clientY = window.pageYOffset;
    this.currentY = this.clientY;

    this.logoImageSrc = './assets/img/logo-desktop.png';

    this.hoverImageSrc = './assets/img/hover.png';

    this.workImagesSrc = JSON.parse(
      document.querySelector('.js-work-images').getAttribute('data-src')
    );

    this.showImagesSrc = JSON.parse(
      document.querySelector('.js-show-images').getAttribute('data-src')
    );

    this.showMoreHoverSrc = './assets/img/showRhombusHoverMore.png';

    this.partnerImagesSrc = JSON.parse(
      document.querySelector('.js-partner-images').getAttribute('data-src')
    );

    this.productImagesSrc = JSON.parse(
      document.querySelector('.js-product-images').getAttribute('data-src')
    );

    /*
    1. Видеомаппинг             Video mapping       video-mapping
    2. Лазерное шоу             Laser show          laser-show
    3. Мультимедийное шоу       Multimedia show     multimedia-show
    4. Постановочные номера     Staging numbers     staging-numbers
    5. Общее                    Сommon              commin
    */
    this.videoMappingData = JSON.parse(
      document
        .querySelector('.js-project-data--video-mapping')
        .getAttribute('data')
    );
    this.laserShowData = JSON.parse(
      document
        .querySelector('.js-project-data--laser-show')
        .getAttribute('data')
    );
    this.multimediaShowData = JSON.parse(
      document
        .querySelector('.js-project-data--multimedia-show')
        .getAttribute('data')
    );
    this.stagingNumbersData = JSON.parse(
      document
        .querySelector('.js-project-data--staging-numbers')
        .getAttribute('data')
    );
    this.commonData = JSON.parse(
      document.querySelector('.js-project-data--common').getAttribute('data')
    );

    this.productData = JSON.parse(
      document.querySelector('.js-product-data').getAttribute('data')
    );
    this.init();
  }

  recalculateScale() {
    // default width = 1000,    <- scale = 1
    // maximum width = 1156.25, <- scale = 1.15625
    // minimum width = 640.     <- scale = 0.64
    this.scale = this.windowWidth / 1024;
    if (this.scale > 1.15625) this.scale = 1.15625;
    else if (this.scale < 0.64) this.scale = 0.64;
  }

  recalculateSpacing() {
    this.spacing = (this.windowWidth - 1024 * this.scale) / 2;
    if (this.spacing < 0) {
      this.spacing = 0;
    }
  }

  /**
   * Обработчики ивентов
   */

  handleResize() {
    // Пересчёт размеров
    this.windowWidth = window.innerWidth;
    this.halfWindowWidth = this.windowWidth / 2;
    this.windowHeight = window.innerHeight;
    this.halfWindowHeight = this.windowHeight / 2;
    this.clientHeight = document.body.clientHeight;
    this.recalculateScale();
    this.recalculateSpacing();
    // Обновление блоков
    this.background.handleResize(
      this.windowWidth,
      this.windowHeight,
      this.clientHeight
    );
    this.blocks.handleResize(this.windowWidth, this.windowHeight, this.scale);
    this.lines.handleResize();
    this.text.handleResize();
    this.gradients.handleResize();

    if (!this.projectViewer.closed) {
      this.projectViewer.handleResize();
    } else if (!this.productViewer.closed) {
      this.productViewer.handleResize();
    }

    this.request = true;
  }

  handleScroll() {
    this.clientY = Math.round(window.pageYOffset);
    if (this.clientY < 0) this.clientY = 0;
  }

  handleMouseMove(e) {
    this.clientX = Math.round(e.clientX) - this.windowWidth / 2;
  }

  listen() {
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  onBlockReady() {
    // this.ready();
    this.gradients = new Gradients({ parent: this });
    if (document.URL.indexOf('down=true') !== -1) {
      if (this.windowWidth < 990) {
        // scrollTo(
        //   getCoords(document.querySelector('div.contact-form-wrapper')) - 100
        // );
        document.querySelector('div.contact-form-wrapper').scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  ready() {
    this.readyState += 1;
    if (this.readyState === 1) {
      this.projectViewer = new ProjectViewer({ parent: this });
      this.productViewer = new ProductViewer({ parent: this });
      // this.gradients = new Gradients({ parent: this });
      this.lines = new Lines({ parent: this });
      this.text = new Text({ parent: this });
      this.textTrigger = new TextTriggers({ parent: this });
      window.trigger(0);
      this.listen();
      this.render(true);
      this.loader.classList.add('loader-wrapper--closed');
    }
  }

  init() {
    // Получим значение скалирования
    this.recalculateScale();
    this.recalculateSpacing();
    this.background = new Background({ parent: this });
    this.blocks = new Blocks({
      parent: this,
      logoImageSrc: this.logoImageSrc,

      hoverImageSrc: this.hoverImageSrc,

      workImagesSrc: this.workImagesSrc,

      showImagesSrc: this.showImagesSrc,

      showMoreHoverSrc: this.showMoreHoverSrc,

      partnerImagesSrc: this.partnerImagesSrc,

      productImagesSrc: this.productImagesSrc
    });
  }

  updateXY() {
    this.currentX += (this.clientX - this.currentX) / 10;
    if (Math.abs(this.clientX - this.currentX) < 1) {
      this.currentX = this.clientX;
    }
    this.currentY += (this.clientY - this.currentY) / 5;
    if (Math.abs(this.clientY - this.currentY) < 1) {
      this.currentY = this.clientY;
    }

    this.background.updateXY();
    this.blocks.updateXY();
    this.gradients.updateXY();
    this.lines.updateXY();
    this.text.updateXY();
    this.textTrigger.updateXY();

    this.projectViewer.updateXY();
    this.productViewer.updateXY();
  }

  render(boolean = false) {
    requestAnimationFrame(this.render.bind(this, false));

    // this.counter += 1;
    // даун до 30 фпс
    // if (this.counter >= 2 || boolean || this.request) {
    // if (boolean || this.request) {
    //
    if (this.windowWidth >= 990) {
      const projectOnWindow = !this.projectViewer.closed;
      const productOnWindow = !this.productViewer.closed;
      if (!projectOnWindow && !productOnWindow) {
        let blockRendered = false;
        let gradientRendered = false;
        let textChecked = false;
        if (
          this.clientX !== this.currentX ||
          this.clientY !== this.currentY ||
          boolean ||
          this.request
        ) {
          this.updateXY();
          this.background.render();
          this.blocks.render();
          this.gradients.render();
          this.lines.render();
          this.text.render();
          this.textTrigger.check();
          blockRendered = true;
          gradientRendered = true;
          textChecked = true;
        }
        if (this.blocks.request && !blockRendered) {
          this.blocks.render();
          if (!textChecked) {
            this.textTrigger.check();
          }
        }
        if (this.gradients.request && !gradientRendered) {
          this.gradients.render();
        }
      } else if (projectOnWindow) {
        let projectRendered = false;
        if (
          this.clientX !== this.currentX ||
          this.clientY !== this.currentY
        ) {
          this.updateXY();
          this.projectViewer.render();
          projectRendered = true;
        }
        if (
          (!projectRendered && this.projectViewer.request) ||
          this.request
        ) {
          this.projectViewer.render();
        }
      } else if (productOnWindow) {
        let productRendered = false;
        if (
          this.clientX !== this.currentX ||
          this.clientY !== this.currentY
        ) {
          this.updateXY();
          this.productViewer.render();
          productRendered = true;
        }
        if (
          (!productRendered && this.productViewer.request) ||
          this.request
        ) {
          this.productViewer.render();
        }
      }
    }
    if (this.request === true) this.request = false;
  }
  // }
}

export default App;
