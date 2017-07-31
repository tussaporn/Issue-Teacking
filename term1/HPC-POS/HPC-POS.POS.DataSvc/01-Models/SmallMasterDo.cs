using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.POS.DataSvc.Models
{
    public class SmallMasterDo
    {
        public string MSTCode { get; set; }
        public string MSTNameEN { get; set; }
        public string MSTNameLC { get; set; }
        
        public bool FlagEditable { get; set; }
        public bool FlagValue1 { get; set; }
        public bool FlagValue2 { get; set; }
        public bool FlagValue3 { get; set; }

        public string Value1DescriptionEN { get; set; }
        public string Value1DescriptionLC { get; set; }
        public string Value2DescriptionEN { get; set; }
        public string Value2DescriptionLC { get; set; }
        public string Value3DescriptionEN { get; set; }
        public string Value3DescriptionLC { get; set; }

        public bool FlagActive { get; set; }
        public bool FlagDelete { get; set; }

        public System.DateTime CreateDate { get; set; }
        public string CreateUser { get; set; }
        
        
    }
}
