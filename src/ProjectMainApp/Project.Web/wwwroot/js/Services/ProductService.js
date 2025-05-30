const ProductService = {
    baseUrl: 'https://localhost:7056/api/product',

    async getProductList(request) {
        try {
            const response = await $.ajax({
                url: `${this.baseUrl}/get-product-list`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(request),
                headers: ServiceUtils.getHeaders(),
            });

            if (response.isSuccess) {
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to get products');
            }
        } catch (error) {
            console.error('Error getting products:', error);
            throw error;
        }
    },

    async addProduct(product) {
        try {
            const response = await $.ajax({
                url: `${this.baseUrl}/add-product`,
                method: 'POST',
                contentType: 'application/json',
                headers: ServiceUtils.getHeaders(),
                data: JSON.stringify(product)
            });

            if (response.isSuccess) {
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }
};

// Initialize the service
window.ProductService = ProductService; 