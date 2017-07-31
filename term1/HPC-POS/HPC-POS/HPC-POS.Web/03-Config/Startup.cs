using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

using Microsoft.AspNetCore.Localization;
using System.Globalization;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.Extensions.Options;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Cors.Internal;

namespace HPC_POS.Web.Config
{
    public class Startup
    {
        private const string DBConfig = "DBConnection";
        private const string Constant = "Constant";
        private const string AssemblyModulePrefixFile = "ASMModule:PrefixFile";
        private const string AssemblyModulePrefixName = "ASMModule:PrefixName";
        private const string AssemblyModules = "ASMModule:Modules";
        
        private class AssemblyConfig
        {
            public string PrefixFile { get; set; }
            public string PrefixName { get; set; }
            public List<string> Modules { get; set; }
        }

        public static void InitialConstants(IConfigurationRoot configuration)
        {
            try
            {
                string assemblyName = string.Format("{0}.Utils", configuration.GetValue<string>(AssemblyModulePrefixFile));
                string className = string.Format("{0}.Utils.Constants.Common", configuration.GetValue<string>(AssemblyModulePrefixName));

                Assembly asm = Utils.IOUtil.GetAssembly(assemblyName);
                if (asm == null)
                    return;

                Type type = asm.GetType(className);
                if (type == null)
                    return;

                foreach(System.Reflection.PropertyInfo prop in type.GetProperties())
                {
                    string val = configuration.GetValue<string>(string.Format("{0}:{1}", Constant, prop.Name));
                    if (val != null)
                    {
                        string typeName = prop.PropertyType.FullName;

                        if ("" == val)
                            prop.SetValue(null, null, null);
                        else if (typeName.Contains(typeof(string).Name))
                        {
                            prop.SetValue(null, val, null);
                        }
                        else if (typeName.Contains(typeof(Int16).Name))
                        {
                            prop.SetValue(null, Int16.Parse(val), null);
                        }
                        else if (typeName.Contains(typeof(Int32).Name))
                        {
                            prop.SetValue(null, Int32.Parse(val), null);
                        }
                        else if (typeName.Contains(typeof(Int64).Name))
                        {
                            prop.SetValue(null, Int64.Parse(val), null);
                        }
                        else if (typeName.Contains(typeof(Single).Name))
                        {
                            prop.SetValue(null, Single.Parse(val), null);
                        }
                        else if (typeName.Contains(typeof(Double).Name))
                        {
                            prop.SetValue(null, Double.Parse(val), null);
                        }
                        else if (typeName.Contains(typeof(Decimal).Name))
                        {
                            prop.SetValue(null, Decimal.Parse(val), null);
                        }
                        else if (typeName.Contains(typeof(long).Name))
                        {
                            prop.SetValue(null, long.Parse(val), null);
                        }
                        else if (typeName.Contains(typeof(DateTime).Name))
                        {
                            try
                            {
                                prop.SetValue(null, DateTime.ParseExact(val, "d/m/yyyy", null), null);
                                continue;
                            }
                            catch { }

                            try
                            {
                                prop.SetValue(null, DateTime.ParseExact(val, "yyyy/m/d", null), null);
                                continue;
                            }
                            catch { }

                            prop.SetValue(null, DateTime.Parse(val), null);
                        }
                        else if (typeName.Contains(typeof(Byte).Name))
                        {
                            prop.SetValue(null, Byte.Parse(val), null);
                        }
                        else if (typeName.Contains(typeof(Boolean).Name))
                        {
                            prop.SetValue(null, Boolean.Parse(val), null);
                        }
                    }
                }
            }
            catch
            {

            }
        }

        public static void ConfigureServices(IConfigurationRoot configuration, IServiceCollection services)
        {
            // Add framework services.
            services.AddDbContext<Services.ApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString(DBConfig)));

            services.AddDbContext<Services.CommonDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString(DBConfig)));

            string cookieName = configuration.GetValue<string>(string.Format("{0}:COOKIE_NAME", Constant));
            int cookieTimes = configuration.GetValue<int>(string.Format("{0}:COOKIE_TIMES", Constant));
            double loginWaittingTime = configuration.GetValue<double>(string.Format("{0}:LOGIN_WAITING_TIME", Constant));
            int maxLoginFail = configuration.GetValue<int>(string.Format("{0}:MAXIMUM_LOGIN_FAIL", Constant));
            string localLanguage = configuration.GetValue<string>(string.Format("{0}:LANGUAGE_LC", Constant));
            string defaultLanguage = configuration.GetValue<string>(string.Format("{0}:DEFAULT_LANGUAGE", Constant));
            string defaultDateFormat = configuration.GetValue<string>(string.Format("{0}:DEFAULT_DATE_FORMAT", Constant));
            
            AssemblyConfig asmModule = new AssemblyConfig();
            asmModule.PrefixFile = configuration.GetValue<string>(AssemblyModulePrefixFile);
            asmModule.PrefixName = configuration.GetValue<string>(AssemblyModulePrefixName);
            asmModule.Modules = new List<string>();

            int i = 0;
            string m = configuration.GetValue<string>(string.Format("{0}:{1}", AssemblyModules, i));
            while (m != null)
            {
                asmModule.Modules.Add(m);
                i++;
                m = configuration.GetValue<string>(string.Format("{0}:{1}", AssemblyModules, i));
            }

            foreach (string module in asmModule.Modules)
            {
                System.Reflection.Assembly csvc = Utils.IOUtil.GetAssembly(string.Format("{0}.{1}.DataSvc", asmModule.PrefixFile, module));
                if (csvc != null)
                {
                    Type csvct = csvc.GetType(string.Format("{0}.{1}.DataSvc.Startup", asmModule.PrefixName, module));
                    System.Reflection.MethodInfo csvcmi = csvct.GetMethod("ConfigureServices");
                    if (csvcmi != null)
                    {
                        object o = csvc.CreateInstance(string.Format("{0}.{0}.DataSvc.Startup", asmModule.PrefixName, module));
                        csvcmi.Invoke(o, new object[]
                        {
                            services,
                            configuration.GetConnectionString(DBConfig)
                        });
                    }
                }
            }

            Web.Config.Screen.Initial(configuration.GetConnectionString(DBConfig));

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins",
                    builder =>
                    {
                        builder.AllowAnyMethod()
                               .AllowAnyHeader()
                               .AllowAnyOrigin()
                               .AllowCredentials();

                    });
            });

            services.AddIdentity<Models.User.ApplicationUser, Models.User.ApplicationRole>()
                .AddEntityFrameworkStores<Services.ApplicationDbContext>()
                .AddDefaultTokenProviders()
                .AddUserManager<Models.User.ApplicationUserManager>()
                .AddRoleManager<Models.User.ApplicationRoleManager>()
                .AddSignInManager<Models.User.ApplicationSignInManager>()
                .AddPasswordValidator<Models.User.UserPasswordValidator<Models.User.ApplicationUser>>();


            
            services.Configure<IdentityOptions>(options =>
            {
                // Password settings
                options.Password.RequiredLength = 0;
                options.Password.RequireDigit = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(loginWaittingTime);
                options.Lockout.MaxFailedAccessAttempts = maxLoginFail;

                // Cookie settings
                options.Cookies.ApplicationCookie.CookieName = cookieName;
                options.Cookies.ApplicationCookie.ExpireTimeSpan = TimeSpan.FromDays(cookieTimes);
                options.Cookies.ApplicationCookie.LoginPath = "/";
                options.Cookies.ApplicationCookie.LogoutPath = "/";
                
                // User settings
                options.User.RequireUniqueEmail = false;
            });

            services.AddScoped<Microsoft.AspNetCore.Identity.IUserClaimsPrincipalFactory<Models.User.ApplicationUser>, Models.User.AppClaimsPrincipalFactory>();

            // Add the localization services to the services container
            services.AddLocalization(options => options.ResourcesPath = "Resources");

            IMvcBuilder mvcb = services.AddMvc()
                // Add support for finding localized views, based on file name suffix, e.g. Index.fr.cshtml
                .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)
                // Add support for localizing strings in data annotations (e.g. validation messages) via the
                // IStringLocalizer abstractions.
                .AddDataAnnotationsLocalization()
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
                });

            foreach (string module in asmModule.Modules)
            {
                mvcb.AddApplicationPart(Utils.IOUtil.GetAssembly(string.Format("{0}.{1}.Api", asmModule.PrefixFile, module)));
            }

            services.Configure<MvcOptions>(options =>
            {
                options.Filters.Add(new CorsAuthorizationFilterFactory("AllowAllOrigins"));
            });

            // Add application services.
            services.AddTransient<Services.IEmailSender, Services.AuthMessageSender>();
            services.AddTransient<Services.ISmsSender, Services.AuthMessageSender>();
                        
            // Configure supported cultures and localization options
            services.Configure<RequestLocalizationOptions>(options =>
            {
                var supportedCultures = new[]
                {
                    new CultureInfo("en-US"),
                    new CultureInfo(localLanguage)
                };
                foreach (CultureInfo c in supportedCultures)
                {
                    c.DateTimeFormat.ShortDatePattern = defaultDateFormat;
                }

                // State what the default culture for your application is. This will be used if no specific culture
                // can be determined for a given request.
                options.DefaultRequestCulture = new RequestCulture(culture: defaultLanguage, uiCulture: defaultLanguage);
                
                // You must explicitly state which cultures your application supports.
                // These are the cultures the app supports for formatting numbers, dates, etc.
                options.SupportedCultures = supportedCultures;

                // These are the cultures the app supports for UI strings, i.e. we have localized resources for.
                options.SupportedUICultures = supportedCultures;
            });

            
        }
        public static void Configure(IConfigurationRoot configuration,
                                        IApplicationBuilder app,
                                        IHostingEnvironment env,
                                        ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            var locOptions = app.ApplicationServices.GetService<IOptions<RequestLocalizationOptions>>();
            app.UseRequestLocalization(locOptions.Value);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseCors("AllowAllOrigins");

            app.UseIdentity();
            
            // Add external authentication middleware below. To configure them please see https://go.microsoft.com/fwlink/?LinkID=532715
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });



            string defaultLanguage = configuration.GetValue<string>(string.Format("{0}:DEFAULT_LANGUAGE", Constant));
            CultureInfo defaultCulture = new CultureInfo(defaultLanguage);
            CultureInfo.DefaultThreadCurrentCulture = defaultCulture;
            CultureInfo.DefaultThreadCurrentUICulture = defaultCulture;
        }

        
    }
}