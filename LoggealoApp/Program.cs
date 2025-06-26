using Loggealo.Services.Implementations;
using Loggealo.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Add CORS policy to allow React dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactDevServer", policy =>
    {
        policy.WithOrigins("http://localhost:5173")  // React dev server URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IMockingRepository, MockingRepository>();
builder.Services.AddSingleton<IDriverLogService, DriverLogService>();
builder.Services.AddSingleton<IUserService, UserService>();

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("CanLogDriverTime", policy =>
        policy.RequireClaim("permission", "LoggealoAdmin", "Owner", "Admin"));

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseCors("AllowReactDevServer");

app.UseAuthorization();

app.MapControllers();

app.Run();
