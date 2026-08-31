using Project.Object.Requests;
using Project.Object.Responses;

namespace Project.Application.Service.Defination
{
    public interface IProductService
    {
        Task<ProductResponseModel> AddProduct(ProductRequestModel product);
        Task<GetProductListResponse> GetProductList(GetProductListRequest request);
        Task<ProductResponseModel> GetProductById(int id);
        Task<ProductResponseModel> UpdateProduct(int id, ProductRequestModel product);
        Task DeleteProduct(int id);
    }
}
