using Project.Application.Provider.Product;
using Project.Application.Service;
using Microsoft.Extensions.DependencyInjection;
using Project.Application.Service.Defination;
using Project.Application.Provider.Product.Command;
using Project.Application.Provider.Product.Query;

namespace Project.Application.Extensions;

public static class ManagersDependencyGroup
{
    public static IServiceCollection AddManagersDependencyGroup(this IServiceCollection services)
    {
        //Services
        services.AddTransient<IProductService, ProductService>();
        
        //Data Providers
        services.AddTransient<IProductProvider, ProductProvider>();

        //Data Command
        services.AddTransient<AddProductCommand>();
        services.AddTransient<GetProductListQuery>();
        
        //Data Query
        
        return services;
    }
}