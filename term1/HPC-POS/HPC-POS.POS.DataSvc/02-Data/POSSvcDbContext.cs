using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;

namespace HPC_POS.POS.DataSvc.Data
{
    public class POSSvcDbContext : DbContext
    {
        public POSSvcDbContext(DbContextOptions<POSSvcDbContext> options)
            : base(options)
        {
        }

        public List<Models.SmallMasterDo> GetSmallMasterAutoComplete()
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_SmallMasterAutoComplete]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    return Utils.DBUtil.ToList<Models.SmallMasterDo>(command);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                conn.Close();
            }
        }
    }
}
