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
import {
    IMAGES,
    TEXT,
    PRODUCT,
    WORK
} from '../settings';
import ScrollMagic from 'scrollmagic';

const DEFAULT_WIDTH = 1366;

async function getData(url) {
    const res = await fetch(`api/${url}`);
    const data = await res.json();
    return data;
};


const loadImages = (data) => new Promise((resolve, reject) => {
    let n = 0;
    let m = 0;
    const result = JSON.parse(JSON.stringify(data));;

    function handleImageLoad() {
        this.removeEventListener('load', handleImageLoad);
        m += 1;
        if (n === m) resolve(result);
    };

    data.forEach(item => {
        if (item instanceof String || typeof item === 'string') {
            n += 1;
        } else if (item instanceof Array) {
            n += item.length;
        }
    });

    data.forEach((item, i) => {
        if (item instanceof String || typeof item === 'string') {
            const image = new Image();
            image.addEventListener('load', handleImageLoad);
            image.src = item;
            result[i] = image;
        } else if (item instanceof Array) {
            item.forEach((subItem, j) => {
                if (subItem instanceof String || typeof subItem === 'string') {
                    const image = new Image();
                    image.addEventListener('load', handleImageLoad);
                    image.src = subItem;
                    result[i][j] = image;
                } else {
                    if (item instanceof String || typeof item === 'string') {
                        const image = new Image();
                        image.addEventListener('load', handleImageLoad);
                        image.src = subItem.image;
                        result[i][j].image = image;
                    } else {
                        n -= 1;
                    };
                }
            })
        }
    })
});

function get(str) {
    return document.querySelector(str);
};

function getChildren(item, i) {
    return item.children[i];
};

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

class App extends Object {
    constructor() {
        super();
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
        new Input([{
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

        this.smController = new ScrollMagic.Controller();
        if (window.innerWidth >= 990) { this.init(); } else this.initMobile();
    }

    recalculateScale() {
        // default width = 1000,    <- scale = 1
        // maximum width = 1156.25, <- scale = 1.15625
        // minimum width = 640.     <- scale = 0.64
        this.scale = this.windowWidth / DEFAULT_WIDTH;
        if (this.scale > 1.15625) this.scale = 1.15625;
        else if (this.scale < 0.64) this.scale = 0.64;
    }

    recalculateSpacing() {
        this.spacing = (this.windowWidth - DEFAULT_WIDTH * this.scale) / 2;
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


        const partnersHeight = this.blocks.getHeight('partnerLines');
        const commonsHeight = this.blocks.getHeight('showLines');
        const productsHeight = this.blocks.getHeight('productLines');
        if (window.innerWidth >= 990) {
            document.querySelector('.background').style.height = `${(commonsHeight + partnersHeight + productsHeight + PRODUCT.y) * this.scale}px`;
        } else document.querySelector('.background').style.height = '100vh';

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
        if (document.URL.indexOf('down=true') !== -1) {
            if (this.windowWidth < 990) {
                document.querySelector('div.contact-form-wrapper').scrollIntoView({
                    behavior: 'smooth'
                })
            }
        }
    }

    init = async () => {
        const partnersData = await getData('partners');
        const showsData = await getData('works');
        const productsData = await getData('products');
        IMAGES.partners = partnersData.map(({
            image
        }) => image);
        IMAGES.shows = showsData.filter(({ work_type }) => work_type === 'common' ).map(({
            image
        }) => image);
        IMAGES.products = productsData.map(({
            image
        }) => image);

        /*
        1. Видеомаппинг             Video mapping       video-mapping
        2. Лазерное шоу             Laser show          laser-show
        3. Мультимедийное шоу       Multimedia show     multimedia-show
        4. Постановочные номера     Staging numbers     staging-numbers
        5. Общее                    Сommon              common
        */
        this.videoMappingData = showsData.filter(({
            work_type
        }) => work_type === 'video-mapping')
        this.laserShowData = showsData.filter(({
            work_type
        }) => work_type === 'laser-show')
        this.multimediaShowData = showsData.filter(({
            work_type
        }) => work_type === 'multimedia-show')
        this.stagingNumbersData = showsData.filter(({
            work_type
        }) => work_type === 'staging-numbers')
        this.commonData = showsData.filter(({
            work_type
        }) => work_type === 'common')

        this.productData = productsData;


        const {
            smController
        } = this;
        const [logo, hover, showMoreHover, works, shows, partners, products, gradients] = await loadImages([
            IMAGES.logo,
            IMAGES.hover,
            IMAGES.showMoreHover,
            IMAGES.works,
            IMAGES.shows,
            IMAGES.partners,
            IMAGES.products,
            IMAGES.gradients
        ]);

        // Получим значение скалирования
        this.recalculateScale();
        this.recalculateSpacing();
        this.background = new Background({
            parent: this
        });
        this.projectViewer = new ProjectViewer({
            parent: this
        });
        this.productViewer = new ProductViewer({
            parent: this
        });
        this.gradients = new Gradients({
            parent: this,
            images: gradients
        });
        this.text = new Text({
            sT: showsData.filter(({ work_type }) => work_type === 'common').map(({ title }) => title),
            pT: productsData.map(({ title }) => title),
            parent: this,
            projectViewer: this.projectViewer,
            productViewer: this.productViewer
        });


        this.blocks = new Blocks({
            text: [this.text.text, this.text.wA],
            smController,
            parent: this,
            gradients: this.gradients,
            images: {
                logo,
                hover,
                works,
                shows,
                showMoreHover,
                partners,
                products
            }
        });
        const partnersHeight = this.blocks.getHeight('partnerLines');
        const commonsHeight = this.blocks.getHeight('showLines');
        const productsHeight = this.blocks.getHeight('productLines');


        this.lines = new Lines({
            parent: this
        });
        this.textTrigger = new TextTriggers({
            parent: this
        });

        this.lines.init(partnersHeight, commonsHeight);
        this.gradients.init(partnersHeight, commonsHeight, productsHeight);
        this.text.init(
            this.blocks,
            this.blocks.works,
            this.blocks.partnerLines,
            this.blocks.showLines,
            this.blocks.productLines,
            partnersHeight, commonsHeight, productsHeight
        );
        this.projectViewer.init({
            partnersHeight,
            commonsHeight,
            productsHeight
        });
        this.productViewer.init({
            partnersHeight,
            commonsHeight,
            productsHeight
        });

        const ttt = new TimelineLite({
            paused: true
        });
        ttt.fromTo(this.text.text[3], .5, {
            css: {
                opacity: 0
            }
        }, {
            css: {
                opacity: 1
            }
        }, 'text');
        ttt.fromTo(this.text.text[3], 1, {
            css: {
                top: 20
            }
        }, {
            css: {
                top: 0
            }
        }, 'text');

        smController.addScene(new ScrollMagic.Scene({
            offset: (TEXT.positions[3][1] - window.innerHeight / 2) * this.scale
        }).on('start', function() {
            ttt.play();
            this.destroy();
        }))
        smController.addScene(this.blocks.scenes());

        if (window.innerWidth >= 990) document.querySelector('.background').style.height = `${(commonsHeight + partnersHeight + productsHeight + PRODUCT.y) * this.scale}px`;
        this.listen();
        this.render(true);


        this.gradients.trigger(0);
        this.loader.classList.add('loader-wrapper--closed');

    }

    initMobile = () => {
        const scrollPositions = [
            () => 0,
            ...WORK.positions.map((_, i) => (e) => {
                e.preventDefault();
                document.querySelectorAll('.show')[i].scrollIntoView({ behavior: 'smooth' });
            }),
            (e) => {
                e.preventDefault();
                document.querySelectorAll('.show-wrapper')[1].scrollIntoView({ behavior: 'smooth' });
            },
            (e) => {
                e.preventDefault();
                document.querySelector('.partners').scrollIntoView({ behavior: 'smooth' });
            },
            (e) => {
                e.preventDefault();
                document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
            },
            (e) => {
                e.preventDefault();
                document.querySelector('.contact-form-wrapper').scrollIntoView({ behavior: 'smooth' });
            }
        ];

        const subMenu = document.querySelector('ul.menu__sub-menu.sub-menu');
        [...subMenu.children].forEach((child, i) => {
            const a = child.children[0];
            const handleClick = scrollPositions[i + 1];
            a.addEventListener('click', handleClick)
        });
        [...document.querySelector('ul.menu').children]
            .filter((_, i) => i > 1 && i < 5)
            .forEach((child, i) => {
            const a = child.children[0];
            const handleClick = scrollPositions[i + 6];
            a.addEventListener('click', handleClick)
            });
        this.loader.classList.add('loader-wrapper--closed');
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
        requestAnimationFrame(this.render.bind(this, false));
    }
    // }
}

export default App;