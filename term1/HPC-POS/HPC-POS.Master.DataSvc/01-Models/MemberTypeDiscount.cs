using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Master.DataSvc.Models
{
    public class MemberTypeDiscount
    {

        //GetMemberTypeDiscountValueAutocomplete
        public decimal? DiscountValue { get; set; }
        public string DiscountValueText { get; set; }

        //GetMemberTypeList
        public int MemberTypeID { get; set; }
        public string MemberTypeName { get; set; }
        public string BrandList { get; set; }
        public decimal? CreditDiscountValue { get; set; }
        public decimal? CashDiscountValue { get; set; }
        public DateTime CreateDate { get; set; }
        public string CreateUser { get; set; }
        public DateTime UpdateDate { get; set; }
        public string UpdateUser { get; set; }

        //GetMemberType
        //public string Remark { get; set; }
        //public string CreditDiscountType { get; set; }
        //public string CreditDiscountTypeName { get; set; }
        //public string CashDiscountType { get; set; }
        //public string CashDiscountTypeName { get; set; }
        //public DateTime StartPeriod { get; set; }
        //public DateTime EndPeriod { get; set; }
        //public float Lifetime { get; set; }
        //public string FlagDelete { get; set; }

        //GetMemberTypeBrandList
        //public string BrandCode { get; set; }
    }

    public class MemberTypeDiscountResult : Utils.Interfaces.ASearchResultData<MemberTypeDiscount>
    {
       
    }
   
}
