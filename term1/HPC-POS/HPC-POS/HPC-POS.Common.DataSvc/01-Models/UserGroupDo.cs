using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Common.DataSvc.Models
{
    public partial class UserGroupDo
    {
        public int GroupID { get; set; }
        public string NameEN { get; set; }
        public string NameLC { get; set; }
        public string Description { get; set; }
        public decimal? CashDiscount { get; set; }
        public decimal? CreditDiscount { get; set; }
        public bool FlagSystemAdmin { get; set; }
        public bool FlagActive { get; set; }
        public bool FlagDelete { get; set; }
        public DateTime CreateDate { get; set; }
        public string CreateUser { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string UpdateUser { get; set; }

        public List<UserGroupPermissionDo> Permissions { get; set; }
        public List<UserInGroupDo> Users { get; set; }
    }
    public partial class UserGroupPermissionDo
    {
        public int GroupID { get; set; }
        public string ScreenID { get; set; }
        public int PermissionID { get; set; }
        public DateTime CreateDate { get; set; }
        public string CreateUser { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string UpdateUser { get; set; }
    }

    public partial class UserInGroupDo
    {
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool FlagActive { get; set; }
    }
    public class UserInGroupResultDo : Utils.Interfaces.ASearchResultData<UserInGroupDo>
    {

    }

    public partial class UserGroupFSDo //User Group for Search.
    {
        public int GroupID { get; set; }
        public string NameEN { get; set; }
        public string NameLC { get; set; }
        public string Description { get; set; }
        public bool FlagSystemAdmin { get; set; }
        public bool FlagActive { get; set; }
        public DateTime CreateDate { get; set; }
        public string CreateUser { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string UpdateUser { get; set; }
    }
    public class UserGroupFSResultDo : Utils.Interfaces.ASearchResultData<UserGroupFSDo>
    {

    }
}
