using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Common.DataSvc.Models
{
    public partial class UserGroupAutoCompleteDo
    {
        public int GroupID { get; set; }
        public string NameEN { get; set; }
        public string NameLC { get; set; }
        public bool FlagSystemAdmin { get; set; }
    }
}
