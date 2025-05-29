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
                            <span class="quantity-btn" onclick="decreaseQuantity(this)">-</span>
                            <span class="quantity-value">1</span>
                            <span class="quantity-btn" onclick="increaseQuantity(this)">+</span>
                        </div>
                        <div class="cart-controls">
                            <button class="btn btn-sm add-to-cart-btn" onclick="addToCart(${this.product.id}, this)">
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
function increaseQuantity(button) {
    const $controls = $(button).closest('.quantity-controls');
    const $quantityValue = $controls.find('.quantity-value');
    const currentValue = parseInt($quantityValue.text());
    $quantityValue.text(currentValue + 1);
}

function decreaseQuantity(button) {
    const $controls = $(button).closest('.quantity-controls');
    const $quantityValue = $controls.find('.quantity-value');
    const currentValue = parseInt($quantityValue.text());
    if (currentValue > 1) {
        $quantityValue.text(currentValue - 1);
    }
}

// Add to cart function
function addToCart(productId, button) {
    const $card = $(button).closest('.card');
    const $quantityValue = $card.find('.quantity-value');
    const quantity = parseInt($quantityValue.text());
    
    // Hide the add to cart button and show quantity controls
    const $cartControls = $(button).closest('.cart-controls');
    $cartControls.find('.add-to-cart-btn').hide();
    $card.find('.quantity-controls').show();
    
    // TODO: Implement cart functionality
    console.log(`Adding product ${productId} to cart with quantity ${quantity}`);
}

// Export the ItemCard class
window.ItemCard = ItemCard; 