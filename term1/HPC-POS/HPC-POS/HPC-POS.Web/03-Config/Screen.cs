using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;

namespace HPC_POS.Web.Config
{
    public class Screen
    {
        public static List<Models.ScreenDo> SCREEN_LIST { get; set; }

        public static void Initial(string connectionString)
        {
            try
            {
                using (Services.CommonDbContext dbContext = new Services.CommonDbContext(connectionString))
                {
                    Screen.SCREEN_LIST = dbContext.GetScreenList();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
