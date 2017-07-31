using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Web.Models.User
{
    public class UserDo
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public int GroupID { get; set; }
        public bool FlagActive { get; set; }
        public bool FlagSystemAdmin { get; set; }
        public string Email { get; set; }
        public int? PasswordAge { get; set; }
        public DateTime? LastUpdatePasswordDate { get; set; }
        public string Remark { get; set; }

        public UserDo()
        {
            this.FlagActive = true;
            this.FlagSystemAdmin = false;
        }
    }
    public class UserLoginDo
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
    public class UserPasswordDo
    {
        public string Username { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public DateTime? LastUpdatePasswordDate { get; set; }
    }

    public class LoginUserResultDo
    {
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public int? GroupID { get; set; }
        public string Error { get; set; }
        public bool IsPasswordExpired { get; set; }
    }
    public class CreateUserResultDo
    {
        public string UserID { get; set; }
        public string UserName { get; set; }
        public List<string> Errors { get; set; }
        public bool UserExist { get; set; }

        public CreateUserResultDo()
        {
            this.Errors = new List<string>();
        }
    }
    public class UpdateUserResultDo
    {
        public string UserID { get; set; }
        public List<string> Errors { get; set; }
        public bool UserExist { get; set; }

        public UpdateUserResultDo()
        {
            this.Errors = new List<string>();
        }
    }
}
