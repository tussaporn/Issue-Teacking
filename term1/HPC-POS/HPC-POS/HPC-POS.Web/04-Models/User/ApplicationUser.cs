using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http;

namespace HPC_POS.Web.Models.User
{
    public class ApplicationUser : IdentityUser
    {
        public bool FlagFirstLogin { get; set; }
        public bool FlagActive { get; set; }
        public bool FlagSystemAdmin { get; set; }

        public int? GroupID { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public DateTime? LastUpdatePasswordDate { get; set; }
        public int? PasswordAge { get; set; }
        public string Remark { get; set; }
    }

    public class ApplicationUserManager : UserManager<ApplicationUser>
    {
        public ApplicationUserManager(IUserStore<ApplicationUser> store,
                                        IOptions<IdentityOptions> optionsAccessor,
                                        IPasswordHasher<ApplicationUser> passwordHasher,
                                        IEnumerable<IUserValidator<ApplicationUser>> userValidators,
                                        IEnumerable<IPasswordValidator<ApplicationUser>> passwordValidators,
                                        ILookupNormalizer keyNormalizer,
                                        IdentityErrorDescriber errors,
                                        IServiceProvider services, ILogger<UserManager<ApplicationUser>> logger)
            : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
        {
        }
    }
    public class ApplicationSignInManager : SignInManager<ApplicationUser>
    {
        public ApplicationSignInManager(UserManager<ApplicationUser> userManager,
                                        IHttpContextAccessor contextAccessor,
                                        IUserClaimsPrincipalFactory<ApplicationUser> claimsFactory,
                                        IOptions<IdentityOptions> optionsAccessor,
                                        ILogger<SignInManager<ApplicationUser>> logger)
            : base(userManager, contextAccessor, claimsFactory, optionsAccessor, logger)
        {
        }
    }
}