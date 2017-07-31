using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Master.DataSvc.Models
{
    public class SmallMasterDetailsDo
    {
        internal List<SmallMasterDetailsDo> Rows;

        public string MSTCode { get; set; }
         public string  ValueCode { get; set; }
        public string  Description { get; set; }
        public string  Value1 { get; set; }
        public string  Value2 { get; set; }
        public string  Value3 { get; set; }
        public int  Seq { get; set; }
        public bool  FlagDefault { get; set; }
        public bool  FlagActive { get; set; }
        public bool  FlagDelete { get; set; }
        public string  CreateUser { get; set; }
        public DateTime  CreateDate { get; set; }
        public string  UpdateUser { get; set; }
        public DateTime  UpdateDate { get; set; }
        public int TotalRecords { get; internal set; }
    }

    public class SmallMasterDetailResult : Utils.Interfaces.ASearchResultData<SmallMasterDetailsDo>
    {
        public string MSTCode { get; set; }
    }
}
