using Project.Application.Provider.Product;
using Project.Application.Service;
using Microsoft.Extensions.DependencyInjection;
using Project.Application.Service.Defination;
using Project.Application.Provider.Product.Command;
using Project.Application.Provider.Product.Query;
using Project.Application.Provider.Cart;
using Project.Application.Provider.Cart.Command;
using Project.Application.Provider.Cart.Query;

namespace Project.Application.Extensions;

public static class ManagersDependencyGroup
{
    public static IServiceCollection AddManagersDependencyGroup(this IServiceCollection services)
    {
        //Services
        services.AddTransient<IProductService, ProductService>();
        services.AddTransient<ICartService, CartService>();
        
        //Data Providers
        services.AddTransient<IProductProvider, ProductProvider>();
        services.AddTransient<ICartProvider, CartProvider>();

        //Data Command
        services.AddTransient<AddProductCommand>();
        services.AddTransient<GetProductListQuery>();
        services.AddTransient<AddItemToCartCommand>();
        services.AddTransient<RemoveItemFromCartCommand>();
        services.AddTransient<GetCartQuery>();
        
        return services;
    }
}