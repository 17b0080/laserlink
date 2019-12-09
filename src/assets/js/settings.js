export const IMAGES = {
  logo: './assets/img/logo-desktop.png',
  hover: './assets/img/hover.png',
  showMoreHover: './assets/img/showRhombusHoverMore.png',
  works: [
    './assets/img/works/01.png',
    './assets/img/works/02.png',
    './assets/img/works/03.png',
    './assets/img/works/04.png'
  ],
  shows: [],
  partners: [],
  products: [],
  gradients: [
    `./assets/img/Gradients/g1.png`,
    `./assets/img/Gradients/g2.png`,
    `./assets/img/Gradients/g3.png`,
    `./assets/img/Gradients/g4.png`,
    `./assets/img/Gradients/g5.png`,
    `./assets/img/Gradients/g6.png`,
    `./assets/img/Gradients/g7.png`,
    `./assets/img/Gradients/g8.png`
  ]
};
export const LOGO_RECT = {
  x: 238,
  y: 188,
  w: 361,
  h: 55
};
export const LOGO_IMAGE = { width: 355, height: 355 };
export const LOGO_MORE = {
  width: 132,
  height: 132,
  y: 6 + LOGO_IMAGE.height,
  x: (LOGO_IMAGE.width - 132) / 2
};
export const LOGO = {
  width: LOGO_IMAGE.width + LOGO_RECT.w,
  height: LOGO_IMAGE.height + LOGO_MORE.height + 6,
  x: 360,
  y: 216
};
export const WORK = {
  radial: {
    radius: 300,
    gradients: [
      [
        [
          'rgb(155, 16, 179, .6)',
          'rgb(155, 16, 179, .25)',
          'rgb(155, 16, 179, 0)'
        ],
        [
          'rgb(16, 122, 179, .6)',
          'rgb(16, 122, 179, .25)',
          'rgb(16, 122, 179, 0)'
        ]
      ],
      [
        [
          'rgb(255, 211, 2003, .6)',
          'rgb(255, 211, 0, .25)',
          'rgb(255, 211, 0, 0)'
        ],
        [
          'rgb(252, 129, 255, .6)',
          'rgb(252, 129, 255, .25)',
          'rgb(252, 129, 255, 0)'
        ]
      ],
      [
        [
          'rgb(97, 227, 85, .6)',
          'rgb(97, 227, 85, .25)',
          'rgb(97, 227, 85, 0)'
        ],
        [
          'rgb(227, 144, 85, .6)',
          'rgb(227, 144, 85, .25)',
          'rgb(227, 144, 85, 0)'
        ]
      ],
      [
        [
          'rgb(219, 74, 188, .6)',
          'rgb(219, 74, 188, .25)',
          'rgb(219, 74, 188, 0)'
        ],
        [
          'rgb(219, 178, 74, .6)',
          'rgb(219, 178, 74, .25)',
          'rgb(219, 178, 74, 0)'
        ]
      ]
    ]
  },
  width: 425,
  height: 425,
  lineWidth: 4,
  positions: [
    [246, 1426],
    [713, 2721],
    [218, 4016],
    [701, 5311]
  ],
  types: [
    'video-mapping',
    'laser-show',
    'multimedia-show',
    'staging-numbers',
    'common'
  ]
};
export const PARTNER = {
  y: 6918,
  width: 298,
  height: 298,
  gapX: 43,
  gapY: 50
};
export const SHOW = {
  y: 8284 - PARTNER.height,
  width: 298,
  height: 298,
  gapX: 43,
  gapY: 50
};
export const PRODUCT = {
  y: 9619 - SHOW.height - PARTNER.height,
  width: 284,
  height: 284,
  gapY: 45,
  gapX: 84
};
export const TEXT = {
  positions: [
    [688, 404], // 0
    [835, 387],
    [686, 460],
    [149, 953],
    [672, 1537],
    [691, 1677], // 5
    [123, 2832],
    [144, 2965],
    [674, 4127 - 89 + 6],
    [692, 4260],
    [125, 5421], // 10
    [144, 5626],
    [127, 6690],
    [144, 6795],
    [125, 8032 - PARTNER.height],
    [144, 8137 - PARTNER.height], // 15
    [125, 9374 - PARTNER.height - SHOW.height],
    [144, 9479 - PARTNER.height - SHOW.height]
  ]
};
export const GRADIENT = {
  src: i => `./assets/img/Gradients/gradient${i}.png`,
  positions: [
    [
      [243, -104],
      [-102, -106],
      [-64, -3]
    ],
    [
      [201, 1099],
      [-55, 1003],
      [-373, 1083]
    ],
    [
      [761, 2496],
      [545, 2467],
      [353, 2635]
    ],
    [
      [197, 3696],
      [-171, 3749],
      [-315, 3784]
    ],
    [
      [720, 5027],
      [434, 5133],
      [422, 5331]
    ],
    [
      [801, 6619],
      [748, 6544]
    ],
    [
      [812, 8032 - PARTNER.height],
      [681, 7984 - PARTNER.height]
    ],
    [
      [872, 9373 - SHOW.height - PARTNER.height],
      [696, 9363 - SHOW.height - PARTNER.height]
    ]
  ],
  rotations: [
    [0, 90, 180],
    [0, -90, 180],
    [0, 90, 180],
    [0, -90, 180],
    [0, 90, 180],
    [0, 90],
    [0, 90],
    [0, 90]
  ],
  offsets: {
    '0': [-1000, -1000],
    '90': [1000, -1000],
    '-90': [1000, -1000],
    '180': [-1000, -1000]
  }
};
export const LINES = {
  positions: [
    [736, 18, 570, 184],
    [621, 656, 864, 890],
    [843, 1040, 531, 1352],
    [360, 2142, 880, 2662],
    [1008, 3416, 474, 3950],
    [364, 4732, 888, 5256],
    [929, 6120, 454, 6595],
    [814, 7424 - PARTNER.height, 318, 7920 - PARTNER.height],
    [
      888,
      8729 - PARTNER.height - SHOW.height,
      353,
      9264 - PARTNER.height - SHOW.height
    ]
  ],
  strokeStyle: [
    '#F5F4EA',
    '#F5F4EA',
    '#9B10B3',
    '#38CB77',
    '#A7561C',
    '#DB4ABC',
    '#FF1494',
    '#4ADB69',
    '#DBB24A'
  ]
};
export const NEON = [
  { width: 575, height: 100 },
  { width: 552, height: 98 },
  { width: 666, height: 210 },
  { width: 590, height: 200 },
  { width: 610, height: 100 },
  { width: 760, height: 110 },
  { width: 450, height: 100 }
];
export const WORK_GRADIENT_COLORS = [
  [
    '#9b10b3',
    '#107ab3',
    '#28b310',
    '#ffd300',
    '#fc81ff',
    '#652ec7',
    '#9b10b3',
    '#107ab3',
    '#28b310'
  ],
  [
    '#ffd300',
    '#fc81ff',
    '#652ec7',
    '#61e355',
    '#e39055',
    '#55a8e3',
    '#ffd300',
    '#fc81ff',
    '#652ec7'
  ],
  [
    '#61e355',
    '#e39055',
    '#55a8e3',
    '#562897',
    '#db4abc',
    '#2fb6a4',
    '#61e355',
    '#e39055',
    '#55a8e3'
  ],
  [
    '#562897',
    '#db4abc',
    '#2fb6a4',
    '#db4abc',
    '#dbb24a',
    '#4a74db',
    '#562897',
    '#db4abc',
    '#2fb6a4'
  ]
];
export const NEON_CHAR_TIME = 0.6;
export const NEON_CHAR_DELAY = 0.15;
export const GRADIENT_LINES_TIME = 5;
