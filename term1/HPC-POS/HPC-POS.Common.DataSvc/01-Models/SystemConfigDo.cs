
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Common.DataSvc.Models
{
    public class SystemConfigDo
    {
        public string SystemCategory { get; set; }
        public string SystemCode { get; set; }
        public string SystemValue1 { get; set; }
        public string SystemValue2 { get; set; }
        public int? SortOrder { get; set; }
        public string Remark { get; set; }
    }
}
