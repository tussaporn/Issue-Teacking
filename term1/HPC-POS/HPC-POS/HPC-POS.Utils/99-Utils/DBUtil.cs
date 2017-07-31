using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Utils
{
    public class DBUtil
    {
        public static void AddParameter(System.Data.Common.DbCommand command, Type type, string name, object value)
        {
            System.Data.SqlClient.SqlParameter param = null;
            if (Utils.CommonUtil.IsNullOrEmpty(value))
            {
                param = new System.Data.SqlClient.SqlParameter(name, type);
                param.Value = DBNull.Value;
            }
            else
                param = new System.Data.SqlClient.SqlParameter(name, value);

            if (param != null)
                command.Parameters.Add(param);
        }
        public static System.Data.SqlClient.SqlParameter AddOutputParameter(System.Data.Common.DbCommand command, Type type, string name)
        {
            System.Data.SqlClient.SqlParameter output = new System.Data.SqlClient.SqlParameter(name, type);

            if (type == typeof(int))
                output.Value = 0;
            else
                output.Value = DBNull.Value;

            output.Direction = System.Data.ParameterDirection.InputOutput;
            command.Parameters.Add(output);

            return output;
        }

        public static List<T> ToList<T>(System.Data.Common.DbCommand command) where T : class
        {
            List<T> result = new List<T>();
            using (System.Data.Common.DbDataReader reader = command.ExecuteReader())
            {
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        T data = MappingData<T>(reader);
                        result.Add(data);
                    }
                }
            }

            return result;
        }
        public static T MappingData<T>(System.Data.Common.DbDataReader reader) where T : class
        {
            T data = System.Activator.CreateInstance<T>();

            Type type = data.GetType();
            for (int colIdx = 0; colIdx < reader.FieldCount; colIdx++)
            {
                if (reader.IsDBNull(colIdx))
                    continue;

                string colName = reader.GetName(colIdx);
                System.Reflection.PropertyInfo prop = type.GetProperty(colName);
                if (prop != null)
                {
                    if (prop.CanWrite != true)
                        continue;
                    if (reader.IsDBNull(colIdx))
                        continue;



                    string typeName = prop.PropertyType.FullName;
                    if (typeName.Contains(typeof(string).Name))
                        prop.SetValue(data, reader.GetString(colIdx), null);
                    else if (typeName.Contains(typeof(int).Name))
                    {
                        int nv = 0;
                        if (int.TryParse(reader.GetValue(colIdx).ToString(), out nv))
                            prop.SetValue(data, nv, null);
                    }
                    else if (typeName.Contains(typeof(decimal).Name))
                    {
                        decimal nv = 0;
                        if (decimal.TryParse(reader.GetValue(colIdx).ToString(), out nv))
                            prop.SetValue(data, nv, null);
                    }
                    else if (typeName.Contains(typeof(bool).Name))
                        prop.SetValue(data, reader.GetBoolean(colIdx), null);
                    else if (typeName.Contains(typeof(DateTime).Name))
                        prop.SetValue(data, reader.GetDateTime(colIdx), null);
                }
            }

            return data;
        }
    }
}