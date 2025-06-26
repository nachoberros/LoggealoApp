using Loggealo.CommonModel.TimerLogs;

namespace Loggealo.Services.Interfaces
{
    public interface IDriverLogService
    {
        List<DriverTimerLog> GetDriverLogs(int accountId, int userId);
        void AddDriverLog(int accountId, DriverTimerLog log);
    }
}
