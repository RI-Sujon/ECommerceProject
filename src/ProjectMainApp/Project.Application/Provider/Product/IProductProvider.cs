using Project.Object.Requests;
using Project.Object.Responses;

namespace Project.Application.Provider.Product
{
    public interface IProductProvider
    {
        Task<ProductResponseModel> AddProduct(ProductRequestModel product);
        Task<GetProductListResponse> GetProductList(GetProductListRequest request);
        Task<ProductResponseModel> GetProductById(int id);
        Task<ProductResponseModel> UpdateProduct(int id, ProductRequestModel product);
        Task DeleteProduct(int id);
    }
}
