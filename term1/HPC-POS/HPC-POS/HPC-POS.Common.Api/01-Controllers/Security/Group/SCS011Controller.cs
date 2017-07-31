using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace HPC_POS.Common.Api
{
    [Route("api/SCS011")]
    public class SCS011Controller : Web.BaseUserController
    {
        private readonly Common.DataSvc.Data.CommonSvcDbContext _commonSvcContext;

        public SCS011Controller(
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
        [Route("GetUserGroup")]
        public async Task<IActionResult> GetUserGroup([FromBody] Common.DataSvc.Models.UserGroupCriteriaDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return new
                    {
                        Group = this._commonSvcContext.GetUserGroup(criteria),
                        Permissions = this._commonSvcContext.GetUserGroupPermission(criteria)
                    };
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        [HttpPost]
        [Route("GetUserInGroup")]
        public async Task<IActionResult> GetUserInGroup([FromBody] Common.DataSvc.Models.UserGroupCriteriaDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._commonSvcContext.GetUserInGroup(criteria);
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        [HttpPost]
        [Route("CreateUserGroup")]
        public async Task<IActionResult> CreateUserGroup([FromBody] Common.DataSvc.Models.UserGroupDo entity)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                entity.CreateDate = Utils.IOUtil.GetCurrentDateTimeTH;
                entity.CreateUser = this.User.Identity.Name;

                await this.BaseCreateRole();
                object res = await this.FixTaskAsync(() =>
                {
                    if (this._commonSvcContext.GetUserGroup(new DataSvc.Models.UserGroupCriteriaDo()
                    {
                        NameEN = entity.NameEN,
                        NameLC = entity.NameLC
                    }) != null)
                        return null;

                    Common.DataSvc.Models.UserGroupDo newGroup = this._commonSvcContext.CreateUserGroup(entity);
                    if (newGroup != null)
                    {
                        return new
                        {
                            Group = newGroup,
                            Permissions = this._commonSvcContext.GetUserGroupPermission(new Common.DataSvc.Models.UserGroupCriteriaDo()
                            {
                                GroupID = newGroup.GroupID
                            })
                        };
                    }

                    return null;
                });
                if (res == null)
                    result.AddMessage(string.Format(Web.Resources.Message.BCE004, entity.NameEN));
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }
        
        [HttpPost]
        [Route("UpdateUserGroup")]
        public async Task<IActionResult> UpdateUserGroup([FromBody] Common.DataSvc.Models.UserGroupDo entity)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                bool currentUser = (await this.FixTaskAsync(this.BaseUserGroupID())) == entity.GroupID;

                entity.UpdateDate = Utils.IOUtil.GetCurrentDateTimeTH;
                entity.UpdateUser = this.User.Identity.Name;

                await this.BaseCreateRole();
                result.Data = await this.FixTaskAsync(() =>
                {

                    this._commonSvcContext.UpdateUserGroup(entity);

                    Common.DataSvc.Models.UserGroupCriteriaDo criteria = new Common.DataSvc.Models.UserGroupCriteriaDo();
                    criteria.GroupID = entity.GroupID;

                    return new
                    {
                        IsCurrentUser = currentUser,
                        Group = this._commonSvcContext.GetUserGroup(criteria),
                        Permissions = this._commonSvcContext.GetUserGroupPermission(criteria)
                    };
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }
    }
}
