using System.Data;
using Project.Core;
using Microsoft.Extensions.DependencyInjection;
using Project.Object.Responses;
using Project.Object.Requests;
using Project.Object.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Project.Application.Provider.Product.Query
{
    public class GetProductListQuery
    {
        private readonly IApplicationContext _applicationContext;
        private readonly AppDbContext _dbContext;

        public GetProductListQuery(IApplicationContext applicationContext, AppDbContext dbContext)
        {
            _applicationContext = applicationContext;
            _dbContext = dbContext;
        }

        public async Task<GetProductListResponse> GetProductList(GetProductListRequest request)
        {
            var query = _dbContext.Products.AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.SearchText))
            {
                query = query.Where(p => p.Name.Contains(request.SearchText) ||
                                        p.Description.Contains(request.SearchText) ||
                                        p.Slug.Contains(request.SearchText));
            }

            if (request.MinPrice.HasValue)
            {
                query = query.Where(p => p.Price >= request.MinPrice.Value);
            }

            if (request.MaxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= request.MaxPrice.Value);
            }

            if (request.IsActive.HasValue)
            {
                query = query.Where(p => p.IsActive == request.IsActive.Value);
            }

            var response = new GetProductListResponse
            {
                Page = request.Page,
                PageSize = request.PageSize,
                TotalCount = await query.CountAsync()
            };

            // Apply descending order by Id
            var products = await query
                .OrderByDescending(p => p.Id)
                .Skip((int)((request.Page - 1) * request.PageSize))
                .Take((int)request.PageSize)
                .Select(p => new ProductResponseModel
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Slug = p.Slug,
                    Price = p.Price,
                    Stock = p.Stock,
                    IsActive = p.IsActive,
                    DiscountStartDate = p.DiscountStartDate,
                    DiscountEndDate = p.DiscountEndDate
                })
                .ToListAsync();

            response.Products = products;
            return response;
        }
    }
} 