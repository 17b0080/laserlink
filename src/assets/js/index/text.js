/* globals document, window */
import { PRODUCT, WORK, TEXT, SHOW, PARTNER, NEON } from '../settings';

function changeTranslate(item, x, y) {
  // eslint-disable-next-line no-param-reassign
  item.style.transform = `translate(${x}px, ${y}px)`;
};


const getLineElementsPositions = (es, eW, eH, eGX, eGY, n = 3) => {
  const result = [];
  const rows = Math.ceil(es.length / n);

  for (let i = 0; i < rows; i += 1) {
    const row = es.slice((i * n), (i * n) + n);
    const m = n - row.length;
    for (let j = 0; j < row.length; j += 1) {
      const eX = eGX / 2 + (eW + eGX) * (m / 2 + j);
      const eY = (eH + eGY) * i;
      result.push([eX, eY]);
    };
  };
  return result;
}

class Text {
  constructor({ projectViewer, productViewer, sT, pT, ...opts }) {
    window.text = this;

    this.parent = opts.parent;
    this.windowWidth = this.parent.windowWidth;
    this.scale = this.parent.scale;
    this.spacing = this.parent.spacing;
    this.projectViewer = projectViewer;
    this.productViewer = productViewer;
    this.currentX = this.parent.currentX;

    this.text = document.querySelectorAll('.js-text');

    this.menu = document.querySelectorAll('.menu__item');
    this.content = document.querySelector('.content');
    this.subMenu = document.querySelectorAll('.sub-menu__item');
    this.form = document.querySelector('.contact-form-wrapper');

    this.logoButton = document.createElement('a');
    this.logoButton.innerHTML = 'Представляем';
    this.logoButton.setAttribute('class', 'content__button');
    this.logoButton.addEventListener('click', () => {
      projectViewer.open(0, 'presentation');
    })
    document.querySelector('.content').appendChild(this.logoButton);

    this.wA = [];
    for (let i = 0; i < 4; i += 1) {
      const a = document.createElement('a');
      a.innerHTML = 'ПОДРОБНЕЕ';
      document.querySelector('.content').appendChild(a);
      this.wA.push(a);
    };
    this.sT = [];
    for (let i = 0; i < sT.length; i += 1) {
      const span = document.createElement('span');
      span.classList.add('content__text', 'js-common-title');
      span.innerHTML = sT[i];
      span.style.textAlign = 'center';
      this.sT.push(span);
      document.querySelector('.content').appendChild(span);
    };
    this.pT = [];
    for (let i = 0; i < pT.length; i += 1) {
      const span = document.createElement('span');
      span.classList.add('content__text', 'js-product-title');
      span.innerHTML = pT[i];
      span.style.textAlign = 'center';
      this.pT.push(span);
      document.querySelector('.content').appendChild(span);
    };
  }

  init = (blocks, works, partnerLines, showLines, productLines, partnersHeight, commonsHeight) => {
    const { scale, projectViewer, productViewer } = this;


    const partnerPositions = getLineElementsPositions(partnerLines.images, PARTNER.width, PARTNER.height, PARTNER.gapX, PARTNER.gapY);
    const showPositions = getLineElementsPositions(showLines.images, SHOW.width, SHOW.height, SHOW.gapX, SHOW.gapY);
    const productPositions = getLineElementsPositions(productLines.images, PRODUCT.width, PRODUCT.height, PRODUCT.gapX, PRODUCT.gapY);

    this.paLA = [];
    this.sLA = [];
    this.prLA = [];
    for (let i = 0; i < works.length; i += 1) {
      const { main: { width, height }, handleMouseMove } = works[i];
      const a = this.wA[i];
      a.style.transform = `translate(${WORK.positions[i][0] * this.scale}px, ${WORK.positions[i][1] * this.scale}px)`;
      a.style.width = `${width}px`;
      a.style.height = `${height}px`;
      a.style.lineHeight = `${height}px`;
      a.setAttribute('class', 'content__button work-button');
      a.addEventListener('mousemove', handleMouseMove);
      a.addEventListener('mouseover', () => blocks.handleMouseOverWork(i));
      a.addEventListener('mouseout', () => blocks.handleMouseOutWork(i));
      a.addEventListener('click', () => projectViewer.open(0, WORK.types[i]));
      document.querySelector('.content').appendChild(a);
    };
    for (let i = 0; i < partnerLines.partnerBlocks.length; i += 1) {
      const block = partnerLines.partnerBlocks[i];
      for (let j = 0; j < block.rhombuses.length; j += 1) {
        const rhombus = block.rhombuses[j];
        const { width, height } = rhombus;
        const [x, y] = partnerPositions[i * 3 + j];
        const a = document.createElement('a');
        a.style.transform = `translate(${x * scale}px, ${(PARTNER.y + y) * scale}px)`;
        a.style.width = `${width}px`;
        a.style.height = `${height}px`;
        a.setAttribute('class', 'content__button');
        document.querySelector('.content').appendChild(a);
        this.paLA.push(a);
      }
    };
    for (let i = 0; i < showLines.showBlocks.length; i += 1) {
      const block = showLines.showBlocks[i];
      for (let j = 0; j < block.rhombuses.length; j += 1) {
        const rhombus = block.rhombuses[j];
        const { width, height } = rhombus;
        const [x, y] = showPositions[i * 3 + j];
        const a = document.createElement('a');
        const title = this.sT[i*3+j];
        title.style.transform = `translate(${x * scale}px, ${(SHOW.height + SHOW.y + partnerLines.height + y) * scale}px)`;
        a.style.transform = `translate(${x * scale}px, ${(SHOW.y + partnerLines.height + y) * scale}px)`;
        title.style.width = a.style.width = `${width}px`;
        title.style.lineHeight = `${SHOW.gapY * scale}px`;
        a.style.height = `${height}px`;
        title.style.height = `${SHOW.gapY * scale}px`;
        a.setAttribute('class', 'content__button');
        document.querySelector('.content').appendChild(a);
        a.addEventListener('mouseover', () => blocks.handleMouseOverShow(i, j));
        a.addEventListener('mouseout', () => blocks.handleMouseOutShow(i, j));
        a.addEventListener('click', () => projectViewer.open(i * 3 + j, 'common'));
        this.sLA.push(a);
        
      }
    };
    for (let i = 0; i < productLines.productBlocks.length; i += 1) {
      const block = productLines.productBlocks[i];
      for (let j = 0; j < block.rhombuses.length; j += 1) {
        const rhombus = block.rhombuses[j];
        const { width, height } = rhombus;
        const [x, y] = productPositions[i * 3 + j];
        const a = document.createElement('a');
        const title = this.pT[i*3+j];
        title.style.transform = `translate(${(x - PRODUCT.gapX / 2) * scale}px, ${(PRODUCT.height + PRODUCT.y + showLines.height + partnerLines.height + y) * scale}px)`;
        title.style.width = `${width}px`;
        title.style.lineHeight = `${PRODUCT.gapY * scale}px`;
        title.style.height = `${PRODUCT.gapY}px`;
        a.style.transform = `translate(${(x - PRODUCT.gapX / 2) * scale}px, ${(PRODUCT.y + showLines.height + partnerLines.height + y) * scale}px)`;
        a.style.width = `${width}px`;
        a.style.height = `${height}px`;
        a.setAttribute('class', 'content__button');
        document.querySelector('.content').appendChild(a);
        a.addEventListener('mouseover', () => blocks.handleMouseOverProduct(i, j));
        a.addEventListener('mouseout', () => blocks.handleMouseOutProduct(i, j));
        a.addEventListener('click', () => productViewer.open(i * 3 + j));
        this.prLA.push(a);
      }
    };
    TEXT.positions[14][1] += partnersHeight;
    TEXT.positions[15][1] += partnersHeight;
    TEXT.positions[16][1] += partnersHeight + commonsHeight;
    TEXT.positions[17][1] += partnersHeight + commonsHeight;

    this.blocks = blocks;
    this.works = works;
    this.showLines = showLines;
    this.partnerLines = partnerLines;
    this.productLines = productLines;

    this.text.forEach((text, i) => changeTranslate(
      text,
      TEXT.positions[i][0] * this.scale,
      TEXT.positions[i][1] * this.scale
    ));

    this.logoButton.style.width = `${132 * this.scale}px`;
    this.logoButton.style.height = `${132 * this.scale}px`;
    this.logoButton.style.lineHeight = `${132 * this.scale}px`;
    changeTranslate(
      this.logoButton,
      471 * this.scale,
      576 * this.scale
    );

    [...document.querySelectorAll('.js-neon')].forEach((neonText, i) => {
      const { width, height } = NEON[i];
      neonText.style.width = `${width * this.scale}px`;
      neonText.style.height = `${height * this.scale}px`;
    });

    [...document.querySelectorAll('.js-text')]
      .filter((_, i) => [3, 5, 7, 9].indexOf(i) > 0)
      .forEach(p => {
        p.style.width = `${600 * this.scale}px`;
      });

    this.initMenu();
  }

  initMenu() {
    const scrollPositions = [
      () => 0,
      ...WORK.positions.map(([x, y], i) => (e) => {
        e.preventDefault();
        if (window.innerWidth >= 990) { window.scrollTo({ behavior: 'smooth', top: y * this.scale }) }
        else document.querySelectorAll('.show')[i].scrollIntoView({ behavior: 'smooth' });
      }),
      (e) => {
        e.preventDefault();
        if (window.innerWidth >= 990) { window.scrollTo({ behavior: 'smooth', top: (SHOW.y + this.partnerLines.height) * this.scale }) }
        else document.querySelectorAll('.show-wrapper')[1].scrollIntoView({ behavior: 'smooth' });
      },
      (e) => {
        e.preventDefault();
        if (window.innerWidth >= 990) { window.scrollTo({ behavior: 'smooth', top: PARTNER.y * this.scale }) }
        else document.querySelector('.partners').scrollIntoView({ behavior: 'smooth' });
      },
      (e) => {
        e.preventDefault();
        if (window.innerWidth >= 990) { window.scrollTo({ behavior: 'smooth', top: (PRODUCT.y + this.partnerLines.height + this.showLines.height) * this.scale }) }
        else document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
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


  }


  updateXY() {
    this.currentX = this.parent.currentX / 10;
    this.currentY = this.parent.currentY;
  }

  handleResize() {
    const { works, partnerLines, showLines, productLines, wA, paLA, sLA, prLA } = this;
    this.scale = this.parent.scale;
    this.spacing = this.parent.spacing;
    const partnerPositions = getLineElementsPositions(partnerLines.images, PARTNER.width, PARTNER.height, PARTNER.gapX, PARTNER.gapY);
    const showPositions = getLineElementsPositions(showLines.images, SHOW.width, SHOW.height, SHOW.gapX, SHOW.gapY);
    const productPositions = getLineElementsPositions(productLines.images, PRODUCT.width, PRODUCT.height, PRODUCT.gapX, PRODUCT.gapY);

    for (let i = 0; i < works.length; i += 1) {
      const { main: { width, height } } = works[i];
      const a = wA[i];
      a.style.transform = `translate(${WORK.positions[i][0] * this.scale}px, ${WORK.positions[i][1] * this.scale}px)`;
      a.style.width = `${width}px`;
      a.style.height = `${height}px`;
      a.style.lineHeight = `${height}px`;
    };
    for (let i = 0; i < partnerLines.partnerBlocks.length; i += 1) {
      const block = partnerLines.partnerBlocks[i];
      for (let j = 0; j < block.rhombuses.length; j += 1) {
        const rhombus = block.rhombuses[j];
        const { width, height } = rhombus;
        const [x, y] = partnerPositions[i * 3 + j];
        const a = paLA[i * 3 + j];
        a.style.transform = `translate(${x * this.scale}px, ${(PARTNER.y + y) * this.scale}px)`;
        a.style.width = `${width}px`;
        a.style.height = `${height}px`;
        
      }
    };
    for (let i = 0; i < showLines.showBlocks.length; i += 1) {
      const block = showLines.showBlocks[i];
      for (let j = 0; j < block.rhombuses.length; j += 1) {
        const title = this.sT[i * 3 + j];
        const rhombus = block.rhombuses[j];
        const { width, height } = rhombus;
        const [x, y] = showPositions[i * 3 + j];
        const a = sLA[i * 3 + j];
        a.style.transform = `translate(${x * this.scale}px, ${(SHOW.y + partnerLines.height + y) * this.scale}px)`;
        a.style.width = `${width}px`;
        a.style.height = `${height}px`;
        title.style.transform = `translate(${x * this.scale}px, ${(SHOW.height + SHOW.y + partnerLines.height + y) * this.scale}px)`;
        title.style.width = `${width}px`;
        title.style.lineHeight = title.style.height = `${SHOW.gapY * this.scale}px`;
      }
    };

    for (let i = 0; i < productLines.productBlocks.length; i += 1) {
      const block = productLines.productBlocks[i];
      for (let j = 0; j < block.rhombuses.length; j += 1) {
        const title = this.pT[i * 3 + j];
        const rhombus = block.rhombuses[j];
        const { width, height } = rhombus;
        const [x, y] = productPositions[i * 3 + j];
        const a = prLA[i * 3 + j];

        a.style.transform = `translate(${(x - PRODUCT.gapX / 2) * this.scale}px, ${(PRODUCT.y + partnerLines.height + showLines.height + y) * this.scale}px)`;
        a.style.width = `${width}px`;
        a.style.height = `${height}px`;
        title.style.transform = `translate(${(x - PRODUCT.gapX / 2) * this.scale}px, ${(PRODUCT.height + PRODUCT.y + partnerLines.height + showLines.height + y) * this.scale}px)`;
        title.style.width = `${width}px`;
        title.style.lineHeight = title.style.height = `${PRODUCT.gapY * this.scale}px`;
      }
    };

    this.text.forEach((text, i) => changeTranslate(
      text,
      TEXT.positions[i][0] * this.scale,
      TEXT.positions[i][1] * this.scale
    ));

    this.logoButton.style.width = `${132 * this.scale}px`;
    this.logoButton.style.height = `${132 * this.scale}px`;
    this.logoButton.style.lineHeight = `${132 * this.scale}px`;
    changeTranslate(
      this.logoButton,
      471 * this.scale,
      576 * this.scale
    );

    if (window.innerWidth <= 990) {
      this.form.style.transform = '';
    };

    [...document.querySelectorAll('.js-neon')].forEach((neonText, i) => {
      const { width, height } = NEON[i];
      neonText.style.width = `${width * this.scale}px`;
      neonText.style.height = `${height * this.scale}px`;
    });

    [...document.querySelectorAll('.js-text')]
      .filter((_, i) => [3, 5, 7, 9].indexOf(i) > 0)
      .forEach(p => {
        p.style.width = `${500 * this.scale}px`
      });
  }

  render() {
    const formY = (this.showLines.height +
      this.partnerLines.height +
      this.productLines.height +
      PRODUCT.y) * this.scale -
      this.currentY
    changeTranslate(this.content, this.spacing - this.currentX, -this.currentY);
    changeTranslate(
      this.form,
      -this.currentX,
      formY > 0 ? formY : 0
    );
  }
}

export default Text;
