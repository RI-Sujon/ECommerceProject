class CheckoutPage {
    constructor() {
        this.container = $('#checkout-container');
        this.cartItems = [];
    }

    async initialize() {
        if (!Common.isLoggedIn()) {
            window.location.href = '/Auth/Login';
            return;
        }

        try {
            const items = await CartService.getCartItems();
            this.cartItems = items;

            if (!items || items.length === 0) {
                this.container.html(`
                    <div class="text-center py-5 fade-in">
                        <i class="fas fa-shopping-cart fa-4x mb-3 d-block" style="color:var(--neutral-300)"></i>
                        <h5 style="font-family:var(--font-display);color:var(--primary)">Your cart is empty</h5>
                        <p class="text-muted small">Add some items before proceeding to checkout.</p>
                        <a href="/Product" class="btn btn-primary btn-sm mt-2"><i class="fas fa-shopping-bag me-2"></i>Browse Products</a>
                    </div>`);
                return;
            }

            this.render();
        } catch (e) {
            this.container.html(`<div class="alert alert-danger">${e.message || 'Failed to load cart.'}</div>`);
        }
    }

    render() {
        const items = this.cartItems;
        let subtotal = 0;
        const itemRows = items.map(item => {
            const price = item.productPrice || 0;
            const lineTotal = price * item.quantity;
            subtotal += lineTotal;
            return `
                <div class="d-flex align-items-center py-3" style="border-bottom:1px solid var(--neutral-200)">
                    <div class="me-3" style="width:56px;height:56px;border-radius:var(--radius-sm);overflow:hidden;border:1px solid var(--neutral-200);flex-shrink:0">
                        <img src="${item.imageUrl || '/css/images/dummy.png'}" alt="${item.productName}" style="width:100%;height:100%;object-fit:cover">
                    </div>
                    <div class="flex-grow-1">
                        <h6 class="mb-0" style="font-family:var(--font-display);color:var(--primary);font-weight:600;font-size:0.9rem">${item.productName}</h6>
                        <small class="text-muted">Qty: ${item.quantity} &times; $${price.toFixed(2)}</small>
                    </div>
                    <div class="fw-bold" style="color:var(--primary);font-size:0.95rem">$${lineTotal.toFixed(2)}</div>
                </div>`;
        }).join('');

        const shipping = 0;
        const tax = subtotal * 0.0;
        const total = subtotal + shipping + tax;

        this.container.html(`
            <div class="row fade-in">
                <!-- Shipping Information -->
                <div class="col-md-7 pe-md-4">
                    <div class="card" style="box-shadow:var(--shadow-md)">
                        <div class="card-header">
                            <i class="fas fa-truck me-2" style="color:var(--accent)"></i>Shipping Information
                        </div>
                        <div class="card-body" style="padding:1.5rem">
                            <form id="checkoutForm" novalidate>
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label" style="font-weight:600;text-transform:uppercase;font-size:0.72rem;letter-spacing:0.05em">First Name <span class="text-danger">*</span></label>
                                        <input type="text" id="shipFirstName" class="form-control" placeholder="John" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label" style="font-weight:600;text-transform:uppercase;font-size:0.72rem;letter-spacing:0.05em">Last Name <span class="text-danger">*</span></label>
                                        <input type="text" id="shipLastName" class="form-control" placeholder="Doe" required>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label" style="font-weight:600;text-transform:uppercase;font-size:0.72rem;letter-spacing:0.05em">Email <span class="text-danger">*</span></label>
                                        <input type="email" id="shipEmail" class="form-control" placeholder="you@example.com" required>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label" style="font-weight:600;text-transform:uppercase;font-size:0.72rem;letter-spacing:0.05em">Phone</label>
                                        <input type="tel" id="shipPhone" class="form-control" placeholder="+1 (555) 000-0000">
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label" style="font-weight:600;text-transform:uppercase;font-size:0.72rem;letter-spacing:0.05em">Street Address <span class="text-danger">*</span></label>
                                        <input type="text" id="shipAddress" class="form-control" placeholder="123 Main Street" required>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label" style="font-weight:600;text-transform:uppercase;font-size:0.72rem;letter-spacing:0.05em">Apartment, Suite, etc.</label>
                                        <input type="text" id="shipAddress2" class="form-control" placeholder="Apt 4B">
                                    </div>
                                    <div class="col-md-5">
                                        <label class="form-label" style="font-weight:600;text-transform:uppercase;font-size:0.72rem;letter-spacing:0.05em">City <span class="text-danger">*</span></label>
                                        <input type="text" id="shipCity" class="form-control" placeholder="New York" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label" style="font-weight:600;text-transform:uppercase;font-size:0.72rem;letter-spacing:0.05em">State / Province</label>
                                        <input type="text" id="shipState" class="form-control" placeholder="NY">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label" style="font-weight:600;text-transform:uppercase;font-size:0.72rem;letter-spacing:0.05em">Zip Code <span class="text-danger">*</span></label>
                                        <input type="text" id="shipZip" class="form-control" placeholder="10001" required>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label" style="font-weight:600;text-transform:uppercase;font-size:0.72rem;letter-spacing:0.05em">Order Notes</label>
                                        <textarea id="shipNotes" class="form-control" rows="2" placeholder="Any special instructions..."></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Payment Method -->
                    <div class="card mt-4" style="box-shadow:var(--shadow-md)">
                        <div class="card-header">
                            <i class="fas fa-lock me-2" style="color:var(--accent)"></i>Payment Method
                        </div>
                        <div class="card-body" style="padding:1.5rem">
                            <div class="form-check mb-3 p-3" style="border:2px solid var(--accent);border-radius:var(--radius-sm);background:rgba(201,169,110,0.04)">
                                <input class="form-check-input" type="radio" name="paymentMethod" id="payCOD" value="cod" checked>
                                <label class="form-check-label fw-medium ms-2" for="payCOD">
                                    <i class="fas fa-money-bill-wave me-2" style="color:var(--accent)"></i>Cash on Delivery
                                </label>
                                <p class="text-muted small mb-0 ms-4 mt-1">Pay when your order arrives</p>
                            </div>
                            <div class="form-check p-3" style="border:1.5px solid var(--neutral-200);border-radius:var(--radius-sm)">
                                <input class="form-check-input" type="radio" name="paymentMethod" id="payCard" value="card" disabled>
                                <label class="form-check-label fw-medium ms-2 text-muted" for="payCard">
                                    <i class="fas fa-credit-card me-2"></i>Credit/Debit Card
                                    <span class="badge" style="background:var(--neutral-200);color:var(--neutral-500);font-size:0.65rem;margin-left:0.5rem">Coming Soon</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="col-md-5 mt-4 mt-md-0">
                    <div class="card" style="box-shadow:var(--shadow-md);position:sticky;top:90px">
                        <div class="card-header">
                            <i class="fas fa-receipt me-2" style="color:var(--accent)"></i>Order Summary
                            <span class="badge bg-primary ms-2">${items.length} item${items.length > 1 ? 's' : ''}</span>
                        </div>
                        <div class="card-body" style="padding:1rem 1.5rem;max-height:350px;overflow-y:auto">
                            ${itemRows}
                        </div>
                        <div class="card-footer" style="padding:1.25rem 1.5rem">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Subtotal</span>
                                <span class="fw-medium">$${subtotal.toFixed(2)}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Shipping</span>
                                <span class="fw-medium" style="color:var(--success)">Free</span>
                            </div>
                            <hr style="border-color:var(--neutral-200)">
                            <div class="d-flex justify-content-between">
                                <span class="fw-bold" style="font-family:var(--font-display);font-size:1.1rem;color:var(--primary)">Total</span>
                                <span class="fw-bold" style="font-family:var(--font-display);font-size:1.25rem;color:var(--primary)">$${total.toFixed(2)}</span>
                            </div>
                            <button id="placeOrderBtn" class="btn btn-primary w-100 mt-3" style="height:48px;font-weight:600;font-size:0.95rem">
                                <i class="fas fa-check-circle me-2"></i>Place Order
                            </button>
                            <a href="/Product" class="btn btn-outline-secondary w-100 mt-2 btn-sm">
                                <i class="fas fa-arrow-left me-2"></i>Continue Shopping
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `);

        // Pre-fill email from JWT
        const userInfo = Common.getUserInfo();
        if (userInfo.username) $('#shipEmail').val(userInfo.username);
        const nameParts = (userInfo.fullName || '').split(' ');
        if (nameParts.length >= 2) {
            $('#shipFirstName').val(nameParts[0]);
            $('#shipLastName').val(nameParts.slice(1).join(' '));
        } else if (nameParts.length === 1) {
            $('#shipFirstName').val(nameParts[0]);
        }

        // Place order handler
        $('#placeOrderBtn').on('click', () => this.placeOrder(total));
    }

    async placeOrder(total) {
        // Validate required fields
        const required = ['shipFirstName', 'shipLastName', 'shipEmail', 'shipAddress', 'shipCity', 'shipZip'];
        let valid = true;
        required.forEach(id => {
            const $el = $(`#${id}`);
            if (!$el.val().trim()) {
                $el.addClass('is-invalid');
                valid = false;
            } else {
                $el.removeClass('is-invalid');
            }
        });

        if (!valid) {
            Toast.error('Please fill in all required fields.');
            return;
        }

        const $btn = $('#placeOrderBtn');
        $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Processing Order...');

        try {
            const order = await OrderService.checkout();
            // Save shipping info to localStorage for confirmation page
            localStorage.setItem('lastOrder', JSON.stringify({
                orderId: order.id,
                totalAmount: order.totalAmount,
                shippingName: $('#shipFirstName').val() + ' ' + $('#shipLastName').val(),
                shippingAddress: $('#shipAddress').val() + ($('#shipAddress2').val() ? ', ' + $('#shipAddress2').val() : ''),
                shippingCity: $('#shipCity').val() + ($('#shipState').val() ? ', ' + $('#shipState').val() : '') + ' ' + $('#shipZip').val()
            }));
            // Redirect to confirmation
            window.location.href = '/Order/Confirmation?id=' + order.id;
        } catch (e) {
            Toast.error(e.message || 'Checkout failed. Please try again.');
            $btn.prop('disabled', false).html('<i class="fas fa-check-circle me-2"></i>Place Order');
        }
    }
}

$(document).ready(() => {
    const page = new CheckoutPage();
    page.initialize();
});
