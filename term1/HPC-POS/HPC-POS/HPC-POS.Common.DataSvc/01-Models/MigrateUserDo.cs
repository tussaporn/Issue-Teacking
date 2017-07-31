using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Common.DataSvc.Models
{
    public partial class MigrateUserDo
    {
        public string Email { get; set; }
        public bool FlagActive { get; set; }
        public int GroupID { get; set; }
        public string NormalizedUserName { get; set; }
        public int PasswordAge { get; set; }
        public string PhoneNumber { get; set; }
        public string Remark { get; set; }
        public string UserName { get; set; }
    }
}
