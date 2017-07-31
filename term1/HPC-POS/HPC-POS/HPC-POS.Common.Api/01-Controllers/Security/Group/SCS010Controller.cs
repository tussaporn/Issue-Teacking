using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace HPC_POS.Common.Api
{
    [Route("api/SCS010")]
    public class SCS010Controller : Web.BaseController
    {
        private readonly Common.DataSvc.Data.CommonSvcDbContext _commonSvcContext;

        public SCS010Controller(
            Web.Models.User.ApplicationUserManager userManager,
            Common.DataSvc.Data.CommonSvcDbContext commonSvcContext
            )
        {
            this._commonSvcContext = commonSvcContext;
        }

        [HttpPost]
        [Route("GetUserGroupList")]
        public async Task<IActionResult> GetUserGroupList([FromBody] Common.DataSvc.Models.UserGroupCriteriaDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                criteria.IncludeSystemAdmin = await this.BaseIsSystemAdmin();

                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._commonSvcContext.GetUserGroupList(criteria);
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        [HttpPost]
        [Route("DeleteUserGroup")]
        public async Task<IActionResult> DeleteUserGroup([FromBody] Common.DataSvc.Models.UserGroupDo entity)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                entity.UpdateDate = Utils.IOUtil.GetCurrentDateTimeTH;
                entity.UpdateUser = this.User.Identity.Name;

                result.Data = await this.FixTaskAsync(() =>
                {
                    this._commonSvcContext.DeleteUserGroup(entity);
                    return true;
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
