using Loggealo.CommonModel.TimerLogs;
using Loggealo.Services.Interfaces;

namespace Loggealo.Services.Implementations
{
    public class DriverLogService : IDriverLogService
    {
        private readonly IMockingRepository _repository;

        public DriverLogService(IMockingRepository repository)
        {
            _repository = repository;
        }

        public List<DriverTimerLog> GetDriverLogs(int accountId, int userId)
        {
            if (accountId < 1 || userId < 1)
                throw new NullReferenceException("AccountId and UserId cannot be null");

            return _repository.GetDriverLogs(accountId, userId);
        }

        public void AddDriverLog(int accountId, DriverTimerLog log)
        {
            if (accountId < 1)
                throw new NullReferenceException("AccountId cannot be null");

            _repository.AddDriverLog(accountId, log);
        }
    }
}
