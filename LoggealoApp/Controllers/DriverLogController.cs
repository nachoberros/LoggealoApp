using Loggealo.CommonModel.TimerLogs;
using Loggealo.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LoggealoApp.Controllers
{
    [Authorize(Policy = "CanLogDriverTime")]
    [ApiController]
    [Route("api/[controller]")]
    public class DriverLogController : LoggealoBaseController
    {
        private readonly IDriverLogService _driverLogService;
        private readonly ILogger<DriverLogController> _logger;

        public DriverLogController(IDriverLogService driverLogService, ILogger<DriverLogController> logger)
        {
            _driverLogService = driverLogService;
            _logger = logger;
        }

        [HttpGet("list")]
        public IActionResult GetPaginatedLogs([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (AccountId < 1 || UserId < 1) return Unauthorized("Claims not found.");

            return Ok(_driverLogService.GetPaginatedDriverLogs(AccountId ?? 0, UserId ?? 0, page, pageSize));
        }

        [HttpGet("month")]
        public IActionResult GetMonthlyLogList()
        {
            if (AccountId < 1 || UserId < 1) return Unauthorized("Claims not found.");

            DateTime now = DateTime.Now;

            DateTime startDate = new(now.Year, now.Month, 1);
            DateTime endDate = startDate.AddMonths(1).AddDays(-1);

            return Ok(_driverLogService.GetDateRangeLogList(AccountId ?? 0, UserId ?? 0, startDate, endDate));
        }

        [HttpPost]
        public IActionResult AddLog(DriverTimerLog request)
        {
            if (AccountId < 1 || UserId < 1) return Unauthorized("Claims not found.");

            if (request == null || request.DateStart == DateTime.MinValue || request.DateEnd == DateTime.MinValue)
                return BadRequest("Request fields are null");

            request.UserId = UserId ?? 0;

            _driverLogService.AddDriverLog(AccountId ?? 0, request);

            return Ok();
        }
    }
}
