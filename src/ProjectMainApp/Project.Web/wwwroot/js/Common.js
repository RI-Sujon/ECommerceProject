const Common = {
    userId: 1012,
    username: "sujon",
    cartItems: [],

    getUserInfo() {
        return {
            userId: this.userId,
            username: this.username
        };
    },
    setCartItems(items) {
        this.cartItems = items;
    },
    getCartItems() {
        return this.cartItems;
    }
};

window.Common = Common; 