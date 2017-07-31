using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Master.DataSvc.Models
{
    public class ZoneDo
    {
        public int ZoneID { get; set; }
        public int BranchID { get; set; }
        public string ZoneName { get; set; }
        public string Remark { get; set; }
        public int Seq { get; set; }
        public string TablePrefix { get; set; }
        public bool ServiceCharge { get; set; }
        public bool FlagActive { get; set; }
        public bool FlagDefault { get; set; }
        public string GenerateTableFrom { get; set; }
        public string GenerateTableTo { get; set; }
        public int TakeAway { get; set; }
        public string TakeAwayName {get;set;}
        public DateTime CreateDate { get; set; }
        public string CreateUser { get; set; }
        public DateTime UpdateDate { get; set; }
        public string UpdateUser { get; set; }
    }

    public class ZoneSearchDo : Utils.Interfaces.ASearchCriteria
    {
        public string   BranchID { get; set; }
    }

    public class ZoneResultDo : Utils.Interfaces.ASearchResultData<ZoneDo>
    {

    }
}
