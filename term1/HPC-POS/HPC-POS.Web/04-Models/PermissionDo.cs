using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Web.Models
{
    public class PermissionDo
    {
        public string ScreenID { get; set; }
        public int PermissionID { get; set; }

        public string PermissionKey
        {
            get
            {
                return string.Format("{0}:{1}", this.ScreenID, this.PermissionID);
            }
        }
    }
}
