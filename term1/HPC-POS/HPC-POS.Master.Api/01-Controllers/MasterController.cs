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


        #region Constant

        [HttpGet,HttpPost]
        [Route("GetSmallMasterAutoComplete")]
        public async Task<IActionResult> GetSmallMasterAutoComplete()
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._masterSvcContext.GetSmallMasterAutoComplete();
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        [HttpPost]
        [Route("GetSmallMasterDetail")]
        public async Task<IActionResult> GetSmallMasterDetail([FromBody] Master.DataSvc.Models.SmallMasterCriteriaDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
               
                result.Data = await this.FixTaskAsync(() =>
                {
                    
                    return this._masterSvcContext.GetSmallMasterDetail(criteria);
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        [HttpPost]
        [Route("GetSmallMasterDetailDesc")]
        public async Task<IActionResult> GetSmallMasterDetailDesc([FromBody] Master.DataSvc.Models.SmallMasterDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {

                result.Data = await this.FixTaskAsync(() =>
                {

                    return this._masterSvcContext.GetSmallMasterDetailDesc(criteria);
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        [HttpGet,HttpPost]
        [Route("GetMemberTypeDiscount")]
        public async Task<IActionResult> GetMemberTypeDiscount()
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._masterSvcContext.GetMemberTypeDiscount();
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        [HttpPost]
        [Route("GetMSTCodeAutocomplete")]
        public async Task<IActionResult> GetMSTCodeAutocomplete([FromBody] Master.DataSvc.Models.SmallMasterCriteriaDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._masterSvcContext.GetMSTCodeAutocomplete(criteria);
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        [HttpPost]
        [Route("GetMemberList")]
        public async Task<IActionResult> GetMemberList([FromBody] Master.DataSvc.Models.MemberTypeDiscountCriteriaDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
            //    criteria.IncludeSystemAdmin = await this.BaseIsSystemAdmin();

                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._masterSvcContext.GetMemberList(criteria);
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        [HttpPost]
        [Route("DeleteMemberTypeList")]
        public async Task<IActionResult> DeleteMemberTypeList([FromBody] Master.DataSvc.Models.MemberTypeDiscount entity)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                entity.UpdateDate = Utils.IOUtil.GetCurrentDateTimeTH;
                entity.UpdateUser = this.User.Identity.Name;

                result.Data = await this.FixTaskAsync(() =>
                {
                    this._masterSvcContext.DeleteMemberTypeList(entity);
                    return true;
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        
        [HttpPost]
        [Route("GetMemberType")]
        public async Task<IActionResult> GetMemberType([FromBody] Master.DataSvc.Models.MemberTypeCriteriaDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._masterSvcContext.GetMemberType(criteria);
                    

                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }
        #endregion





    }
}
