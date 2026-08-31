class OrderHistoryPage {
    constructor() {
        this.container = $('#order-container');
        this.page = 1;
        this.pageSize = 5;
        this.totalCount = 0;
        this.statusFilter = '';
    }

    async initialize() {
        if (!Common.isLoggedIn()) {
            window.location.href = '/Auth/Login';
            return;
        }
        this._renderFilterBar();
        await this.fetchAndRender();
    }

    _renderFilterBar() {
        const statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
        const statusIcons = { Pending: 'fa-clock', Confirmed: 'fa-check', Shipped: 'fa-truck', Delivered: 'fa-box-open', Cancelled: 'fa-times' };
        const $bar = $(`
            <div class="filter-bar mb-4">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <p class="text-muted mb-0 small fw-medium"><i class="fas fa-filter me-1" style="color:var(--accent)"></i>Filter by status:</p>
                    <div class="d-flex gap-2 flex-wrap">
                        <button class="btn btn-sm ${!this.statusFilter ? 'btn-primary' : 'btn-outline-secondary'} filter-btn" data-status="">All</button>
                        ${statuses.map(s => `<button class="btn btn-sm ${this.statusFilter === s ? 'btn-primary' : 'btn-outline-secondary'} filter-btn" data-status="${s}"><i class="fas ${statusIcons[s]} me-1"></i>${s}</button>`).join('')}
                    </div>
                </div>
            </div>`);
        this.container.before($bar);
        $bar.on('click', '.filter-btn', (e) => {
            this.statusFilter = $(e.currentTarget).data('status');
            this.page = 1;
            $bar.find('.filter-btn').removeClass('btn-primary').addClass('btn-outline-secondary');
            $(e.currentTarget).removeClass('btn-outline-secondary').addClass('btn-primary');
            this.fetchAndRender();
        });
    }

    async fetchAndRender() {
        this.container.html('<div class="text-center py-5"><i class="fas fa-spinner fa-spin fa-2x"></i></div>');
        try {
            const result = await OrderService.getOrderHistory(this.page, this.pageSize, this.statusFilter);
            this.totalCount = result.totalCount;
            this.render(result.orders);
        } catch (e) {
            this.container.html(`<div class="alert alert-danger">${e.message || 'Failed to load orders.'}</div>`);
        }
    }

    getTotalPages() {
        return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
    }

    render(orders) {
        this.container.empty();

        if (!orders.length) {
            this.container.html(`
                <div class="text-center py-5">
                    <i class="fas fa-box-open fa-4x mb-3 d-block" style="color:var(--neutral-300)"></i>
                    <h5 style="font-family:var(--font-display);color:var(--primary)">No orders yet</h5>
                    <p class="text-muted small">When you place an order, it will appear here.</p>
                    <a href="/Product" class="btn btn-primary btn-sm mt-2"><i class="fas fa-shopping-bag me-2"></i>Start Shopping</a>
                </div>`);
            return;
        }

        orders.forEach(order => {
            const statusClass = {
                Pending: 'warning', Confirmed: 'info',
                Shipped: 'primary', Delivered: 'success', Cancelled: 'danger'
            }[order.status] || 'secondary';

            const itemRows = order.items.map(i => `
                <tr>
                    <td>${i.productName}</td>
                    <td>${i.quantity}</td>
                    <td>$${i.unitPrice.toFixed(2)}</td>
                    <td>$${(i.unitPrice * i.quantity).toFixed(2)}</td>
                </tr>`).join('');

            const card = $(`
                <div class="card mb-4 shadow-sm">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span class="fw-bold">Order #${order.id}</span>
                        <div class="d-flex align-items-center gap-2">
                            <span class="badge bg-${statusClass}">${order.status}</span>
                            <a href="/Order/Detail?id=${order.id}" class="btn btn-sm btn-outline-secondary">
                                <i class="fas fa-eye me-1"></i>Details
                            </a>
                            ${order.status === 'Pending' ? `
                            <button class="btn btn-sm btn-outline-danger cancel-order-btn" data-order-id="${order.id}">
                                <i class="fas fa-times me-1"></i>Cancel
                            </button>` : ''}
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <table class="table mb-0">
                            <thead class="table-light">
                                <tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr>
                            </thead>
                            <tbody>${itemRows}</tbody>
                        </table>
                    </div>
                    <div class="card-footer d-flex justify-content-between text-muted small">
                        <span>Placed: ${new Date(order.createdAt).toLocaleDateString()}</span>
                        <span class="fw-bold">Order Total: $${order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            `);
            this.container.append(card);
        });

        // Cancel order handlers
        this.container.find('.cancel-order-btn').on('click', async function () {
            const orderId = parseInt($(this).data('orderId'));
            if (!confirm(`Cancel Order #${orderId}? Stock will be restored.`)) return;
            $(this).prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');
            try {
                await OrderService.cancelOrder(orderId);
                Toast.success(`Order #${orderId} cancelled.`);
                // Re-render the page
                const page = $(this).closest('.order-history-page-root').data('instance');
                if (window._orderHistoryPage) window._orderHistoryPage.fetchAndRender();
            } catch (e) {
                Toast.error(e.message || 'Failed to cancel order.');
                $(this).prop('disabled', false).html('<i class="fas fa-times me-1"></i>Cancel');
            }
        });

        this.renderPagination();
    }

    renderPagination() {
        const totalPages = this.getTotalPages();
        if (totalPages <= 1) return;

        const $pagination = $('<div class="d-flex justify-content-center mt-2 mb-4">');
        const $ul = $('<ul class="pagination">');

        const $prev = $('<li>').addClass(`page-item ${this.page === 1 ? 'disabled' : ''}`).append(
            $('<button class="page-link">').text('Previous').on('click', () => {
                if (this.page > 1) { this.page--; this.fetchAndRender(); }
            })
        );
        $ul.append($prev);

        for (let i = 1; i <= totalPages; i++) {
            const $li = $('<li>').addClass(`page-item ${i === this.page ? 'active' : ''}`).append(
                $('<button class="page-link">').text(i).on('click', () => {
                    this.page = i; this.fetchAndRender();
                })
            );
            $ul.append($li);
        }

        const $next = $('<li>').addClass(`page-item ${this.page === totalPages ? 'disabled' : ''}`).append(
            $('<button class="page-link">').text('Next').on('click', () => {
                if (this.page < totalPages) { this.page++; this.fetchAndRender(); }
            })
        );
        $ul.append($next);

        $pagination.append($ul);
        this.container.append($pagination);
    }
}

$(document).ready(() => {
    window._orderHistoryPage = new OrderHistoryPage();
    window._orderHistoryPage.initialize();
});
