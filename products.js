export const products = [
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    price: 1199,
    rating: 4.9,
    reviewsCount: 142,
    description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
    colors: [
      { name: "Titanium Black", hex: "#232426", image: "assets/iphone.png" },
      { name: "Titanium Blue", hex: "#2f4452", image: "assets/iphone.png" },
      { name: "Titanium White", hex: "#e3e4e5", image: "assets/iphone.png" }
    ],
    storage: [
      { size: "256GB", extraPrice: 0 },
      { size: "512GB", extraPrice: 200 },
      { size: "1TB", extraPrice: 400 }
    ],
    specs: {
      display: '6.7" Super Retina XDR OLED, 120Hz',
      processor: "A17 Pro chip (3nm)",
      camera: "48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto",
      battery: "4441 mAh, 25W fast charging",
      os: "iOS 17 (Upgradable)",
      weight: "221g"
    },
    featured: true
  },
  {
    id: "galaxy-s24-ultra",
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    price: 1299,
    rating: 4.8,
    reviewsCount: 198,
    description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.",
    colors: [
      { name: "Titanium Gray", hex: "#8e8e90", image: "assets/galaxy.png" },
      { name: "Titanium Yellow", hex: "#ece3cc", image: "assets/galaxy.png" },
      { name: "Titanium Violet", hex: "#4b415a", image: "assets/galaxy.png" }
    ],
    storage: [
      { size: "256GB", extraPrice: 0 },
      { size: "512GB", extraPrice: 120 },
      { size: "1TB", extraPrice: 360 }
    ],
    specs: {
      display: '6.8" Dynamic AMOLED 2X, 120Hz, HDR10+',
      processor: "Snapdragon 8 Gen 3 for Galaxy",
      camera: "200MP Main + 50MP Periscope + 12MP Ultra Wide + 10MP Telephoto",
      battery: "5000 mAh, 45W fast charging",
      os: "Android 14 (One UI 6.1)",
      weight: "232g"
    },
    featured: true
  },
  {
    id: "pixel-8-pro",
    name: "Pixel 8 Pro",
    brand: "Google",
    price: 999,
    rating: 4.7,
    reviewsCount: 110,
    description: "The all-pro phone engineered by Google. It has the best of Google AI, the most advanced Pixel Camera ever, and can help you do more, even faster.",
    colors: [
      { name: "Bay Blue", hex: "#a4c2e6", image: "assets/pixel.png" },
      { name: "Obsidian", hex: "#2d2d2d", image: "assets/pixel.png" },
      { name: "Porcelain", hex: "#f4f0ea", image: "assets/pixel.png" }
    ],
    storage: [
      { size: "128GB", extraPrice: 0 },
      { size: "256GB", extraPrice: 60 },
      { size: "512GB", extraPrice: 180 }
    ],
    specs: {
      display: '6.7" LTPO OLED, 120Hz, 2400 nits',
      processor: "Google Tensor G3 (4nm)",
      camera: "50MP Main + 48MP Ultra Wide + 48MP 5x Telephoto",
      battery: "5050 mAh, 30W fast charging",
      os: "Android 14 (Pure Pixel Experience)",
      weight: "213g"
    },
    featured: true
  },
  {
    id: "oneplus-12",
    name: "OnePlus 12",
    brand: "OnePlus",
    price: 799,
    rating: 4.8,
    reviewsCount: 85,
    description: "Redefined flagship specs. Combining the latest hardware with custom optimization, the OnePlus 12 delivers smooth performance, elite cameras, and ultra-fast charging.",
    colors: [
      { name: "Flowy Emerald", hex: "#4e6a57", image: "assets/oneplus.png" },
      { name: "Silky Black", hex: "#1f2022", image: "assets/oneplus.png" }
    ],
    storage: [
      { size: "256GB", extraPrice: 0 },
      { size: "512GB", extraPrice: 100 }
    ],
    specs: {
      display: '6.82" LTPO2 AMOLED, 120Hz, 4500 nits',
      processor: "Snapdragon 8 Gen 3 (4nm)",
      camera: "50MP Main + 64MP 3x Periscope + 48MP Ultra Wide",
      battery: "5400 mAh, 100W SuperVOOC",
      os: "Android 14 (OxygenOS 14)",
      weight: "220g"
    },
    featured: false
  },
  {
    id: "xiaomi-14-ultra",
    name: "Xiaomi 14 Ultra",
    brand: "Xiaomi",
    price: 1099,
    rating: 4.9,
    reviewsCount: 74,
    description: "Co-engineered with Leica, featuring a quad-camera system with a massive 1-inch sensor and stepless variable aperture. A masterpiece of optical engineering.",
    colors: [
      { name: "Black Leather", hex: "#1a1a1a", image: "assets/xiaomi.png" },
      { name: "White Leather", hex: "#eaeaea", image: "assets/xiaomi.png" }
    ],
    storage: [
      { size: "512GB", extraPrice: 0 }
    ],
    specs: {
      display: '6.73" LTPO AMOLED, 120Hz, Dolby Vision',
      processor: "Snapdragon 8 Gen 3 (4nm)",
      camera: "50MP Leica 1\" Main + 50MP Telephoto + 50MP Periscope + 50MP Ultra Wide",
      battery: "5000 mAh, 90W HyperCharge",
      os: "Android 14 (HyperOS)",
      weight: "220g"
    },
    featured: false
  },
  {
    id: "xperia-1-vi",
    name: "Xperia 1 VI",
    brand: "Sony",
    price: 1199,
    rating: 4.6,
    reviewsCount: 43,
    description: "Designed for creators and audiophiles. Features a unique optical telephoto zoom lens (85-170mm), a brilliant OLED display, and high-res audio jacks.",
    colors: [
      { name: "Black", hex: "#111111", image: "assets/xperia.png" },
      { name: "Khaki Green", hex: "#44493f", image: "assets/xperia.png" }
    ],
    storage: [
      { size: "256GB", extraPrice: 0 },
      { size: "512GB", extraPrice: 150 }
    ],
    specs: {
      display: '6.5" OLED, 120Hz, 19.5:9 ratio',
      processor: "Snapdragon 8 Gen 3 (4nm)",
      camera: "48MP Main + 12MP Continuous Telephoto + 12MP Ultra Wide",
      battery: "5000 mAh, 30W USB-PD",
      os: "Android 14",
      weight: "192g"
    },
    featured: false
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    brand: "Apple",
    price: 799,
    rating: 4.7,
    reviewsCount: 203,
    description: "iPhone 15 features a stunning 6.1-inch Super Retina XDR display, the powerful A16 Bionic chip, and a 48MP main camera that captures extraordinary detail.",
    colors: [
      { name: "Pink",          hex: "#f4b8c1", image: "assets/iphone15.png" },
      { name: "Yellow",        hex: "#f5e27a", image: "assets/iphone15.png" },
      { name: "Green",         hex: "#a8d5b5", image: "assets/iphone15.png" },
      { name: "Black",         hex: "#1c1c1e", image: "assets/iphone15.png" }
    ],
    storage: [
      { size: "128GB", extraPrice: 0 },
      { size: "256GB", extraPrice: 100 },
      { size: "512GB", extraPrice: 300 }
    ],
    specs: {
      display:   '6.1" Super Retina XDR OLED, 60Hz',
      processor: "A16 Bionic chip (4nm)",
      camera:    "48MP Main + 12MP Ultra Wide",
      battery:   "3877 mAh, 20W fast charging",
      os:        "iOS 17 (Upgradable)",
      weight:    "171g"
    },
    featured: false
  },
  {
    id: "galaxy-a55-5g",
    name: "Galaxy A55 5G",
    brand: "Samsung",
    price: 449,
    rating: 4.5,
    reviewsCount: 316,
    description: "The Galaxy A55 5G brings flagship-level design and features to the mid-range. IP67 rated, Gorilla Glass Victus+, and a 50MP OIS camera — all at an accessible price.",
    colors: [
      { name: "Awesome Iceblue", hex: "#a8cce0", image: "assets/galaxy_a55.png" },
      { name: "Awesome Navy",    hex: "#1a2744", image: "assets/galaxy_a55.png" },
      { name: "Awesome Lilac",   hex: "#c8b8d8", image: "assets/galaxy_a55.png" }
    ],
    storage: [
      { size: "128GB", extraPrice: 0 },
      { size: "256GB", extraPrice: 50 }
    ],
    specs: {
      display:   '6.6" Super AMOLED, 120Hz, FHD+',
      processor: "Exynos 1480 (4nm)",
      camera:    "50MP OIS Main + 12MP Ultra Wide + 5MP Macro",
      battery:   "5000 mAh, 25W fast charging",
      os:        "Android 14 (One UI 6.1)",
      weight:    "213g"
    },
    featured: false
  },
  {
    id: "nothing-phone-2",
    name: "Nothing Phone 2",
    brand: "Nothing",
    price: 599,
    rating: 4.6,
    reviewsCount: 88,
    description: "Nothing Phone 2 redefines transparency — literally. With its iconic Glyph Interface on the back, Snapdragon 8+ Gen 1, and a clean Nothing OS, this phone stands apart.",
    colors: [
      { name: "White", hex: "#f0f0f0", image: "assets/nothing2.png" },
      { name: "Dark Grey", hex: "#2a2a2a", image: "assets/nothing2.png" }
    ],
    storage: [
      { size: "128GB", extraPrice: 0 },
      { size: "256GB", extraPrice: 80 },
      { size: "512GB", extraPrice: 160 }
    ],
    specs: {
      display:   '6.7" LTPO OLED, 120Hz, 1600 nits',
      processor: "Snapdragon 8+ Gen 1 (4nm)",
      camera:    "50MP OIS Main + 50MP Ultra Wide",
      battery:   "4700 mAh, 45W fast charging",
      os:        "Android 14 (Nothing OS 2.5)",
      weight:    "201g"
    },
    featured: false
  },
  {
    id: "motorola-edge-50-pro",
    name: "Motorola Edge 50 Pro",
    brand: "Motorola",
    price: 699,
    rating: 4.5,
    reviewsCount: 67,
    description: "The Edge 50 Pro combines a stunning curved pOLED display with blazing-fast 125W TurboPower charging and a versatile 50MP triple camera with optical zoom.",
    colors: [
      { name: "Luxe Lavender", hex: "#c4a8d4", image: "assets/motorola.png" },
      { name: "Black Beauty",  hex: "#1a1a1a", image: "assets/motorola.png" },
      { name: "Moonlight Pearl", hex: "#e8e4dc", image: "assets/motorola.png" }
    ],
    storage: [
      { size: "256GB", extraPrice: 0 },
      { size: "512GB", extraPrice: 100 }
    ],
    specs: {
      display:   '6.7" curved pOLED, 144Hz, HDR10+',
      processor: "Snapdragon 7 Gen 3 (4nm)",
      camera:    "50MP OIS Main + 10MP 3x Telephoto + 13MP Ultra Wide",
      battery:   "4500 mAh, 125W TurboPower",
      os:        "Android 14 (Hello UI)",
      weight:    "186g"
    },
    featured: false
  },
  {
    id: "vivo-x100-pro",
    name: "Vivo X100 Pro",
    brand: "Vivo",
    price: 999,
    rating: 4.8,
    reviewsCount: 54,
    description: "Co-engineered with Zeiss, the X100 Pro features a 1-inch Sony sensor, real-time portrait bokeh, and 100W FlashCharge. A true camera powerhouse.",
    colors: [
      { name: "Asteroid Black", hex: "#1c1c22", image: "assets/vivo.png" },
      { name: "Startrail Blue", hex: "#2a4a6a", image: "assets/vivo.png" }
    ],
    storage: [
      { size: "256GB", extraPrice: 0 },
      { size: "512GB", extraPrice: 100 }
    ],
    specs: {
      display:   '6.78" AMOLED, 120Hz, 3000 nits',
      processor: "Dimensity 9300 (4nm)",
      camera:    "50MP Zeiss 1\" Main + 50MP 4x Periscope + 50MP Ultra Wide",
      battery:   "5400 mAh, 100W FlashCharge",
      os:        "Android 14 (OriginOS 4)",
      weight:    "225g"
    },
    featured: false
  },
  {
    id: "realme-gt-6",
    name: "Realme GT 6",
    brand: "Realme",
    price: 549,
    rating: 4.6,
    reviewsCount: 92,
    description: "Realme GT 6 brings flagship Snapdragon 8s Gen 3 performance to the masses with a 120Hz AMOLED display, 120W SUPERVOOC charging, and Sony LYT-808 main sensor.",
    colors: [
      { name: "Fluid Silver", hex: "#c0c8d0", image: "assets/realme.png" },
      { name: "Razor Green",  hex: "#2d4a35", image: "assets/realme.png" }
    ],
    storage: [
      { size: "256GB", extraPrice: 0 },
      { size: "512GB", extraPrice: 80 }
    ],
    specs: {
      display:   '6.78" AMOLED, 120Hz, 4000 nits',
      processor: "Snapdragon 8s Gen 3 (4nm)",
      camera:    "50MP Sony LYT-808 Main + 8MP Ultra Wide + 2MP Macro",
      battery:   "5500 mAh, 120W SUPERVOOC",
      os:        "Android 14 (Realme UI 5.0)",
      weight:    "199g"
    },
    featured: false
  }
];
