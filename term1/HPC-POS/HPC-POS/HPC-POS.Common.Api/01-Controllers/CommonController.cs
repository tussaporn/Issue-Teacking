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

namespace HPC_POS.Common.Api
{
    [Route("api/Common")]
    public class CommonController : Web.BaseUserController
    {
        private readonly Common.DataSvc.Data.CommonSvcDbContext _commonSvcContext;

        public CommonController(
            Web.Models.User.ApplicationUserManager userManager,
            Web.Models.User.ApplicationSignInManager signInManager,
            Web.Models.User.ApplicationRoleManager roleManager,
            Web.Services.CommonDbContext commonDbContext,
            Common.DataSvc.Data.CommonSvcDbContext commonSvcContext
        ) : base(userManager, signInManager, roleManager, commonDbContext)
        {
            this._commonSvcContext = commonSvcContext;
        }

        #region Language

        [HttpGet]
        [AllowAnonymous]
        [Route("SetLanguage")]
        public IActionResult SetLanguage(string culture, string returnUrl)
        {
            Response.Cookies.Append(
                CookieRequestCultureProvider.DefaultCookieName,
                CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture, culture)),
                new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
            );

            //return LocalRedirect(returnUrl);
            return Redirect(returnUrl);
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("GetCurrentLanguage")]
        public IActionResult GetCurrentLanguage()
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = System.Threading.Thread.CurrentThread.CurrentCulture.Name;
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        #endregion
        #region Constant

        [HttpPost]
        [Route("GetConstantAutoComplete")]
        public async Task<IActionResult> GetConstantAutoComplete([FromBody] Common.DataSvc.Models.ConstantAutoCompleteDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._commonSvcContext.GetConstantAutoComplete(criteria);
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        #endregion
        #region User Group

        [HttpPost]
        [Route("GetUserGroupAutoComplete")]
        public async Task<IActionResult> GetUserGroupAutoComplete()
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                bool includeSystemAdmin = await this.BaseIsSystemAdmin();

                result.Data = await this.FixTaskAsync(() =>
                {
                    List<Common.DataSvc.Models.UserGroupAutoCompleteDo> list = this._commonSvcContext.GetUserGroupAutoComplete();
                    return list.FindAll(x => includeSystemAdmin == true || !x.FlagSystemAdmin);
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        #endregion
        #region User

        [HttpPost]
        [AllowAnonymous]
        [Route("IsAuthenticated")]
        public string IsAuthenticated()
        {
            return User.Identity.IsAuthenticated ? this.User.Identity.Name : null;
        }

        [HttpPost]
        [Route("IsUserInRole")]
        public IActionResult IsUserInRole([FromBody] Models.UserInRoleDo role)
        {
            if (role != null)
            {
                foreach (Models.UserInRoleDo.ScreenPermissionDo scn in role.permissions)
                {
                    foreach (Models.UserInRoleDo.ScreenPermissionDo.PermissionDo permission in scn.permissions)
                    {
                        permission.hasPermission =
                            this.User.IsInRole(string.Format("{0}:{1}",
                                scn.screenID, permission.permissionID));
                    }
                }
            }

            Web.Models.ResultData result = new Web.Models.ResultData();
            result.Data = role;

            return new ObjectResult(result);
        }

        [HttpPost]
        [Route("GetUserAutoComplete")]
        public async Task<IActionResult> GetUserAutoComplete()
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                bool includeSystemAdmin = await this.BaseIsSystemAdmin();

                result.Data = await this.FixTaskAsync(() =>
                {
                    List<Common.DataSvc.Models.UserAutoCompleteDo> list = this._commonSvcContext.GetUserAutoComplete();
                    return list.FindAll(x => includeSystemAdmin == true || !x.FlagSystemAdmin);
                });
            }
            catch (Exception ex)
            {
                result.AddMessage(ex);
            }

            return new ObjectResult(result);
        }

        #endregion
        #region Screen

        [HttpPost]
        [Route("GetScreenMenu")]
        public IActionResult GetScreenMenu()
        {
            ClientMenu menu = new ClientMenu()
            {
                path = "s"
            };
            menu.children = new List<ClientMenu>();

            foreach (Web.Models.ScreenDo scn in Web.Config.Screen.SCREEN_LIST)
            {
                if (Utils.CommonUtil.IsNullOrEmpty(scn.Path))
                    continue;
                if (this.User.IsInRole(string.Format("{0}:1", scn.ScreenID)) == false)
                    continue;

                if (Utils.CommonUtil.IsNullOrEmpty(scn.GroupID) == false)
                {
                    ClientMenu smg = null;

                    ClientMenu mg = menu.children.Find(x => x.gid == scn.GroupID);
                    if (mg == null)
                    {
                        mg = new ClientMenu();
                        mg.gid = scn.GroupID;
                        mg.path = "";
                        mg.data = new ClientMenu.ClientMenuData();
                        mg.data.menu.titleEN = scn.GroupNameEN;
                        mg.data.menu.titleLC = scn.GroupNameLC;
                        mg.data.menu.icon = scn.GroupImageIcon;
                        mg.data.menu.order = scn.MenuSequence;
                        mg.children = new List<ClientMenu>();

                        menu.children.Add(mg);
                    }
                    if (Utils.CommonUtil.IsNullOrEmpty(scn.SubGroupID) == false)
                    {
                        if (mg.children == null)
                            mg.children = new List<ClientMenu>();

                        smg = mg.children.Find(x => x.gid == scn.SubGroupID);
                        if (smg == null)
                        {
                            smg = new ClientMenu();
                            smg.gid = scn.SubGroupID;
                            smg.path = "";
                            smg.data = new ClientMenu.ClientMenuData();
                            smg.data.menu.titleEN = scn.SubGroupNameEN;
                            smg.data.menu.titleLC = scn.SubGroupNameLC;
                            smg.data.menu.icon = scn.SubGroupImageIcon;
                            smg.data.menu.order = scn.MenuSequence;
                            smg.children = new List<ClientMenu>();

                            mg.children.Add(smg);
                        }
                    }

                    ClientMenu m = new ClientMenu();
                    m.path = new string[] {
                                    string.Format("/{0}/{1}", menu.path, scn.Path)
                                };
                    m.data = new ClientMenu.ClientMenuData();
                    m.data.menu.titleEN = scn.NameEN;
                    m.data.menu.titleLC = scn.NameLC;
                    m.data.menu.icon = scn.ImageIcon;
                    m.data.menu.order = scn.MenuSequence;
                    m.data.menu.hidden = !scn.FlagMenu;

                    if (smg != null)
                        smg.children.Add(m);
                    else
                        mg.children.Add(m);
                }
                else
                {
                    ClientMenu m = new ClientMenu();
                    m.path = new string[] {
                                    string.Format("/{0}/{1}", menu.path, scn.Path)
                                };
                    m.data = new ClientMenu.ClientMenuData();
                    m.data.menu.titleEN = scn.NameEN;
                    m.data.menu.titleLC = scn.NameLC;
                    m.data.menu.icon = scn.ImageIcon;
                    m.data.menu.order = scn.MenuSequence;
                    m.data.menu.hidden = !scn.FlagMenu;

                    menu.children.Add(m);
                }
            }

            foreach (ClientMenu m in menu.children)
            {
                if (m.children != null)
                {
                    if (m.children.FindAll(x => !x.data.menu.hidden).Count <= 1)
                    {
                        m.path = m.children[0].path;
                        m.data = new ClientMenu.ClientMenuData();
                        m.data.menu.titleEN = m.children[0].data.menu.titleEN;
                        m.data.menu.titleLC = m.children[0].data.menu.titleLC;
                        m.data.menu.icon = m.children[0].data.menu.icon;
                        m.data.menu.order = m.children[0].data.menu.order;
                        m.data.menu.hidden = m.children[0].data.menu.hidden;
                        m.children = null;
                    }
                }
            }

            Web.Models.ResultData result = new Web.Models.ResultData();
            result.Data = new List<ClientMenu>()
            {
                menu
            };

            return new ObjectResult(result);
        }

        private class ClientMenu
        {
            public class ClientMenuData
            {
                public class ClientMenuDataMenu
                {
                    public string titleEN { get; set; }
                    public string titleLC { get; set; }
                    public string icon { get; set; }
                    public bool selected { get; set; }
                    public bool expanded { get; set; }
                    public int order { get; set; }
                    public bool hidden { get; set; }
                }

                public ClientMenuDataMenu menu { get; set; }

                public ClientMenuData()
                {
                    this.menu = new ClientMenuDataMenu();
                }
            }

            public object path { get; set; }
            public ClientMenuData data { get; set; }
            public List<ClientMenu> children { get; set; }

            public int? gid { get; set; }
        }

        #endregion
        #region IO

        [HttpGet]
        [Route("CurrentDateTime")]
        public IActionResult CurrentDateTime(bool flagCutHour = false)
        {
            DateTime currentDate = Utils.IOUtil.GetCurrentDateTimeTH;
            if (flagCutHour == true)
            {
                List<DataSvc.Models.SystemConfigDo> list = this._commonSvcContext.GetSystemConfig(new DataSvc.Models.SystemConfigDo()
                {
                    SystemCategory = "CUT_OFF_HOUR",
                    SystemCode = "1"
                });
                if (list != null)
                {
                    if (list.Count > 0)
                    {
                        if (int.Parse(Utils.ConvertUtil.ConvertToString(currentDate, "HHmm")) < int.Parse(list[0].SystemValue1))
                            currentDate = currentDate.AddDays(-1);
                    }
                }
            }
            currentDate = new DateTime(currentDate.Year, currentDate.Month, currentDate.Day);

            return new ObjectResult(new
            {
                Data = currentDate
            });
        }

        [HttpGet]
        [Route("Download")]
        public FileResult Download([FromQuery] string f)
        {
            System.IO.FileInfo file = null;
            try
            {
                string filePath = System.IO.Path.Combine(Utils.Constants.Common.TEMP_PATH, f);
                if (System.IO.File.Exists(filePath))
                {
                    file = new System.IO.FileInfo(filePath);

                    string contentType = "text/plain";
                    if (file.Extension == ".xlsx")
                        contentType = "application/vnd.ms-excel";
                    else if (file.Extension == ".pdf")
                        contentType = "application/pdf";

                    using (System.IO.FileStream stream = file.OpenRead())
                    {
                        byte[] bytes = new byte[stream.Length];
                        stream.Read(bytes, 0, (int)stream.Length);

                        return File(bytes, contentType, f);
                    }
                }

                return null;
            }
            finally
            {
                if (file != null)
                    file.Delete();
            }
        }

        #endregion
        #region System Config

        [HttpPost]
        [Route("GetSystemConfig")]
        public async Task<IActionResult> GetSystemConfig([FromBody] Common.DataSvc.Models.SystemConfigDo criteria)
        {
            Web.Models.ResultData result = new Web.Models.ResultData();
            try
            {
                result.Data = await this.FixTaskAsync(() =>
                {
                    return this._commonSvcContext.GetSystemConfig(criteria);
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
