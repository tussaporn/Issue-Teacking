using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace HPC_POS.Common.Api
{
    [Route("api/SCS021")]
    public class SCS021Controller : Web.BaseUserController
    {
        private string FAKE_PASSWORD = "XXXX@1234";

        private readonly Common.DataSvc.Data.CommonSvcDbContext _commonSvcContext;

        public SCS021Controller(
            Web.Models.User.ApplicationUserManager userManager,
            Web.Models.User.ApplicationSignInManager signInManager,
            Web.Models.User.ApplicationRoleManager roleManager,
            Web.Services.CommonDbContext commonDbContext,
            Common.DataSvc.Data.CommonSvcDbContext commonSvcContext
        ) : base(userManager, signInManager, roleManager, commonDbContext)
        {
            this._commonSvcContext = commonSvcContext;
        }

        [HttpPost]
        [Route("GetUser")]
        public async Task<IActionResult> GetUser([FromBody] Common.DataSvc.Models.UserCriteriaDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    DataSvc.Models.UserDo user = this._commonSvcContext.GetUser(criteria);
                    if (user != null)
                    {
                        user.Password = FAKE_PASSWORD;

                        return new
                        {
                            User = user
                        };
                    }
                    else
                    {
                        return new
                        {
                            User = user
                        };
                    }

                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }
        
        [HttpPost]
        [Route("CreateUser")]
        public async Task<IActionResult> CreateUser([FromBody] Common.DataSvc.Models.UserDo entity)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                if (result.HasError == false)
                {
                    Web.Models.User.CreateUserResultDo user = null;
                    for (int loop = 0; loop < 5; loop++)
                    {
                        entity.UserName = _commonSvcContext.GenerateUserName();
                        entity.CreateDate = Utils.IOUtil.GetCurrentDateTimeTH;
                        entity.CreateUser = this.User.Identity.Name;

                        user = await this.BaseCreateUser(new Web.Models.User.UserDo()
                        {
                            Username = entity.UserName,
                            GroupID = entity.GroupID,
                            FlagActive = true,
                            FlagSystemAdmin = false,
                            Password = entity.Password,
                            PasswordAge = null,
                            LastUpdatePasswordDate = entity.CreateDate
                        });

                        if (user.UserExist == false)
                            break;

                        System.Threading.Thread.Sleep(1000);
                    }

                    if (user == null)
                        result.AddMessage(Web.Resources.Message.BCE006);
                    else
                    {
                        if (user.Errors.Count > 0)
                        {
                            foreach (string err in user.Errors)
                            {
                                result.AddMessage(err);
                            }
                        }
                        else
                        {
                            if (Utils.CommonUtil.IsNullOrEmpty(user.UserID))
                                result.AddMessage(Web.Resources.Message.BCE006);
                            else
                            {
                                entity.UserID = user.UserID;

                                Common.DataSvc.Models.UserCriteriaDo criteria = new DataSvc.Models.UserCriteriaDo();
                                criteria.UserName = entity.UserName;

                                result.Data = await this.FixTaskAsync(() =>
                                {
                                    this._commonSvcContext.CreateUserInfo(entity);

                                    DataSvc.Models.UserDo nuser = this._commonSvcContext.GetUser(criteria);
                                    nuser.Password = FAKE_PASSWORD;

                                    return new
                                    {
                                        User = nuser
                                    };
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }
        [HttpPost]
        [Route("UpdateUser")]
        public async Task<IActionResult> UpdateUser([FromBody] Common.DataSvc.Models.UserDo entity)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                bool currentUser = this.User.Identity.Name == entity.UserName;
                bool changePassword = (entity.Password != FAKE_PASSWORD);

                entity.UpdateDate = Utils.IOUtil.GetCurrentDateTimeTH;
                entity.UpdateUser = this.User.Identity.Name;

                Web.Models.User.UpdateUserResultDo res = await this.BaseUpdateUser(new Web.Models.User.UserDo()
                {
                    Username = entity.UserName,
                    GroupID = entity.GroupID,
                    FlagActive = entity.FlagActive,
                    FlagSystemAdmin = false,
                    PasswordAge = null,
                    LastUpdatePasswordDate = entity.UpdateDate
                }, changePassword ? entity.Password : null);

                if (res.Errors.Count > 0)
                {
                    foreach (string err in res.Errors)
                    {
                        result.AddMessage(err);
                    }
                }
                else
                {
                    entity.UserID = res.UserID;

                    Common.DataSvc.Models.UserCriteriaDo criteria = new DataSvc.Models.UserCriteriaDo();
                    criteria.UserName = entity.UserName;

                    result.Data = await this.FixTaskAsync(() =>
                    {
                        this._commonSvcContext.UpdateUserInfo(entity);

                        DataSvc.Models.UserDo nuser = this._commonSvcContext.GetUser(criteria);
                        nuser.Password = FAKE_PASSWORD;

                        return new
                        {
                            IsCurrentUser = currentUser,
                            User = nuser
                        };
                    });
                }
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }
    }
}
