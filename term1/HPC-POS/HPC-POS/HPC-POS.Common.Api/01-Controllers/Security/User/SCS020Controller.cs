using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace HPC_POS.Common.Api
{
    [Route("api/SCS020")]
    public class SCS020Controller : Web.BaseController
    {
        private readonly Common.DataSvc.Data.CommonSvcDbContext _commonSvcContext;

        public SCS020Controller(
            Web.Models.User.ApplicationUserManager userManager,
            Common.DataSvc.Data.CommonSvcDbContext commonSvcContext
            )
            : base(userManager)
        {
            this._commonSvcContext = commonSvcContext;
        }

        [HttpPost]
        [Route("GetUserList")]
        public async Task<IActionResult> GetUserList([FromBody] Common.DataSvc.Models.UserCriteriaDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                criteria.IncludeSystemAdmin = await this.BaseIsSystemAdmin();

                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._commonSvcContext.GetUserList(criteria);
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
