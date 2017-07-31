using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace HPC_POS.Web.Models.User
{
    public class ApplicationRole : IdentityRole
    {
    }

    public class ApplicationRoleManager : RoleManager<ApplicationRole>
    {
        public ApplicationRoleManager(IRoleStore<ApplicationRole> store,
                                        IEnumerable<IRoleValidator<ApplicationRole>> roleValidators,
                                        ILookupNormalizer keyNormalizer, IdentityErrorDescriber errors,
                                        ILogger<RoleManager<ApplicationRole>> logger, IHttpContextAccessor contextAccessor)
            : base(store, roleValidators, keyNormalizer, errors, logger, contextAccessor)
        {
        }
    }
}
