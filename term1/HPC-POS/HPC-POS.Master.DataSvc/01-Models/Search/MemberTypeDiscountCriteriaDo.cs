
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Master.DataSvc.Models
{
    public class MemberTypeDiscountCriteriaDo : Utils.Interfaces.ASearchCriteria
    {
        public int MemberTypeID { get; set; }
        public string MemberTypeName { get; set; }
        public decimal? DiscountValue { get; set; }
        public string DiscountType { get; set; }

     //   
    }

    public class MemberTypeCriteriaDo : Utils.Interfaces.ASearchCriteria
    {
        public int MemberTypeID { get; set; }
        public string MemberTypeName { get; set; }
        public string BrandList { get; set; }
        public string Remark { get; set; }
        public decimal? CreditDiscountValue { get; set; }
        public string CreditDiscountType { get; set; }
        public decimal? CashDiscountValue { get; set; }
        public string CashDiscountType { get; set; }
        public DateTime StartPeriod { get; set; }
        public DateTime EndPeriod { get; set; }
        public int MemberLifeType { get; set; }
        public decimal? Lifetime { get; set; }
        public bool FlagDelete { get; set; }
        public DateTime UpdateDate { get; set; }
        public string UpdateUser { get; set; }

    }

}
