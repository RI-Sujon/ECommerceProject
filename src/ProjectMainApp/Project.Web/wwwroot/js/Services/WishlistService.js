const WishlistService = {
    _key: 'ebazaar_wishlist',

    getAll() {
        try {
            return JSON.parse(localStorage.getItem(this._key) || '[]');
        } catch { return []; }
    },

    add(product) {
        const items = this.getAll();
        if (items.some(i => i.id === product.id)) return false;
        items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl || null,
            slug: product.slug || '',
            addedAt: new Date().toISOString()
        });
        localStorage.setItem(this._key, JSON.stringify(items));
        this._notify();
        return true;
    },

    remove(productId) {
        const items = this.getAll().filter(i => i.id !== productId);
        localStorage.setItem(this._key, JSON.stringify(items));
        this._notify();
    },

    isInWishlist(productId) {
        return this.getAll().some(i => i.id === productId);
    },

    toggle(product) {
        if (this.isInWishlist(product.id)) {
            this.remove(product.id);
            return false;
        } else {
            this.add(product);
            return true;
        }
    },

    count() {
        return this.getAll().length;
    },

    clear() {
        localStorage.removeItem(this._key);
        this._notify();
    },

    _notify() {
        // Update wishlist badge count in header if present
        const $badge = $('.wishlist-count');
        const c = this.count();
        if ($badge.length) {
            $badge.text(c);
            $badge.css('display', c > 0 ? 'flex' : 'none');
        }
    }
};

window.WishlistService = WishlistService;
