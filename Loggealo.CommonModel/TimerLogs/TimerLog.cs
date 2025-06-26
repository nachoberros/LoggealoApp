namespace Loggealo.CommonModel.TimerLogs
{
    public abstract class TimerLog
    {
        protected TimerLog() { }

        public int TimerLogId { get; set; }
        public DateTime DateStart { get; set; }
        public DateTime DateEnd { get; set; }
        public int UserId { get; set; }
    }
}