using Loggealo.CommonModel;
using Loggealo.CommonModel.TimerLogs;

namespace Loggealo.Services.Interfaces
{
    public interface IDriverLogService
    {
        PaginatedResult<DriverTimerLog> GetPaginatedDriverLogs(int accountId, int userId, int page, int pageSize);
        void AddDriverLog(int accountId, DriverTimerLog log);
    }
}
