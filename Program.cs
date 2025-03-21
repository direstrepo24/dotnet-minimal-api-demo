using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Define API endpoints
app.MapGet("/", () => "Hello from Minimal API Demo!");

app.MapGet("/api/info", () => new
{
    Name = "Minimal API Demo",
    Version = "1.0.0",
    Framework = ".NET 10",
    Timestamp = DateTime.UtcNow
});

app.MapGet("/api/env", () =>
{
    var envVars = Environment.GetEnvironmentVariables();
    var safeEnvVars = new Dictionary<string, string>();
    
    foreach (var key in envVars.Keys)
    {
        var keyStr = key.ToString();
        if (!string.IsNullOrEmpty(keyStr) && 
            !keyStr.Contains("SECRET", StringComparison.OrdinalIgnoreCase) && 
            !keyStr.Contains("KEY", StringComparison.OrdinalIgnoreCase) && 
            !keyStr.Contains("TOKEN", StringComparison.OrdinalIgnoreCase) && 
            !keyStr.Contains("PASSWORD", StringComparison.OrdinalIgnoreCase))
        {
            safeEnvVars[keyStr] = envVars[key]?.ToString() ?? "";
        }
    }
    
    return safeEnvVars;
});

app.MapPost("/api/echo", ([FromBody] object data) =>
{
    return Results.Json(data);
});

app.Run();
