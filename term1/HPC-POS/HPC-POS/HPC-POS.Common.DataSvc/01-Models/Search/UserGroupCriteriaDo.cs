using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Common.DataSvc.Models
{
    public class UserGroupCriteriaDo : Utils.Interfaces.ASearchCriteria
    {
        public int? GroupID { get; set; }
        public string GroupName { get; set; }
        public string NameEN { get; set; }
        public string NameLC { get; set; }
        public string Description { get; set; }
        public string UserName { get; set; }
        public bool? FlagActive { get; set; }
        public bool IncludeSystemAdmin { get; set; }
    }
}
