using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Common.Api.Models
{
    public class UserInRoleDo
    {
        public class ScreenPermissionDo
        {
            public class PermissionDo
            {
                public int permissionID { get; set; }
                public bool hasPermission { get; set; }
            }

            public string screenID { get; set; }
            public List<PermissionDo> permissions { get; set; }
        }

        public List<ScreenPermissionDo> permissions { get; set; }
    }
}
