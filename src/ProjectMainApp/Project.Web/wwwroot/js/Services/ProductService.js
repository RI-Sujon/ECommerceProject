const ProductService = {
    baseUrl: 'https://localhost:7056/api/product',

    getProductList: async function(request) {
        try {
            const response = await $.ajax({
                url: `${this.baseUrl}/get-product-list`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(request)
            });
            
            if (response.isSuccess) {
                return response.data;
            } else {
                throw new Error(response.errorMessage || 'Failed to get products');
            }
        } catch (error) {
            console.error('Error in getProductList:', error);
            throw error;
        }
    },

    addToCart: async function(request) {
        try {
            const response = await $.ajax({
                url: '/api/cart/add-item-to-cart',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(request)
            });

            if (response.isSuccess) {
                return response.data;
            } else {
                throw new Error(response.errorMessage || 'Failed to add item to cart');
            }
        } catch (error) {
            console.error('Error in addToCart:', error);
            throw error;
        }
    },

    async addProduct(productData) {
        try {
            const response = await $.ajax({
                url: `${this.baseUrl}/add-product`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(productData)
            });
            
            if (response.isSuccess) {
                return response.data;
            } else {
                throw new Error(response.errorMessage || 'Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }
};

// Export the ProductService
window.ProductService = ProductService; 