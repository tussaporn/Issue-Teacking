using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Utils
{
    public class IOUtil
    {
        public static Assembly GetAssembly(string assemblyName)
        {
            try
            {
                var location = System.Reflection.Assembly.GetEntryAssembly().Location;
                var path = System.IO.Path.GetDirectoryName(location);

                string filePath = System.IO.Path.Combine(path, string.Format("{0}.dll", assemblyName));
                return Assembly.LoadFrom(filePath);
            }
            catch (Exception)
            {
            }

            return null;
        }
        public static DateTime GetCurrentDateTimeTH
        {
            get
            {
                DateTime date = DateTime.Now;
                return GetDateTimeTH(date);
            }
        }

        public static DateTime GetDateTimeTH(DateTime date)
        {

            try
            {
                string timeZoneId = "SE Asia Standard Time";
                return TimeZoneInfo.ConvertTimeBySystemTimeZoneId(date, TimeZoneInfo.Local.Id, timeZoneId);
            }
            catch
            {

            }

            return date;
        }
    }
}
