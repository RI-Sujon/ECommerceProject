using Project.Application.Provider;
using Project.Application.Service;
using Microsoft.Extensions.DependencyInjection;
using Project.Application.Service.Defination;
using Project.Application.Provider.Cart;
using Project.Application.Data.Command;

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
        
        //Data Query
        
        return services;
    }
}