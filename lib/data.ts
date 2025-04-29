import { Data, IProductInput, IUserInput } from '@/types'
import { toSlug } from './utils'
import bcrypt from 'bcryptjs'

const products: IProductInput[] = [
  //new added
  {
    name: 'Ardiuno uno (smd) with cable',
    slug: toSlug('Ardiuno uno (smd) with cable'),
    category: 'Development-Board',
    images: [
      '/images/ardiuno-uno-smd-cable-1.webp',
      '/images/ardiuno-uno-smd-cable-2.webp',
    ],
    imagesId: ['', ''],
    tags: ['new-arrival', 'todays-deal'],
    isPublished: true,
    price: 495,
    listPrice: 550,
    brand: 'Ardiuno',
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [],
    numSales: 0,
    countInStock: 2,
    description:
      'Microcontroller ATmega328 (SMD) Interface CH340G. Operating Voltage: 5V. Input Voltage (recommended): 7-12V. Input Voltage (limits): 5-20V. Digital I / O Pins 14 (of which 6 provide PWM output). Analog Input Pins: 6. DC Current per I Pin: 40 mA. DC Current for 3.3V Pin: 50 mA. Flash Memory: 32 KB (ATmega328) of which 0.5 KB used by bootloader. SRAM: 2 KB (ATmega328). EEPROM: 1 KB (ATmega328). Clock Speed: 16 MHz',
    sizes: ['(smd) with cable'],
    colors: ['Blue'],
    reviews: [],
  },

  {
    name: 'Esp32 Camera module',
    slug: toSlug('Esp32 Camera module'),
    category: 'Development-Board',
    images: [
      '/images/esp32-cam-1.webp',
      '/images/esp32-cam-2.webp',
      '/images/esp32-cam-3.webp',
    ],
    imagesId: ['', ''],
    tags: ['new-arrival', 'featured', 'todays-deal'],
    isPublished: true,
    price: 720,
    listPrice: 850,
    brand: 'AI Thinker',
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [],
    numSales: 0,
    countInStock: 2,
    description:
      'Dual-core 32-bit CPU Frequency: 240MHz (main). Computing Power: 600 DMIPS. SRAM: 520 KB (Built-in). PSRAM: 4M(external). Camera Expansion: 16x through-holes with UART,SPI,I2C,PWM,ADC,DAC. Support OV2640 cameras, built-in flash. Support image WiFi upload, TF card and multiple sleep modes. Support STA/AP/STA+AP working mode. Power Supply: 5V via pin header',
    sizes: ['module with cam'],
    colors: ['Black'],
    reviews: [],
  },
  {
    name: 'Luckfox pico',
    slug: toSlug('Luckfox pico'),
    category: 'Development-Board',
    brand: 'Luckfox',
    images: [
      '/images/luckfox-pico-1.webp',
      '/images/luckfox-pico-2.webp',
      '/images/luckfox-pico-3.webp',
    ],
    imagesId: ['', ''],
    tags: ['new-arrival', 'todays-deal'],
    isPublished: true,
    price: 1215,
    listPrice: 1350,
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [],
    numSales: 0,
    countInStock: 1,
    description:
      'Processor: Cortex A7 at 1.2GHz + RISC-V. NPU: 0.5TOPS, supports int4, int8 and int16. ISP Input: 4M at 30fps (Max). Memory: 64 MB DDR2. USB: 2.0 Host/Device. Camera: MIPI CSI 2-lane (Not included). GPIO: 24x GPIO pins. Default Storage: TF card (Not included). Pinheader Options',
    sizes: ['luckfox-pico(soldered)'],
    colors: ['black'],
    reviews: [],
  },

  {
    name: 'Ardiuno NANO Welding Type-C',
    slug: toSlug('Ardiuno NANO Welding Type-C'),
    category: 'Development-Board',
    images: [
      '/images/ardiuno-nano-without-cable-1.webp',
      '/images/ardiuno-nano-without-cable-2.webp',
    ],
    imagesId: ['', ''],
    tags: ['new-arrival', 'todays-deal'],
    isPublished: true,
    price: 375,
    listPrice: 418,
    brand: 'Ardiuno',
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [],
    numSales: 0,
    countInStock: 4,
    description:
      'Model Type: Nano. Color: Blue. Microcontroller: ATmega328. Operating Voltage (VDC): 5. Country of Origin/Manufacture: China. Power Consumption: 1 (Watt). Analog I/O Pins: 8. Digital I/O Pins: 22. PWM Output Pins: 6. Clock Speed: 16 MHz. DC Current per I/O Pin (mA): 40. Flash Memory: 32 KB. EEPROM: 1KB. SRAM: 2.',
    sizes: ['Type C'],
    colors: ['Without cable'],
    reviews: [],
  },
  {
    name: 'Ardiuno UNO R3 With Cable',
    slug: toSlug('Ardiuno UNO R3 With Cable'),
    category: 'Development-Board',
    images: [
      '/images/arduino-uno-r3-with-cable-1.webp',
      '/images/arduino-uno-r3-with-cable-2.webp',
    ],
    imagesId: ['', ''],
    tags: ['new-arrival', 'todays-deal'],
    isPublished: true,
    price: 700,
    listPrice: 825,
    brand: 'Ardiuno',
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [],
    numSales: 0,
    countInStock: 2,
    description:
      'Microcontroller: ATmega328. Operating Voltage: 5V. Input Voltage (recommended): 7-12V. Input Voltage (limits): 5-20V. Digital I/O Pins: 14 (of which 6 provide PWM output). Analog Input Pins: 6. DC Current per I/O Pin: 40 mA. DC Current for 3.3V Pin: 50 mA. Flash Memory: 32 KB (ATmega328) of which 0.5 KB used by bootloader. SRAM: 2 KB (ATmega328). EEPROM: 1 KB (ATmega328). Clock Speed: 16 MHz',
    sizes: ['With cable'],
    colors: ['Blue'],
    reviews: [],
  },

  {
    name: 'ESP32-S3 N16R8',
    slug: toSlug('ESP32-S3 N16R8'),
    category: 'Development-Board',
    images: [
      '/images/esp32-s3 n16r8-1.webp',
      '/images/esp32-s3 n16r8-2.webp',
      '/images/esp32-s3 n16r8-3.webp',
      '/images/esp32-s3 n16r8-4.webp',
      '/images/esp32-s3 n16r8-5.webp',
    ],
    imagesId: ['', ''],
    tags: ['new-arrival', 'todays-deal'],
    isPublished: true,
    price: 710,
    listPrice: 790,
    brand: 'ESP',
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [],
    numSales: 0,
    countInStock: 1,
    description:
      'CPU: Dual-core Xtensa LX7, 240 MHz. Flash: 16MB. PSRAM: 8MB. ROM: 384KB. SRAM: 512KB and RTC SRAM: 16KB. WiFi: IEEE 802.11b/g/n, up to 150 Mbps. Bluetooth: Bluetooth 5 LE with speeds up to 2 Mbps. USB-to-Serial: CH340K, max rate 2 Mbps. I/O Interfaces: SPI, UART, I2C, PWM, ADC, DAC. Input Voltage: 5V via USB',
    sizes: ['With-out cable'],
    colors: ['Black'],
    reviews: [],
  },
  {
    name: 'TP4056 Type-C Micro USB 18650 1A Lithium Battery Charging Board',
    slug: toSlug(
      'TP4056 Type-C Micro USB 18650 1A Lithium Battery Charging Board'
    ),
    category: 'Charging-Module',
    images: [
      '/images/type-c-1a-battery-charging-board-1.webp',
      '/images/type-c-1a-battery-charging-board-2.webp',
    ],
    imagesId: ['', ''],
    tags: ['new-arrival'],
    isPublished: true,
    price: 35,
    listPrice: 0,
    brand: 'None',
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [],
    numSales: 0,
    countInStock: 20,
    description:
      'Input voltage: DC 5V. Charging cut-off voltage: 4.2V±1%. Maximum charging current: 1000mA. Battery over discharge protection voltage: 2.5V. Battery overcurrent protection current: 3A. Charging accuracy (%): 1.5',
    sizes: ['TP4056'],
    colors: ['blue'],
    reviews: [],
  },
  {
    name: 'DC 3V-6V N20 Mini Micro Metal Gear Motor',
    slug: toSlug('DC 3V-6V N20 Mini Micro Metal Gear Motor'),
    category: 'Motor',
    images: [
      '/images/n20_mini_micro_metal_gear_motor_1.webp',
      '/images/n20_mini_micro_metal_gear_motor_2.webp',
      '/images/n20_mini_micro_metal_gear_motor_3.webp',
    ],
    imagesId: ['', ''],
    tags: ['new-arrival'],
    isPublished: true,
    price: 200,
    listPrice: 0,
    brand: 'None',
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [],
    numSales: 0,
    countInStock: 5,
    description:
      'Model: N20 Gear Motor. Rated voltage: DC 5V. No-load Speed: 60RPM. No-load current: 50mA. Applicable voltage: 3-9V (36-108rpm). Weight: 20g. Motor Shaft Diameter: 3mm. Motor Shaft Length: 7.2mm',
    sizes: ['Metal'],
    colors: ['Black'],
    reviews: [],
  },
  {
    name: 'Magnetic Switch',
    slug: toSlug('Magnetic Switch'),
    category: 'Switch',
    images: ['/images/megnetic-switch-1.webp'],
    imagesId: ['', ''],
    tags: ['new-arrival'],
    isPublished: true,
    price: 20,
    listPrice: 0,
    brand: 'None',
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [],
    numSales: 0,
    countInStock: 10,
    description:
      'Glass Length: 14mm. Glass Diameter: 2mm. Max Switching Voltage: 300VDC. Min Breakdown Voltage: 150VDC. Max Contact Rating: 10W. Max Switching Current: 0.55A. Max Operate time: 0.45ms. Bounce time: 0.25ms. Max Release time: 0.35ms. Resonant Frequency: 5000HZ. Max Operating: 400HZ',
    sizes: ['2x14mm'],
    colors: ['transparent'],
    reviews: [],
  },
  {
    name: 'Slide Switch 3pin',
    slug: toSlug('Sldie Switch 3pin'),
    category: 'Switch',
    images: ['/images/silde-switch-3pin.webp'],
    imagesId: ['', ''],
    tags: ['new-arrival'],
    isPublished: true,
    price: 10,
    listPrice: 0,
    brand: 'None',
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [],
    numSales: 0,
    countInStock: 20,
    description: 'Type: Slide Switch. Pin: 3pin. Position: Two Position',
    sizes: ['4mm'],
    colors: ['slide'],
    reviews: [],
  },
  {
    name: 'Lasers Dot Diode Module(650nm 6mm 5V 5 million watt)',
    slug: toSlug('Lasers Dot Diode Module(650nm 6mm 5V 5 million watt)'),
    category: 'Diode',
    images: ['/images/lasers-dot-diode-1.webp'],
    imagesId: ['', ''],
    tags: ['new-arrival'],
    isPublished: true,
    price: 35,
    listPrice: 0,
    brand: 'None',
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [],
    numSales: 0,
    countInStock: 10,
    description:
      'Laser wavelength: 650nm (Red). Copper Head Diameter: 6mm. Light power: <5mW. Supply Voltage: 5VDC. Operating Current: <40mA. Power lead length: 75mm',
    sizes: ['5v'],
    colors: ['Red'],
    reviews: [],
  },
  {
    name: 'MQ-2 Detection Smoke Module',
    slug: toSlug('MQ-2 Detection Smoke Module'),
    category: 'Sensor-Module',
    images: ['/images/mq-2_detection_smoke_module-1.webp'],
    imagesId: ['', ''],
    tags: ['new-arrival'],
    isPublished: true,
    price: 140,
    listPrice: 0,
    brand: 'None',
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [],
    numSales: 0,
    countInStock: 5,
    description:
      'Operating voltage: DC 5V. Analog Output (AO): 0~5V. Digital Output (DO): 0V or 5V output. Configuration: Through Potentiometer (adjusts the output level transition). Preheat Duration: 20s',
    sizes: ['MQ-2'],
    colors: ['Blue'],
    reviews: [],
  },
  {
    name: 'MQ-4 Detection Smoke Module',
    slug: toSlug('MQ-4 Detection Smoke Module'),
    category: 'Sensor-Module',
    images: ['/images/mq-4_detection_smoke_module-1.webp'],
    imagesId: ['', ''],
    tags: ['new-arrival'],
    isPublished: true,
    price: 150,
    listPrice: 0,
    brand: 'None',
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [],
    numSales: 0,
    countInStock: 5,
    description:
      'Operating voltage: DC 3v-5V. Detecting Range: 300ppm to 10000ppm. Analog Output (AO): 0~5V. Digital Output (DO): 0V or 5V output. Configuration: Through Potentiometer (adjusts the output level transition)',
    sizes: ['MQ-4'],
    colors: ['Blue'],
    reviews: [],
  },
]

const users: IUserInput[] = [
  {
    name: 'Admin',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'Admin',
    address: {
      fullName: 'Admin Admin',
      street: '121',
      city: 'Dhaka',
      division: 'Dhaka',
      postalCode: '1001',
      phone: '123-456-7890',
    },
    paymentMethod: 'Bikash',
    emailVerified: false,
  },
  {
    name: 'Tester',
    email: 'tester@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Tester Tester',
      street: '123',
      city: 'Dhaka',
      division: 'Dhaka',
      postalCode: '1002',
      phone: '123-456-7890',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
]
const reviews = [
  {
    rating: 5,
    title: "Couldn't ask for more!",
    comment:
      "Love this product! It's durable, stylish, and works great. Would buy again without hesitation.",
  },
]
const webPages = [
  {
    title: 'About Us',
    slug: 'about-us',
    content: `Welcome to SuperStoreX, your trusted destination for quality products and exceptional service. Our journey began with a mission to bring you the best shopping experience by offering a wide range of products at competitive prices, all in one convenient platform.

At SuperStoreX, we prioritize customer satisfaction and innovation. Our team works tirelessly to curate a diverse selection of items, from everyday essentials to exclusive deals, ensuring there's something for everyone. We also strive to make your shopping experience seamless with fast shipping, secure payments, and excellent customer support.

As we continue to grow, our commitment to quality and service remains unwavering. Thank you for choosing SuperStoreX—we look forward to being a part of your journey and delivering value every step of the way.`,
    isPublished: true,
  },
  {
    title: 'Contact Us',
    slug: 'contact-us',
    content: `We’re here to help! If you have any questions, concerns, or feedback, please don’t hesitate to reach out to us. Our team is ready to assist you and ensure you have the best shopping experience.

**Customer Support**
For inquiries about orders, products, or account-related issues, contact our customer support team:
- **Email:** support@example.com
- **Phone:** +1 (123) 456-7890
- **Live Chat:** Available on our website from 9 AM to 6 PM (Monday to Friday).

**Head Office**
For corporate or business-related inquiries, reach out to our headquarters:
- **Address:** 
- **Phone:** 015******54

We look forward to assisting you! Your satisfaction is our priority.
`,
    isPublished: true,
  },
  {
    title: 'Help',
    slug: 'help',
    content: `Welcome to our Help Center! We're here to assist you with any questions or concerns you may have while shopping with us. Whether you need help with orders, account management, or product inquiries, this page provides all the information you need to navigate our platform with ease.

**Placing and Managing Orders**
Placing an order is simple and secure. Browse our product categories, add items to your cart, and proceed to checkout. Once your order is placed, you can track its status through your account under the "My Orders" section. If you need to modify or cancel your order, please contact us as soon as possible for assistance.

**Delivery and Returns**
We offer a variety of delivery options to suit your needs, including standard and express delivery. For detailed delivery costs and delivery timelines, visit our delivery Policy page. If you're not satisfied with your purchase, our hassle-free return process allows you to initiate a return within the specified timeframe. Check our Returns Policy for more details.

**Account and Support**
Managing your account is easy. Log in to update your personal information, payment methods, and saved addresses. If you encounter any issues or need further assistance, our customer support team is available via email, live chat, or phone. Visit our Contact Us page for support hours and contact details.`,
    isPublished: true,
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: `We value your privacy and are committed to protecting your personal information. This Privacy Notice explains how we collect, use, and share your data when you interact with our services. By using our platform, you consent to the practices described herein.

We collect data such as your name, email address, and payment details to provide you with tailored services and improve your experience. This information may also be used for marketing purposes, but only with your consent. Additionally, we may share your data with trusted third-party providers to facilitate transactions or deliver products.

Your data is safeguarded through robust security measures to prevent unauthorized access. However, you have the right to access, correct, or delete your personal information at any time. For inquiries or concerns regarding your privacy, please contact our support team.`,
    isPublished: true,
  },
  {
    title: 'Conditions of Use',
    slug: 'conditions-of-use',
    content: `Welcome to SuperStoreX. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. These terms govern your use of our platform, including browsing, purchasing products, and interacting with any content or services provided. You must be at least 18 years old or have the consent of a parent or guardian to use this website. Any breach of these terms may result in the termination of your access to our platform.

We strive to ensure all product descriptions, pricing, and availability information on our website are accurate. However, errors may occur, and we reserve the right to correct them without prior notice. All purchases are subject to our return and refund policy. By using our site, you acknowledge that your personal information will be processed according to our privacy policy, ensuring your data is handled securely and responsibly. Please review these terms carefully before proceeding with any transactions.
`,
    isPublished: true,
  },
  {
    title: 'Customer Service',
    slug: 'customer-service',
    content: `At SuperStoreX, our customer service team is here to ensure you have the best shopping experience. Whether you need assistance with orders, product details, or returns, we are committed to providing prompt and helpful support.

If you have questions or concerns, please reach out to us through our multiple contact options:
- **Email:** support@example.com
- **Live Chat:** Available on our website for instant assistance

We also provide helpful resources such as order tracking, product guides, and FAQs to assist you with common inquiries. Your satisfaction is our priority, and we’re here to resolve any issues quickly and efficiently. Thank you for choosing us!`,
    isPublished: true,
  },
  {
    title: 'Returns Policy',
    slug: 'returns-policy',
    content: 'Returns Policy Content',
    isPublished: true,
  },
  {
    title: 'Careers',
    slug: 'careers',
    content: 'careers Content',
    isPublished: true,
  },
  {
    title: 'Blog',
    slug: 'blog',
    content: 'Blog Content',
    isPublished: true,
  },
  {
    title: 'Sell Products',
    slug: 'sell',
    content: `Sell Products Content`,
    isPublished: true,
  },
  {
    title: 'Become Affiliate',
    slug: 'become-affiliate',
    content: 'Become Affiliate Content',
    isPublished: true,
  },
  {
    title: 'Advertise Your Products',
    slug: 'advertise',
    content: 'Advertise Your Products',
    isPublished: true,
  },
  {
    title: 'Shipping Rates & Policies',
    slug: 'shipping',
    content: 'Shipping Rates & Policies',
    isPublished: true,
  },
]

const data: Data = {
  users,
  products,
  reviews,
  webPages,
  headerMenus: [
    {
      name: "Today's Deal",
      href: '/search?tag=todays-deal',
    },
    {
      name: 'New Arrivals',
      href: '/search?tag=new-arrival',
    },
    {
      name: 'Featured Products',
      href: '/search?tag=featured',
    },
    {
      name: 'Best Sellers',
      href: '/search?tag=best-seller',
    },
    {
      name: 'Browsing History',
      href: '/#browsing-history',
    },
    {
      name: 'Customer Service',
      href: '/page/customer-service',
    },
    {
      name: 'About Us',
      href: '/page/about-us',
    },
    {
      name: 'Help',
      href: '/page/help',
    },
  ],
  carousels: [
    {
      title: 'Most Popular ESP32 Camera For Sale',
      buttonCaption: 'Shop Now',
      image: '/images/Banner_ESP32-CAM.webp',
      url: '/search?category=Development-Board',
      isPublished: true,
    },
    {
      title: 'Most Popular Luckfox pico For Sale',
      buttonCaption: 'Shop Now',
      image: '/images/Luckfox-Pico-M.webp',
      url: '/search?category=Development-Board',
      isPublished: true,
    },
    {
      title: 'Most Popular Arduino For Sale',
      buttonCaption: 'See More',
      image: '/images/Arduino_Banner.webp',
      url: '/search?category=Development-Board',
      isPublished: true,
    },
  ],
}
export default data
