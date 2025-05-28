using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Boooks.Net.Endpoint.ActionFilters;

public class AddRequiredHeaderParameter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        operation.Parameters ??= new List<OpenApiParameter>();

        var parameters = new List<OpenApiParameter>
        {
            new OpenApiParameter
            {
                Name = "UserId",
                In = ParameterLocation.Header,
                Required = false,
                Schema = new OpenApiSchema
                {
                    Type = "String",
                    Default = new OpenApiString(string.Empty)
                }
            },
            new OpenApiParameter
            {
                Name = "UserName",
                In = ParameterLocation.Header,
                Required = false,
                Schema = new OpenApiSchema
                {
                    Type = "String",
                    Default = new OpenApiString(string.Empty)
                }
            }
        };

        foreach (var parameter in parameters)
        {
            operation.Parameters.Add(parameter);
        }
    }
}
