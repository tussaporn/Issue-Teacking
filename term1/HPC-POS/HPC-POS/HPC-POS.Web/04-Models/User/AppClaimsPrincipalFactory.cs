using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Builder;
using System.Security.Claims;

namespace HPC_POS.Web.Models.User
{
    public class AppClaimsPrincipalFactory : UserClaimsPrincipalFactory<ApplicationUser, ApplicationRole>
    {
        private readonly Web.Services.CommonDbContext _commonDbContext;

        public AppClaimsPrincipalFactory(
              UserManager<ApplicationUser> userManager
            , RoleManager<ApplicationRole> roleManager
            , IOptions<IdentityOptions> optionsAccessor
            , Web.Services.CommonDbContext commonDbContext)
        : base(userManager, roleManager, optionsAccessor)
        {
            _commonDbContext = commonDbContext;
        }

        public async override Task<ClaimsPrincipal> CreateAsync(ApplicationUser user)
        {
            var principal = await base.CreateAsync(user);

            ((ClaimsIdentity)principal.Identity).AddClaim(new Claim("FlagFirstLogin", user.FlagFirstLogin.ToString()));
            ((ClaimsIdentity)principal.Identity).AddClaim(new Claim("FlagActive", user.FlagActive.ToString()));
            ((ClaimsIdentity)principal.Identity).AddClaim(new Claim("GroupID", user.GroupID == null ? "" : user.GroupID.ToString()));
            ((ClaimsIdentity)principal.Identity).AddClaim(new Claim("Remark", user.Remark == null ? "" : user.Remark));
            ((ClaimsIdentity)principal.Identity).AddClaim(new Claim("LoginKey", Guid.NewGuid().ToString()));

            return principal;
        }
    }
}