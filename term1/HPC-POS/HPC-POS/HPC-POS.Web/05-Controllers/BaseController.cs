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
    public abstract class BaseController : Controller
    {
        private readonly Web.Models.User.ApplicationUserManager _userManager;

        public BaseController()
        {

        }
        public BaseController(
            Web.Models.User.ApplicationUserManager userManager
        )
        {
            _userManager = userManager;
        }

        public async Task<bool> BaseIsSystemAdmin()
        {
            if (_userManager != null)
            {
                Models.User.ApplicationUser user = await this.FixTaskAsync(_userManager.GetUserAsync(this.User));
                if (user != null)
                    return user.FlagSystemAdmin;
            }

            return false;
        }
        public async Task<int?> BaseUserGroupID()
        {
            if (_userManager != null)
            {
                Models.User.ApplicationUser user = await this.FixTaskAsync(_userManager.GetUserAsync(this.User));
                if (user != null)
                    return user.GroupID;
            }

            return null;
        }

        public async Task FixTaskAsync(Action function)
        {
            await this.FixTaskAsync(Task.Factory.StartNew(function));
        }
        public async Task FixTaskAsync(Task task)
        {
            CultureInfo currentCulture = System.Threading.Thread.CurrentThread.CurrentCulture;

            try
            {
                await task;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                System.Threading.Thread.CurrentThread.CurrentCulture = currentCulture;
                System.Threading.Thread.CurrentThread.CurrentUICulture = currentCulture;
            }
        }
        public async Task<T> FixTaskAsync<T>(Func<T> function)
        {
            return await this.FixTaskAsync(Task.Factory.StartNew<T>(function));
        }
        public async Task<T> FixTaskAsync<T>(Task<T> task)
        {
            CultureInfo currentCulture = System.Threading.Thread.CurrentThread.CurrentCulture;

            try
            {
                return await task;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                System.Threading.Thread.CurrentThread.CurrentCulture = currentCulture;
                System.Threading.Thread.CurrentThread.CurrentUICulture = currentCulture;
            }
        }
    }
}