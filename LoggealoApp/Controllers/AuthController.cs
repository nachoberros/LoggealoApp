using Loggealo.CommonModel.Users.Enum;
using Loggealo.CommonModel.Users;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Loggealo.Services.Interfaces;

namespace LoggealoApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IUserService _userRepository;
        private readonly IConfiguration _configuration;

        public AuthController(IUserService userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (request.Email == "andresberros@gmail.com" && request.Password == "Hot34*jl")
            {
                var user = GetUserByEmail(request.Email);
                if (user != null)
                {
                    var account = _userRepository.GetDefaultAccount(user.Email);
                    var token = GenerateJwtToken(account.Id, user);
                    return Ok(new { token, user });
                }
            }

            return Unauthorized("Invalid username or password");
        }

        private string GenerateJwtToken(int accountId, User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Name, user.Name),
            };

            claims.Add(new Claim("permission", user.Role.ToString()));
            claims.Add(new Claim("accountId", accountId.ToString()));
            claims.Add(new Claim("userId", user.Id.ToString()));

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Issuer"],
                claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private User GetUserByEmail(string email)
        {
            if (email.Equals("andresberros@gmail.com", StringComparison.InvariantCultureIgnoreCase))
            {
                return new User()
                {
                    Id = 4,
                    Name = "Nacho",
                    Email = "andresberros@gmail.com",
                    Role = Role.LoggealoAdmin
                };
            }

            return new User();
        }
    }
}
