using Loggealo.CommonModel;
using Loggealo.CommonModel.Account;
using Loggealo.CommonModel.TimerLogs;

namespace Loggealo.Services.Interfaces
{
    public interface IMockingRepository
    {
        PaginatedResult<DriverTimerLog> GetDriverLogs(int accountId, int userId, int page, int pageSize);
        void AddDriverLog(int accountId, DriverTimerLog log);
        Account GetDefaultAccount(string email);
    }
}
