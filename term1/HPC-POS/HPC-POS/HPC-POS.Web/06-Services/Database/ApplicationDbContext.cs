using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HPC_POS.Web.Services
{
    public class ApplicationDbContext : IdentityDbContext<Models.User.ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);

            builder.Entity<Models.User.ApplicationUser>().ToTable("tb_User", "dbo");

            builder.Entity<IdentityRole>().ToTable("tb_Role", "dbo");
            builder.Entity<Models.User.ApplicationRole>().ToTable("tb_Role", "dbo");

            builder.Entity<IdentityUserClaim<string>>().ToTable("tb_UserClaim", "dbo");
            builder.Entity<IdentityUserRole<string>>().ToTable("tb_UserRole", "dbo");
            builder.Entity<IdentityUserLogin<string>>().ToTable("tb_UserLogin", "dbo");
            builder.Entity<IdentityUserToken<string>>().ToTable("tb_UserToken", "dbo");
            builder.Entity<IdentityRoleClaim<string>>().ToTable("tb_RoleClaim", "dbo");
        }
    }
}
