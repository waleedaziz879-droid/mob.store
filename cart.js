// Cart Management System using LocalStorage and Custom Events

export class CartManager {
  constructor() {
    this.items = this.loadCart();
  }

  loadCart() {
    const data = localStorage.getItem('mobile_store_cart');
    return data ? JSON.parse(data) : [];
  }

  saveCart() {
    localStorage.setItem('mobile_store_cart', JSON.stringify(this.items));
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { items: this.items } }));
  }

  addToCart(product, colorName, storageSize) {
    // Find color object
    const colorObj = product.colors.find(c => c.name === colorName) || product.colors[0];
    // Find storage object
    const storageObj = product.storage.find(s => s.size === storageSize) || product.storage[0];
    
    const finalPrice = product.price + storageObj.extraPrice;
    
    // Check if duplicate item exists
    const existingIndex = this.items.findIndex(item => 
      item.productId === product.id && 
      item.color.name === colorName && 
      item.storage === storageSize
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += 1;
    } else {
      this.items.push({
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        productId: product.id,
        name: product.name,
        brand: product.brand,
        color: colorObj,
        storage: storageSize,
        price: finalPrice,
        quantity: 1
      });
    }

    this.saveCart();
  }

  removeFromCart(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.saveCart();
  }

  updateQuantity(itemId, quantity) {
    const item = this.items.find(item => item.id === itemId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart();
    }
  }

  getCartTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }
}

export const cartManager = new CartManager();
