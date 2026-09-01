class AdminPage {
    constructor() {
        this.statsContainer = $('#stats-container');
        this.ordersContainer = $('#orders-container');
        this.statusFilter = '';
        this.page = 1;
        this.pageSize = 20;
    }

    async initialize() {
        if (!Common.isLoggedIn()) { window.location.href = '/Auth/Login'; return; }
        if (Common.getUserInfo().role !== 'Admin') { window.location.href = '/Product'; return; }
        await Promise.all([this.loadStats(), this.loadOrders()]);
    }

    async loadStats() {
        try {
            const stats = await AdminService.getStats();
            this.renderStats(stats);
        } catch (e) {
            this.statsContainer.html(`<div class="alert alert-danger">${e.message}</div>`);
        }
    }

    renderStats(stats) {
        const statCards = [
            { icon: 'fa-box',          color: 'primary', value: stats.totalProducts, label: 'Active Products' },
            { icon: 'fa-shopping-bag', color: 'success', value: stats.totalOrders,   label: 'Total Orders'    },
            { icon: 'fa-users',        color: 'info',    value: stats.totalUsers,    label: 'Registered Users'},
            { icon: 'fa-dollar-sign',  color: 'warning', value: `৳${stats.totalRevenue.toFixed(2)}`, label: 'Total Revenue' }
        ];

        const lowStockHtml = stats.lowStockProducts.length ? `
            <div class="card mb-4" style="border-left:4px solid var(--warning)">
                <div class="card-header" style="background:var(--warning-light)">
                    <i class="fas fa-exclamation-triangle me-2" style="color:var(--warning)"></i>
                    <span class="fw-semibold">Low Stock Alert</span>
                    <span class="text-muted ms-1">— ${stats.lowStockProducts.length} product(s) with fewer than 5 units</span>
                </div>
                <div class="card-body p-0">
                    <table class="table mb-0">
                        <thead class="table-light"><tr><th>Product</th><th>Price</th><th class="text-center">Stock</th></tr></thead>
                        <tbody>
                            ${stats.lowStockProducts.map(p => `
                                <tr>
                                    <td class="fw-medium">${p.name}</td>
                                    <td>৳${p.price.toFixed(2)}</td>
                                    <td class="text-center"><span class="badge bg-danger">${p.stock}</span></td>
                                </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>` : '';

        this.statsContainer.html(`
            <div class="row g-3 mb-4">
                ${statCards.map(c => `
                    <div class="col-6 col-md-3">
                        <div class="admin-stat-card">
                            <i class="fas ${c.icon} text-${c.color}"></i>
                            <h3 class="mb-0">${c.value}</h3>
                            <small>${c.label}</small>
                        </div>
                    </div>`).join('')}
            </div>
            ${lowStockHtml}
        `);
    }

    async loadOrders() {
        this.ordersContainer.html('<div class="text-center py-3"><i class="fas fa-spinner fa-spin"></i> Loading orders...</div>');
        try {
            const result = await AdminService.getAllOrders(this.page, this.pageSize, this.statusFilter);
            this.renderOrders(result);
        } catch (e) {
            this.ordersContainer.html(`<div class="alert alert-danger">${e.message}</div>`);
        }
    }

    renderOrders(result) {
        const statusColors = { Pending: 'warning', Confirmed: 'info', Shipped: 'primary', Delivered: 'success', Cancelled: 'danger' };
        const statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

        const rows = result.orders.map(o => `
            <tr>
                <td class="fw-bold">#${o.id}</td>
                <td>${o.userEmail ? `<span title="User #${o.userId}">${o.userEmail}</span>` : `#${o.userId}`}</td>
                <td>৳${o.totalAmount.toFixed(2)}</td>
                <td><span class="badge bg-${statusColors[o.status] || 'secondary'}">${o.status}</span></td>
                <td>${new Date(o.createdAt).toLocaleDateString()}</td>
                <td class="d-flex gap-2 align-items-center">
                    <select class="form-select form-select-sm status-select" data-order-id="${o.id}" style="width:130px">
                        ${statuses.map(s => `<option value="${s}" ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}
                    </select>
                    <a href="/Order/Detail?id=${o.id}" class="btn btn-sm btn-outline-secondary" title="View">
                        <i class="fas fa-eye"></i>
                    </a>
                </td>
            </tr>`).join('');

        this.ordersContainer.html(`
            <div class="card shadow-sm">
                <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <span class="fw-semibold">All Orders <span class="text-muted">(${result.totalCount} total)</span></span>
                    <select id="statusFilterSelect" class="form-select form-select-sm" style="width:160px">
                        <option value="">All Statuses</option>
                        ${statuses.map(s => `<option value="${s}" ${s === this.statusFilter ? 'selected' : ''}>${s}</option>`).join('')}
                    </select>
                </div>
                <div class="card-body p-0 table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr><th>Order</th><th>User</th><th>Total</th><th>Status</th><th>Date</th><th>Update Status</th></tr>
                        </thead>
                        <tbody>${rows || '<tr><td colspan="6" class="text-center text-muted py-4">No orders found</td></tr>'}</tbody>
                    </table>
                </div>
            </div>
        `);

        // Status change
        this.ordersContainer.find('.status-select').on('change', async function () {
            const orderId = parseInt($(this).data('order-id'));
            const newStatus = $(this).val();
            try {
                await OrderService.updateOrderStatus(orderId, newStatus);
                Toast.success(`Order #${orderId} → ${newStatus}`);
            } catch (e) {
                Toast.error(`Failed to update order #${orderId}`);
            }
        });

        // Status filter
        this.ordersContainer.find('#statusFilterSelect').on('change', (e) => {
            this.statusFilter = e.target.value;
            this.page = 1;
            this.loadOrders();
        });
    }
}

$(document).ready(() => {
    const page = new AdminPage();
    page.initialize();
});
