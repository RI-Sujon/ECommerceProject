const Common = {
    cartItems: [],

    // ── JWT helpers ──────────────────────────────────────────────────────────
    _parseJwt(token) {
        try {
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        } catch { return null; }
    },

    getToken() {
        return localStorage.getItem('jwt_token');
    },

    saveToken(token) {
        localStorage.setItem('jwt_token', token);
    },

    clearToken() {
        localStorage.removeItem('jwt_token');
    },

    isLoggedIn() {
        const token = this.getToken();
        if (!token) return false;
        const payload = this._parseJwt(token);
        if (!payload) return false;
        // Check expiry (exp is Unix timestamp in seconds)
        return payload.exp * 1000 > Date.now();
    },

    // ── User info ────────────────────────────────────────────────────────────
    getUserInfo() {
        const token = this.getToken();
        if (!token) return { userId: 0, username: '', fullName: '', role: '' };
        const p = this._parseJwt(token);
        // .NET ClaimTypes.Role serialises as this full URI in JWT payloads
        const dotnetRoleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
        return {
            userId: parseInt(p?.sub ?? 0),
            username: p?.email ?? '',
            fullName: p?.fullName ?? '',
            role: p?.[dotnetRoleKey] ?? p?.role ?? ''
        };
    },

    logout() {
        this.clearToken();
        window.location.href = '/Auth/Login';
    },

    // ── Cart state ───────────────────────────────────────────────────────────
    setCartItems(items) { this.cartItems = items; },
    getCartItems() { return this.cartItems; }
};

window.Common = Common; 