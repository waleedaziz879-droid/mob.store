// Comparison System for comparing up to 3 mobile devices side-by-side

export class ComparisonManager {
  constructor() {
    this.comparingIds = this.loadComparing();
  }

  loadComparing() {
    const data = localStorage.getItem('mobile_store_compare');
    return data ? JSON.parse(data) : [];
  }

  saveComparing() {
    localStorage.setItem('mobile_store_compare', JSON.stringify(this.comparingIds));
    window.dispatchEvent(new CustomEvent('compare-updated', { detail: { ids: this.comparingIds } }));
  }

  addToCompare(product) {
    if (this.comparingIds.includes(product.id)) {
      return { success: false, message: `${product.name} is already in the comparison list.` };
    }
    if (this.comparingIds.length >= 3) {
      return { success: false, message: "You can compare a maximum of 3 products at a time." };
    }
    this.comparingIds.push(product.id);
    this.saveComparing();
    return { success: true, message: `${product.name} added to comparison list.` };
  }

  removeFromCompare(productId) {
    this.comparingIds = this.comparingIds.filter(id => id !== productId);
    this.saveComparing();
  }

  isComparing(productId) {
    return this.comparingIds.includes(productId);
  }

  getCompareList() {
    return this.comparingIds;
  }

  clearCompare() {
    this.comparingIds = [];
    this.saveComparing();
  }
}

export const comparisonManager = new ComparisonManager();
