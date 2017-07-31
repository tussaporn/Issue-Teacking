using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Master.DataSvc.Models
{
    public class LocationCodeDo
    {
        public int LOC_CD { get; set; }
        public string LOC_DESC { get; set; }
        public string LOC_D { get; set; }
        
    }

    public class LocationCodeSearchDo : Utils.Interfaces.ASearchCriteria
    {
        public string LOC_CD { get; set; }
    }

    public class LocationCodeResultDo : Utils.Interfaces.ASearchResultData<LocationCodeDo>
    {

    }
}
