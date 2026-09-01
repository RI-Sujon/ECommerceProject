class ConfirmationPage {
    constructor() {
        this.container = $('#confirmation-container');
    }

    initialize() {
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get('id');
        const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || 'null');

        this.container.html(`
            <div class="text-center fade-in" style="max-width:600px;margin:0 auto">
                <!-- Success Animation -->
                <div class="mb-4" style="position:relative;display:inline-block">
                    <div style="width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,var(--success),#43a047);display:inline-flex;align-items:center;justify-content:center;box-shadow:0 8px 32px rgba(46,125,82,0.3);animation:successPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both">
                        <i class="fas fa-check fa-3x text-white"></i>
                    </div>
                </div>

                <h2 style="font-family:var(--font-display);color:var(--primary);font-weight:700;margin-bottom:0.5rem">
                    Order Confirmed!
                </h2>
                <p class="text-muted mb-4">Thank you for your purchase. Your order has been placed successfully.</p>

                <!-- Order Details Card -->
                <div class="card text-start" style="box-shadow:var(--shadow-md);border-left:4px solid var(--success)">
                    <div class="card-body" style="padding:1.75rem">
                        <div class="row">
                            <div class="col-6 mb-3">
                                <p class="text-muted small mb-1" style="text-transform:uppercase;letter-spacing:0.05em;font-weight:600;font-size:0.7rem">Order Number</p>
                                <p class="fw-bold mb-0" style="font-family:var(--font-display);font-size:1.3rem;color:var(--primary)">#${orderId || '—'}</p>
                            </div>
                            <div class="col-6 mb-3">
                                <p class="text-muted small mb-1" style="text-transform:uppercase;letter-spacing:0.05em;font-weight:600;font-size:0.7rem">Status</p>
                                <span class="badge bg-warning" style="font-size:0.78rem;padding:0.4rem 0.8rem"><i class="fas fa-clock me-1"></i>Pending</span>
                            </div>
                            ${lastOrder ? `
                            <div class="col-6 mb-3">
                                <p class="text-muted small mb-1" style="text-transform:uppercase;letter-spacing:0.05em;font-weight:600;font-size:0.7rem">Total Amount</p>
                                <p class="fw-bold mb-0" style="font-family:var(--font-display);font-size:1.2rem;color:var(--primary)">৳${lastOrder.totalAmount?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div class="col-6 mb-3">
                                <p class="text-muted small mb-1" style="text-transform:uppercase;letter-spacing:0.05em;font-weight:600;font-size:0.7rem">Payment</p>
                                <p class="fw-medium mb-0"><i class="fas fa-money-bill-wave me-1" style="color:var(--accent)"></i>${lastOrder.paymentMethod || 'Cash on Delivery'}</p>
                            </div>
                            <div class="col-12">
                                <hr style="border-color:var(--neutral-200)">
                                <p class="text-muted small mb-1" style="text-transform:uppercase;letter-spacing:0.05em;font-weight:600;font-size:0.7rem">Shipping To</p>
                                <p class="mb-0 fw-medium">${lastOrder.shippingName || ''}</p>
                                ${lastOrder.shippingPhone ? `<p class="text-muted small mb-0"><i class="fas fa-phone me-1"></i>${lastOrder.shippingPhone}</p>` : ''}
                                <p class="text-muted small mb-0">${lastOrder.shippingAddress || ''}</p>
                                <p class="text-muted small mb-0">${lastOrder.shippingCity || ''}</p>
                            </div>
                            ` : `
                            <div class="col-12">
                                <p class="text-muted small mb-1" style="text-transform:uppercase;letter-spacing:0.05em;font-weight:600;font-size:0.7rem">Date</p>
                                <p class="mb-0">${new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</p>
                            </div>
                            `}
                        </div>
                    </div>
                </div>

                <!-- What's Next -->
                <div class="card mt-4 text-start" style="background:var(--neutral-50);border:1px solid var(--neutral-200)">
                    <div class="card-body" style="padding:1.5rem">
                        <h6 style="font-family:var(--font-display);color:var(--primary);font-weight:700;margin-bottom:1rem">
                            <i class="fas fa-info-circle me-2" style="color:var(--accent)"></i>What happens next?
                        </h6>
                        <div class="d-flex align-items-start mb-2">
                            <div style="min-width:28px;height:28px;border-radius:50%;background:var(--info-light);display:flex;align-items:center;justify-content:center;margin-right:0.75rem;margin-top:2px">
                                <i class="fas fa-envelope small" style="color:var(--info)"></i>
                            </div>
                            <div>
                                <p class="mb-0 fw-medium small">Confirmation email sent</p>
                                <p class="text-muted mb-0" style="font-size:0.78rem">You'll receive an email with your order details</p>
                            </div>
                        </div>
                        <div class="d-flex align-items-start mb-2">
                            <div style="min-width:28px;height:28px;border-radius:50%;background:var(--warning-light);display:flex;align-items:center;justify-content:center;margin-right:0.75rem;margin-top:2px">
                                <i class="fas fa-box small" style="color:var(--warning)"></i>
                            </div>
                            <div>
                                <p class="mb-0 fw-medium small">Order processing</p>
                                <p class="text-muted mb-0" style="font-size:0.78rem">We'll prepare your items for shipment</p>
                            </div>
                        </div>
                        <div class="d-flex align-items-start">
                            <div style="min-width:28px;height:28px;border-radius:50%;background:var(--success-light);display:flex;align-items:center;justify-content:center;margin-right:0.75rem;margin-top:2px">
                                <i class="fas fa-truck small" style="color:var(--success)"></i>
                            </div>
                            <div>
                                <p class="mb-0 fw-medium small">Delivery on the way</p>
                                <p class="text-muted mb-0" style="font-size:0.78rem">Track your order status from your orders page</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="d-flex justify-content-center gap-3 mt-4">
                    ${orderId ? `<a href="/Order/Detail?id=${orderId}" class="btn btn-primary"><i class="fas fa-eye me-2"></i>View Order</a>` : ''}
                    <a href="/Order" class="btn btn-outline-primary"><i class="fas fa-box me-2"></i>My Orders</a>
                    <a href="/Product" class="btn btn-outline-secondary"><i class="fas fa-shopping-bag me-2"></i>Keep Shopping</a>
                </div>
            </div>

            <style>
                @keyframes successPop {
                    0% { transform: scale(0); opacity: 0; }
                    60% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }
            </style>
        `);

        // Clear stored order data
        localStorage.removeItem('lastOrder');

        // Update cart count in header
        if (window.cart) {
            window.cart.items = [];
            window.cart.updateCartCount();
        }
        $('.cart-count').text('').addClass('d-none');
    }
}

$(document).ready(() => {
    const page = new ConfirmationPage();
    page.initialize();
});
