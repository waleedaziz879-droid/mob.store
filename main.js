import { products } from './products.js';
import { cartManager } from './cart.js';
import { comparisonManager } from './comparison.js';

// Application State
let activeHeroIndex = 0;
let brandFilter = 'All';
let searchQuery = '';
let minPrice = 0;
let maxPrice = 1500;
let sortOption = 'featured';
let heroInterval;

// DOM Elements Cache
const elements = {
  // Navigation & General
  themeToggle: document.getElementById('theme-toggle'),
  themeMoonIcon: document.getElementById('theme-moon-icon'),
  themeSunIcon: document.getElementById('theme-sun-icon'),
  catalogSearch: document.getElementById('catalog-search'),
  
  // Hero Slider
  heroSlider: document.getElementById('hero-slider-container'),
  heroSliderDots: document.getElementById('hero-slider-dots'),
  
  // Filters
  brandButtons: document.querySelectorAll('.brand-btn'),
  priceMin: document.getElementById('price-min'),
  priceMax: document.getElementById('price-max'),
  priceSlider: document.getElementById('price-slider'),
  sortSelect: document.getElementById('sort-select'),
  resultsCount: document.getElementById('results-count-text'),
  
  // Product Catalog
  catalogGrid: document.getElementById('catalog-products-grid'),
  
  // Floating Compare Bar
  compareBar: document.getElementById('compare-bar'),
  compareSlots: document.getElementById('compare-slots-container'),
  compareCount: document.getElementById('compare-count-text'),
  compareNowBtn: document.getElementById('compare-now-btn'),
  
  // Cart Drawer
  cartTrigger: document.getElementById('cart-trigger'),
  cartBadge: document.getElementById('cart-badge-count'),
  cartOverlay: document.getElementById('cart-drawer-overlay'),
  cartClose: document.getElementById('cart-drawer-close'),
  cartItemsContainer: document.getElementById('cart-drawer-items'),
  cartSubtotal: document.getElementById('cart-subtotal-val'),
  checkoutTrigger: document.getElementById('checkout-trigger-btn'),
  
  // Modals
  detailsOverlay: document.getElementById('details-modal-overlay'),
  detailsClose: document.getElementById('details-modal-close'),
  detailsContent: document.getElementById('details-modal-content'),
  
  compareOverlay: document.getElementById('compare-modal-overlay'),
  compareClose: document.getElementById('compare-modal-close'),
  compareGridWrapper: document.getElementById('compare-modal-grid-wrapper'),
  
  checkoutOverlay: document.getElementById('checkout-modal-overlay'),
  checkoutClose: document.getElementById('checkout-modal-close'),
  checkoutModalBody: document.getElementById('checkout-modal-body'),
  
  toastContainer: document.getElementById('toast-container')
};

// ==========================================================================
// Initialization & Core Events
// ==========================================================================
function init() {
  setupTheme();
  renderHeroSlider();
  renderCatalog();
  updateCartUI();
  updateCompareUI();
  setupEventListeners();
  
  // Start Hero Auto-rotate
  startHeroRotation();
}

// Theme handling (Light / Dark)
function setupTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-theme');
    elements.themeMoonIcon.style.display = 'none';
    elements.themeSunIcon.style.display = 'block';
  } else {
    document.body.classList.remove('dark-theme');
    elements.themeMoonIcon.style.display = 'block';
    elements.themeSunIcon.style.display = 'none';
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  elements.themeMoonIcon.style.display = isDark ? 'none' : 'block';
  elements.themeSunIcon.style.display = isDark ? 'block' : 'none';
  showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled');
}

// Toast System
function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'error' : ''}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${isError ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>' 
                 : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'}
    </svg>
    <span>${message}</span>
  `;
  elements.toastContainer.appendChild(toast);
  
  // Remove toast after animation completes
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease-in reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==========================================================================
// Hero Slider Feature
// ==========================================================================
function renderHeroSlider() {
  const featured = products.filter(p => p.featured);
  elements.heroSlider.innerHTML = '';
  elements.heroSliderDots.innerHTML = '';

  featured.forEach((product, idx) => {
    // Generate slide HTML
    const slide = document.createElement('div');
    slide.className = `hero-slide glass ${idx === activeHeroIndex ? 'active' : ''}`;
    slide.style.background = `linear-gradient(135deg, ${product.colors[0].hex}22, var(--bg-secondary))`;
    slide.innerHTML = `
      <div class="hero-content">
        <span class="hero-tag">Featured New Flagship</span>
        <h2 class="hero-title">${product.name}</h2>
        <p class="hero-desc">${product.description}</p>
        <p class="hero-price">From $${product.price}</p>
        <button class="glow-btn hero-btn" data-id="${product.id}">Learn More & Buy</button>
      </div>
      <div class="hero-image-container">
        <img src="${product.colors[0].image}" alt="${product.name}" class="hero-image" onerror="this.src='https://placehold.co/300x500/171d26/00f0ff?text=${encodeURIComponent(product.name)}'">
      </div>
    `;
    elements.heroSlider.appendChild(slide);

    // Generate navigation dot
    const dot = document.createElement('button');
    dot.className = `slider-dot ${idx === activeHeroIndex ? 'active' : ''}`;
    dot.ariaLabel = `Go to slide ${idx + 1}`;
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetHeroRotation();
    });
    elements.heroSliderDots.appendChild(dot);
  });
  
  // Bind CTA
  elements.heroSlider.querySelectorAll('.hero-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prodId = e.target.getAttribute('data-id');
      const prod = products.find(p => p.id === prodId);
      if (prod) openDetailsModal(prod);
    });
  });
}

function goToSlide(idx) {
  const slides = elements.heroSlider.querySelectorAll('.hero-slide');
  const dots = elements.heroSliderDots.querySelectorAll('.slider-dot');
  if (!slides.length) return;
  
  slides[activeHeroIndex].classList.remove('active');
  dots[activeHeroIndex].classList.remove('active');
  
  activeHeroIndex = (idx + slides.length) % slides.length;
  
  slides[activeHeroIndex].classList.add('active');
  dots[activeHeroIndex].classList.add('active');
}

function startHeroRotation() {
  heroInterval = setInterval(() => {
    goToSlide(activeHeroIndex + 1);
  }, 6000);
}

function resetHeroRotation() {
  clearInterval(heroInterval);
  startHeroRotation();
}

// ==========================================================================
// Catalog filtering & rendering
// ==========================================================================
function renderCatalog() {
  // 1. Filter products
  let filtered = products.filter(product => {
    const matchesBrand = brandFilter === 'All' || product.brand === brandFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.specs.processor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    return matchesBrand && matchesSearch && matchesPrice;
  });

  // 2. Sort products
  if (sortOption === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else {
    // Featured first, then alphabetical
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.name.localeCompare(b.name));
  }

  // 3. Update count UI
  elements.resultsCount.innerText = searchQuery 
    ? `Found ${filtered.length} products for "${searchQuery}"`
    : `Showing ${filtered.length} products`;

  // 4. Render Grid HTML
  elements.catalogGrid.innerHTML = '';
  if (filtered.length === 0) {
    elements.catalogGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-secondary);">
        <p style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;">No products found</p>
        <p>Try adjusting your search criteria or filters.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(product => {
    const isComparing = comparisonManager.isComparing(product.id);
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="card-actions-top">
        <div class="card-rating">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>${product.rating}</span>
        </div>
        <button class="card-compare-btn ${isComparing ? 'active' : ''}" data-id="${product.id}" title="Compare Product">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 3h5v5M4 20L20.2 3.8M20 16v5h-5M4 4l16.2 16.2"></path>
          </svg>
        </button>
      </div>
      <div class="product-img-wrapper">
        <img src="${product.colors[0].image}" alt="${product.name}" onerror="this.src='https://placehold.co/180x280/171d26/00f0ff?text=${encodeURIComponent(product.name)}'">
      </div>
      <div class="card-body">
        <span class="card-brand">${product.brand}</span>
        <h3 class="card-name">${product.name}</h3>
        <p class="card-desc">${product.description}</p>
      </div>
      <div class="card-footer">
        <span class="card-price">${product.price}</span>
        <button class="quick-view-btn" data-id="${product.id}">Customize</button>
      </div>
    `;
    elements.catalogGrid.appendChild(card);
  });

  // Bind Events for newly rendered cards
  elements.catalogGrid.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prodId = e.target.getAttribute('data-id');
      const prod = products.find(p => p.id === prodId);
      if (prod) openDetailsModal(prod);
    });
  });

  elements.catalogGrid.querySelectorAll('.card-compare-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const prodId = btn.getAttribute('data-id');
      const prod = products.find(p => p.id === prodId);
      if (prod) {
        if (comparisonManager.isComparing(prodId)) {
          comparisonManager.removeFromCompare(prodId);
          btn.classList.remove('active');
          showToast(`${prod.name} removed from comparison.`);
        } else {
          const res = comparisonManager.addToCompare(prod);
          if (res.success) {
            btn.classList.add('active');
            showToast(res.message);
          } else {
            showToast(res.message, true);
          }
        }
      }
    });
  });
}

// ==========================================================================
// Product Customization Modal (Details)
// ==========================================================================
function openDetailsModal(product) {
  let selectedColor = product.colors[0];
  let selectedStorage = product.storage[0];

  function getDynamicPrice() {
    return product.price + selectedStorage.extraPrice;
  }

  function updateModalPrice() {
    const priceEl = elements.detailsContent.querySelector('.detail-price');
    priceEl.innerText = `$${getDynamicPrice()}`;
  }

  function renderInnerContent() {
    elements.detailsContent.innerHTML = `
      <div class="detail-media-pane">
        <div class="detail-img-box">
          <img id="detail-active-img" src="${selectedColor.image}" alt="${product.name}" onerror="this.src='https://placehold.co/240x380/171d26/00f0ff?text=${encodeURIComponent(product.name)}'">
        </div>
      </div>
      <div class="detail-info-pane">
        <div class="detail-header">
          <h2 class="detail-title">${product.name}</h2>
          <div class="detail-meta">
            <span class="card-brand" style="font-size: 0.95rem;">${product.brand}</span>
            <span class="card-rating" style="font-size: 0.95rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              ${product.rating} (${product.reviewsCount} reviews)
            </span>
          </div>
        </div>

        <p class="detail-price">$${getDynamicPrice()}</p>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">${product.description}</p>

        <!-- Color Selection -->
        <div>
          <h4 class="option-section-title">Select Color: <span id="color-label-text" style="color: var(--accent-primary); font-weight: normal;">${selectedColor.name}</span></h4>
          <div class="color-palette">
            ${product.colors.map(color => `
              <div class="color-swatch-wrapper ${color.name === selectedColor.name ? 'active' : ''}" data-color-name="${color.name}">
                <button class="color-swatch" style="background-color: ${color.hex};" aria-label="Select ${color.name}"></button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Storage Option Selection -->
        <div>
          <h4 class="option-section-title">Select Storage:</h4>
          <div class="storage-options">
            ${product.storage.map(st => `
              <button class="storage-btn ${st.size === selectedStorage.size ? 'active' : ''}" data-storage="${st.size}">
                ${st.size}
                <div style="font-size: 0.75rem; font-weight: normal; margin-top: 0.2rem;">
                  ${st.extraPrice > 0 ? `+$${st.extraPrice}` : 'Included'}
                </div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Spec Highlights -->
        <div class="detail-specifications">
          <h4 class="option-section-title" style="margin-bottom: 0.2rem;">Technical Specs:</h4>
          <div class="spec-row">
            <span class="spec-name">Processor</span>
            <span class="spec-value">${product.specs.processor}</span>
          </div>
          <div class="spec-row">
            <span class="spec-name">Display</span>
            <span class="spec-value">${product.specs.display}</span>
          </div>
          <div class="spec-row">
            <span class="spec-name">Battery</span>
            <span class="spec-value">${product.specs.battery}</span>
          </div>
          <div class="spec-row">
            <span class="spec-name">Cameras</span>
            <span class="spec-value">${product.specs.camera}</span>
          </div>
          <div class="spec-row">
            <span class="spec-name">OS</span>
            <span class="spec-value">${product.specs.os}</span>
          </div>
        </div>

        <button class="glow-btn" id="modal-add-to-cart-btn" style="padding: 1rem; width: 100%; font-size: 1.1rem; margin-top: 0.5rem;">
          Add to Cart
        </button>
      </div>
    `;

    // 1. Setup color swatch listeners
    elements.detailsContent.querySelectorAll('.color-swatch-wrapper').forEach(wrapper => {
      wrapper.addEventListener('click', () => {
        const colorName = wrapper.getAttribute('data-color-name');
        selectedColor = product.colors.find(c => c.name === colorName);
        
        // Update selection UI classes
        elements.detailsContent.querySelectorAll('.color-swatch-wrapper').forEach(w => w.classList.remove('active'));
        wrapper.classList.add('active');

        // Update image and label
        elements.detailsContent.querySelector('#detail-active-img').src = selectedColor.image;
        elements.detailsContent.querySelector('#color-label-text').innerText = selectedColor.name;
      });
    });

    // 2. Setup storage click listeners
    elements.detailsContent.querySelectorAll('.storage-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const storageVal = btn.getAttribute('data-storage');
        selectedStorage = product.storage.find(s => s.size === storageVal);

        // Update selection UI classes
        elements.detailsContent.querySelectorAll('.storage-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update price
        updateModalPrice();
      });
    });

    // 3. Add to Cart button
    elements.detailsContent.querySelector('#modal-add-to-cart-btn').addEventListener('click', () => {
      cartManager.addToCart(product, selectedColor.name, selectedStorage.size);
      closeDetailsModal();
      showToast(`${product.name} (${selectedColor.name}, ${selectedStorage.size}) added to cart.`);
    });
  }

  renderInnerContent();
  elements.detailsOverlay.classList.add('open');
}

function closeDetailsModal() {
  elements.detailsOverlay.classList.remove('open');
}

// ==========================================================================
// Cart Management & Checkout UI
// ==========================================================================
function updateCartUI() {
  const count = cartManager.getCartCount();
  const total = cartManager.getCartTotal();
  
  // Update badge count
  elements.cartBadge.innerText = count;
  elements.cartSubtotal.innerText = `$${total.toFixed(2)}`;

  elements.cartItemsContainer.innerHTML = '';
  
  if (cartManager.items.length === 0) {
    elements.cartItemsContainer.innerHTML = `
      <div class="empty-cart-message">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p>Your cart is empty</p>
      </div>
    `;
    elements.checkoutTrigger.disabled = true;
    return;
  }

  elements.checkoutTrigger.disabled = false;

  cartManager.items.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.color.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://placehold.co/100/171d26/00f0ff?text=${encodeURIComponent(item.name)}'">
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.name}</h4>
        <span class="cart-item-meta">${item.color.name} | ${item.storage}</span>
        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
      </div>
      <div class="cart-item-actions">
        <div class="qty-controls">
          <button class="qty-btn dec-qty" data-id="${item.id}">&minus;</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn inc-qty" data-id="${item.id}">&plus;</button>
        </div>
        <button class="cart-remove-btn" data-id="${item.id}">Remove</button>
      </div>
    `;
    elements.cartItemsContainer.appendChild(itemEl);
  });

  // Quantity control binding
  elements.cartItemsContainer.querySelectorAll('.dec-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = cartManager.items.find(i => i.id === id);
      if (item) cartManager.updateQuantity(id, item.quantity - 1);
    });
  });

  elements.cartItemsContainer.querySelectorAll('.inc-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = cartManager.items.find(i => i.id === id);
      if (item) cartManager.updateQuantity(id, item.quantity + 1);
    });
  });

  // Remove buttons binding
  elements.cartItemsContainer.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cartManager.removeFromCart(btn.getAttribute('data-id'));
      showToast("Item removed from cart.");
    });
  });
}

// Checkout Modal logic
function openCheckoutModal() {
  elements.cartOverlay.classList.remove('open');
  
  const subtotal = cartManager.getCartTotal();
  const tax = subtotal * 0.08; // 8% sales tax
  const shipping = subtotal > 800 ? 0 : 15; // Free shipping above $800
  const grandTotal = subtotal + tax + shipping;

  elements.checkoutModalBody.innerHTML = `
    <div class="checkout-modal-content">
      <h2 style="font-size: 1.8rem; margin-bottom: 0.5rem;">Billing & Checkout</h2>
      <div class="checkout-grid">
        <!-- Form Details -->
        <form class="checkout-form" id="checkout-payment-form">
          <div class="form-group">
            <label for="co-name">Full Name</label>
            <input type="text" id="co-name" class="form-input" required placeholder="John Doe">
          </div>
          <div class="form-group">
            <label for="co-email">Email Address</label>
            <input type="email" id="co-email" class="form-input" required placeholder="john@example.com">
          </div>
          <div class="form-group">
            <label for="co-address">Shipping Address</label>
            <input type="text" id="co-address" class="form-input" required placeholder="123 tech Blvd">
          </div>
          <div class="form-group">
            <label for="co-card">Credit Card Number</label>
            <input type="text" id="co-card" class="form-input" pattern="\\d{16}" maxlength="16" required placeholder="1111222233334444">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label for="co-exp">Expiry (MM/YY)</label>
              <input type="text" id="co-exp" class="form-input" pattern="\\d{2}/\\d{2}" maxlength="5" required placeholder="12/28">
            </div>
            <div class="form-group">
              <label for="co-cvv">CVV</label>
              <input type="password" id="co-cvv" class="form-input" pattern="\\d{3}" maxlength="3" required placeholder="123">
            </div>
          </div>
          <button type="submit" class="glow-btn" style="padding: 0.8rem; font-size: 1rem; margin-top: 1rem;">
            Submit Order ($${grandTotal.toFixed(2)})
          </button>
        </form>

        <!-- Order Summary -->
        <div class="checkout-summary">
          <h3 style="margin-bottom: 0.8rem;">Order Summary</h3>
          <div style="flex-grow: 1; overflow-y: auto; max-height: 250px; display: flex; flex-direction: column; gap: 0.8rem;">
            ${cartManager.items.map(item => `
              <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <div>
                  <strong>${item.name}</strong> x ${item.quantity}
                  <div style="font-size: 0.75rem; color: var(--text-secondary);">${item.color.name} | ${item.storage}</div>
                </div>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <div style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
            <div class="checkout-summary-item">
              <span>Subtotal:</span>
              <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="checkout-summary-item">
              <span>Est. Tax (8%):</span>
              <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="checkout-summary-item">
              <span>Shipping:</span>
              <span>${shipping === 0 ? '<span style="color: #22c55e;">FREE</span>' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div class="checkout-summary-total">
              <span>Total:</span>
              <span>$${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Form Submission
  const form = elements.checkoutModalBody.querySelector('#checkout-payment-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handlePaymentSubmit();
  });

  elements.checkoutOverlay.classList.add('open');
}

function handlePaymentSubmit() {
  elements.checkoutModalBody.innerHTML = `
    <div class="success-screen">
      <div class="success-icon">&checkmark;</div>
      <h2 style="font-size: 2rem;">Order Confirmed!</h2>
      <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto;">
        Thank you for your purchase. We are preparing your order and a confirmation email has been sent.
      </p>
      <button class="glow-btn" id="success-done-btn" style="padding: 0.8rem 2rem; margin-top: 1rem;">
        Return to Catalog
      </button>
    </div>
  `;

  // Complete Order
  cartManager.clearCart();
  
  elements.checkoutModalBody.querySelector('#success-done-btn').addEventListener('click', () => {
    elements.checkoutOverlay.classList.remove('open');
  });
}

// ==========================================================================
// Product Comparison Features
// ==========================================================================
function updateCompareUI() {
  const list = comparisonManager.getCompareList();
  
  // Show / Hide Comparison footer drawer
  if (list.length > 0) {
    elements.compareBar.classList.add('visible');
  } else {
    elements.compareBar.classList.remove('visible');
  }

  // Update comparison badge counters
  elements.compareCount.innerText = list.length;

  elements.compareSlots.innerHTML = '';
  
  list.forEach(id => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    
    const slot = document.createElement('div');
    slot.className = 'comp-slot';
    slot.innerHTML = `
      <img src="${prod.colors[0].image}" alt="${prod.name}" onerror="this.src='https://placehold.co/40/171d26/00f0ff?text=${encodeURIComponent(prod.name)}'">
      <span>${prod.name}</span>
      <button class="remove-slot-btn" data-id="${prod.id}">&times;</button>
    `;
    elements.compareSlots.appendChild(slot);
  });

  // Bind removal button events
  elements.compareSlots.querySelectorAll('.remove-slot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prodId = btn.getAttribute('data-id');
      comparisonManager.removeFromCompare(prodId);
      
      // Update catalog compare button class state
      const catalogBtn = elements.catalogGrid?.querySelector(`.card-compare-btn[data-id="${prodId}"]`);
      if (catalogBtn) catalogBtn.classList.remove('active');
      
      showToast("Removed from comparison.");
    });
  });
}

function openCompareModal() {
  const ids = comparisonManager.getCompareList();
  if (ids.length === 0) return;

  const activeProds = ids.map(id => products.find(p => p.id === id)).filter(Boolean);

  elements.compareGridWrapper.innerHTML = `
    <h2 style="font-size: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">Compare Flagships</h2>
    
    <div style="overflow-x: auto;">
      <div class="compare-grid" style="grid-template-columns: 200px repeat(${activeProds.length}, 1fr);">
        
        <!-- Header Row (Product images and buttons) -->
        <div class="compare-cell compare-label-cell" style="border-bottom: 2px solid var(--border-color);">Device</div>
        ${activeProds.map(prod => `
          <div class="compare-col-header">
            <img src="${prod.colors[0].image}" alt="${prod.name}" onerror="this.src='https://placehold.co/120/171d26/00f0ff?text=${encodeURIComponent(prod.name)}'">
            <h3 style="font-size: 1.15rem; margin-top: 0.5rem;">${prod.name}</h3>
            <span style="font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase;">${prod.brand}</span>
            <button class="glow-btn compare-add-cart" data-id="${prod.id}" style="padding: 0.4rem 1rem; font-size: 0.8rem; margin-top: 0.5rem;">
              Buy $${prod.price}
            </button>
          </div>
        `).join('')}

        <!-- Price -->
        <div class="compare-cell compare-label-cell">Price</div>
        ${activeProds.map(prod => `<div class="compare-cell compare-value-cell" style="font-weight: 700; color: var(--accent-primary); font-size: 1.1rem;">$${prod.price}</div>`).join('')}

        <!-- OS -->
        <div class="compare-cell compare-label-cell">OS</div>
        ${activeProds.map(prod => `<div class="compare-cell compare-value-cell">${prod.specs.os}</div>`).join('')}

        <!-- Display -->
        <div class="compare-cell compare-label-cell">Display</div>
        ${activeProds.map(prod => `<div class="compare-cell compare-value-cell">${prod.specs.display}</div>`).join('')}

        <!-- Processor -->
        <div class="compare-cell compare-label-cell">Processor</div>
        ${activeProds.map(prod => `<div class="compare-cell compare-value-cell" style="font-weight: 500;">${prod.specs.processor}</div>`).join('')}

        <!-- Cameras -->
        <div class="compare-cell compare-label-cell">Cameras</div>
        ${activeProds.map(prod => `<div class="compare-cell compare-value-cell" style="font-size: 0.85rem;">${prod.specs.camera}</div>`).join('')}

        <!-- Battery -->
        <div class="compare-cell compare-label-cell">Battery</div>
        ${activeProds.map(prod => `<div class="compare-cell compare-value-cell">${prod.specs.battery}</div>`).join('')}

        <!-- Weight -->
        <div class="compare-cell compare-label-cell">Weight</div>
        ${activeProds.map(prod => `<div class="compare-cell compare-value-cell">${prod.specs.weight}</div>`).join('')}

        <!-- Rating -->
        <div class="compare-cell compare-label-cell">Rating</div>
        ${activeProds.map(prod => `
          <div class="compare-cell compare-value-cell" style="color: #fbbf24; font-weight: 600;">
            ★ ${prod.rating} (${prod.reviewsCount} reviews)
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Bind compare Buy button events
  elements.compareGridWrapper.querySelectorAll('.compare-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const prodId = btn.getAttribute('data-id');
      const prod = products.find(p => p.id === prodId);
      if (prod) {
        elements.compareOverlay.classList.remove('open');
        openDetailsModal(prod);
      }
    });
  });

  elements.compareOverlay.classList.add('open');
}

// ==========================================================================
// Event Listeners Configuration
// ==========================================================================
function setupEventListeners() {
  // Theme Switching
  elements.themeToggle.addEventListener('click', toggleTheme);

  // Cart Drawer open/close
  elements.cartTrigger.addEventListener('click', () => elements.cartOverlay.classList.add('open'));
  elements.cartClose.addEventListener('click', () => elements.cartOverlay.classList.remove('open'));
  elements.cartOverlay.addEventListener('click', (e) => {
    if (e.target === elements.cartOverlay) elements.cartOverlay.classList.remove('open');
  });

  // Details Modal close
  elements.detailsClose.addEventListener('click', closeDetailsModal);
  elements.detailsOverlay.addEventListener('click', (e) => {
    if (e.target === elements.detailsOverlay) closeDetailsModal();
  });

  // Compare Modal open/close
  elements.compareNowBtn.addEventListener('click', openCompareModal);
  elements.compareClose.addEventListener('click', () => elements.compareOverlay.classList.remove('open'));
  elements.compareOverlay.addEventListener('click', (e) => {
    if (e.target === elements.compareOverlay) elements.compareOverlay.classList.remove('open');
  });

  // Checkout Modal open/close
  elements.checkoutTrigger.addEventListener('click', openCheckoutModal);
  elements.checkoutClose.addEventListener('click', () => elements.checkoutOverlay.classList.remove('open'));
  elements.checkoutOverlay.addEventListener('click', (e) => {
    if (e.target === elements.checkoutOverlay) elements.checkoutOverlay.classList.remove('open');
  });

  // Brand Filter Selection
  elements.brandButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.brandButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      brandFilter = btn.getAttribute('data-brand');
      renderCatalog();
    });
  });

  // Price Range Slider Filter
  elements.priceSlider.addEventListener('input', (e) => {
    maxPrice = parseInt(e.target.value);
    elements.priceMax.value = maxPrice;
    renderCatalog();
  });

  elements.priceMin.addEventListener('change', (e) => {
    minPrice = Math.max(0, parseInt(e.target.value) || 0);
    e.target.value = minPrice;
    renderCatalog();
  });

  elements.priceMax.addEventListener('change', (e) => {
    maxPrice = Math.max(minPrice, parseInt(e.target.value) || 1500);
    e.target.value = maxPrice;
    elements.priceSlider.value = maxPrice;
    renderCatalog();
  });

  // Sorting Selector
  elements.sortSelect.addEventListener('change', (e) => {
    sortOption = e.target.value;
    renderCatalog();
  });

  // Realtime Live Search
  elements.catalogSearch.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCatalog();
  });

  // Global listeners for state synchronizations
  window.addEventListener('cart-updated', updateCartUI);
  window.addEventListener('compare-updated', () => {
    updateCompareUI();
    // Re-render catalog to update card compare button styles
    renderCatalog();
  });
}

// Start Application on Load
document.addEventListener('DOMContentLoaded', init);
// Handle instant load if DOM already ready
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  init();
}
