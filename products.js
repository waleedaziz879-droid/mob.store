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
  }
];
