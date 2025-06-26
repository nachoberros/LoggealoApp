using Loggealo.CommonModel.TimerLogs;
using Loggealo.CommonModel.Users;

namespace Loggealo.CommonModel.Account
{
    public class Account
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public User Owner { get; set; }
        public List<User> Users { get; set; }
        public List<DriverTimerLog> DriverLogs { get; set; }
    }
}
