class ProductDetailPage {
    constructor() {
        this.container = $('#product-detail-container');
    }

    async initialize() {
        const params = new URLSearchParams(window.location.search);
        const id = parseInt(params.get('id'));
        if (!id) {
            this.container.html('<div class="alert alert-danger">Invalid product ID.</div>');
            return;
        }

        this.container.html(`
            <div class="row placeholder-glow fade-in">
                <div class="col-md-5">
                    <div class="placeholder col-12" style="height:380px;border-radius:var(--radius-lg)"></div>
                </div>
                <div class="col-md-7 ps-md-5 pt-3">
                    <div class="placeholder col-8 mb-3" style="height:2rem;border-radius:var(--radius-sm)"></div>
                    <div class="placeholder col-12 mb-2" style="border-radius:var(--radius-sm)"></div>
                    <div class="placeholder col-10 mb-4" style="border-radius:var(--radius-sm)"></div>
                    <div class="placeholder col-4" style="height:2.5rem;border-radius:var(--radius-sm)"></div>
                </div>
            </div>`);

        try {
            const product = await ProductService.getProductById(id);
            this.render(product);
        } catch (e) {
            this.container.html(`<div class="alert alert-danger">${e.message || 'Product not found.'}</div>`);
        }
    }

    render(product) {
        const now = new Date();
        const dStart = product.discountStartDate ? new Date(product.discountStartDate) : null;
        const dEnd   = product.discountEndDate   ? new Date(product.discountEndDate)   : null;
        const isDisc = dStart && dEnd && dStart <= now && dEnd >= now;
        const displayPrice = isDisc ? product.price * 0.75 : product.price;

        const priceHtml = isDisc
            ? `<span class="product-detail-price text-danger">$${displayPrice.toFixed(2)}</span>
               <span class="text-muted text-decoration-line-through ms-2" style="font-size:1.1rem">$${product.price.toFixed(2)}</span>
               <span class="badge badge-discount ms-2"><i class="fas fa-bolt me-1"></i>25% OFF</span>`
            : `<span class="product-detail-price">$${displayPrice.toFixed(2)}</span>`;

        const discountLine = (dStart && dEnd) ? `
            <div class="d-flex align-items-center gap-2 mt-2 p-2" style="background:var(--warning-light);border-radius:var(--radius-sm);border-left:3px solid var(--accent)">
                <i class="fas fa-tag" style="color:var(--accent)"></i>
                <span class="small" style="color:var(--neutral-700)">Discount: ${dStart.toLocaleDateString()} – ${dEnd.toLocaleDateString()}</span>
            </div>` : '';

        // Role-based action buttons
        const userInfo = Common.getUserInfo();
        const isAdmin = userInfo.role === 'Admin';
        const isLoggedIn = Common.isLoggedIn();

        let actionButtons;
        if (isAdmin) {
            actionButtons = `
                <div class="d-flex gap-2 mt-4">
                    <button id="edit-product-btn" class="btn btn-warning btn-lg">
                        <i class="fas fa-edit me-2"></i>Edit Product
                    </button>
                    <button id="delete-product-btn" class="btn btn-danger btn-lg">
                        <i class="fas fa-trash me-2"></i>Delete
                    </button>
                    <a href="/Product" class="btn btn-outline-secondary btn-lg">
                        <i class="fas fa-arrow-left me-2"></i>Back
                    </a>
                </div>`;
        } else if (!isLoggedIn) {
            actionButtons = `
                <div class="d-flex gap-2 mt-4">
                    <a href="/Auth/Login" class="btn btn-primary btn-lg">
                        <i class="fas fa-lock me-2"></i>Login to Buy
                    </a>
                    <a href="/Product" class="btn btn-outline-secondary btn-lg">
                        <i class="fas fa-arrow-left me-2"></i>Back
                    </a>
                </div>`;
        } else {
            const isWished = typeof WishlistService !== 'undefined' && WishlistService.isInWishlist(product.id);
            actionButtons = `
                <div class="d-flex gap-2 mt-4">
                    <button id="add-to-cart-btn" class="btn btn-primary btn-lg" ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus me-2"></i>Add to Cart
                    </button>
                    <button id="wishlist-detail-btn" class="btn btn-outline-secondary btn-lg" data-id="${product.id}"
                            style="color:${isWished ? 'var(--danger)' : 'var(--neutral-400)'}">
                        <i class="fas fa-heart me-1"></i>${isWished ? 'Wishlisted' : 'Wishlist'}
                    </button>
                    <a href="/Product" class="btn btn-outline-secondary btn-lg">
                        <i class="fas fa-arrow-left me-2"></i>Back
                    </a>
                </div>`;
        }

        this.container.html(`
            <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/Product">Products</a></li>
                    <li class="breadcrumb-item active">${product.name}</li>
                </ol>
            </nav>
            <div class="row">
                <div class="col-md-5">
                    <div class="product-detail-image">
                        <div class="text-center">
                            <i class="fas fa-image fa-5x"></i>
                            <p class="text-muted mt-2 small mb-0">No image available</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-7 ps-md-5 pt-3 pt-md-0">
                    <h2 class="product-detail-title">${product.name}</h2>
                    <p style="color:var(--neutral-500);line-height:1.7;margin-top:0.5rem">${product.description || 'No description available.'}</p>
                    <div class="mb-3 mt-3">${priceHtml}</div>
                    ${discountLine}
                    <div class="d-flex align-items-center gap-2 mt-3">
                        <span class="badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}" style="font-size:0.78rem;padding:0.4rem 0.8rem">
                            <i class="fas ${product.stock > 0 ? 'fa-check-circle' : 'fa-times-circle'} me-1"></i>
                            ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                        ${product.categoryName ? `<span class="badge bg-primary" style="font-size:0.78rem;padding:0.4rem 0.8rem"><i class="fas fa-tag me-1"></i>${product.categoryName}</span>` : ''}
                    </div>
                    ${actionButtons}
                </div>
            </div>
        `);

        // Bind buttons based on role
        if (isLoggedIn && !isAdmin) {
            $('#add-to-cart-btn').on('click', async () => {
                const $btn = $('#add-to-cart-btn');
                $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Adding...');
                try {
                    await CartService.addItemToCart(product.id, 1);
                    Toast.success(`"${product.name}" added to cart!`);
                } catch (e) {
                    Toast.error(e.message || 'Failed to add to cart');
                } finally {
                    $btn.prop('disabled', product.stock === 0)
                        .html('<i class="fas fa-cart-plus me-2"></i>Add to Cart');
                }
            });

            // Wishlist toggle on detail page
            $('#wishlist-detail-btn').on('click', () => {
                const added = WishlistService.toggle(product);
                const $btn = $('#wishlist-detail-btn');
                $btn.css('color', added ? 'var(--danger)' : 'var(--neutral-400)')
                    .html(`<i class="fas fa-heart me-1"></i>${added ? 'Wishlisted' : 'Wishlist'}`);
                Toast.info(added ? `"${product.name}" added to wishlist` : 'Removed from wishlist');
            });
        }

        if (isAdmin) {
            $('#edit-product-btn').on('click', () => {
                ProductAdminModal.openEdit(product);
            });

            $('#delete-product-btn').on('click', async () => {
                if (!confirm(`Delete "${product.name}"?\n\nThis cannot be undone.`)) return;
                const $btn = $('#delete-product-btn')
                    .prop('disabled', true)
                    .html('<i class="fas fa-spinner fa-spin me-2"></i>Deleting...');
                try {
                    await ProductService.deleteProduct(product.id);
                    Toast.success(`"${product.name}" deleted.`);
                    setTimeout(() => window.location.href = '/Product', 800);
                } catch (e) {
                    Toast.error(e.message || 'Failed to delete product.');
                    $btn.prop('disabled', false).html('<i class="fas fa-trash me-2"></i>Delete');
                }
            });
        }
    }
}

$(document).ready(() => {
    const page = new ProductDetailPage();
    page.initialize();
});
