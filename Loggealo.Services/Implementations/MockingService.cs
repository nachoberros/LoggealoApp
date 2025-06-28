using Loggealo.CommonModel;
using Loggealo.CommonModel.Account;
using Loggealo.CommonModel.TimerLogs;
using Loggealo.CommonModel.Users;
using Loggealo.CommonModel.Users.Enum;
using Loggealo.Services.Interfaces;
using System.Data;

namespace Loggealo.Services.Implementations
{
    public class MockingRepository : IMockingRepository
    {
        private List<Account> _accounts = [];

        public MockingRepository()
        {
            _accounts = [InitializeMockedAccount()];
        }

        public PaginatedResult<DriverTimerLog> GetDriverLogs(int accountId, int userId, int page, int pageSize)
        {
            var skip = (page - 1) * pageSize;
            var logs = _accounts.FirstOrDefault(a => a.Id.Equals(accountId))?.DriverLogs
                .OrderByDescending(x => x.DateStart)
                .Skip(skip)
                .Take(pageSize)
                .ToList();

            var totalCount = _accounts.FirstOrDefault(a => a.Id.Equals(accountId))?.DriverLogs.Count;

            return new PaginatedResult<DriverTimerLog>
            {
                Items = logs ?? [],
                TotalCount = totalCount ?? 0,
                Page = page,
                PageSize = pageSize
            };
        }

        public void AddDriverLog(int accountId, DriverTimerLog log)
        {
            var account = _accounts.FirstOrDefault(a => a.Id.Equals(accountId));
            if (account == null)
            {
                throw new InvalidOperationException("Account was not found");
            }

            log.TimerLogId = GenerateDriverLogId();

            account.DriverLogs.Add(log);
        }

        public Account GetDefaultAccount(string email)
        {
            var account = _accounts.FirstOrDefault(a => a.Users.Any(u => u.Email.ToLowerInvariant().Equals(email.ToLowerInvariant())));
            if (account == null)
            {
                return new Account();
            }

            return account;
        }

        private Account InitializeMockedAccount()
        {
            var users = GetMockedUsers();
            var driverLogs = GetMockedDriverLogs(users);

            var nacho = users.FirstOrDefault(u => u.Name.ToLowerInvariant().Equals("nacho"));
            if (nacho == null)
            {
                throw new InvalidOperationException("Nacho needs to exist");
            }

            return new Account() { Id = 1, Name = "Nachos driver logs accounts", Owner = nacho, Users = users, DriverLogs = driverLogs };
        }

        private List<DriverTimerLog> GetMockedDriverLogs(List<User> users)
        {
            var nacho = users.First(u => u.Name == "Nacho");

            return
            [
                new DriverTimerLog() { UserId = nacho.Id, TimerLogId = 1, DateStart = DateTime.Today.AddHours(10), DateEnd = DateTime.Today.AddHours(11) },
                new DriverTimerLog() { UserId = nacho.Id, TimerLogId = 2, DateStart = DateTime.Today.AddHours(13), DateEnd = DateTime.Today.AddHours(15) }
            ];
        }

        private User GetUser(int? userId)
        {
            if (userId == null)
            {
                throw new ArgumentNullException(nameof(userId), "User ID cannot be null.");
            }

            var user = _accounts.SelectMany(a => a.Users).FirstOrDefault(u => u.Id == userId.Value);
            if (user == null)
            {
                throw new InvalidOperationException($"User with ID {userId} not found.");
            }

            return user;
        }

        private List<User> GetMockedUsers()
        {
            return [new()
            {
                Id = 4,
                Name = "Nacho",
                Email = "andresberros@gmail.com",
                Role = Role.LoggealoAdmin
            }];
        }

        private int GenerateDriverLogId()
        {
            return _accounts.SelectMany(a => a.DriverLogs).Max(l => l.TimerLogId) + 1;
        }
    }
}
