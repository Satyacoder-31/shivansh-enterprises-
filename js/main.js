/**
 * Sivansh Enterprise — Core Luxury JavaScript Engine
 * Features:
 *  - Dark / Luxury White Theme Toggle with LocalStorage Persistence
 *  - 3-Second Automatic Cinematic Hero Carousel with Progress Bar & Controls
 *  - Dynamic Header State Management
 *  - Full Cart System with LocalStorage & WhatsApp Checkout
 *  - Pre-formatted WhatsApp Order & Quote Generators
 *  - Global Search Modal with Real-Time Filtering
 *  - Gallery Lightbox Modal
 *  - Mobile Navigation
 */

// Global Configuration
const SIVANSH_CONFIG = {
  phone: "7533838538",
  whatsappNumber: "917533838538",
  businessName: "Sivansh Enterprise",
  address: "First Floor, Shop No. 3, Agreed Pan Street, Patel Mail Road, Near BOI Bank, Keshod – 362220, Gujarat, India",
  heroIntervalTime: 3000 // 3 seconds
};

// State
let cart = JSON.parse(localStorage.getItem("sivansh_cart") || "[]");
let heroTimer = null;
let currentHeroIndex = 0;

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initHeader();
  initHeroCarousel();
  initCart();
  initSearch();
  initMobileMenu();
  initLightbox();
  initForms();
});

/* ==========================================================================
   THEME SWITCHER (DARK / LUXURY WHITE THEME)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem("sivansh_theme") || "dark";
  applyTheme(savedTheme);

  const toggleBtns = document.querySelectorAll(".theme-toggle-btn");
  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const isLight = document.body.classList.contains("theme-light");
      const nextTheme = isLight ? "dark" : "light";
      applyTheme(nextTheme);
    });
  });
}

function applyTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("theme-light", isLight);
  localStorage.setItem("sivansh_theme", theme);

  // Update theme toggle button icons
  const toggleBtns = document.querySelectorAll(".theme-toggle-btn");
  toggleBtns.forEach(btn => {
    btn.setAttribute("title", isLight ? "Switch to Dark Mode" : "Switch to Light Mode");
    btn.setAttribute("aria-label", isLight ? "Switch to Dark Mode" : "Switch to Light Mode");
    btn.innerHTML = isLight ? `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    ` : `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  });
}

/* ==========================================================================
   HEADER SCROLL MANAGEMENT
   ========================================================================== */
function initHeader() {
  // Dynamically sync announcement bar height to prevent mobile header overlap
  const syncAnnouncementHeight = () => {
    const annBar = document.querySelector('.announcement-bar');
    if (annBar) {
      document.documentElement.style.setProperty('--announcement-height', annBar.offsetHeight + 'px');
    }
  };
  window.addEventListener('resize', syncAnnouncementHeight, { passive: true });
  syncAnnouncementHeight();

  const header = document.querySelector(".site-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/* ==========================================================================
   HERO CAROUSEL (PAGE 1)
   ========================================================================== */
function initHeroCarousel() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  const prevBtn = document.querySelector(".carousel-arrow.prev");
  const nextBtn = document.querySelector(".carousel-arrow.next");
  const carouselTrack = document.querySelector(".hero-carousel-section");

  if (!slides.length) return;

  function showSlide(index) {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    currentHeroIndex = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    resetTimer();
  }

  function nextSlide() {
    showSlide(currentHeroIndex + 1);
  }

  function prevSlide() {
    showSlide(currentHeroIndex - 1);
  }

  function startTimer() {
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = setInterval(nextSlide, SIVANSH_CONFIG.heroIntervalTime);
  }

  function resetTimer() {
    clearInterval(heroTimer);
    startTimer();
  }

  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => showSlide(idx));
  });

  if (carouselTrack) {
    carouselTrack.addEventListener("mouseenter", () => clearInterval(heroTimer));
    carouselTrack.addEventListener("mouseleave", startTimer);

    let touchStartX = 0;
    let touchEndX = 0;

    carouselTrack.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselTrack.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) nextSlide();
      if (touchEndX - touchStartX > 50) prevSlide();
    }, { passive: true });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

  showSlide(0);
}

/* ==========================================================================
   CART SYSTEM & WHATSAPP CHECKOUT
   ========================================================================== */
function initCart() {
  updateCartBadge();
  renderCartDrawerItems();

  const cartTrigger = document.querySelector("#cart-trigger-btn");
  const cartOverlay = document.querySelector("#cart-drawer-overlay");
  const cartDrawer = document.querySelector("#cart-drawer");
  const cartClose = document.querySelector("#cart-close-btn");
  const checkoutBtn = document.querySelector("#cart-checkout-btn");

  if (cartTrigger) {
    cartTrigger.addEventListener("click", () => openCart());
  }

  if (cartClose) {
    cartClose.addEventListener("click", () => closeCart());
  }

  if (cartOverlay) {
    cartOverlay.addEventListener("click", () => closeCart());
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is currently empty. Please add products to proceed.");
        return;
      }
      openOrderModal();
    });
  }

  const orderModal = document.querySelector("#whatsapp-order-modal");
  const orderForm = document.querySelector("#whatsapp-order-form");
  const closeOrderModalBtn = document.querySelector("#close-order-modal-btn");

  if (closeOrderModalBtn && orderModal) {
    closeOrderModalBtn.addEventListener("click", () => {
      orderModal.classList.remove("active");
    });
  }

  if (orderForm) {
    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      executeWhatsAppCheckout(
        document.getElementById("cust-name").value.trim(),
        document.getElementById("cust-phone").value.trim(),
        document.getElementById("cust-address").value.trim()
      );
    });
  }
}

function openCart() {
  const overlay = document.querySelector("#cart-drawer-overlay");
  const drawer = document.querySelector("#cart-drawer");
  if (overlay && drawer) {
    overlay.classList.add("active");
    drawer.classList.add("active");
  }
}

function closeCart() {
  const overlay = document.querySelector("#cart-drawer-overlay");
  const drawer = document.querySelector("#cart-drawer");
  if (overlay && drawer) {
    overlay.classList.remove("active");
    drawer.classList.remove("active");
  }
}

function updateCartBadge() {
  const badges = document.querySelectorAll(".cart-badge");
  const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
  badges.forEach(b => b.textContent = totalCount);
}

function saveCart() {
  localStorage.setItem("sivansh_cart", JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawerItems();
}

function addToCart(productId, quantity = 1) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      model: product.model || "",
      brand: product.brand || "",
      priceDisplay: product.priceDisplay,
      image: product.image,
      qty: quantity
    });
  }

  saveCart();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
}

function updateQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
  }
}

function renderCartDrawerItems() {
  const container = document.querySelector("#cart-items-body");
  const totalItemsSpan = document.querySelector("#cart-total-items");
  if (!container) return;

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  if (totalItemsSpan) totalItemsSpan.textContent = totalItems;

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem; color: #888888;">
        <div style="font-size: 2.5rem; color: var(--gold-primary); margin-bottom: 1rem;">◆</div>
        <p style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 0.5rem;">Your Luxury Cart is Empty</p>
        <p style="font-size: 0.85rem;">Explore our curated CCTV, LED, and Solar collections.</p>
        <a href="shop.html" class="btn btn-gold-outline btn-sm" style="margin-top: 1.5rem;">Explore Collection</a>
      </div>
    `;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-meta">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${item.priceDisplay}</div>
        <div class="cart-item-controls">
          <div class="qty-counter">
            <button type="button" class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
            <span class="qty-input">${item.qty}</span>
            <button type="button" class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
          </div>
          <button type="button" style="background:transparent; color:#888; font-size:0.75rem; cursor:pointer;" onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
      </div>
    </div>
  `).join("");
}

function openOrderModal() {
  const modal = document.querySelector("#whatsapp-order-modal");
  if (modal) {
    modal.classList.add("active");
  }
}

/* ==========================================================================
   WHATSAPP MESSAGE BUILDERS
   ========================================================================== */
function orderOnWhatsApp(productId, quantity = 1) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const message = 
`Hello Sivansh Enterprise,

I would like to enquire/order about the following product:

Product: ${product.name}
Model: ${product.model || 'Standard'}
Quantity: ${quantity}
Price: ${product.priceDisplay}

Please confirm availability, specifications and delivery details.`;

  const waUrl = `https://wa.me/${SIVANSH_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
}

function executeWhatsAppCheckout(name, phone, address) {
  if (!name || !phone || !address) {
    alert("Please fill in your name, mobile number, and address to proceed.");
    return;
  }

  let itemsList = cart.map((item, index) => 
    `[Item ${index + 1}] ${item.name}
  • Model: ${item.model || 'N/A'}
  • Quantity: ${item.qty}
  • Price: ${item.priceDisplay}`
  ).join("\n\n");

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  const message = 
`Hello Sivansh Enterprise,

I would like to place an order.

ORDER DETAILS:
${itemsList}

TOTAL ITEMS: ${totalItems} Products
STATUS: ${cart.some(i => i.priceDisplay.includes("Contact")) ? "Contact for Price Confirmation" : "Ready for Confirmation"}

CUSTOMER DETAILS:
Name: ${name}
Phone: ${phone}
Address: ${address}

Please confirm my order, pricing, and dispatch schedule.`;

  const waUrl = `https://wa.me/${SIVANSH_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  
  document.querySelector("#whatsapp-order-modal").classList.remove("active");
  closeCart();
  window.open(waUrl, "_blank");
}

function requestCCTVQuote(customNotes = "") {
  const message = 
`Hello Sivansh Enterprise,

I would like to request a professional CCTV Security Survey & Quotation for my property.

Property Type: [Home / Office / Shop / Farm / Warehouse]
Required Cameras: [e.g. 4 Cameras, 8 Cameras, or Solar Linkage]
Location: [City / Area]
${customNotes ? `Notes: ${customNotes}` : ''}

Please share suitable camera recommendations and estimated quote.`;

  const waUrl = `https://wa.me/${SIVANSH_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
}

function requestSolarQuote(name = "", phone = "", location = "", propertyType = "", bill = "") {
  const message = 
`Hello Sivansh Enterprise,

I would like to request a Rooftop Solar Consultation & Quotation.

Customer Name: ${name || '[Your Name]'}
Mobile: ${phone || '[Phone]'}
Location: ${location || '[City / Town]'}
Property Type: ${propertyType || '[Residential / Commercial / Industrial]'}
Approx. Monthly Electricity Bill: ${bill || '[e.g. ₹3,000 - ₹10,000]'}

Please advise suitable solar capacity (kW) and consultation availability.`;

  const waUrl = `https://wa.me/${SIVANSH_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
}

/* ==========================================================================
   GLOBAL SEARCH MODAL
   ========================================================================== */
function initSearch() {
  const searchTrigger = document.querySelector("#search-trigger-btn");
  const searchModal = document.querySelector("#search-modal");
  const searchClose = document.querySelector("#search-close-btn");
  const searchInput = document.querySelector("#global-search-input");
  const searchResults = document.querySelector("#search-results-list");

  if (!searchModal) return;

  const openSearch = () => {
    searchModal.classList.add("active");
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
      renderSearchResults("");
    }
  };

  const closeSearch = () => {
    searchModal.classList.remove("active");
  };

  if (searchTrigger) searchTrigger.addEventListener("click", openSearch);
  if (searchClose) searchClose.addEventListener("click", closeSearch);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchModal.classList.contains("active")) closeSearch();
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      openSearch();
    }
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderSearchResults(e.target.value.trim().toLowerCase());
    });
  }

  function renderSearchResults(query) {
    if (!searchResults) return;

    if (!query) {
      searchResults.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #888;">
          Type to search security cameras, solar systems, and LED lighting...
        </div>
      `;
      return;
    }

    const filtered = PRODUCTS_DATA.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.subCategory.toLowerCase().includes(query) ||
      p.shortDesc.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      searchResults.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #888;">
          No matching products found for "${query}".
        </div>
      `;
      return;
    }

    searchResults.innerHTML = filtered.map(item => `
      <a href="product-details.html?id=${item.id}" class="search-result-item">
        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: contain; background: #fff; padding: 4px; border: 1px solid var(--gold-border);">
        <div style="flex-grow: 1;">
          <div style="font-family: var(--font-serif); font-size: 0.95rem; font-weight: 700; color: inherit;">${item.name}</div>
          <div style="font-size: 0.75rem; color: var(--gold-primary);">${item.brand} • ${item.subCategory}</div>
        </div>
        <div style="font-size: 0.8rem; font-weight: 700; color: inherit;">${item.priceDisplay}</div>
      </a>
    `).join("");
  }
}

/* ==========================================================================
   MOBILE MENU
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector("#mobile-menu-toggle");
  const nav = document.querySelector(".nav-menu");

  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove("active");
    toggle.classList.remove("active");
    document.body.style.overflow = "";
  };

  const openMenu = () => {
    nav.classList.add("active");
    toggle.classList.add("active");
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (nav.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  nav.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("click", (e) => {
    if (nav.classList.contains("active") && !nav.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("active")) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   LIGHTBOX MODAL
   ========================================================================== */
function initLightbox() {
  const modal = document.querySelector("#lightbox-modal");
  const imgTarget = document.querySelector("#lightbox-target-img");
  const closeBtn = document.querySelector("#lightbox-close-btn");

  if (!modal || !imgTarget) return;

  window.openLightbox = function(src) {
    imgTarget.src = src;
    modal.classList.add("active");
  };

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });
}

/* ==========================================================================
   SOLAR & CONTACT FORMS
   ========================================================================== */
function initForms() {
  const solarForm = document.querySelector("#solar-consult-form");
  if (solarForm) {
    solarForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("solar-name")?.value.trim() || "";
      const phone = document.getElementById("solar-phone")?.value.trim() || "";
      const loc = document.getElementById("solar-location")?.value.trim() || "";
      const ptype = document.getElementById("solar-type")?.value || "";
      const bill = document.getElementById("solar-bill")?.value || "";
      requestSolarQuote(name, phone, loc, ptype, bill);
    });
  }

  const contactForm = document.querySelector("#contact-main-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("contact-name")?.value.trim() || "";
      const phone = document.getElementById("contact-phone")?.value.trim() || "";
      const req = document.getElementById("contact-req")?.value || "";
      const msg = document.getElementById("contact-msg")?.value.trim() || "";

      const fullMessage = 
`Hello Sivansh Enterprise,

New Website Inquiry:

Name: ${name}
Phone: ${phone}
Requirement: ${req}
Message: ${msg}

Please get in touch with me.`;

      const waUrl = `https://wa.me/${SIVANSH_CONFIG.whatsappNumber}?text=${encodeURIComponent(fullMessage)}`;
      window.open(waUrl, "_blank");
    });
  }
}
