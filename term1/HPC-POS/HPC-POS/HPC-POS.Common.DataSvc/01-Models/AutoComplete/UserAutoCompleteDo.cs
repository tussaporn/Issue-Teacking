using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Common.DataSvc.Models
{
    public partial class UserAutoCompleteDo
    {
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool FlagSystemAdmin { get; set; }
    }
}
