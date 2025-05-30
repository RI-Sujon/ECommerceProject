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
                    <h3>Shopping Cart</h3>
                    <button class="close-cart">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-items"></div>
            </div>
        `);

        // Append to body
        $('body').append(this.cartOverlay).append(this.cartContainer);
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
            $itemsContainer.html('<div class="empty-cart">Your cart is empty</div>');
            return;
        }

        this.items.forEach(item => {
            const price = typeof item.productPrice === 'number' ? item.productPrice : 0;
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
                        $${price.toFixed(2)}
                    </div>
                </div>
            `);

            $itemsContainer.append($item);
        });
    }

    updateCartCount() {
        const totalItems = this.items.reduce((total, item) => total + (item.quantity || 0), 0);
        const $cartBtn = $('.cart-icon .btn-link');
        const $cartCount = $cartBtn.find('.cart-count');
        
        if (totalItems > 0) {
            $cartBtn.addClass('has-items');
            $cartCount.text(totalItems);
        } else {
            $cartBtn.removeClass('has-items');
            $cartCount.text('');
        }
    }
}

// Initialize the cart
window.cart = new Cart(); 