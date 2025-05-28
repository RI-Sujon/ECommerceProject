using Project.Core.Caching;
using Project.Core.Log;
using Microsoft.Extensions.DependencyInjection;

namespace Project.Core;

public class ApplicationContext  : IApplicationContext
{
    private readonly ICacheProvider _cache;
    private readonly ILogProvider _log;
    private readonly IServiceCollection _services;
    
    public ApplicationContext( ICacheProvider cache, ILogProvider log)
    {
        //_services = services;
        _log = log;
        _cache = cache;
    }

    public ICacheProvider Cache
    {
        get { return _cache; }
    }

    public ILogProvider Log
    {
        get { return _log; }
    }

    public IServiceCollection Services
    {
        get 
        {
            return _services;
        }
    }
}