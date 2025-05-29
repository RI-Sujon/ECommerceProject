class ProductHomePage {
    constructor() {
        this.productContainer = $('#product-container');
        this.productsPerRow = 4;
        this.currentPage = 1;
        this.pageSize = 8;
        this.totalCount = 0;
        this.pageSizeOptions = [8, 16, 24, 32];
    }

    async initialize() {
        try {
            const request = {
                page: this.currentPage,
                pageSize: this.pageSize,
                searchText: '',
                minPrice: null,
                maxPrice: null
            };
            const result = await ProductService.getProductList(request);
            this.totalCount = result.totalCount;
            this.renderProducts(result.products, result.page, result.totalCount);
        } catch (error) {
            console.error('Error initializing product page:', error);
            this.showError('Failed to load products. Please try again later.');
        }
    }

    async changePage(newPage) {
        if (newPage < 1 || newPage > this.getTotalPages()) return;
        
        this.currentPage = newPage;
        await this.fetchAndRenderProducts();
    }

    async changePageSize(newSize) {
        this.pageSize = newSize;
        this.currentPage = 1; // Reset to first page when changing page size
        await this.fetchAndRenderProducts();
    }

    async fetchAndRenderProducts() {
        try {
            const request = {
                page: this.currentPage,
                pageSize: this.pageSize,
                searchText: '',
                minPrice: null,
                maxPrice: null
            };
            const result = await ProductService.getProductList(request);
            this.renderProducts(result.products, result.page, result.totalCount);
        } catch (error) {
            console.error('Error fetching products:', error);
            this.showError('Failed to load products. Please try again later.');
        }
    }

    getTotalPages() {
        return Math.ceil(this.totalCount / this.pageSize);
    }

    renderProducts(products, pageNumber, totalCount) {
        if (!this.productContainer.length) {
            console.error('Product container not found');
            return;
        }

        // Clear existing content
        this.productContainer.empty();

        var startItemNo = ((pageNumber - 1) * this.pageSize) + 1;
        var endItemNo = startItemNo + products.length - 1;
        if (totalCount < endItemNo) {
            endItemNo = totalCount;
        }

        var headInfo = '<div class="px-5 py-2"><h5>Showing ' + startItemNo + '-' + endItemNo + ' of ' + totalCount + ' results</h5></div>';

        this.productContainer.append(headInfo);

        // Create rows of products
        for (let i = 0; i < products.length; i += this.productsPerRow) {
            const $row = $('<div class="px-5">').addClass('row');

            // Add products to the row
            const rowProducts = products.slice(i, i + this.productsPerRow);
            rowProducts.forEach(product => {
                const itemCard = new ItemCard(product);
                $row.append(itemCard.createCard());
            });

            this.productContainer.append($row);
        }

        // Add pagination controls
        this.renderPagination();
    }

    renderPagination() {
        const totalPages = this.getTotalPages();
        //if (totalPages <= 1) return;

        const $paginationContainer = $('<div class="d-flex justify-content-end align-items-center px-5 py-3">');
        
        // Page size selector
        const $pageSizeContainer = $('<div class="d-flex align-items-center gap-2 px-2">');
        const $pageSizeSelect = $('<select class="form-select form-select-sm" style="width: 120px; text-align: center">');
        
        this.pageSizeOptions.forEach(size => {
            const $option = $('<option>')
                .val(size)
                .text(size + " per page")
                .prop('selected', size === this.pageSize);
            $pageSizeSelect.append($option);
        });

        $pageSizeSelect.on('change', (e) => this.changePageSize(parseInt(e.target.value)));
        $pageSizeContainer.append($pageSizeSelect);

        // Pagination controls
        const $pagination = $('<nav>').attr('aria-label', 'Product pagination');
        const $paginationList = $('<ul class="pagination mb-0">');

        // Previous button
        const $prevLi = $('<li class="page-item">').addClass(this.currentPage === 1 ? 'disabled' : '');
        const $prevButton = $('<button class="page-link">')
            .html('<i class="fas fa-arrow-left me-1"></i> Prev')
            .on('click', () => this.changePage(this.currentPage - 1));
        $prevLi.append($prevButton);
        $paginationList.append($prevLi);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const $pageLi = $('<li class="page-item">').addClass(i === this.currentPage ? 'active' : '');
            const $pageButton = $('<button class="page-link">')
                .text(i)
                .on('click', () => this.changePage(i));
            $pageLi.append($pageButton);
            $paginationList.append($pageLi);
        }

        // Next button
        const $nextLi = $('<li class="page-item">').addClass(this.currentPage === totalPages ? 'disabled' : '');
        const $nextButton = $('<button class="page-link">')
            .html('Next <i class="fas fa-arrow-right ms-1"></i>')
            .on('click', () => this.changePage(this.currentPage + 1));
        $nextLi.append($nextButton);
        $paginationList.append($nextLi);

        $pagination.append($paginationList);
        $paginationContainer.append($pagination, $pageSizeContainer);
        this.productContainer.append($paginationContainer);
    }

    showError(message) {
        if (this.productContainer.length) {
            this.productContainer.html(`
                <div class="alert alert-danger" role="alert">
                    ${message}
                </div>
            `);
        }
    }
}

// Initialize the page when the DOM is loaded
$(document).ready(() => {
    const productPage = new ProductHomePage();
    productPage.initialize();

    // Add Product Form Handler
    $('#saveProductBtn').on('click', async function() {
        const productData = {
            name: $('#productName').val(),
            slug: $('#productSlug').val(),
            price: parseFloat($('#productPrice').val()),
            discountStartDate: $('#discountStart').val() ? new Date($('#discountStart').val()).toISOString() : null,
            discountEndDate: $('#discountEnd').val() ? new Date($('#discountEnd').val()).toISOString() : null
        };

        try {
            await ProductService.addProduct(productData);
            $('#addProductModal').modal('hide');
            $('#addProductForm')[0].reset();
            // Refresh the product list
            productPage.initialize();
            
        } catch (error) {
            alert('Error adding product. Please try again.');
            console.error('Error:', error);
        }
    });
}); 