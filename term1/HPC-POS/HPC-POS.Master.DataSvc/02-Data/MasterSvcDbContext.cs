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

        #region Constant

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

        public Models.SmallMasterResultDo GetSmallMasterDetail(Models.SmallMasterCriteriaDo criteria)
        {
            Models.SmallMasterResultDo result = new Models.SmallMasterResultDo();

            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_SmallMasterDetail]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;


                    Utils.DBUtil.AddParameter(command, typeof(string), "MSTCode", criteria.MSTCode);

                    result.Rows = Utils.DBUtil.ToList<Models.SmallMasterDo>(command);
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


        public Models.SmallMasterDo GetSmallMasterDetailDesc(Models.SmallMasterDo criteria)
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_SmallMasterDetailDesc]";
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

        public List<Models.MemberTypeDiscount> GetMemberTypeDiscount()
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();


                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_MemberTypeDiscountValueAutocomplete]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;


                    return Utils.DBUtil.ToList<Models.MemberTypeDiscount>(command);
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

        public List<Models.SmallMasterDo> GetMSTCodeAutocomplete(Models.SmallMasterCriteriaDo criteria)
        {
            Models.SmallMasterResultDo result = new Models.SmallMasterResultDo();

            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_SmallMasterDetail]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;


                    Utils.DBUtil.AddParameter(command, typeof(string), "MSTCode", criteria.MSTCode);

                    return Utils.DBUtil.ToList<Models.SmallMasterDo>(command);
                    


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

        public Models.MemberTypeDiscountResult GetMemberList(Models.MemberTypeDiscountCriteriaDo criteria)
        {
            Models.MemberTypeDiscountResult result = new Models.MemberTypeDiscountResult();

            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_MemberTypeList]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;


                    Utils.DBUtil.AddParameter(command, typeof(string), "MemberTypeName", criteria.MemberTypeName);
                    Utils.DBUtil.AddParameter(command, typeof(decimal), "DiscountValue", criteria.DiscountValue);
                    Utils.DBUtil.AddParameter(command, typeof(string), "DiscountType", criteria.DiscountType);
                    Utils.DBUtil.AddParameter(command, typeof(string), "Sorting", criteria.sorting);
                    Utils.DBUtil.AddParameter(command, typeof(bool), "IsAssending", criteria.isAssending);
                    Utils.DBUtil.AddParameter(command, typeof(int), "OffsetRow", criteria.OffsetRow);
                    Utils.DBUtil.AddParameter(command, typeof(int), "NextRowCount", criteria.NextRowCount);

                    System.Data.SqlClient.SqlParameter output = Utils.DBUtil.AddOutputParameter(command, typeof(int), "TotalRecord");

                    result.Rows = Utils.DBUtil.ToList<Models.MemberTypeDiscount>(command);

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

        public void DeleteMemberTypeList(Models.MemberTypeDiscount entity)
        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Delete_MemberType]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(int), "MemberTypeID", entity.MemberTypeID);
                    

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

        //Edit

        public Models.MemberTypeDiscountResult UpdateMemberType(Models.MemberTypeDiscountCriteriaDo criteria)
        {
            Models.MemberTypeDiscountResult result = new Models.MemberTypeDiscountResult();

            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_MemberTypeBrandList]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;


                    //Utils.DBUtil.AddParameter(command, typeof(string), "MemberTypeName", criteria.MemberTypeName);
                    //Utils.DBUtil.AddParameter(command, typeof(decimal), "BrandList", criteria.BrandList);
                    //Utils.DBUtil.AddParameter(command, typeof(string), "Remark", criteria.Remark);
                    //Utils.DBUtil.AddParameter(command, typeof(string), "CreditDiscountValue", criteria.CreditDiscountValue);
                    //Utils.DBUtil.AddParameter(command, typeof(bool), "CreditDiscountType", criteria.CreditDiscountType);
                    //Utils.DBUtil.AddParameter(command, typeof(int), "CashDiscountValue", criteria.CashDiscountValue);
                    //Utils.DBUtil.AddParameter(command, typeof(int), "CashDiscountType", criteria.CashDiscountType);
                    //Utils.DBUtil.AddParameter(command, typeof(int), "StartPeriod", criteria.StartPeriod);
                    //Utils.DBUtil.AddParameter(command, typeof(int), "EndPeriod", criteria.EndPeriod);
                    //Utils.DBUtil.AddParameter(command, typeof(int), "MemberLifeType", criteria.MemberLifeType);
                    //Utils.DBUtil.AddParameter(command, typeof(int), "LifeTime", criteria.LifeTime);
                    //Utils.DBUtil.AddParameter(command, typeof(int), "FlagDelete", criteria.FlagDelete);
                    //Utils.DBUtil.AddParameter(command, typeof(int), "UpdateDate", criteria.UpdateDate);
                    //Utils.DBUtil.AddParameter(command, typeof(int), "UpdateUser", criteria.UpdateUser);

                    result.Rows = Utils.DBUtil.ToList<Models.MemberTypeDiscount>(command);

                   


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

        public Models.MemberTypeCriteriaDo GetMemberType(Models.MemberTypeCriteriaDo criteria)

        {
            var conn = this.Database.GetDbConnection();
            try
            {
                conn.Open();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "[dbo].[sp_Get_MemberType]";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    Utils.DBUtil.AddParameter(command, typeof(int), "MemberTypeID", criteria.MemberTypeID);
                    Utils.DBUtil.AddParameter(command, typeof(string), "MemberTypeName", criteria.MemberTypeName);

                    List<Models.MemberTypeCriteriaDo> result =  Utils.DBUtil.ToList<Models.MemberTypeCriteriaDo>(command);
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

        #endregion



    }
}
