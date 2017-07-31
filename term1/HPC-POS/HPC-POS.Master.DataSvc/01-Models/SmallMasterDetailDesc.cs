using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Master.DataSvc.Models
{
    public class SmallMasterDetailDesc
    {
        //GetSmallMasterAutoComplete
        
        public string Value1DescriptionEN { get; set; }
        public string Value2DescriptionEN { get; set; }
        public string Value3DescriptionEN { get; set; }
        public string Value1DescriptionLC { get; set; }
        public string Value2DescriptionLC { get; set; }        
        public string Value3DescriptionLC { get; set; }

    }

    public class SmallMasterDetailDescResult : Utils.Interfaces.ASearchResultData<SmallMasterDetailDesc>
    {
        public string MSTCode { get; set; }
    }
}
