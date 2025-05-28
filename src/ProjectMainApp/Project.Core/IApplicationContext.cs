using Project.Core.Caching;
using Project.Core.Log;
using Microsoft.Extensions.DependencyInjection;

namespace Project.Core;

public interface IApplicationContext
{
    ICacheProvider Cache { get; }
    ILogProvider Log { get; }
    IServiceCollection Services { get; }
}