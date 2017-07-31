using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Master.DataSvc.Models
{
    public class TemplateMenuDo
    {
        public string BrandCode { get; set; }
        public int TemplateID { get; set; }
        public string TemplateName { get; set; }
    }

    public class TemplateMenuSearchDo : Utils.Interfaces.ASearchCriteria
    {
        public string BrandCode { get; set; }
    }

    public class TemplateMenuResultDo : Utils.Interfaces.ASearchResultData<TemplateMenuDo>
    {

    }
}
