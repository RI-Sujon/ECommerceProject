using Project.Object.Requests;
using Project.Object.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project.Application.Service.Defination
{
    public interface IProductService
    {
        public Task<ProductResponseModel> AddProduct(ProductRequestModel product);
        public Task<GetProductListResponse> GetProductList(GetProductListRequest request);
    }
}
