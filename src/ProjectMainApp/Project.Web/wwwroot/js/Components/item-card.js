class ItemCard {
    constructor(product) {
        this.product = product;
    }

    createCard() {
        const $card = $('<div>').addClass('col-md-3');
        
        $card.html(`
            <div class="card h-100 product-card px-4">
                <div class="position-relative p-3">
                    <img src="${this.product.imageUrl ? this.product.imageUrl : '/css/images/dummy.png'}"
                         class="card-img-top product-image" 
                         alt="${this.product.name}">
                </div>
                <div class="card-body">
                    <h5 class="card-title product-name text-truncate">${this.product.name}</h5>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <span class="h5 mb-0 product-price">$${this.product.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="quantity-controls" style="display: none;">
                            <span class="quantity-btn" onclick="decreaseQuantity(${JSON.stringify(this.product).replace(/"/g, '&quot;') }, this)">-</span>
                            <span class="quantity-value">1</span>
                            <span class="quantity-btn" onclick="increaseQuantity(${JSON.stringify(this.product).replace(/"/g, '&quot;')} , this)">+</span>
                        </div>
                        <div class="cart-controls">
                            <button class="btn btn-sm add-to-cart-btn" onclick="addToCart(${JSON.stringify(this.product).replace(/"/g, '&quot;')}, this)">
                                Add to Cart
                            </button>
                        </div>
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
    debugger
    try {
        const productId = product.id;
        await CartService.addItemToCart(productId, 1);
        $quantityValue.text(newValue);
        // Reload cart data
        await window.cart.loadCartItems();
    } catch (error) {
        console.error('Error increasing quantity:', error);
        alert('Failed to update quantity. Please try again.');
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
            await CartService.removeItemFromCart(productId);
            $quantityValue.text(currentValue - 1);
            // Reload cart data
            await window.cart.loadCartItems();
        } catch (error) {
            console.error('Error decreasing quantity:', error);
            alert('Failed to update quantity. Please try again.');
        }
    } else {
        try {
            await CartService.removeItemFromCart(productId);
            
            // Hide quantity controls and show add to cart button
            $controls.hide();
            $card.find('.cart-controls .add-to-cart-btn').show();
            // Reload cart data
            await window.cart.loadCartItems();
        } catch (error) {
            console.error('Error removing item from cart:', error);
            alert('Failed to remove item. Please try again.');
        }
    }
}

// Add to cart function
async function addToCart(product, button) {
    const $card = $(button).closest('.card');
    const $quantityValue = $card.find('.quantity-value');
    const quantity = parseInt($quantityValue.text());
    
    try {
        // Add item to cart via API
        await CartService.addItemToCart(product.id, quantity);
        
        // Update UI
        const $cartControls = $(button).closest('.cart-controls');
        $cartControls.find('.add-to-cart-btn').hide();
        $card.find('.quantity-controls').show();
        
        // Reload cart data
        await window.cart.loadCartItems();
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add item to cart. Please try again.');
    }
}

// Export the ItemCard class
window.ItemCard = ItemCard; 