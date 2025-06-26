using Loggealo.CommonModel.Users.Enum;

namespace Loggealo.CommonModel.Users
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public Role Role { get; set; }
    }
}
