using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Common.DataSvc.Models
{
    public class ScreenPermissionDo
    {
        public string ScreenID { get; set; }
        public string NameEN { get; set; }
        public string NameLC { get; set; }
        public string GroupNameEN { get; set; }
        public string GroupNameLC { get; set; }
        public string GroupImageIcon { get; set; }
        public string ParentScreenID { get; set; }
        public string ImageIcon { get; set; }

        public bool SCN_1 { get; set; }
        public bool ROL_1 { get; set; }
        public bool SCN_2 { get; set; }
        public bool ROL_2 { get; set; }
        public bool SCN_3 { get; set; }
        public bool ROL_3 { get; set; }
        public bool SCN_4 { get; set; }
        public bool ROL_4 { get; set; }
        public bool SCN_5 { get; set; }
        public bool ROL_5 { get; set; }
        public bool SCN_6 { get; set; }
        public bool ROL_6 { get; set; }
        public bool SCN_7 { get; set; }
        public bool ROL_7 { get; set; }
    }
    public class ScreenGroupPermissionDo
    {
        public string GroupNameEN { get; set; }
        public string GroupNameLC { get; set; }
        public string GroupImageIcon { get; set; }

        public List<ScreenPermissionDo> Screens { get; set; }
    }
}
