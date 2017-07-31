using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Cors;

namespace HPC_POS.POS.Api
{
    [Route("api/POS")]
    public class POSController : Web.BaseController
    {
        private readonly POS.DataSvc.Data.POSSvcDbContext _posSvcContext;

        public POSController(
            POS.DataSvc.Data.POSSvcDbContext posSvcContext
        ) : base()
        {
            this._posSvcContext = posSvcContext;
        }

        [HttpPost]
        [Route("GetSmallMasterAutoComplete")]
        public async Task<IActionResult> GetSmallMasterAutoComplete()
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._posSvcContext.GetSmallMasterAutoComplete();
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
