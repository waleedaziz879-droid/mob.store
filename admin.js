// Electra Mobile Store - Admin Panel Orchestrator
// Connects to Supabase Database using CDN Client SDK

let supabaseClient;
let activeTab = 'dashboard';
let cache = { products: [], orders: [], orderItems: [] };

// Default JSON Formats to pre-populate product creation forms
const templates = {
  colors: `[
  {"name": "Titanium Black", "hex": "#232426", "image": "assets/iphone.png"},
  {"name": "Titanium Silver", "hex": "#d1d5db", "image": "assets/iphone.png"}
]`,
  storage: `[
  {"size": "256GB", "extraPrice": 0},
  {"size": "512GB", "extraPrice": 150}
]`,
  specs: `{
  "display": "6.7\\" OLED Display, 120Hz",
  "processor": "Next-Gen A18 Chip",
  "camera": "48MP Main + 12MP Ultra-wide",
  "battery": "4500 mAh, 30W charging",
  "os": "Android 15 / iOS 18",
  "weight": "210g"
}`
};

// DOM Cache
const dom = {
  lockScreen: document.getElementById('admin-lock-screen'),
  passcodeInput: document.getElementById('admin-passcode-input'),
  loginBtn: document.getElementById('admin-login-btn'),
  layout: document.getElementById('admin-dashboard-layout'),
  logoutBtn: document.getElementById('admin-logout-btn'),
  pageTitle: document.getElementById('page-title'),
  pageSubtitle: document.getElementById('page-subtitle'),
  
  // Navigation
  navButtons: {
    dashboard: document.getElementById('nav-dashboard'),
    products: document.getElementById('nav-products'),
    orders: document.getElementById('nav-orders')
  },
  sections: {
    dashboard: document.getElementById('section-dashboard'),
    products: document.getElementById('section-products'),
    orders: document.getElementById('section-orders')
  },

  // Stats
  statRevenue: document.getElementById('stat-revenue'),
  statOrders: document.getElementById('stat-orders'),
  statAov: document.getElementById('stat-aov'),
  statProducts: document.getElementById('stat-products'),
  recentOrdersTable: document.getElementById('dashboard-recent-orders'),
  brandBreakdownTable: document.getElementById('dashboard-brand-breakdown'),

  // Products CRUD
  productsTable: document.getElementById('products-table-body'),
  addProductTrigger: document.getElementById('add-product-trigger-btn'),
  productModal: document.getElementById('product-form-modal-overlay'),
  productModalClose: document.getElementById('product-form-modal-close'),
  productForm: document.getElementById('product-crud-form'),
  modalSubmitBtn: document.getElementById('form-submit-btn'),
  modalTitle: document.getElementById('form-modal-title'),

  // Form Inputs
  formId: document.getElementById('prod-form-id'),
  formName: document.getElementById('prod-form-name'),
  formBrand: document.getElementById('prod-form-brand'),
  formPrice: document.getElementById('prod-form-price'),
  formRating: document.getElementById('prod-form-rating'),
  formReviews: document.getElementById('prod-form-reviews'),
  formDesc: document.getElementById('prod-form-desc'),
  formColors: document.getElementById('prod-form-colors'),
  formStorage: document.getElementById('prod-form-storage'),
  formSpecs: document.getElementById('prod-form-specs'),
  formFeatured: document.getElementById('prod-form-featured'),

  // Orders
  ordersTable: document.getElementById('orders-table-body'),
  viewAllOrdersLnk: document.getElementById('view-all-orders-lnk'),
  toastContainer: document.getElementById('toast-container-admin')
};

// ==========================================================================
// Authentication Lock Screen
// ==========================================================================
function setupAuth() {
  const isAuth = sessionStorage.getItem('admin_authenticated');
  if (isAuth === 'true') {
    unlockPanel();
  }

  dom.loginBtn.addEventListener('click', handleAuthSubmit);
  dom.passcodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAuthSubmit();
  });
  
  dom.logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('admin_authenticated');
    location.reload();
  });
}

function handleAuthSubmit() {
  const input = dom.passcodeInput.value.trim();
  
  // Accepts 'admin', 'admin123', the public key, or the secret service role key itself
  if (input === 'admin' || input === 'admin123' || input === SUPABASE_SERVICE_ROLE_KEY || input === SUPABASE_ANON_KEY) {
    sessionStorage.setItem('admin_authenticated', 'true');
    unlockPanel();
    showToast("Authenticated successfully!");
  } else {
    showToast("Invalid passcode or credential key.", true);
  }
}

function unlockPanel() {
  dom.lockScreen.style.display = 'none';
  dom.layout.style.display = 'grid';
  
  // Initialize Supabase using Service Role key so the admin can write/delete records
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  // Load Database values
  loadAllData();
  setupTheme();
}

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
  dom.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease-in reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Dark/Light Theme for Admin
function setupTheme() {
  const themeToggle = document.getElementById('theme-toggle-admin');
  const moon = themeToggle.querySelector('#theme-moon-icon');
  const sun = themeToggle.querySelector('#theme-sun-icon');
  
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    document.body.classList.add('dark-theme');
    moon.style.display = 'none';
    sun.style.display = 'block';
  } else {
    document.body.classList.remove('dark-theme');
    moon.style.display = 'block';
    sun.style.display = 'none';
  }

  themeToggle.addEventListener('click', () => {
    const toggled = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', toggled ? 'dark' : 'light');
    moon.style.display = toggled ? 'none' : 'block';
    sun.style.display = toggled ? 'block' : 'none';
    showToast(toggled ? 'Dark mode enabled' : 'Light mode enabled');
  });
}

// ==========================================================================
// Database Queries
// ==========================================================================
async function loadAllData() {
  try {
    // 1. Fetch Products
    const prodRes = await supabaseClient.from('products').select('*');
    if (prodRes.error) throw prodRes.error;
    cache.products = prodRes.data || [];

    // 2. Fetch Orders
    const ordRes = await supabaseClient.from('orders').select('*').order('created_at', { ascending: false });
    if (ordRes.error) throw ordRes.error;
    cache.orders = ordRes.data || [];

    // 3. Fetch Order Items
    const itemsRes = await supabaseClient.from('order_items').select('*');
    if (itemsRes.error) throw itemsRes.error;
    cache.orderItems = itemsRes.data || [];

    // Render current active tab view
    switchTab(activeTab);
  } catch (error) {
    console.error("Database Fetch Error:", error);
    showToast("Error loading database records. Ensure schema.sql is seeded.", true);
  }
}

// ==========================================================================
// Tab Switching Orchestration
// ==========================================================================
function setupTabNavigation() {
  Object.keys(dom.navButtons).forEach(key => {
    dom.navButtons[key].addEventListener('click', () => switchTab(key));
  });

  dom.viewAllOrdersLnk.addEventListener('click', (e) => {
    e.preventDefault();
    switchTab('orders');
  });
}

function switchTab(tabName) {
  activeTab = tabName;

  // Toggle active buttons style
  Object.keys(dom.navButtons).forEach(key => {
    if (key === tabName) {
      dom.navButtons[key].classList.add('active');
      dom.sections[key].style.display = 'block';
    } else {
      dom.navButtons[key].classList.remove('active');
      dom.sections[key].style.display = 'none';
    }
  });

  // Update Headers & Refresh View
  if (tabName === 'dashboard') {
    dom.pageTitle.innerText = "Dashboard Overview";
    dom.pageSubtitle.innerText = "Real-time metrics and administration controls.";
    renderDashboardView();
  } else if (tabName === 'products') {
    dom.pageTitle.innerText = "Inventory Management";
    dom.pageSubtitle.innerText = "Add, edit, or delete items from the mobile store.";
    renderProductsView();
  } else if (tabName === 'orders') {
    dom.pageTitle.innerText = "Orders Ledger";
    dom.pageSubtitle.innerText = "Monitor purchases, fulfill shipments, and review invoicing.";
    renderOrdersView();
  }
}

// ==========================================================================
// Dashboard View Builder
// ==========================================================================
function renderDashboardView() {
  // Compute Stats
  const revenue = cache.orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + Number(o.total), 0);
  
  const totalOrders = cache.orders.length;
  const aov = totalOrders > 0 ? revenue / totalOrders : 0;
  const activeProducts = cache.products.length;

  dom.statRevenue.innerText = `$${revenue.toFixed(2)}`;
  dom.statOrders.innerText = totalOrders;
  dom.statAov.innerText = `$${aov.toFixed(2)}`;
  dom.statProducts.innerText = activeProducts;

  // Render recent 5 orders
  dom.recentOrdersTable.innerHTML = '';
  const recent = cache.orders.slice(0, 5);
  
  if (recent.length === 0) {
    dom.recentOrdersTable.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-tertiary);">No orders placed yet.</td></tr>`;
  } else {
    recent.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString();
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="color: var(--accent-primary); font-size: 0.85rem;">#${order.id.slice(0, 8)}</strong></td>
        <td>
          <div style="font-weight: 600;">${order.customer_name}</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary);">${order.customer_email}</div>
        </td>
        <td><strong>$${Number(order.total).toFixed(2)}</strong></td>
        <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
      `;
      dom.recentOrdersTable.appendChild(tr);
    });
  }

  // Render Brand Breakdown Distribution
  const breakdown = {};
  cache.products.forEach(p => {
    if (!breakdown[p.brand]) {
      breakdown[p.brand] = { count: 0, minPrice: Infinity, maxPrice: -Infinity };
    }
    breakdown[p.brand].count++;
    breakdown[p.brand].minPrice = Math.min(breakdown[p.brand].minPrice, p.price);
    breakdown[p.brand].maxPrice = Math.max(breakdown[p.brand].maxPrice, p.price);
  });

  dom.brandBreakdownTable.innerHTML = '';
  const brands = Object.keys(breakdown);
  
  if (brands.length === 0) {
    dom.brandBreakdownTable.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-tertiary);">No inventory items loaded.</td></tr>`;
  } else {
    brands.forEach(brand => {
      const info = breakdown[brand];
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${brand}</strong></td>
        <td>${info.count} models</td>
        <td>$${info.minPrice} - $${info.maxPrice}</td>
      `;
      dom.brandBreakdownTable.appendChild(tr);
    });
  }
}

// ==========================================================================
// Products Management View (CRUD)
// ==========================================================================
function renderProductsView() {
  dom.productsTable.innerHTML = '';
  
  if (cache.products.length === 0) {
    dom.productsTable.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-tertiary);">Inventory catalog is empty.</td></tr>`;
    return;
  }

  cache.products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${p.colors[0]?.image || 'https://placehold.co/40'}" alt="${p.name}" class="product-thumb" onerror="this.src='https://placehold.co/40'"></td>
      <td><strong>${p.name}</strong><br><small style="color: var(--text-secondary); font-family: monospace;">${p.id}</small></td>
      <td>${p.brand}</td>
      <td><strong>$${p.price}</strong></td>
      <td>★ ${p.rating}</td>
      <td>
        <span class="status-badge" style="background-color: ${p.featured ? 'var(--accent-glow)' : 'var(--bg-tertiary)'}; color: ${p.featured ? 'var(--accent-primary)' : 'var(--text-tertiary)'};">
          ${p.featured ? 'Featured' : 'Standard'}
        </span>
      </td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="action-btn edit" data-id="${p.id}">Edit</button>
          <button class="action-btn delete" data-id="${p.id}">Delete</button>
        </div>
      </td>
    `;
    dom.productsTable.appendChild(tr);
  });

  // Bind Actions
  dom.productsTable.querySelectorAll('.action-btn.edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const prod = cache.products.find(p => p.id === id);
      if (prod) openProductFormModal(prod);
    });
  });

  dom.productsTable.querySelectorAll('.action-btn.delete').forEach(btn => {
    btn.addEventListener('click', () => handleProductDelete(btn.getAttribute('data-id')));
  });
}

function openProductFormModal(product = null) {
  if (product) {
    // EDIT MODE
    dom.modalTitle.innerText = "Edit Flagship details";
    dom.formId.value = product.id;
    dom.formId.disabled = true; // Cannot edit primary key ID
    
    dom.formName.value = product.name;
    dom.formBrand.value = product.brand;
    dom.formPrice.value = product.price;
    dom.formRating.value = product.rating;
    dom.formReviews.value = product.reviews_count;
    dom.formDesc.value = product.description || '';
    
    dom.formColors.value = JSON.stringify(product.colors, null, 2);
    dom.formStorage.value = JSON.stringify(product.storage, null, 2);
    dom.formSpecs.value = JSON.stringify(product.specs, null, 2);
    
    dom.formFeatured.checked = product.featured;
  } else {
    // CREATE MODE
    dom.modalTitle.innerText = "Add Flagship Product";
    dom.formId.value = '';
    dom.formId.disabled = false;
    
    dom.formName.value = '';
    dom.formBrand.value = '';
    dom.formPrice.value = '';
    dom.formRating.value = '4.8';
    dom.formReviews.value = '24';
    dom.formDesc.value = '';
    
    // Autofill with template presets
    dom.formColors.value = templates.colors;
    dom.formStorage.value = templates.storage;
    dom.formSpecs.value = templates.specs;
    
    dom.formFeatured.checked = false;
  }

  dom.productModal.classList.add('open');
}

async function handleProductFormSubmit(e) {
  e.preventDefault();

  try {
    // Validate JSON entries
    const colorsParsed = JSON.parse(dom.formColors.value);
    const storageParsed = JSON.parse(dom.formStorage.value);
    const specsParsed = JSON.parse(dom.formSpecs.value);

    const productData = {
      id: dom.formId.value.trim(),
      name: dom.formName.value.trim(),
      brand: dom.formBrand.value.trim(),
      price: Number(dom.formPrice.value),
      rating: Number(dom.formRating.value),
      reviews_count: parseInt(dom.formReviews.value),
      description: dom.formDesc.value.trim(),
      colors: colorsParsed,
      storage: storageParsed,
      specs: specsParsed,
      featured: dom.formFeatured.checked
    };

    dom.modalSubmitBtn.disabled = true;
    dom.modalSubmitBtn.innerText = "Saving to database...";

    // Upsert into Supabase products table
    const { error } = await supabaseClient.from('products').upsert([productData]);
    if (error) throw error;

    showToast(`Product "${productData.name}" saved successfully!`);
    dom.productModal.classList.remove('open');
    loadAllData(); // Reload stats and grid
  } catch (err) {
    console.error("Save product failed:", err);
    showToast(`Error: ${err.message || "Invalid JSON configuration format."}`, true);
  } finally {
    dom.modalSubmitBtn.disabled = false;
    dom.modalSubmitBtn.innerText = "Save Product";
  }
}

async function handleProductDelete(productId) {
  const prod = cache.products.find(p => p.id === productId);
  if (!prod) return;

  if (confirm(`Are you absolutely sure you want to permanently delete ${prod.name} from the database?`)) {
    try {
      const { error } = await supabaseClient.from('products').delete().eq('id', productId);
      if (error) throw error;

      showToast(`Deleted ${prod.name} successfully.`);
      loadAllData();
    } catch (err) {
      console.error(err);
      showToast(`Delete failed: ${err.message}`, true);
    }
  }
}

// ==========================================================================
// Customer Orders Ledger View
// ==========================================================================
function renderOrdersView() {
  dom.ordersTable.innerHTML = '';

  if (cache.orders.length === 0) {
    dom.ordersTable.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-tertiary);">No customer orders found.</td></tr>`;
    return;
  }

  cache.orders.forEach(order => {
    const date = new Date(order.created_at).toLocaleString();
    const tr = document.createElement('tr');
    tr.id = `order-row-${order.id}`;
    tr.innerHTML = `
      <td><strong style="color: var(--accent-primary); font-family: monospace;">#${order.id.slice(0, 8)}</strong></td>
      <td>
        <div style="font-weight: 600;">${order.customer_name}</div>
        <div style="font-size: 0.8rem; color: var(--text-secondary);">${order.customer_email}</div>
      </td>
      <td><strong>$${Number(order.total).toFixed(2)}</strong></td>
      <td style="font-size: 0.85rem;">${date}</td>
      <td>
        <select class="admin-form-select order-status-select" data-id="${order.id}">
          <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>
        <button class="action-btn view-details" data-id="${order.id}">Items details</button>
      </td>
    `;
    dom.ordersTable.appendChild(tr);

    // Create a collapsed items drawer row
    const itemsRow = document.createElement('tr');
    itemsRow.id = `order-drawer-${order.id}`;
    itemsRow.style.display = 'none';
    
    const matchedItems = cache.orderItems.filter(i => i.order_id === order.id);
    const shippingCost = Number(order.shipping);
    
    itemsRow.innerHTML = `
      <td colspan="6" class="order-details-drawer">
        <div class="order-details-grid">
          <div>
            <h4 style="margin-bottom: 0.8rem; font-size: 0.95rem; color: var(--accent-primary);">Items in Order:</h4>
            <div class="order-items-list">
              ${matchedItems.map(item => `
                <div class="order-item-row">
                  <div>
                    <strong>${item.product_name}</strong>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">${item.color} | ${item.storage}</div>
                  </div>
                  <span>$${Number(item.price).toFixed(2)} x ${item.quantity} = <strong>$${(Number(item.price) * item.quantity).toFixed(2)}</strong></span>
                </div>
              `).join('')}
            </div>
          </div>
          <div style="background-color: var(--bg-secondary); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); font-size: 0.9rem; display: flex; flex-direction: column; gap: 0.4rem;">
            <h4 style="margin-bottom: 0.4rem; font-size: 0.95rem;">Delivery Summary:</h4>
            <div><strong>Shipping Address:</strong><br><span style="color: var(--text-secondary);">${order.shipping_address}</span></div>
            <div style="margin-top: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem; display: flex; flex-direction: column; gap: 0.2rem;">
              <div style="display: flex; justify-content: space-between;"><span>Subtotal:</span><span>$${Number(order.subtotal).toFixed(2)}</span></div>
              <div style="display: flex; justify-content: space-between;"><span>Tax (8%):</span><span>$${Number(order.tax).toFixed(2)}</span></div>
              <div style="display: flex; justify-content: space-between;"><span>Shipping:</span><span>${shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span></div>
              <div style="display: flex; justify-content: space-between; font-weight: 700; margin-top: 0.3rem;"><span>Grand Total:</span><span>$${Number(order.total).toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </td>
    `;
    dom.ordersTable.appendChild(itemsRow);
  });

  // Bind Order Item Detail toggling
  dom.ordersTable.querySelectorAll('.action-btn.view-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const drawer = document.getElementById(`order-drawer-${id}`);
      if (drawer.style.display === 'none') {
        drawer.style.display = 'table-row';
        btn.innerText = "Hide Details";
      } else {
        drawer.style.display = 'none';
        btn.innerText = "Items details";
      }
    });
  });

  // Bind Order Status Selection Updates
  dom.ordersTable.querySelectorAll('.order-status-select').forEach(select => {
    select.addEventListener('change', async (e) => {
      const orderId = select.getAttribute('data-id');
      const statusVal = e.target.value;
      
      try {
        const { error } = await supabaseClient
          .from('orders')
          .update({ status: statusVal })
          .eq('id', orderId);
        
        if (error) throw error;
        showToast(`Order #${orderId.slice(0, 8)} status updated to ${statusVal}.`);
        loadAllData();
      } catch (err) {
        console.error(err);
        showToast(`Status update failed: ${err.message}`, true);
      }
    });
  });
}

// ==========================================================================
// Setup Listeners
// ==========================================================================
function setupEventListeners() {
  setupTabNavigation();

  // Product CRUD modal triggers
  dom.addProductTrigger.addEventListener('click', () => openProductFormModal());
  dom.productModalClose.addEventListener('click', () => dom.productModal.classList.remove('open'));
  dom.productModal.addEventListener('click', (e) => {
    if (e.target === dom.productModal) dom.productModal.classList.remove('open');
  });

  // Form submit
  dom.productForm.addEventListener('submit', handleProductFormSubmit);
}

// Startup
document.addEventListener('DOMContentLoaded', setupAuth);
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  setupAuth();
}
