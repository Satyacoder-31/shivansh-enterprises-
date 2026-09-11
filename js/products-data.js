/**
 * Sivansh Enterprise — Authentic Products Catalog
 * Accurate specifications directly from official brand brochures.
 * Strict adherence: No fabricated pricing ("Contact for Price") and authentic technical specs.
 */

const PRODUCTS_DATA = [
  {
    id: "cofe-4g-solar-camera",
    name: "COFE 4G Solar Camera",
    model: "CF-4G-PTSL24-A-DL Pro",
    brand: "COFE",
    category: "cctv",
    subCategory: "Solar CCTV",
    badge: "10-Day Battery Backup",
    priceDisplay: "Contact for Price",
    priceValue: null,
    rating: 5.0,
    inStock: true,
    image: "assets/images/products/cofe-4g-solar-camera.jpg",
    shortDesc: "Bold and powerful 4G solar camera featuring dual-lens technology, 10X zoom, and up to 10 days of continuous battery backup with integrated solar power.",
    tagline: "Now More Bold & Power Full — Peace For Life",
    specs: {
      "Model Number": "CF-4G-PTSL24-A-DL Pro",
      "Camera Optics": "Dual-Lens Camera System with 10X Zoom",
      "Power Source": "High-Efficiency Solar Panel with Inbuilt Battery",
      "Battery Autonomy": "Up to 10 Days Continuous Battery Backup",
      "Connectivity": "4G SIM Card Support (100% Wire-Free Operation)",
      "Recording Mode": "24x7 Continuous Recording with Alarm LED Function",
      "Night Illumination": "Intelligent Spotlight & Alarm LED",
      "Deployment": "Farms, Ranches, Remote Locations, Orchards, Construction Sites"
    },
    features: [
      "10 Days Continuous Battery Backup with Inbuilt High-Capacity Storage",
      "10X Zoom Capability for Long-Range Perimeter Inspection",
      "4G SIM Connectivity — Operates Wirelessly Anywhere with Cellular Signal",
      "Dual-Lens Camera Configuration for Simultaneous Wide & Focused Views",
      "24x7 Continuous Recording Supported by Autonomous Solar Regeneration",
      "Integrated Alarm LED and Active Warning System"
    ],
    application: "Farms, Agricultural Land, Remote Sites, Construction Areas, Warehouses, Boundary Walls"
  },
  {
    id: "cpplus-vandal-dome-camera",
    name: "CP PLUS 2.4MP Full HD HDCVI IR Vandal Dome Camera",
    model: "CP-UVC-VB24FL3-B",
    brand: "CP PLUS",
    category: "cctv",
    subCategory: "Dome Cameras",
    badge: "IK10 Vandal-Proof",
    priceDisplay: "Contact for Price",
    priceValue: null,
    rating: 5.0,
    inStock: true,
    image: "assets/images/products/cpplus-vandal-dome-camera.jpg",
    shortDesc: "Professional 2.4MP Full HD vandal-resistant dome camera with 30-meter IR range, 120dB WDR, and Starlight technology for extreme low-light clarity.",
    tagline: "Think Security, Think CP PLUS",
    specs: {
      "Model Number": "CP-UVC-VB24FL3-B",
      "Image Sensor": "1/2.8\" 2.4MP CMOS Image Sensor (0.9071 cm)",
      "Frame Rate": "Max 30fps @ 2.4MP Resolution",
      "Video Output": "HD and SD Output Switchable",
      "Dynamic Range": "True WDR (120dB) for Balanced Contrast",
      "Day/Night Filter": "ICR Mechanical Filter with Starlight Low-Light Technology",
      "Image Processing": "2D/3D-DNR, AWB, AGC, BLC, HLC",
      "Lens": "2.7mm – 13.5mm Varifocal Lens with Adjustable Field of View",
      "IR Range": "Up to 30 Metres Infrared Night Range",
      "Ingress / Impact": "IP67 Weatherproof Rating & IK10 Vandal-Proof Casing"
    },
    features: [
      "1/2.8\" 2.4MP CMOS Image Sensor delivering ultra-sharp Full HD video",
      "Starlight Technology for crystal-clear night visuals even in near-pitch darkness",
      "True 120dB WDR eliminates glare from headlights, sunlight, and reflections",
      "2.7–13.5mm Varifocal Lens provides complete flexibility from wide to telephoto",
      "IK10 Vandal-Proof heavy-duty metal housing designed to withstand physical impact",
      "IP67 Weatherproof standard engineered for harsh rain, dust, and temperature extremes"
    ],
    application: "Commercial Showrooms, Banks, Retail Shops, Luxury Homes, Schools, Office Buildings"
  },
  {
    id: "hifocus-mini-pt-solar-camera",
    name: "HI-FOCUS 3MP 4G Mini PT Solar Linkage Camera",
    model: "HC-IPC-SDJ40N3-SLR4G",
    brand: "HI-FOCUS",
    category: "cctv",
    subCategory: "Solar Linkage PT",
    badge: "100% Wire-Free 4G",
    priceDisplay: "Contact for Price",
    priceValue: null,
    rating: 5.0,
    inStock: true,
    image: "assets/images/products/hifocus-mini-pt-solar-camera.jpg",
    shortDesc: "Wire-free 3MP 4G Mini PT camera featuring motorized 355° pan-tilt, color night vision, two-way audio, and solar linkage charging for remote monitoring.",
    tagline: "HF AIoT — Enhancing Your Vision",
    specs: {
      "Model Number": "HC-IPC-SDJ40N3-SLR4G",
      "Video Resolution": "3 Megapixel (3MP) Crisp Visual Clarity",
      "Connectivity": "4G SIM Connectivity (100% Wire-Free, No Wi-Fi or Wiring Needed)",
      "Power System": "Dedicated Solar Panel with High-Capacity Built-in Battery",
      "Pan-Tilt Rotation": "PT 355° Horizontal Rotation for Full 360° Perimeter Coverage",
      "Night Mode": "Intelligent Full Color Night Vision with Warm Light + IR",
      "Audio System": "Two-Way Audio with Built-in High-Sensitivity Mic & Speaker",
      "Smart Detection": "Advanced AI Human Detection & Instant Alerts",
      "Weather Ingress": "IP66 Weatherproof Certified Housing",
      "Storage": "Micro SD Card & Encrypted Cloud Storage Support",
      "Remote Access": "Real-Time Mobile Monitoring via Official App"
    },
    features: [
      "Solar Powered with Built-in Battery — continuous autonomous security",
      "4G SIM Connectivity provides complete independence from local Wi-Fi or broadband",
      "Motorized 355° Pan Rotation allows remote angle control from your smartphone",
      "Color Night Vision provides vivid night monitoring rather than blurry monochrome",
      "Two-Way Audio lets you speak directly to visitors or deter intruders remotely",
      "AI Human Detection filters out false alarms caused by rain, leaves, or animals"
    ],
    application: "Farms & Ranches, Construction Sites, Warehouses, Remote Properties, Agricultural Fields"
  },
  {
    id: "coreprix-wifi-pt-camera",
    name: "Coreprix 3MP Wi-Fi Smart PT Camera",
    model: "CPWF-3M-ODSL",
    brand: "Coreprix",
    category: "cctv",
    subCategory: "Wi-Fi Cameras",
    badge: "BIS ER Certified • 2 Year Warranty",
    priceDisplay: "Contact for Price",
    priceValue: null,
    rating: 5.0,
    inStock: true,
    image: "assets/images/products/coreprix-wifi-pt-camera.jpg",
    shortDesc: "Made in India 3MP smart Wi-Fi pan-tilt security camera certified by accredited STQC Lab with motion tracking, color night vision, and Coreprix Pro app control.",
    tagline: "Eyes That Never Blink On Your Safety",
    specs: {
      "Model Number": "CPWF-3M-ODSL",
      "Resolution": "3MP High-Definition Video Stream",
      "Certification": "BIS ER Certified (Through Accredited STQC Lab, Reg: R-71047872)",
      "Connectivity": "High-Gain Wi-Fi Dual Antennas",
      "Pan & Tilt": "Motorized Multi-Axis Pan & Tilt Control",
      "Tracking": "Automated Motion Tracking with Human Detection",
      "Night Vision": "Full Color Night Vision with Multi-LED Array",
      "Storage": "Local TF Card Slot with Loop Recording",
      "Software": "Coreprix Pro Official Mobile Application (Android & iOS)",
      "Warranty": "2-Year Official Manufacturer Warranty",
      "Manufacturing": "Proudly Made in India"
    },
    features: [
      "BIS ER Certified through accredited STQC Lab ensuring national regulatory compliance",
      "Smart Motion Tracking automatically follows moving subjects across the coverage zone",
      "Vivid Color Night Vision with powerful illuminators for nocturnal surveillance",
      "2-Year Official Warranty for long-term reliability and peace of mind",
      "Coreprix Pro mobile application with instant push notifications and playback",
      "Dual high-gain external antennas for reliable signal penetration through walls"
    ],
    application: "Residential Homes, Retail Stores, Small Offices, Clinics, Garages, Driveways"
  },
  {
    id: "hifocus-optima-ip-cameras",
    name: "HI-FOCUS Optima Series 4MP IP Surveillance Suite",
    model: "HIPC-D3304-DLS-R1 / HIPC-T4404-DL-R1",
    brand: "HI-FOCUS",
    category: "cctv",
    subCategory: "IP Cameras",
    badge: "STQC Certified • 4MP IP",
    priceDisplay: "Contact for Price",
    priceValue: null,
    rating: 5.0,
    inStock: true,
    image: "assets/images/products/hifocus-optima-ip-cameras.jpg",
    shortDesc: "Enterprise-grade 4MP IP Dome and Bullet camera series with 50M/40M IR distance, 20M white light, PoE support, built-in mic, and two-way audio.",
    tagline: "Intelligent Protection. Trusted Every Time.",
    specs: {
      "Series": "HI-FOCUS Optima Series (STQC / BIS-ER Certified)",
      "4MP Dome Model": "HIPC-D3304-DLS-R1 (1/3\" CMOS, 50M IR, 20M White Light, IP66, Built-in Mic & Speaker)",
      "4MP Bullet Model": "HIPC-T4404-DL-R1 (1/3\" CMOS, 40M IR, 20M White Light, 4mm/6mm Lens, IP67, PoE 802.3af)",
      "Sensor Technology": "1/3\" CMOS High-Quality Image Sensor",
      "Night Illumination": "Smart Night Vision with Hybrid IR + 20M Integrated White Light",
      "Power Options": "12V DC Power Supply & PoE (IEEE 802.3af Power Over Ethernet)",
      "Audio Support": "Built-in Mic for Audio Recording & Two-Way Audio Communication (PRIME NVR)",
      "Protection Standard": "Weatherproof & Dustproof IP66 / IP67 Design",
      "Security Analytics": "Motion Detection, Tampering Alarm, High Resolution Imaging"
    },
    features: [
      "4MP High-Definition imaging provides ultra-fine identification of faces and vehicle plates",
      "Extended 50-Meter IR range on Dome and 40-Meter IR on Bullet for total perimeter coverage",
      "Integrated 20M White Light lamps for full color night capture upon detection",
      "PoE (Power over Ethernet) support allows single cable installation for data and power",
      "Built-in Microphone with crisp acoustic capture and optional two-way speaker talkback",
      "Certified by BIS-ER and accredited STQC laboratory standards"
    ],
    application: "Corporate Offices, Industrial Warehouses, Residential Societies, Showrooms, Infrastructure"
  },
  {
    id: "sivansh-architectural-led-downlight",
    name: "Sivansh Architectural Anti-Glare LED Downlight Series",
    model: "SE-LED-DL-PRO",
    brand: "Sivansh Signature",
    category: "led",
    subCategory: "LED Downlights",
    badge: "Architectural Grade",
    priceDisplay: "Contact for Price",
    priceValue: null,
    rating: 5.0,
    inStock: true,
    image: "assets/images/lifestyle/led-app-shop.jpg",
    shortDesc: "Deep recessed architectural LED downlights with CRI 95+ precision optics, zero-glare honeycomb baffle, and seamless dimming compatibility.",
    tagline: "Light That Defines Space",
    specs: {
      "Wattage Options": "7W / 12W / 18W / 24W",
      "Color Temperature": "3000K (Warm White) / 4000K (Natural) / 6000K (Cool Day)",
      "Color Rendering Index": "CRI ≥ 95 for true-to-life color rendering",
      "Beam Angle": "24° / 36° / 60° Precision Optical Reflectors",
      "Optics Design": "Deep Recessed Honeycomb Anti-Glare Baffle (UGR < 13)",
      "Housing": "Die-Cast Aerospace Grade Aluminum with Electrostatic Powder Coat",
      "Operating Lifespan": "Up to 50,000 Operating Hours with Constant-Current Driver"
    },
    features: [
      "Museum and luxury boutique-grade CRI 95+ illuminates textures with rich fidelity",
      "Deep recessed anti-glare design prevents eye strain and glare in high-end spaces",
      "Energy-saving architecture delivers up to 85% reduced electrical consumption",
      "High-efficiency thermal heatsink guarantees zero color shifting across decades",
      "Compatible with leading smart automation systems and phase/analog dimmers"
    ],
    application: "Luxury Homes, Jewelry Boutiques, Art Galleries, Executive Offices, Hotels"
  },
  {
    id: "sivansh-linear-cove-led-suite",
    name: "Sivansh High-CRI Linear Architectural LED Cove Suite",
    model: "SE-LED-LIN-ARCH",
    brand: "Sivansh Signature",
    category: "led",
    subCategory: "LED Lighting",
    badge: "Seamless Illumination",
    priceDisplay: "Contact for Price",
    priceValue: null,
    rating: 5.0,
    inStock: true,
    image: "assets/images/hero/hero-led.jpg",
    shortDesc: "Continuous spotless linear architectural LED profile system engineered for false ceiling coves, stair risers, and contemporary wall wash treatments.",
    tagline: "Sculpting Spaces With Warm Illumination",
    specs: {
      "Form Factor": "Ultra-Slim Extruded Anodized Aluminum Profile with Frosted Diffuser",
      "LED Density": "240 LEDs/Meter for 100% Spotless Continuous Illumination",
      "Color Temperature": "2700K Architectural Warm / 3000K / Tunable White",
      "Luminous Efficacy": "120 Lumens / Watt High-Efficiency Output",
      "Driver System": "High-Power-Factor Isolated Constant Voltage Driver",
      "Ingress Protection": "IP20 Indoor Architectural / IP67 Wet Area Grade Available"
    },
    features: [
      "Spot-free continuous illumination through high-density LED engineering",
      "Warm metallic reflection enhances architectural stone, wood, and gold accents",
      "Long-term structural reliability with heavy-duty extruded aluminum profiles",
      "Customizable lengths to suit bespoke residential and commercial layouts"
    ],
    application: "False Ceilings, Staircases, Marble Accent Walls, Reception Counters, Luxury Lounges"
  },
  {
    id: "sivansh-monocrystalline-solar-suite",
    name: "Sivansh High-Efficiency Monocrystalline Rooftop Solar Suite",
    model: "SE-SOLAR-MONO-N",
    brand: "Sivansh Energy",
    category: "solar",
    subCategory: "Rooftop Solar",
    badge: "Topcon Bifacial N-Type",
    priceDisplay: "Contact for Price",
    priceValue: null,
    rating: 5.0,
    inStock: true,
    image: "assets/images/hero/hero-solar.jpg",
    shortDesc: "Premium all-black N-Type TopCon bifacial monocrystalline solar panels engineered for maximum generation yield on Gujarat rooftops.",
    tagline: "Energy. Reimagined.",
    specs: {
      "Cell Architecture": "N-Type TOPCon Half-Cut Bifacial Monocrystalline Cells",
      "Module Efficiency": "High Conversion Efficiency up to 22.8%",
      "Power Classes": "540W / 550W / 580W per Module",
      "Structure Mounting": "Heavy-Duty Hot-Dip Galvanized / Anodized Aluminum Engineered Structures",
      "Inverter Compatibility": "Grid-Tied On-Grid, Hybrid Battery Ready & Microinverter Systems",
      "Temperature Coefficient": "Superior -0.30%/°C low temperature coefficient ideal for Gujarat summers",
      "Durability Standard": "Engineered to withstand high wind velocity and coastal weather"
    },
    features: [
      "Ultra-modern all-black aesthetics blend seamlessly with architectural rooflines",
      "Bifacial generation captures reflected ambient ground light for bonus energy yield",
      "Drastically reduces monthly commercial and residential electricity expenditures",
      "Installed by certified technicians with complete end-to-end liaison and metering support"
    ],
    application: "Luxury Residences, Commercial Buildings, Hospitals, Farmhouses, Industrial Sheds"
  }
];

// Helper functions for easy querying
function getProductById(id) {
  return PRODUCTS_DATA.find(p => p.id === id);
}

function getProductsByCategory(category) {
  if (!category || category === "all") return PRODUCTS_DATA;
  return PRODUCTS_DATA.filter(p => p.category === category);
}

function getCCTVProducts() {
  return PRODUCTS_DATA.filter(p => p.category === "cctv");
}

function getFeaturedProducts() {
  // Products to highlight on homepage collection
  return PRODUCTS_DATA.slice(0, 6);
}
