using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Utils.Constants
{
    public class Common
    {
        public static string DATABASE_DATE_TIME_FORMAT { get; private set; }
        public static int LOGIN_WAITING_TIME { get; private set; }
        public static int MAXIMUM_LOGIN_FAIL { get; private set; }
        public static string TEMP_PATH { get; private set; }
    }
}
