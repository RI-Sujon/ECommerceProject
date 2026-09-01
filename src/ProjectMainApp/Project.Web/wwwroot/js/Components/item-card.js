class ItemCard {
    constructor(product) {
        this.product = product;
    }

    createCard() {
        const $card = $('<div>').addClass('col-md-3');
        
        // Calculate discount if within date range
        const now = new Date();
        const discountStart = this.product.discountStartDate ? new Date(this.product.discountStartDate) : null;
        const discountEnd = this.product.discountEndDate ? new Date(this.product.discountEndDate) : null;
        const isDiscountActive = discountStart && discountEnd && 
                               now >= discountStart && now <= discountEnd;
        
        const originalPrice = this.product.price;
        const discountedPrice = isDiscountActive ? 
            originalPrice * 0.75 : // 25% discount
            originalPrice;

        // Determine role-based action buttons
        const userInfo = Common.getUserInfo();
        const isAdmin = userInfo.role === 'Admin';
        const isLoggedIn = Common.isLoggedIn();
        const productJson = JSON.stringify(this.product).replace(/"/g, '&quot;');

        let actionsHtml;
        if (isAdmin) {
            actionsHtml = `
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary admin-edit-btn"
                            data-product="${productJson}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger admin-delete-btn"
                            data-product-id="${this.product.id}"
                            data-product-name="${this.product.name.replace(/"/g, '&quot;')}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>`;
        } else if (!isLoggedIn) {
            actionsHtml = `
                <div class="cart-controls">
                    <a href="/Auth/Login" class="btn btn-sm add-to-cart-btn">
                        <i class="fas fa-lock me-1"></i>Login to Buy
                    </a>
                </div>`;
        } else {
            actionsHtml = `
                <div class="quantity-controls ${this.product.selectedQty ? '' : 'd-none'}">
                    <span class="quantity-btn" onclick="decreaseQuantity(${productJson}, this)">-</span>
                    <span class="quantity-value">${this.product.selectedQty ? this.product.selectedQty : 1}</span>
                    <span class="quantity-btn" onclick="increaseQuantity(${productJson}, this)">+</span>
                </div>
                <div class="cart-controls ${this.product.selectedQty ? 'd-none' : ''}">
                    <button class="btn btn-sm add-to-cart-btn" onclick="addToCart(${productJson}, this)">
                        Add to Cart
                    </button>
                </div>`;
        }
        
        // Wishlist check
        const isWished = typeof WishlistService !== 'undefined' && WishlistService.isInWishlist(this.product.id);

        $card.html(`
            <div class="card h-100 product-card">
                <div class="position-relative" style="overflow:hidden;border-radius:var(--radius-lg) var(--radius-lg) 0 0">
                    <img src="${this.product.imageUrl ? this.product.imageUrl : '/css/images/dummy.png'}"
                         class="card-img-top product-image" 
                         alt="${this.product.name}"
                         style="border-radius:0">
                    ${isDiscountActive ? '<span class="badge badge-discount position-absolute top-0 start-0 m-2"><i class="fas fa-bolt me-1"></i>25% OFF</span>' : ''}
                    ${this.product.stock === 0 ? '<span class="badge bg-danger position-absolute top-0 end-0 m-2">Out of Stock</span>' : ''}
                    ${!isAdmin ? `<button class="btn btn-sm wishlist-toggle-btn position-absolute m-2"
                            data-product-json="${productJson}"
                            style="top:0;${this.product.stock === 0 ? 'right:90px' : 'right:0'};width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,0.9);border:none;color:${isWished ? 'var(--danger)' : 'var(--neutral-400)'};box-shadow:var(--shadow-sm);transition:all 0.25s;z-index:2">
                        <i class="fas fa-heart"></i>
                    </button>` : ''}
                </div>
                <div class="card-body">
                    <h5 class="card-title product-name text-truncate">${this.product.name}</h5>
                    <a href="/Product/Detail?id=${this.product.id}" class="btn btn-link p-0 small text-decoration-none mb-2 d-block" style="color:var(--accent-dark);font-weight:500">
                        <i class="fas fa-eye me-1"></i>View Details
                    </a>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <span class="h5 mb-0 product-price">৳${discountedPrice.toFixed(2)}</span>
                            ${isDiscountActive ? 
                                `<span class="product-original-price text-decoration-line-through me-2">৳${originalPrice.toFixed(2)}</span>` : 
                                ''}
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        ${actionsHtml}
                    </div>
                </div>
            </div>
        `);
        return $card;
    }
}

// Quantity control functions
async function increaseQuantity(product, button) {
    const $controls = $(button).closest('.quantity-controls');
    const $quantityValue = $controls.find('.quantity-value');
    const currentValue = parseInt($quantityValue.text());
    const newValue = currentValue + 1;
    
    try {
        const productId = product.id;
        await CartService.addItemToCart(productId, 1);
        $quantityValue.text(newValue);
        // Reload cart data
        await window.cart.loadCartItems();
    } catch (error) {
        console.error('Error increasing quantity:', error);
        Toast.error('Failed to update quantity. Please try again.');
    }
}

async function decreaseQuantity(product, button) {
    const $controls = $(button).closest('.quantity-controls');
    const $quantityValue = $controls.find('.quantity-value');
    const currentValue = parseInt($quantityValue.text());
    const $card = $(button).closest('.card');
    const productId = product.id;

    if (currentValue > 1) {
        try {
            await CartService.decreaseItemQuantity(productId, 1);
            $quantityValue.text(currentValue - 1);
            // Reload cart data
            await window.cart.loadCartItems();
        } catch (error) {
            console.error('Error decreasing quantity:', error);
            Toast.error('Failed to update quantity. Please try again.');
        }
    } else {
        try {
            await CartService.removeItemFromCart(product.cartId);
            
            $card.find('.cart-controls').removeClass('d-none');
            $card.find('.quantity-controls').addClass('d-none');
            
            await window.cart.loadCartItems();
        } catch (error) {
            console.error('Error removing item from cart:', error);
            Toast.error('Failed to remove item. Please try again.');
        }
    }
}

async function addToCart(product, button) {
    const $card = $(button).closest('.card');
    const $quantityValue = $card.find('.quantity-value');
    const quantity = parseInt($quantityValue.text());
    
    try {
        await CartService.addItemToCart(product.id, quantity);
        
        $card.find('.cart-controls').addClass('d-none');
        $card.find('.quantity-controls').removeClass('d-none');
        
        await window.cart.loadCartItems();
    } catch (error) {
        console.error('Error adding to cart:', error);
        Toast.error('Failed to add item to cart. Please try again.');
    }
}

window.ItemCard = ItemCard; 