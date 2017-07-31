using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;

namespace HPC_POS.Web.Services
{
    public class CommonDbContext : DbContext
    {
        private string ConnectionString { get; set; }

        public CommonDbContext(string connectionString)
        {
            this.ConnectionString = connectionString;
        }
        public CommonDbContext(DbContextOptions<CommonDbContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (this.ConnectionString != null)
                optionsBuilder.UseSqlServer(this.ConnectionString);

            base.OnConfiguring(optionsBuilder);
        }

        public List<Models.ScreenDo> GetScreenList()
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_ScreenList]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    return Utils.DBUtil.ToList<Models.ScreenDo>(command);
                }
            }
            catch
            {

            }
            finally
            {
                conn.Close();
            }

            return null;
        }

        public List<Models.PermissionDo> GetAllGroupPermission()
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "SELECT [ScreenID], [PermissionID] FROM [dbo].[tb_ScreenPermission]";
                    command.CommandType = System.Data.CommandType.Text;

                    return Utils.DBUtil.ToList<Models.PermissionDo>(command);
                }
            }
            catch
            {

            }
            finally
            {
                conn.Close();
            }

            return null;
        }

        public void UpdateUserLoginDate(string id)
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Update_UserLogin]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    command.Parameters.Add(new System.Data.SqlClient.SqlParameter("UserID", id));
                    command.Parameters.Add(new System.Data.SqlClient.SqlParameter("LastLoginDate", Utils.IOUtil.GetCurrentDateTimeTH));

                    command.ExecuteNonQuery();
                }
            }
            catch
            {

            }
            finally
            {
                conn.Close();
            }
        }
        public string GetUserDisplayName(string id)
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_UserDisplayName]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    command.Parameters.Add(new System.Data.SqlClient.SqlParameter("Id", id));

                    return command.ExecuteScalar() as string;
                }
            }
            catch (Exception)
            {

            }
            finally
            {
                conn.Close();
            }

            return null;
        }
        public bool IsUserGroupActive(int? groupID)
        {
            if (groupID != null)
            {
                var conn = this.Database.GetDbConnection();
                try
                {
                    conn.Open();

                    using (var command = conn.CreateCommand())
                    {
                        command.CommandText = "SELECT [FlagActive] FROM [dbo].[tb_UserGroup] WHERE [GroupID] = @GroupID AND [FlagActive] = 1";
                        command.CommandType = System.Data.CommandType.Text;
                        command.Parameters.Add(new System.Data.SqlClient.SqlParameter("GroupID", groupID));

                        var result = command.ExecuteScalar();

                        bool act = false;
                        if (result != null)
                            bool.TryParse(result.ToString(), out act);

                        return act;
                    }
                }
                catch (Exception)
                {

                }
                finally
                {
                    conn.Close();
                }
            }

            return false;
        }
    }
}