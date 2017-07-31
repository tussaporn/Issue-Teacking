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
    public class CommonUtil
    {
        public static bool IsNullOrEmpty(object obj)
        {
            if (obj != null)
            {
                if (obj is string)
                {
                    string str = (string)obj;
                    if (string.IsNullOrEmpty(str.Trim()) == false
                        || string.IsNullOrWhiteSpace(str.Trim()) == false)
                        return false;
                }
                else if (obj.GetType().IsGenericType)
                {
                    System.Collections.ICollection objL = obj as System.Collections.ICollection;
                    if (objL != null)
                    {
                        if (objL.Count > 0)
                            return false;
                    }
                }
                else if (obj is DBNull)
                {
                    return true;
                }
                else
                    return false;
            }

            return true;
        }
        public static bool IsNumber(object obj)
        {
            if (CommonUtil.IsNullOrEmpty(obj) == false)
            {
                return (obj.GetType() == typeof(int)
                        || obj.GetType() == typeof(int?)
                        || obj.GetType() == typeof(decimal)
                        || obj.GetType() == typeof(decimal?));
            }

            return false;
        }

        public static bool SetObjectValue(string prop_name, object obj, string value, string format = null)
        {
            if (obj != null)
            {
                System.Reflection.PropertyInfo prop = obj.GetType().GetProperty(prop_name);
                if (prop != null)
                    return SetObjectValue(prop, obj, value, format);
            }

            return false;
        }
        public static bool SetObjectValue(PropertyInfo prop, object obj, string value, string format = null)
        {
            try
            {
                if (prop != null)
                {
                    if (prop.CanWrite == false)
                        return false;

                    if (prop.PropertyType == typeof(bool)
                        || prop.PropertyType == typeof(bool?))
                    {
                        bool b;
                        if (bool.TryParse(value, out b))
                            prop.SetValue(obj, b, null);
                        else if (value == "1")
                            prop.SetValue(obj, true, null);
                        else if (value == "0")
                            prop.SetValue(obj, false, null);
                        else
                            return false;
                    }
                    else if (prop.PropertyType == typeof(decimal)
                        || prop.PropertyType == typeof(decimal?))
                    {
                        decimal dec;
                        if (decimal.TryParse(value, out dec))
                            prop.SetValue(obj, dec, null);
                        else
                            return false;
                    }
                    else if (prop.PropertyType == typeof(int)
                            || prop.PropertyType == typeof(int?))
                    {
                        int num;
                        if (int.TryParse(value, out num))
                            prop.SetValue(obj, num, null);
                        else
                            return false;
                    }
                    else if (prop.PropertyType == typeof(DateTime)
                            || prop.PropertyType == typeof(DateTime?))
                    {
                        CultureInfo info = new CultureInfo("en-US");

                        DateTime date;
                        if (DateTime.TryParseExact(value, string.IsNullOrEmpty(format) == false ? format : "yyyy/MM/dd",
                            info, DateTimeStyles.None, out date))
                            prop.SetValue(obj, date, null);
                        else
                        {
                            double excelDateNumber = 0;
                            if (double.TryParse(value, out excelDateNumber))
                            {
                                date = DateTime.FromOADate(excelDateNumber);
                                prop.SetValue(obj, date, null);
                            }
                            else
                                return false;
                        }
                    }
                    else if (prop.PropertyType == typeof(TimeSpan)
                            || prop.PropertyType == typeof(TimeSpan?))
                    {
                        bool pass = false;
                        if (value.Length >= 5
                            && value.IndexOf(":") > 0)
                        {
                            string[] time = value.Split(":".ToCharArray());
                            if (time.Length <= 3)
                            {
                                int hh = 0;
                                int mm = 0;
                                int ss = 0;
                                if (int.TryParse(time[0], out hh)
                                    && int.TryParse(time[1], out mm)
                                    && int.TryParse(time.Length >= 3 ? time[2] : "0", out ss))
                                {
                                    if (hh < 24 && mm <= 59 && ss <= 59)
                                    {
                                        TimeSpan date;
                                        if (TimeSpan.TryParse(value, out date))
                                        {
                                            prop.SetValue(obj, date, null);
                                            pass = true;
                                        }
                                    }
                                }
                            }
                        }

                        if (pass == false)
                            return false;
                    }
                    else if (prop.PropertyType.IsEnum)
                        prop.SetValue(obj, GetENUMValue(prop.PropertyType, value), null);
                    else if (prop.PropertyType == typeof(string))
                        prop.SetValue(obj, value, null);
                    else if (prop.PropertyType == typeof(Guid))
                        prop.SetValue(obj, new Guid(value), null);

                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static object GetENUMValue(Type enumType, string value)
        {
            string enum_value = value;
            MemberInfo[] members = enumType.GetMembers();
            if (members != null)
            {
                foreach (MemberInfo member in members)
                {
                    object[] attrs = member.GetCustomAttributes(true);
                    if (attrs != null)
                    {
                        foreach (object attr in attrs)
                        {
                            if (attr is DescriptionAttribute)
                            {
                                if (((DescriptionAttribute)attr).Description == value)
                                    enum_value = member.Name;
                                break;
                            }
                        }
                    }
                }
            }

            return Enum.Parse(enumType, enum_value);
        }
    }
}
