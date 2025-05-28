namespace Project.Core.Caching;

public interface IAsyncCacheProvider
{
    Task<object> GetAsync(string key);
    Task SetAsync(string key, object value, TimeSpan? absoluteExpiration = null);
    Task<bool> ExistsAsync(string key);
    Task RemoveAsync(string key);
    Task ClearAsync();
}