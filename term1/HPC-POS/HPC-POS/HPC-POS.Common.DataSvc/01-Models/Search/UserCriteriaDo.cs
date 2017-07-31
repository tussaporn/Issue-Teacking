
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Common.DataSvc.Models
{
    public class UserCriteriaDo : Utils.Interfaces.ASearchCriteria
    {
        public string UserName { get; set; }
        public int? GroupID { get; set; }
        public bool? FlagActive { get; set; }
        public bool IncludeSystemAdmin { get; set; }
    }
}
