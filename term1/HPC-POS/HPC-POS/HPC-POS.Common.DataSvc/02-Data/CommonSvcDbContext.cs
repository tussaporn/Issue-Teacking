using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;

namespace HPC_POS.Common.DataSvc.Data
{
    public class CommonSvcDbContext : DbContext
    {
        public CommonSvcDbContext(DbContextOptions<CommonSvcDbContext> options)
            : base(options)
        {
        }

        #region Constant

        public List<Models.ConstantAutoCompleteDo> GetConstantAutoComplete(Models.ConstantAutoCompleteDo criteria)
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_ConstantAutoComplete]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(string), "ConstantCode", criteria.ConstantCode);

                    return Utils.DBUtil.ToList<Models.ConstantAutoCompleteDo>(command);
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

        #endregion
        #region User Group

        public List<Models.UserGroupAutoCompleteDo> GetUserGroupAutoComplete()
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_UserGroupAutoComplete]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    return Utils.DBUtil.ToList<Models.UserGroupAutoCompleteDo>(command);
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

        public Models.UserGroupDo GetUserGroup(Models.UserGroupCriteriaDo criteria)
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_UserGroup]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;


                    Utils.DBUtil.AddParameter(command, typeof(int), "GroupID", criteria.GroupID);
                    Utils.DBUtil.AddParameter(command, typeof(string), "NameEN", criteria.NameEN);
                    Utils.DBUtil.AddParameter(command, typeof(string), "NameLC", criteria.NameLC);

                    List<Models.UserGroupDo> result = Utils.DBUtil.ToList<Models.UserGroupDo>(command);
                    if (result != null)
                    {
                        if (result.Count > 0)
                            return result[0];
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                conn.Close();
            }

            return null;
        }
        public Models.UserInGroupResultDo GetUserInGroup(Models.UserGroupCriteriaDo criteria)
        {
            Models.UserInGroupResultDo result = new Models.UserInGroupResultDo();

            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_UserInGroup]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;


                    Utils.DBUtil.AddParameter(command, typeof(string), "GroupID", criteria.GroupID);

                    result.Rows = Utils.DBUtil.ToList<Models.UserInGroupDo>(command);
                    result.TotalRecords = result.Rows.Count;
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                conn.Close();
            }

            return result;
        }
        public Models.UserGroupFSResultDo GetUserGroupList(Models.UserGroupCriteriaDo criteria)
        {
            Models.UserGroupFSResultDo result = new Models.UserGroupFSResultDo();

            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_UserGroupList]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;


                    Utils.DBUtil.AddParameter(command, typeof(string), "GroupName", criteria.GroupName);
                    Utils.DBUtil.AddParameter(command, typeof(string), "Description", criteria.Description);
                    Utils.DBUtil.AddParameter(command, typeof(string), "UserName", criteria.UserName);
                    Utils.DBUtil.AddParameter(command, typeof(bool), "FlagActive", criteria.FlagActive);
                    Utils.DBUtil.AddParameter(command, typeof(bool), "IncludeSystemAdmin", criteria.IncludeSystemAdmin);

                    Utils.DBUtil.AddParameter(command, typeof(string), "Sorting", criteria.sorting);
                    Utils.DBUtil.AddParameter(command, typeof(bool), "IsAssending", criteria.isAssending);
                    Utils.DBUtil.AddParameter(command, typeof(int), "OffsetRow", criteria.OffsetRow);
                    Utils.DBUtil.AddParameter(command, typeof(int), "NextRowCount", criteria.NextRowCount);

                    System.Data.SqlClient.SqlParameter output = Utils.DBUtil.AddOutputParameter(command, typeof(int), "TotalRecord");

                    result.Rows = Utils.DBUtil.ToList<Models.UserGroupFSDo>(command);

                    if (output != null)
                        result.TotalRecords = (int)output.Value;
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                conn.Close();
            }

            return result;
        }
        public List<Models.ScreenGroupPermissionDo> GetUserGroupPermission(Models.UserGroupCriteriaDo criteria)
        {
            List<Models.ScreenGroupPermissionDo> result = new List<Models.ScreenGroupPermissionDo>();

            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_UserGroupPermission]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(int), "GroupID", criteria.GroupID);

                    List<Models.ScreenPermissionDo> permissions = Utils.DBUtil.ToList<Models.ScreenPermissionDo>(command);
                    foreach (Models.ScreenPermissionDo p in permissions)
                    {
                        if (Utils.CommonUtil.IsNullOrEmpty(p.GroupNameEN)
                            && Utils.CommonUtil.IsNullOrEmpty(p.GroupNameLC))
                        {
                            Models.ScreenGroupPermissionDo grp = new Models.ScreenGroupPermissionDo();
                            grp.Screens = new List<Models.ScreenPermissionDo>();
                            result.Add(grp);

                            grp.Screens.Add(p);
                        }
                        else
                        {
                            Models.ScreenGroupPermissionDo grp = result.Find(x =>
                            x.GroupNameEN == p.GroupNameEN
                            && x.GroupNameLC == p.GroupNameLC);
                            if (grp == null)
                            {
                                grp = new Models.ScreenGroupPermissionDo();
                                grp.GroupNameEN = p.GroupNameEN;
                                grp.GroupNameLC = p.GroupNameLC;
                                grp.GroupImageIcon = p.GroupImageIcon;

                                grp.Screens = new List<Models.ScreenPermissionDo>();
                                result.Add(grp);
                            }

                            grp.Screens.Add(p);
                        }
                    }
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

            return result;
        }

        public Models.UserGroupDo CreateUserGroup(Models.UserGroupDo entity)
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Create_UserGroup]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;


                    Utils.DBUtil.AddParameter(command, typeof(string), "NameEN", entity.NameEN);
                    Utils.DBUtil.AddParameter(command, typeof(string), "NameLC", entity.NameLC);
                    Utils.DBUtil.AddParameter(command, typeof(string), "Description", entity.Description);
                    Utils.DBUtil.AddParameter(command, typeof(decimal), "CashDiscount", entity.CashDiscount);
                    Utils.DBUtil.AddParameter(command, typeof(decimal), "CreditDiscount", entity.CreditDiscount);

                    Utils.DBUtil.AddParameter(command, typeof(bool), "FlagSystemAdmin", entity.FlagSystemAdmin);

                    string userXML = Utils.ConvertUtil.ConvertToXml_Store<Models.UserInGroupDo>(entity.Users);
                    Utils.DBUtil.AddParameter(command, typeof(string), "UserInGroupXML", userXML);

                    string permissionXML = Utils.ConvertUtil.ConvertToXml_Store<Models.UserGroupPermissionDo>(entity.Permissions);
                    Utils.DBUtil.AddParameter(command, typeof(string), "GroupPermissionXML", permissionXML);

                    Utils.DBUtil.AddParameter(command, typeof(DateTime), "CreateDate", entity.CreateDate);
                    Utils.DBUtil.AddParameter(command, typeof(string), "CreateUser", entity.CreateUser);

                    List<Models.UserGroupDo> result = Utils.DBUtil.ToList<Models.UserGroupDo>(command);
                    if (result != null)
                    {
                        if (result.Count > 0)
                            return result[0];
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                conn.Close();
            }

            return null;
        }
        public void UpdateUserGroup(Models.UserGroupDo entity)
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Update_UserGroup]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(int), "GroupID", entity.GroupID);
                    Utils.DBUtil.AddParameter(command, typeof(string), "NameEN", entity.NameEN);
                    Utils.DBUtil.AddParameter(command, typeof(string), "NameLC", entity.NameLC);
                    Utils.DBUtil.AddParameter(command, typeof(string), "Description", entity.Description);
                    Utils.DBUtil.AddParameter(command, typeof(decimal), "CashDiscount", entity.CashDiscount);
                    Utils.DBUtil.AddParameter(command, typeof(decimal), "CreditDiscount", entity.CreditDiscount);
                    Utils.DBUtil.AddParameter(command, typeof(bool), "FlagActive", entity.FlagActive);

                    string userXML = Utils.ConvertUtil.ConvertToXml_Store<Models.UserInGroupDo>(entity.Users);
                    Utils.DBUtil.AddParameter(command, typeof(string), "UserInGroupXML", userXML);

                    string permissionXML = Utils.ConvertUtil.ConvertToXml_Store<Models.UserGroupPermissionDo>(entity.Permissions);
                    Utils.DBUtil.AddParameter(command, typeof(string), "GroupPermissionXML", permissionXML);

                    Utils.DBUtil.AddParameter(command, typeof(DateTime), "UpdateDate", entity.UpdateDate);
                    Utils.DBUtil.AddParameter(command, typeof(string), "UpdateUser", entity.UpdateUser);

                    command.ExecuteScalar();
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                conn.Close();
            }
        }
        public void DeleteUserGroup(Models.UserGroupDo entity)
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Delete_UserGroup]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(int), "GroupID", entity.GroupID);
                    Utils.DBUtil.AddParameter(command, typeof(DateTime), "UpdateDate", entity.UpdateDate);
                    Utils.DBUtil.AddParameter(command, typeof(string), "UpdateUser", entity.UpdateUser);

                    command.ExecuteScalar();
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                conn.Close();
            }
        }

        #endregion
        #region User

        public List<Models.UserAutoCompleteDo> GetUserAutoComplete()
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_UserAutoComplete]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    return Utils.DBUtil.ToList<Models.UserAutoCompleteDo>(command);
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

        public Models.UserDo GetUser(Models.UserCriteriaDo criteria)
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_User]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(string), "UserName", criteria.UserName);

                    List<Models.UserDo> result = Utils.DBUtil.ToList<Models.UserDo>(command);
                    if (result != null)
                    {
                        if (result.Count > 0)
                            return result[0];
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                conn.Close();
            }

            return null;
        }
        public Models.UserFSResultDo GetUserList(Models.UserCriteriaDo criteria)
        {
            Models.UserFSResultDo result = new Models.UserFSResultDo();

            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_UserList]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(string), "UserName", criteria.UserName);
                    Utils.DBUtil.AddParameter(command, typeof(int), "GroupID", criteria.GroupID);
                    Utils.DBUtil.AddParameter(command, typeof(bool), "FlagActive", criteria.FlagActive);
                    Utils.DBUtil.AddParameter(command, typeof(bool), "IncludeSystemAdmin", criteria.IncludeSystemAdmin);

                    Utils.DBUtil.AddParameter(command, typeof(string), "Sorting", criteria.sorting);
                    Utils.DBUtil.AddParameter(command, typeof(bool), "IsAssending", criteria.isAssending);
                    Utils.DBUtil.AddParameter(command, typeof(int), "OffsetRow", criteria.OffsetRow);
                    Utils.DBUtil.AddParameter(command, typeof(int), "NextRowCount", criteria.NextRowCount);

                    System.Data.SqlClient.SqlParameter output = Utils.DBUtil.AddOutputParameter(command, typeof(int), "TotalRecord");

                    result.Rows = Utils.DBUtil.ToList<Models.UserFSDo>(command);

                    if (output != null)
                        result.TotalRecords = (int)output.Value;
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                conn.Close();
            }

            return result;
        }
       
        public List<Models.ScreenGroupPermissionDo> GetUserPermission(Models.UserCriteriaDo criteria)
        {
            List<Models.ScreenGroupPermissionDo> result = new List<Models.ScreenGroupPermissionDo>();

            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_UserPermission]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(string), "UserName", criteria.UserName);
                    Utils.DBUtil.AddParameter(command, typeof(int), "GroupID", criteria.GroupID);

                    List<Models.ScreenPermissionDo> permissions = Utils.DBUtil.ToList<Models.ScreenPermissionDo>(command);
                    foreach (Models.ScreenPermissionDo p in permissions)
                    {
                        if (Utils.CommonUtil.IsNullOrEmpty(p.GroupNameEN)
                            && Utils.CommonUtil.IsNullOrEmpty(p.GroupNameLC))
                        {
                            Models.ScreenGroupPermissionDo grp = new Models.ScreenGroupPermissionDo();
                            grp.Screens = new List<Models.ScreenPermissionDo>();
                            result.Add(grp);

                            grp.Screens.Add(p);
                        }
                        else
                        {
                            Models.ScreenGroupPermissionDo grp = result.Find(x =>
                            x.GroupNameEN == p.GroupNameEN
                            && x.GroupNameLC == p.GroupNameLC);
                            if (grp == null)
                            {
                                grp = new Models.ScreenGroupPermissionDo();
                                grp.GroupNameEN = p.GroupNameEN;
                                grp.GroupNameLC = p.GroupNameLC;
                                grp.GroupImageIcon = p.GroupImageIcon;

                                grp.Screens = new List<Models.ScreenPermissionDo>();
                                result.Add(grp);
                            }

                            grp.Screens.Add(p);
                        }
                    }
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

            return result;
        }

        public string GenerateUserName()
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Generate_UserName]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    return command.ExecuteScalar() as string;
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                conn.Close();
            }
        }
        public void CreateUserInfo(Models.UserDo entity)
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Create_UserInfo]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(string), "UserID", entity.UserID);
                    Utils.DBUtil.AddParameter(command, typeof(string), "FirstName", entity.FirstName);
                    Utils.DBUtil.AddParameter(command, typeof(string), "LastName", entity.LastName);
                    Utils.DBUtil.AddParameter(command, typeof(string), "NickName", entity.NickName);
                    Utils.DBUtil.AddParameter(command, typeof(string), "CitizenID", entity.CitizenID);
                    Utils.DBUtil.AddParameter(command, typeof(DateTime), "BirthDate", entity.BirthDate);
                    Utils.DBUtil.AddParameter(command, typeof(string), "Address", entity.Address);
                    Utils.DBUtil.AddParameter(command, typeof(string), "TelNo", entity.TelNo);
                    Utils.DBUtil.AddParameter(command, typeof(string), "Gender", entity.Gender);
                    Utils.DBUtil.AddParameter(command, typeof(string), "Email", entity.Email);

                    Utils.DBUtil.AddParameter(command, typeof(DateTime), "CreateDate", entity.CreateDate);
                    Utils.DBUtil.AddParameter(command, typeof(string), "CreateUser", entity.CreateUser);

                    command.ExecuteScalar();
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                conn.Close();
            }
        }
        public void UpdateUserInfo(Models.UserDo entity)
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Update_UserInfo]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(string), "UserID", entity.UserID);
                    Utils.DBUtil.AddParameter(command, typeof(string), "FirstName", entity.FirstName);
                    Utils.DBUtil.AddParameter(command, typeof(string), "LastName", entity.LastName);
                    Utils.DBUtil.AddParameter(command, typeof(string), "NickName", entity.NickName);
                    Utils.DBUtil.AddParameter(command, typeof(string), "CitizenID", entity.CitizenID);
                    Utils.DBUtil.AddParameter(command, typeof(DateTime), "BirthDate", entity.BirthDate);
                    Utils.DBUtil.AddParameter(command, typeof(string), "Address", entity.Address);
                    Utils.DBUtil.AddParameter(command, typeof(string), "TelNo", entity.TelNo);
                    Utils.DBUtil.AddParameter(command, typeof(string), "Gender", entity.Gender);
                    Utils.DBUtil.AddParameter(command, typeof(string), "Email", entity.Email);

                    Utils.DBUtil.AddParameter(command, typeof(DateTime), "UpdateDate", entity.UpdateDate);
                    Utils.DBUtil.AddParameter(command, typeof(string), "UpdateUser", entity.UpdateUser);

                    command.ExecuteScalar();
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                conn.Close();
            }
        }

        #endregion
        #region System config

        public List<Models.SystemConfigDo> GetSystemConfig(Models.SystemConfigDo criteria)
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_SystemConfig]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(string), "SystemCategory", criteria.SystemCategory);
                    Utils.DBUtil.AddParameter(command, typeof(string), "SystemCode", criteria.SystemCode);
                    Utils.DBUtil.AddParameter(command, typeof(string), "SystemValue1", criteria.SystemValue1);
                    Utils.DBUtil.AddParameter(command, typeof(string), "SystemValue2", criteria.SystemValue2);

                    return Utils.DBUtil.ToList<Models.SystemConfigDo>(command);
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

        #endregion
        #region Migrate

        public List<Models.MigrateUserDo> MigrateUser()
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_MIGRATE_User]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    return Utils.DBUtil.ToList<Models.MigrateUserDo>(command);
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

        #endregion
    }
}
