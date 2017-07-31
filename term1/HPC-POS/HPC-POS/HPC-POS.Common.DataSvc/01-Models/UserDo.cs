
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Common.DataSvc.Models
{
    public partial class UserDo
    {
        public string UserID { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int GroupID { get; set; }

        public string NickName { get; set; }
        public string Gender { get; set; }
        public string CitizenID { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Address { get; set; }
        public string TelNo { get; set; }
        public string Email { get; set; }
        public string Remark { get; set; }

        public DateTime? LastUpdatePasswordDate { get; set; }
        public string Password { get; set; }
        public bool FlagActive { get; set; }
        public bool FlagSystemAdmin { get; set; }

        public DateTime CreateDate { get; set; }
        public string CreateUser { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string UpdateUser { get; set; }
    }
    
    public partial class UserFSDo //User Group for Search.
    {
        public string UserName { get; set; }
        public string Name { get; set; }
        public int GroupID { get; set; }
        public string GroupNameEN { get; set; }
        public string GroupNameLC { get; set; }
        public string NickName { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public bool FlagActive { get; set; }
    }
    public class UserFSResultDo : Utils.Interfaces.ASearchResultData<UserFSDo>
    {

    }
}
