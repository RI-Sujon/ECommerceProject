class WishlistPage {
    constructor() {
        this.container = $('#wishlist-container');
    }

    initialize() {
        this.render();
    }

    render() {
        const items = WishlistService.getAll();

        if (!items.length) {
            this.container.html(`
                <div class="text-center py-5 fade-in">
                    <i class="fas fa-heart fa-4x mb-3 d-block" style="color:var(--neutral-300)"></i>
                    <h5 style="font-family:var(--font-display);color:var(--primary)">Your wishlist is empty</h5>
                    <p class="text-muted small">Save items you love by clicking the heart icon on any product.</p>
                    <a href="/Product" class="btn btn-primary btn-sm mt-2"><i class="fas fa-shopping-bag me-2"></i>Browse Products</a>
                </div>`);
            return;
        }

        const cards = items.map(item => `
            <div class="col-md-3 fade-in" id="wl-item-${item.id}" style="padding:8px">
                <div class="card h-100 product-card">
                    <div class="position-relative" style="overflow:hidden;border-radius:var(--radius-lg) var(--radius-lg) 0 0">
                        <img src="${item.imageUrl || '/css/images/dummy.png'}" class="card-img-top product-image" alt="${item.name}" style="border-radius:0">
                        <button class="btn btn-sm position-absolute top-0 end-0 m-2 wl-remove-btn"
                                data-id="${item.id}"
                                style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.9);border:none;color:var(--danger);box-shadow:var(--shadow-sm)">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title product-name text-truncate">${item.name}</h5>
                        <a href="/Product/Detail?id=${item.id}" class="btn btn-link p-0 small text-decoration-none mb-2 d-block" style="color:var(--accent-dark);font-weight:500">
                            <i class="fas fa-eye me-1"></i>View Details
                        </a>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="product-price">$${item.price.toFixed(2)}</span>
                        </div>
                        <p class="text-muted mt-2 mb-0" style="font-size:0.72rem">
                            <i class="fas fa-calendar-alt me-1"></i>Added ${new Date(item.addedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>`).join('');

        this.container.html(`
            <div class="d-flex justify-content-between align-items-center mb-3 fade-in">
                <p class="results-count mb-0"><span>${items.length}</span> item${items.length !== 1 ? 's' : ''} in your wishlist</p>
                <button id="clearWishlistBtn" class="btn btn-outline-danger btn-sm"><i class="fas fa-trash me-2"></i>Clear All</button>
            </div>
            <div class="row">${cards}</div>
        `);

        // Remove individual items
        this.container.on('click', '.wl-remove-btn', (e) => {
            const id = parseInt($(e.currentTarget).data('id'));
            WishlistService.remove(id);
            $(`#wl-item-${id}`).fadeOut(300, () => {
                $(`#wl-item-${id}`).remove();
                if (!WishlistService.count()) this.render();
            });
            Toast.info('Removed from wishlist');
        });

        // Clear all
        $('#clearWishlistBtn').on('click', () => {
            if (!confirm('Remove all items from your wishlist?')) return;
            WishlistService.clear();
            this.render();
            Toast.info('Wishlist cleared');
        });
    }
}

$(document).ready(() => {
    const page = new WishlistPage();
    page.initialize();
});
