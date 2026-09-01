class OrderDetailPage {
    constructor() {
        this.container = $('#order-detail-container');
    }

    async initialize() {
        if (!Common.isLoggedIn()) {
            window.location.href = '/Auth/Login';
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const id = parseInt(params.get('id'));
        if (!id) {
            this.container.html('<div class="alert alert-danger">Invalid order ID.</div>');
            return;
        }

        this.container.html('<div class="text-center py-5"><i class="fas fa-spinner fa-spin fa-2x"></i></div>');
        try {
            const order = await OrderService.getOrderById(id);
            this.render(order);
        } catch (e) {
            this.container.html(`<div class="alert alert-danger">${e.message || 'Failed to load order.'}</div>`);
        }
    }

    render(order) {
        const statusClass = {
            Pending: 'warning', Confirmed: 'info',
            Shipped: 'primary', Delivered: 'success', Cancelled: 'danger'
        }[order.status] || 'secondary';

        const itemRows = order.items.map(i => `
            <tr>
                <td>${i.productName}</td>
                <td class="text-center">${i.quantity}</td>
                <td class="text-end">৳${i.unitPrice.toFixed(2)}</td>
                <td class="text-end fw-bold">৳${(i.unitPrice * i.quantity).toFixed(2)}</td>
            </tr>`).join('');

        this.container.html(`
            <div class="fade-in">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 style="font-family:var(--font-display);font-weight:700;color:var(--primary);margin-bottom:0.25rem">Order #${order.id}</h4>
                        <span class="text-muted small"><i class="fas fa-calendar-alt me-1" style="color:var(--accent)"></i>Placed on ${new Date(order.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</span>
                    </div>
                    <span class="badge bg-${statusClass}" style="font-size:0.82rem;padding:0.45rem 0.9rem">${order.status}</span>
                </div>

                <div class="card" style="box-shadow:var(--shadow-md)">
                    <div class="card-header fw-semibold"><i class="fas fa-list-ul me-2" style="color:var(--accent)"></i>Order Items</div>
                    <div class="card-body p-0">
                        <table class="table mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>Product</th>
                                    <th class="text-center">Qty</th>
                                    <th class="text-end">Unit Price</th>
                                    <th class="text-end">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>${itemRows}</tbody>
                            <tfoot class="table-light">
                                <tr>
                                    <td colspan="3" class="text-end fw-bold" style="font-family:var(--font-display)">Order Total</td>
                                    <td class="text-end fw-bold" style="font-family:var(--font-display);font-size:1.1rem;color:var(--primary)">৳${order.totalAmount.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                ${order.updatedAt ? `<p class="text-muted small mt-3"><i class="fas fa-sync-alt me-1"></i>Last updated: ${new Date(order.updatedAt).toLocaleString()}</p>` : ''}

                ${order.status === 'Pending' ? `
                <div class="alert alert-warning d-flex justify-content-between align-items-center mt-3">
                    <span><i class="fas fa-info-circle me-2"></i>This order is still pending and can be cancelled.</span>
                    <button id="cancel-order-btn" class="btn btn-sm btn-danger">
                        <i class="fas fa-times me-1"></i>Cancel Order
                    </button>
                </div>` : ''}

                <a href="/Order" class="btn btn-outline-secondary mt-3">
                    <i class="fas fa-arrow-left me-2"></i>Back to Orders
                </a>
            </div>
        `);

        // Cancel order button
        $('#cancel-order-btn').on('click', async function () {
            if (!confirm(`Cancel Order #${order.id}? Stock will be restored.`)) return;
            $(this).prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i>Cancelling...');
            try {
                await OrderService.cancelOrder(order.id);
                Toast.success(`Order #${order.id} cancelled.`);
                setTimeout(() => window.location.reload(), 800);
            } catch (e) {
                Toast.error(e.message || 'Failed to cancel order.');
                $(this).prop('disabled', false).html('<i class="fas fa-times me-1"></i>Cancel Order');
            }
        });
    }
}

$(document).ready(() => {
    const page = new OrderDetailPage();
    page.initialize();
});
