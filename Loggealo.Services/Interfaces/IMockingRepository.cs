using Loggealo.CommonModel.Account;
using Loggealo.CommonModel.TimerLogs;

namespace Loggealo.Services.Interfaces
{
    public interface IMockingRepository
    {
        List<DriverTimerLog> GetDriverLogs(int accountId, int userId);
        void AddDriverLog(int accountId, DriverTimerLog log);
        Account GetDefaultAccount(string email);
    }
}
