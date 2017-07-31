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

namespace HPC_POS.Master.Api
{
    [Route("api/Master")]
    public class MasterController : Web.BaseController
    {
        private readonly Master.DataSvc.Data.MasterSvcDbContext _masterSvcContext;

        public MasterController(
            Master.DataSvc.Data.MasterSvcDbContext masterSvcContext
        ) : base()
        {
            this._masterSvcContext = masterSvcContext;
        }
        

        [HttpPost]
        [Route("GetSmallMasterDetails")]
        public async Task<IActionResult> GetSmallMasterDetails([FromBody] Master.DataSvc.Models.SmallMasterDetailResult criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._masterSvcContext.GetSmallMasterDetails(criteria);
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        [HttpPost]
        [Route("GetSmallMasterDescription")]
        public async Task<IActionResult> GetSmallMasterDescription([FromBody] Master.DataSvc.Models.SmallMasterDetailResult criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._masterSvcContext.GetSmallMasterDescription(criteria);
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        
        [Route("GetSmallMasterAutoComplete")]
        public async Task<IActionResult> GetSmallMasterAutoComplete([FromBody] Master.DataSvc.Models.SmallMasterDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._masterSvcContext.GetSmallMasterAutoComplete(criteria);
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        [Route("GetBranchList")]
        public async Task<IActionResult> GetBranchList([FromBody] Master.DataSvc.Models.BranchSearchDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._masterSvcContext.GetBranchList(criteria);
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        [HttpPost]
        [Route("DeleteBranch")]
        public async Task<IActionResult> DeleteUserGroup([FromBody] Master.DataSvc.Models.BranchDo entity)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                entity.UpdateDate = Utils.IOUtil.GetCurrentDateTimeTH;
                entity.UpdateUser = this.User.Identity.Name;

                result.Data = await this.FixTaskAsync(() =>
                {
                    this._masterSvcContext.DeleteBranch(entity);
                    return true;
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }


        [Route("GetBranchDetails")]
        public async Task<IActionResult> GetBranchDetails([FromBody] Master.DataSvc.Models.BranchDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._masterSvcContext.GetBranchDetails(criteria);
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        //-------------------------------------------------- Common --------------------------------------------------
        [Route("GetProvinceAutoComplete")]
        public async Task<IActionResult> ProvinceAutoComplete()
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._masterSvcContext.ProvinceAutoComplete();
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }
        [Route("GetCantonAutoComplete")]
        public async Task<IActionResult> CantonAutoComplete([FromBody] Master.DataSvc.Models.ProvinceDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._masterSvcContext.CantonAutoComplete(criteria);
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }
        [Route("GetDistrictAutoComplete")]
        public async Task<IActionResult> DistrictAutoComplete([FromBody] Master.DataSvc.Models.CantonDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._masterSvcContext.DistrictAutoComplete(criteria);
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }







        //----------------------------zone----------------------------------------------------
        [Route("GetZoneList")]
        public async Task<IActionResult> ZoneList([FromBody] Master.DataSvc.Models.ZoneSearchDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._masterSvcContext.ZoneList(criteria);
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }


        //----------------------------Location Code----------------------------------------------------
        [Route("LocationCodeAutoComplete")]
        public async Task<IActionResult> LocationCodeAutoComplete()
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._masterSvcContext.LocationCodeAutoComplete();
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }


        //----------------------------Template Menu----------------------------------------------------
        [Route("TemplateMenuAutoComplete")]
        public async Task<IActionResult> TemplateMenuAutoComplete([FromBody] Master.DataSvc.Models.TemplateMenuSearchDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._masterSvcContext.TemplateMenuAutoComplete(criteria);
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
