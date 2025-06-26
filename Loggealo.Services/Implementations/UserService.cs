using Loggealo.Services.Interfaces;
using Loggealo.CommonModel.Account;
using Loggealo.Services.Interfaces;

namespace Loggealo.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IMockingRepository _mockingRepository;

        public UserService(IMockingRepository mockingRepository) 
        {
            _mockingRepository = mockingRepository;
        }

        public Account GetDefaultAccount(string email)
        {
            return _mockingRepository.GetDefaultAccount(email);
        }
    }
}
