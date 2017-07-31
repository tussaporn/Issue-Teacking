using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Master.DataSvc.Models
{
    public class BranchDo
    {                                                
        public int BranchID                          { get; set; }
        public string BrandCode                    { get; set; }
        public string BrandName                     { get; set; }
        public string BranchCode                   { get; set; }
        public string BranchName                   { get; set; }
        public string BranchShortNameEN            { get; set; }
        public string BranchShortNameTH            { get; set; }
        public string LocationCode                 { get; set; }
        public string BranchAddress                    { get; set; }
        public string BillHeader                   { get; set; }
        public int ProvinceID                   { get; set; }
        public int CantonID                     { get; set; }
        public int DistrictID                   { get; set; }
        public string ZipCode                      { get; set; }
        public string TelNo                        { get; set; }
        public string FaxNo                        { get; set; }
        public int TemplateID                        { get; set; }
        public string TaxID                        { get; set; }
        public string TaxBranchCode                { get; set; }
        public decimal ServiceCharge                 { get; set; }
        public bool FlagDelete                        { get; set; }
        public DateTime CreateDate                   { get; set; }
        public string CreateUser                   { get; set; }
        public DateTime UpdateDate { get; set; }
        public string UpdateUser  { get; set; }
        public int BranchSeq { get; set; }
    }

    public class BranchSearchDo : Utils.Interfaces.ASearchCriteria
    {
        public string   BrandCode { get; set; }
        public string   BranchName { get; set; }
    }

    public class BranchResultDo : Utils.Interfaces.ASearchResultData<BranchDo>
    {

    }
}
