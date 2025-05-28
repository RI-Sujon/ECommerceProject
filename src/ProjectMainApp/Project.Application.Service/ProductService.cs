using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Project.Application.Models;
using Project.Domain.Entities;
using Project.Domain.Interfaces;

namespace Project.Application.Services
{
    public class ProductService
    {
        private readonly IProductProvider _productProvider;

        public ProductService(IProductProvider productProvider)
        {
            _productProvider = productProvider;
        }

        public async Task<GetProductListResponse> GetProductList(GetProductListRequest request)
        {
            var response = new GetProductListResponse
            {
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };

            var query = _productProvider.GetQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.SearchText))
            {
                query = query.Where(p => p.Name.Contains(request.SearchText) || 
                                        p.Description.Contains(request.SearchText));
            }

            if (request.CategoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == request.CategoryId.Value);
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

            // Get total count
            response.TotalCount = await query.CountAsync();

            // Apply pagination
            var products = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(p => new ProductModel
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    CategoryId = p.CategoryId,
                    IsActive = p.IsActive,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                })
                .ToListAsync();

            response.Products = products;
            return response;
        }
    }
} 