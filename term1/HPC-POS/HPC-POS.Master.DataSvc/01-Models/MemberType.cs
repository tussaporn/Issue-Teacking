using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Master.DataSvc.Models
{
    public class MemberType
    {
        //GetMemberType
        public int MemberTypeID { get; set; }
        public string MemberTypeName { get; set; }
        public string Remark { get; set; }
        public string CreditDiscountType { get; set; }
        public string CreditDiscountTypeName { get; set; }
        public string CashDiscountType { get; set; }
        public string CashDiscountTypeName { get; set; }
        public DateTime StartPeriod { get; set; }
        public DateTime EndPeriod { get; set; }
        public int MemberLifeType { get; set; }
        public decimal? Lifetime { get; set; }
        public bool FlagDelete { get; set; }

        //GetMemberTypeBrandList
        public string BrandCode { get; set; }
    }

    public class MemberTypeResult : Utils.Interfaces.ASearchResultData<MemberType>
    {
       
    }
   
}
