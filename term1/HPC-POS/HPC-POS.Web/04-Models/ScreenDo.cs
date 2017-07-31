using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Web.Models
{
    public class ScreenDo
    {
        public string ScreenID { get; set; }
        public string ParentScreenID { get; set; }
        public bool FlagMenu { get; set; }

        public int? GroupID { get; set; }
        public string GroupNameEN { get; set; }
        public string GroupNameLC { get; set; }
        public string GroupImageIcon { get; set; }

        public int? SubGroupID { get; set; }
        public string SubGroupNameEN { get; set; }
        public string SubGroupNameLC { get; set; }
        public string SubGroupImageIcon { get; set; }

        public string NameEN { get; set; }
        public string NameLC { get; set; }
        public string ImageIcon { get; set; }
        public string Path { get; set; }

        public string Description { get; set; }
        public bool FlagPermission { get; set; }
        public int MenuSequence { get; set; }
    }
}
