using Microsoft.AspNetCore.Mvc;

namespace LoggealoApp.Controllers
{
    public abstract class LoggealoBaseController : ControllerBase
    {
        protected int? AccountId
        {
            get
            {
                var stringAccountId = User?.Claims.FirstOrDefault(c => c.Type == "accountId")?.Value;
                if (int.TryParse(stringAccountId, out int accountId))
                {
                    return accountId;
                }
                return null;
            }
        }

        protected int? UserId
        {
            get
            {
                var stringUserId = User?.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
                if (int.TryParse(stringUserId, out int userId))
                {
                    return userId;
                }
                return null;
            }
        }
    }
}
