using Loggealo.CommonModel.Account;

namespace Loggealo.Services.Interfaces
{
    public interface IUserService
    {
        Account GetDefaultAccount(string email);
    }
}
