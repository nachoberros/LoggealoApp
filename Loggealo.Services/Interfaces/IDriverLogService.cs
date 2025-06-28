using Loggealo.CommonModel;
using Loggealo.CommonModel.TimerLogs;

namespace Loggealo.Services.Interfaces
{
    public interface IDriverLogService
    {
        PaginatedResult<DriverTimerLog> GetPaginatedDriverLogs(int accountId, int userId, int page, int pageSize);
        List<DriverTimerLog> GetDateRangeLogList(int accountId, int userId, DateTime start, DateTime end);
        void AddDriverLog(int accountId, DriverTimerLog log);
    }
}
