// =========================================
// FROM THE GARDEN — Store Logic
// =========================================

const PRODUCTS = {
  classic_roses: {
    id: 'classic_roses',
    name: 'Classic Roses',
    description: 'Hand-wrapped, seasonally sourced roses — made just for you. Every bouquet is arranged with fresh stems from Potomac Floral Wholesale and wrapped in kraft paper with ribbon.',
    basePrice: 0,
    stemOptions: [
      { id: 'mini',     label: 'Mini',     stems: 6,  price: 35, desc: 'Perfect for a desk, a gift, or just because.' },
      { id: 'standard', label: 'Standard', stems: 10, price: 55, desc: 'Our most popular. Hand-wrapped in kraft paper with ribbon.', popular: true },
      { id: 'premium',  label: 'Premium',  stems: 15, price: 85, desc: 'The full From The Garden experience. Seasonal foliage included.' },
    ],
    colors: [
      { id: 'red',    label: 'Classic Red',  hex: '#C0392B' },
      { id: 'white',  label: 'Pure White',   hex: '#F5F0EB' },
      { id: 'pink',   label: 'Blush Pink',   hex: '#D4748A' },
      { id: 'yellow', label: 'Soft Yellow',  hex: '#E8C94F' },
      { id: 'mixed',  label: 'Mixed',        hex: 'linear-gradient(135deg, #C0392B 0%, #D4748A 40%, #F5F0EB 70%, #E8C94F 100%)' },
      { id: 'surprise', label: 'Surprise Me', hex: '#7A9E8E' },
    ],
    addOns: [
      { id: 'vase',      label: 'Glass Vase',          price: 12, desc: 'Clear glass bud vase included' },
      { id: 'card',      label: 'Handwritten Card',    price:  5, desc: 'Personal message written by us' },
      { id: 'giftwrap',  label: 'Gift Wrap Upgrade',   price:  8, desc: 'Premium tissue + ribbon packaging' },
      { id: 'priority',  label: 'Same-Day Priority',   price: 15, desc: 'Priority sourcing & prep' },
      { id: 'chocolate', label: 'Chocolate Box',       price: 18, desc: 'Artisan chocolates add-on' },
    ],
  }
};

// Cart state
let cart = JSON.parse(sessionStorage.getItem('ftg_cart') || '[]');

function saveCart() {
  sessionStorage.setItem('ftg_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

function getItemTotal(item) {
  const stem = PRODUCTS[item.productId].stemOptions.find(s => s.id === item.stemId);
  const addOnTotal = (item.addOns || []).reduce((sum, aId) => {
    const ao = PRODUCTS[item.productId].addOns.find(a => a.id === aId);
    return sum + (ao ? ao.price : 0);
  }, 0);
  return (stem ? stem.price : 0) + addOnTotal;
}

function addToCart(productId, stemId, colorId, addOns, qty = 1) {
  const product = PRODUCTS[productId];
  const stem = product.stemOptions.find(s => s.id === stemId);
  const color = product.colors.find(c => c.id === colorId);

  const item = {
    id: Date.now(),
    productId,
    name: product.name,
    stemId,
    stemLabel: stem.label,
    stemCount: stem.stems,
    colorId,
    colorLabel: color.label,
    addOns,
    qty,
    unitPrice: getItemTotal({ productId, stemId, addOns }),
  };

  cart.push(item);
  saveCart();
  showCartToast(item);
}

function removeFromCart(itemId) {
  cart = cart.filter(i => i.id !== itemId);
  saveCart();
  renderCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
}

function showCartToast(item) {
  const toast = document.getElementById('cart-toast');
  if (!toast) return;
  toast.querySelector('.toast-name').textContent = `${item.stemLabel} — ${item.colorLabel}`;
  toast.querySelector('.toast-price').textContent = `$${item.unitPrice}`;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 3000);
}

// Cart drawer render
function renderCart() {
  const drawer = document.getElementById('cart-drawer');
  const body = document.getElementById('cart-body');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🌸</div>
        <p>Your cart is empty.</p>
        <a href="shop.html" class="btn btn-primary" onclick="closeCart()">Start Shopping →</a>
      </div>`;
    document.getElementById('cart-footer').style.display = 'none';
    return;
  }

  document.getElementById('cart-footer').style.display = 'block';

  body.innerHTML = cart.map(item => {
    const addOnNames = (item.addOns || []).map(aId => {
      const ao = PRODUCTS[item.productId].addOns.find(a => a.id === aId);
      return ao ? ao.label : '';
    }).filter(Boolean).join(', ');

    return `
      <div class="cart-item">
        <div class="cart-item-color" style="background: ${PRODUCTS[item.productId].colors.find(c=>c.id===item.colorId)?.hex || '#ddd'}"></div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">${item.stemCount} stems · ${item.colorLabel}</div>
          ${addOnNames ? `<div class="cart-item-addons">${addOnNames}</div>` : ''}
        </div>
        <div class="cart-item-right">
          <div class="cart-item-price">$${item.unitPrice}</div>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
        </div>
      </div>`;
  }).join('');

  document.getElementById('cart-total-amount').textContent = `$${getCartTotal()}`;
}

function openCart() {
  renderCart();
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-overlay').classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('visible');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();

  const overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.addEventListener('click', closeCart);
});
