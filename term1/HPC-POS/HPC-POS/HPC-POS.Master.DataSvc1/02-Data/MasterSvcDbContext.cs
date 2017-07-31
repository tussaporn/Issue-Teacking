using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;

namespace HPC_POS.Master.DataSvc.Data
{
    public class MasterSvcDbContext : DbContext
    {
        public MasterSvcDbContext(DbContextOptions<MasterSvcDbContext> options)
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

       

        public Models.SmallMasterDo GetSmallMasterDescription(Models.SmallMasterDetailResult criteria)
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_SmallMasterDescription]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    
                    Utils.DBUtil.AddParameter(command, typeof(string), "MSTCode", criteria.MSTCode);

                    List<Models.SmallMasterDo> result = Utils.DBUtil.ToList<Models.SmallMasterDo>(command);
                    if (result != null)
                    {
                        if (result.Count > 0)
                            return result[0];
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
            return null;
        }

        public Models.SmallMasterDetailResult GetSmallMasterDetails(Models.SmallMasterDetailResult criteria)
        {
            Models.SmallMasterDetailResult result = new Models.SmallMasterDetailResult();

            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_SmallMasterDetail]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(string), "MSTCode", criteria.MSTCode);

                    result.Rows = Utils.DBUtil.ToList<Models.SmallMasterDetailsDo>(command);
                    result.TotalRecords = result.Rows.Count;
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

        //-------------------------------------------------Branch---------------------------------------------------
        //----------------------------------------------------------------------------------------------------------
        public List<Models.SmallMasterDetailsDo> GetSmallMasterAutoComplete(Models.SmallMasterDo criteria)// for dropdown autocomplete
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_SmallMasterDetail]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(string), "MSTCode", criteria.MSTCode);

                    return Utils.DBUtil.ToList<Models.SmallMasterDetailsDo>(command);
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

        public Models.BranchDo GetBranchDetails(Models.BranchDo criteria)//get data for edit 
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_Branch]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;


                    Utils.DBUtil.AddParameter(command, typeof(string), "BranchID", criteria.BranchID);
                    Utils.DBUtil.AddParameter(command, typeof(string), "BranchName", criteria.BranchName);

                    List<Models.BranchDo> result = Utils.DBUtil.ToList<Models.BranchDo>(command);
                    if (result != null)
                    {
                        if (result.Count > 0)
                            return result[0];
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
            return null;
        }


        public Models.BranchResultDo GetBranchList(Models.BranchSearchDo criteria) // for search and get data to show in table
        {
            Models.BranchResultDo result = new Models.BranchResultDo();

            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_BranchList]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(string), "BrandCode", criteria.BrandCode);
                    Utils.DBUtil.AddParameter(command, typeof(string), "BranchName", criteria.BranchName);

                    Utils.DBUtil.AddParameter(command, typeof(string), "Sorting", criteria.sorting);
                    Utils.DBUtil.AddParameter(command, typeof(bool), "IsAssending", criteria.isAssending);
                    Utils.DBUtil.AddParameter(command, typeof(int), "OffsetRow", criteria.OffsetRow);
                    Utils.DBUtil.AddParameter(command, typeof(int), "NextRowCount", criteria.NextRowCount);


                    System.Data.SqlClient.SqlParameter output = Utils.DBUtil.AddOutputParameter(command, typeof(int), "TotalRecord");

                    result.Rows = Utils.DBUtil.ToList<Models.BranchDo>(command);
                    if (output != null)
                        result.TotalRecords = (int)output.Value;
                    //result.TotalRecords = result.Rows.Count;
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
        public void DeleteBranch(Models.BranchDo criteria) // for delete function
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Delete_Branch]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(string), "BranchID", criteria.BranchID);
                    Utils.DBUtil.AddParameter(command, typeof(string), "DeleteUser", criteria.UpdateUser);

                    Utils.DBUtil.ToList<Models.BranchDo>(command);
                    return;
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
        //public void InsertBranch(Models.BranchSDo criteria) // for search and get data to show in table
        //{
        //    var conn = this.Database.GetDbConnection();
        //    try
        //    {
        //        conn.Open();

        //        using (var command = conn.CreateCommand())
        //        {
        //            command.CommandText = "[dbo].[sp_Get_BranchList]";
        //            command.CommandType = System.Data.CommandType.StoredProcedure;

        //            Utils.DBUtil.AddParameter(command, typeof(string), "BrandCode", criteria.BrandCode);
        //            Utils.DBUtil.AddParameter(command, typeof(string), "BranchName", criteria.BranchName);
        //            Utils.DBUtil.AddParameter(command, typeof(string), "Sorting", criteria.Sorting);
        //            Utils.DBUtil.AddParameter(command, typeof(string), "IsAssending", criteria.IsAssending);
        //            Utils.DBUtil.AddParameter(command, typeof(string), "OffsetRow", criteria.OffsetRow);
        //            Utils.DBUtil.AddParameter(command, typeof(string), "NextRowCount", criteria.NextRowCount);

        //            return Utils.DBUtil.ToList<Models.BranchDo>(command);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    finally
        //    {
        //        conn.Close();
        //    }
        //}
        //---------------------------------------------------zone---------------------------------------------------------
        //-----------------------------------------------------------------------------------------------------------------
        public Models.ZoneResultDo ZoneList(Models.ZoneSearchDo Criteria)// for dropdown autocomplete Distric
        {
            Models.ZoneResultDo result = new Models.ZoneResultDo();
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_ZoneList]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(string), "BranchID", Criteria.BranchID);

                    result.Rows = Utils.DBUtil.ToList<Models.ZoneDo>(command);
                    result.TotalRecords = result.Rows.Count;
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

        //---------------------------------------------------common--------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------------
        public List<Models.DistrictDo> DistrictAutoComplete(Models.CantonDo Criteria)// for dropdown autocomplete Distric
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_DistrictAutoComplete]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(string), "CantonID", Criteria.CantonID);

                    return Utils.DBUtil.ToList<Models.DistrictDo>(command);
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
        
        public List<Models.CantonDo> CantonAutoComplete(Models.ProvinceDo Criteria)// for dropdown autocomplete Canton
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_CantonAutoComplete]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(string), "ProvinceID", Criteria.ProvinceID);

                    return Utils.DBUtil.ToList<Models.CantonDo>(command);
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
        public List<Models.ProvinceDo> ProvinceAutoComplete()// for dropdown autocomplete province
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_ProvinceAutoComplete]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    return Utils.DBUtil.ToList<Models.ProvinceDo>(command);
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
    
        //-----------------------------------------------------------location code -----------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------------------------------------------------
        public List<Models.LocationCodeDo> LocationCodeAutoComplete()// for dropdown autocomplete province
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_LocationCodeAutoComplete]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    return Utils.DBUtil.ToList<Models.LocationCodeDo>(command);
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
        //----------------------------------------------------------- Template Menu  -----------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------------------------------------------------
        public List<Models.TemplateMenuDo> TemplateMenuAutoComplete(Models.TemplateMenuSearchDo Criteria)// for dropdown autocomplete province
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_TemplateMenuAutoComplete]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;


                    Utils.DBUtil.AddParameter(command, typeof(string), "BrandID", Criteria.BrandCode);

                    return Utils.DBUtil.ToList<Models.TemplateMenuDo>(command);
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
