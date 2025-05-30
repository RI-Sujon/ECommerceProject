const CartService = {
    baseUrl: 'https://localhost:7056/api/Cart',

    async addItemToCart(productId, quantity) {
        try {
            const response = await $.ajax({
                url: `${this.baseUrl}/add-item-to-cart`,
                method: 'POST',
                contentType: 'application/json',
                headers: ServiceUtils.getHeaders(),
                data: JSON.stringify({
                    productId: productId,
                    quantity: quantity
                })
            });

            if (response.isSuccess) {
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to add item to cart');
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
            throw error;
        }
    },

    async removeItemFromCart(productId) {
        try {
            const response = await $.ajax({
                url: `${this.baseUrl}/remove-item-from-cart/${productId}`,
                method: 'DELETE',
                contentType: 'application/json',
                headers: ServiceUtils.getHeaders()
            });

            if (response.isSuccess) {
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to remove item from cart');
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
            throw error;
        }
    },

    async getCartItems() {
        try {
            const response = await $.ajax({
                url: `${this.baseUrl}/get-cart`,
                method: 'GET',
                headers: ServiceUtils.getHeaders()
            });

            if (response.isSuccess) {
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to get cart items');
            }
        } catch (error) {
            console.error('Error getting cart items:', error);
            throw error;
        }
    }
}

// Initialize the service
window.CartService = CartService; 