using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace HPC_POS.Common.Api
{
    [Route("api/CMS010")]
    public class CMS010Controller : Web.BaseUserController
    {
        public CMS010Controller(
            Web.Models.User.ApplicationUserManager userManager,
            Web.Models.User.ApplicationSignInManager signInManager,
            Web.Models.User.ApplicationRoleManager roleManager,
            Web.Services.CommonDbContext commonDbContext
        ) : base(userManager, signInManager, roleManager, commonDbContext)
        {
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("Initial")]
        public async Task<IActionResult> Initial()
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                await this.BaseLogout();

                result.Data = true;
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] Web.Models.User.UserLoginDo userDo)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                Web.Models.User.LoginUserResultDo res = await this.BaseLogin(userDo);
                if (Utils.CommonUtil.IsNullOrEmpty(res.Error) == false)
                {
                    result.AddMessage(res.Error);

                    if (res.IsPasswordExpired)
                        result.Data = res;
                }
                else
                    result.Data = res;
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] Web.Models.User.UserPasswordDo userDo)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                userDo.LastUpdatePasswordDate = Utils.IOUtil.GetCurrentDateTimeTH;

                Web.Models.User.UpdateUserResultDo res = await this.BaseChangePassword(userDo);
                if (res.Errors.Count > 0)
                {
                    foreach (string err in res.Errors)
                    {
                        result.AddMessage(err);
                    }
                }
                else
                    result.Data = true;
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }
    }
}
