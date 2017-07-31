using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace HPC_POS.Utils
{
    public class ConvertUtil
    {
        public static string ConvertToString(object obj, string format = null)
        {
            string result = "";
            try
            {
                object _obj = obj;
                string _format = "{0}";
                IFormatProvider _provider = null;

                if (_obj != null)
                {
                    Type type = obj.GetType();

                    if (type.IsEnum)
                    {
                        MemberInfo[] members = type.GetMember(_obj.ToString());
                        if (members != null)
                        {
                            if (members.Length > 0)
                            {
                                object[] attrs = members[0].GetCustomAttributes(true);
                                if (attrs != null)
                                {
                                    foreach (object attr in attrs)
                                    {
                                        if (attr is DescriptionAttribute)
                                        {
                                            _obj = ((DescriptionAttribute)attr).Description;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        string dformat = format;
                        if (string.IsNullOrEmpty(dformat))
                        {
                            if (type == typeof(int)
                                || type == typeof(int?))
                            {
                                dformat = "N0";
                            }
                            else if (type == typeof(double)
                                    || type == typeof(double?)
                                    || type == typeof(decimal)
                                    || type == typeof(decimal?))
                            {
                                dformat = "N2";
                            }
                            else if (type == typeof(DateTime)
                                    || type == typeof(DateTime?))
                            {
                                dformat = "dd/MM/yyyy";
                            }
                        }
                        _format = "{0:" + dformat + "}";

                        if (type == typeof(DateTime)
                            || type == typeof(DateTime?))
                        {
                            _provider = new CultureInfo("en-US");
                        }
                    }
                }

                if (_provider != null)
                    result = string.Format(_provider, _format, _obj);
                else
                    result = string.Format(_format, _obj);
            }
            catch
            {
                result = "";
            }

            return result;
        }
        public static string ConvertToXml_Store<T>(List<T> lst, params string[] fields) where T : class
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                doc.LoadXml("<rows></rows>");

                if (lst != null)
                {
                    Type cType = typeof(T);
                    PropertyInfo[] props = cType.GetProperties();

                    if (fields != null)
                    {
                        if (fields.Length > 0)
                        {
                            List<PropertyInfo> pLst = new List<PropertyInfo>();
                            foreach (string f in fields)
                            {
                                PropertyInfo prop = cType.GetProperty(f);
                                if (prop != null)
                                    pLst.Add(prop);
                            }
                            props = pLst.ToArray();
                        }
                    }

                    foreach (T obj in lst)
                    {
                        XmlNode node = doc.CreateNode(XmlNodeType.Element, "row", "");
                        doc.ChildNodes[0].AppendChild(node);

                        if (props == null)
                            continue;

                        foreach (PropertyInfo prop in props)
                        {
                            XmlNode iNode = doc.CreateNode(XmlNodeType.Element, prop.Name, "");

                            object value = prop.GetValue(obj, null);
                            if (value != null)
                            {
                                string val = string.Empty;
                                if (prop.PropertyType == typeof(bool))
                                {
                                    bool b = (bool)value;
                                    if (b)
                                        val = "1";
                                    else
                                        val = "0";
                                }
                                else if (prop.PropertyType == typeof(bool?))
                                {
                                    bool? b = (bool?)value;
                                    if (b.HasValue)
                                    {
                                        if (b.Value)
                                            val = "1";
                                        else
                                            val = "0";
                                    }
                                }
                                else if (prop.PropertyType == typeof(DateTime))
                                {
                                    DateTime dt = (DateTime)value;
                                    if (dt.Ticks == 0)
                                        dt = Utils.IOUtil.GetCurrentDateTimeTH;

                                    CultureInfo c = new CultureInfo("en-US");
                                    val = dt.ToString(Constants.Common.DATABASE_DATE_TIME_FORMAT, c);
                                }
                                else if (prop.PropertyType == typeof(DateTime?))
                                {
                                    DateTime? dt = (DateTime?)value;
                                    if (dt.HasValue)
                                    {
                                        CultureInfo c = new CultureInfo("en-US");
                                        val = dt.Value.ToString(Constants.Common.DATABASE_DATE_TIME_FORMAT, c);
                                    }
                                }
                                else
                                    val = value.ToString();

                                iNode.InnerText = val;
                            }
                            else
                                iNode.InnerText = string.Empty;

                            node.AppendChild(iNode);
                        }
                    }
                }

                StringWriter sw = new StringWriter();
                XmlTextWriter tx = new XmlTextWriter(sw);
                doc.WriteTo(tx);

                return sw.ToString();
            }
            catch (Exception)
            {
                throw;
            }
        }
        public static DataTable ConvertDoToDataTable<T>(T objDo)
        {
            DataTable dtOut = new DataTable();
            if (objDo != null)
            {
                PropertyInfo[] pSourceInfo = objDo.GetType().GetProperties();
                foreach (PropertyInfo pInfo in pSourceInfo)
                {
                    string strPropertyType = string.Empty;
                    if (pInfo.PropertyType.FullName == objDo.GetType().ToString())
                    {
                        continue;
                    }

                    if (pInfo.PropertyType.IsGenericType && pInfo.PropertyType.Name.Contains("Nullable"))
                    {
                        Type tNullableType = Type.GetType(pInfo.PropertyType.FullName);
                        strPropertyType = tNullableType.GetGenericArguments()[0].FullName;
                    }
                    else if (!pInfo.PropertyType.IsGenericType)
                    {
                        strPropertyType = pInfo.PropertyType.FullName;
                    }
                    else
                    {
                        continue;
                    }
                    DataColumn col = new DataColumn(pInfo.Name, Type.GetType(strPropertyType));
                    dtOut.Columns.Add(col);
                }

                DataRow row = dtOut.NewRow();
                for (int idx = 0; idx < dtOut.Columns.Count; idx++)
                {
                    PropertyInfo pDestInfo = objDo.GetType().GetProperty(dtOut.Columns[idx].ColumnName);
                    Object objVal = pDestInfo.GetValue(objDo, null);
                    row[dtOut.Columns[idx].ColumnName] = objVal == null ? DBNull.Value : objVal;
                }
                dtOut.Rows.Add(row);
                dtOut.AcceptChanges();
            }
            return dtOut;
        }
        public static DataTable ConvertDoListToDataTable<T>(List<T> objDoList)
        {
            DataTable dtOut = new DataTable();

            if (objDoList != null && objDoList.Count >= 0)
            {
                T objSource = System.Activator.CreateInstance<T>();
                if (objDoList.Count > 0)
                {
                    objSource = objDoList[0];
                }
                //Generate DataTable Column
                PropertyInfo[] pSourceInfo = objSource.GetType().GetProperties();
                foreach (PropertyInfo pInfo in pSourceInfo)
                {
                    string strPropertyType = string.Empty;
                    if (pInfo.PropertyType.FullName == objSource.GetType().ToString())
                    {
                        continue;
                    }

                    if (pInfo.PropertyType.IsGenericType && pInfo.PropertyType.Name.Contains("Nullable"))
                    {
                        Type tNullableType = Type.GetType(pInfo.PropertyType.FullName);
                        strPropertyType = tNullableType.GetGenericArguments()[0].FullName;
                    }
                    else if (!pInfo.PropertyType.IsGenericType)
                    {
                        strPropertyType = pInfo.PropertyType.FullName;
                    }
                    else
                    {
                        continue;
                    }
                    DataColumn col = new DataColumn(pInfo.Name, Type.GetType(strPropertyType));
                    dtOut.Columns.Add(col);
                }

                // Transfer Data from Do list to DataTable
                foreach (T obj in objDoList)
                {
                    DataRow row = dtOut.NewRow();
                    for (int idx = 0; idx < dtOut.Columns.Count; idx++)
                    {
                        PropertyInfo pDestInfo = obj.GetType().GetProperty(dtOut.Columns[idx].ColumnName);
                        Object objVal = pDestInfo.GetValue(obj, null);
                        row[dtOut.Columns[idx].ColumnName] = objVal == null ? DBNull.Value : objVal;
                    }
                    dtOut.Rows.Add(row);
                    dtOut.AcceptChanges();
                }
            }
            return dtOut;
        }
    }
}
