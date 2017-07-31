using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Master.DataSvc.Models
{
    public class ProvinceDo
    {                                                
        public int ProvinceID { get; set; }
        public string ProvinceName { get; set; }
    }

    public class CantonDo
    {
        public int ProvinceID { get; set; }
        public int CantonID { get; set; }
        public string CantonName { get; set; }
    }
    public class DistrictDo
    {
        public int CantonID { get; set; }
        public int DistrictID { get; set; }
        public string DistrictName { get; set; }
    }
}
