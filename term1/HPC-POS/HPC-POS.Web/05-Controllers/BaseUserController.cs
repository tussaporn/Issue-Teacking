using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using Microsoft.AspNetCore.Cors;

namespace HPC_POS.Web
{
    //[EnableCors("AllowAllOrigins")]
    public abstract class BaseUserController : BaseController
    {
        private readonly Web.Models.User.ApplicationUserManager _userManager;
        private readonly Web.Models.User.ApplicationSignInManager _signInManager;
        private readonly Web.Models.User.ApplicationRoleManager _roleManager;
        private readonly Web.Services.CommonDbContext _commonDbContext;

        public BaseUserController(
            Web.Models.User.ApplicationUserManager userManager,
            Web.Models.User.ApplicationSignInManager signInManager,
            Web.Models.User.ApplicationRoleManager roleManager,
            Web.Services.CommonDbContext commonDbContext
        ):base(userManager)
        {

            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _commonDbContext = commonDbContext;
        }

        public async Task<Models.User.LoginUserResultDo> BaseLogin(Models.User.UserLoginDo userDo)
        {
            Models.User.LoginUserResultDo result = new Models.User.LoginUserResultDo();
            Models.User.ApplicationUser user = await this.FixTaskAsync(_userManager.FindByNameAsync(userDo.Username));

            if (user == null)
                result.Error = Web.Resources.Message.BCE001;
            else
            {
                bool flagActive = user.FlagActive;
                if (flagActive == true)
                {
                    if (_commonDbContext != null)
                        flagActive = _commonDbContext.IsUserGroupActive(user.GroupID);
                }

                if (flagActive == false)
                    result.Error = Web.Resources.Message.BCE001;
                else
                {
                    var res = await this.FixTaskAsync(_signInManager.PasswordSignInAsync(userDo.Username, userDo.Password, false, false));
                    if (res.Succeeded)
                    {
                        bool isExpired = false;
                        if (user.PasswordAge != null)
                        {
                            if (user.LastUpdatePasswordDate == null)
                                isExpired = true;
                            else
                            {
                                int diff = user.LastUpdatePasswordDate.Value.AddDays(user.PasswordAge.Value).CompareTo(Utils.IOUtil.GetCurrentDateTimeTH);
                                if (diff < 0)
                                    isExpired = true;
                            }
                        }

                        if (isExpired)
                        {
                            result.Error = Web.Resources.Message.BCE010;
                            result.IsPasswordExpired = true;
                        }
                        else
                        {
                            this._commonDbContext.UpdateUserLoginDate(user.Id);

                            result.UserName = user.UserName;
                            result.DisplayName = this._commonDbContext.GetUserDisplayName(user.Id);
                            result.GroupID = user.GroupID;
                        }
                    }
                    else if (res.IsLockedOut)
                        result.Error = string.Format(Web.Resources.Message.BCE002, Utils.Constants.Common.LOGIN_WAITING_TIME);
                    else
                    {
                        int accessFailedCount = await this.FixTaskAsync(_userManager.GetAccessFailedCountAsync(user));
                        int attemptsLeft = Utils.Constants.Common.MAXIMUM_LOGIN_FAIL - accessFailedCount;

                        result.Error = string.Format(Web.Resources.Message.BCE003, attemptsLeft);
                    }
                }
            }

            return result;
        }
        public async Task BaseLogout()
        {
            if (_signInManager != null)
                await this.FixTaskAsync(_signInManager.SignOutAsync());
        }

        public async Task<Models.User.CreateUserResultDo> BaseCreateUser(Models.User.UserDo userDo)
        {
            Models.User.CreateUserResultDo result = new Models.User.CreateUserResultDo();

            Web.Models.User.ApplicationUser exist = await this.FixTaskAsync(_userManager.FindByNameAsync(userDo.Username));
            if (exist != null)
                result.UserExist = true;
            else
            {
                Web.Models.User.ApplicationUser user = new Web.Models.User.ApplicationUser
                {
                    UserName = userDo.Username,
                    GroupID = userDo.GroupID,
                    FlagActive = userDo.FlagActive,
                    FlagSystemAdmin = userDo.FlagSystemAdmin,
                    PasswordAge = userDo.PasswordAge,
                    LastUpdatePasswordDate = userDo.LastUpdatePasswordDate,
                    Remark = userDo.Remark
                };

                var res = await this.FixTaskAsync(_userManager.CreateAsync(user, userDo.Password));
                if (res.Succeeded)
                {
                    user = await this.FixTaskAsync(_userManager.FindByNameAsync(userDo.Username));

                    result.UserID = user.Id;
                    result.UserName = user.UserName;
                }
                else
                {
                    foreach (var error in res.Errors)
                    {
                        result.Errors.Add(error.Description);
                    }
                }
            }

            return result;
        }
        public async Task<Models.User.UpdateUserResultDo> BaseUpdateUser(Models.User.UserDo userDo, string password = null)
        {
            Models.User.UpdateUserResultDo result = new Models.User.UpdateUserResultDo();

            Web.Models.User.ApplicationUser user = await this.FixTaskAsync(_userManager.FindByNameAsync(userDo.Username));
            if (user == null)
                result.UserExist = false;
            else
            {
                result.UserExist = true;

                user.GroupID = userDo.GroupID;
                user.FlagActive = userDo.FlagActive;
                user.FlagSystemAdmin = userDo.FlagSystemAdmin;
                user.PasswordAge = userDo.PasswordAge;

                if (password != null)
                {
                    user.LastUpdatePasswordDate = userDo.LastUpdatePasswordDate;

                    Models.User.UserPasswordValidator<Models.User.ApplicationUser> validator = new Models.User.UserPasswordValidator<Models.User.ApplicationUser>();
                    Microsoft.AspNetCore.Identity.IdentityResult pres = await this.FixTaskAsync(validator.ValidateAsync(_userManager, user, password));
                    if (!pres.Succeeded)
                    {
                        foreach (var error in pres.Errors)
                        {
                            result.Errors.Add(error.Description);
                        }
                    }
                    else
                    {
                        await this.FixTaskAsync(_userManager.RemovePasswordAsync(user));
                        pres = await this.FixTaskAsync(_userManager.AddPasswordAsync(user, password));
                        if (!pres.Succeeded)
                        {
                            foreach (var error in pres.Errors)
                            {
                                result.Errors.Add(error.Description);
                            }
                        }
                    }
                }

                if (result.Errors.Count == 0)
                {
                    var res = await this.FixTaskAsync(_userManager.UpdateAsync(user));
                    if (res.Succeeded)
                        result.UserID = user.Id;
                    else
                    {
                        foreach (var error in res.Errors)
                        {
                            result.Errors.Add(error.Description);
                        }
                    }
                }
            }

            return result;
        }
        public async Task<Models.User.UpdateUserResultDo> BaseChangePassword(Models.User.UserPasswordDo userDo)
        {
            Models.User.UpdateUserResultDo result = new Models.User.UpdateUserResultDo();

            Web.Models.User.ApplicationUser user = await this.FixTaskAsync(_userManager.FindByNameAsync(userDo.Username));
            if (user == null)
                result.UserExist = false;
            else
            {
                result.UserExist = true;

                var res = await this.FixTaskAsync(_userManager.ChangePasswordAsync(user, userDo.OldPassword, userDo.NewPassword));
                if (!res.Succeeded)
                {
                    foreach (var error in res.Errors)
                    {
                        result.Errors.Add(error.Description);
                    }
                }

                if (result.Errors.Count == 0)
                {
                    user.LastUpdatePasswordDate = userDo.LastUpdatePasswordDate;

                    res = await this.FixTaskAsync(_userManager.UpdateAsync(user));
                    if (res.Succeeded)
                        result.UserID = user.Id;
                    else
                    {
                        foreach (var error in res.Errors)
                        {
                            result.Errors.Add(error.Description);
                        }
                    }
                }
            }

            return result;
        }

        public async Task<bool> BaseCreateRole()
        {
            if (_commonDbContext != null)
            {
                List<Web.Models.PermissionDo> permissions = _commonDbContext.GetAllGroupPermission();
                if (permissions != null)
                {
                    foreach (Web.Models.PermissionDo permission in permissions)
                    {
                        if ((await this.FixTaskAsync(_roleManager.FindByNameAsync(permission.PermissionKey))) == null)
                        {
                            Models.User.ApplicationRole role =
                                new Models.User.ApplicationRole();
                            role.Name = permission.PermissionKey;

                            await this.FixTaskAsync(_roleManager.CreateAsync(role));
                        }
                    }
                }
            }

            return true;
        }
    }
}