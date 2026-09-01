class Cart {
    constructor() {
        this.isOpen = false;
        this.items = [];
        this.init();
    }

    init() {
        this.createCartElement();
        this.loadCartItems();
        this.bindEvents();
    }

    async loadCartItems() {
        try {
            const response = await CartService.getCartItems();
            this.items = response;
            Common.setCartItems(this.items);
          
            this.renderItems();
            this.updateCartCount();
        } catch (error) {
            console.error('Error loading cart items:', error);
        }
    }

    createCartElement() {
        // Create cart overlay and container
        this.cartOverlay = $('<div class="cart-overlay"></div>');
        this.cartContainer = $(`
            <div class="cart-container">
                <div class="cart-header">
                    <h3><i class="fas fa-shopping-bag me-2" style="color:var(--accent)"></i>Shopping Cart</h3>
                    <button class="close-cart" title="Close cart">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-items"></div>
                <div class="cart-total">
                    <div class="total-row">
                        <span style="color:var(--neutral-600)">Subtotal</span>
                        <span class="total-amount">৳0.00</span>
                    </div>
                    <button id="checkout-btn" class="btn btn-primary w-100 mt-3" style="display:none;height:44px;font-weight:600">
                        <i class="fas fa-credit-card me-2"></i>Checkout
                    </button>
                </div>
            </div>
        `);

        // Append to body
        $('body').append(this.cartOverlay).append(this.cartContainer);

        // Checkout handler — navigate to checkout page
        this.cartContainer.on('click', '#checkout-btn', () => {
            this.closeCart();
            window.location.href = '/Order/Checkout';
        });
    }

    bindEvents() {
        // Cart button click
        $('.cart-icon .btn-link').on('click', (e) => {
            e.preventDefault();
            this.toggleCart();
        });

        // Close cart events
        this.cartOverlay.on('click', () => this.closeCart());
        this.cartContainer.find('.close-cart').on('click', () => this.closeCart());

        // ESC key to close cart
        $(document).on('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeCart();
            }
        });
    }

    toggleCart() {
        this.isOpen = !this.isOpen;
        this.cartOverlay.toggleClass('active', this.isOpen);
        this.cartContainer.toggleClass('active', this.isOpen);
        $('body').toggleClass('cart-open', this.isOpen);
    }

    closeCart() {
        this.isOpen = false;
        this.cartOverlay.removeClass('active');
        this.cartContainer.removeClass('active');
        $('body').removeClass('cart-open');
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: 1
            });
        }

        this.updateCart();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.updateCart();
            }
        }
    }

    updateCart() {
        this.renderItems();
        this.updateCartCount();
    }

    renderItems() {
        const $itemsContainer = this.cartContainer.find('.cart-items');
        $itemsContainer.empty();

        if (this.items.length === 0) {
            $itemsContainer.html(`
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag fa-3x mb-3 d-block" style="color:var(--neutral-300)"></i>
                    <p style="font-family:var(--font-display);color:var(--primary);font-weight:600;margin-bottom:0.25rem">Your cart is empty</p>
                    <small class="text-muted">Add some items to get started</small>
                </div>`);
            this.updateTotal(0);
            return;
        }

        let total = 0;
        this.items.forEach(item => {
            const price = typeof item.productPrice === 'number' ? item.productPrice : 0;
            const itemTotal = price * item.quantity;
            total += itemTotal;

            const $item = $(`
                <div class="cart-item" data-id="${item.productId}">
                    <div class="cart-item-image">
                        <img src="${item.imageUrl || '/css/images/dummy.png'}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.productName}</h4>
                        <div class="cart-item-info">
                            <div>
                                <span class="quantity">Qty: ${item.quantity}</span>
                            </div>
                        </div>
                    </div>
                    <div class="cart-item-price">
                        ৳${price.toFixed(2)}
                    </div>
                </div>
            `);

            $itemsContainer.append($item);
        });

        this.updateTotal(total);
    }

    updateTotal(total) {
        const $totalAmount = this.cartContainer.find('.total-amount');
        $totalAmount.text(`৳${total.toFixed(2)}`);
        const $btn = this.cartContainer.find('#checkout-btn');
        if (this.items.length > 0 && Common.isLoggedIn()) {
            $btn.show();
        } else {
            $btn.hide();
        }
    }

    updateCartCount() {
        const totalItems = this.items.reduce((total, item) => total + (item.quantity || 0), 0);
        const $count = $('.cart-count');
        $count.text(totalItems > 0 ? totalItems : '');
        $count.toggleClass('d-none', totalItems === 0);
    }
}

// Initialize the cart
window.cart = new Cart(); 