using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Utils.Interfaces
{
    public abstract class ASearchResultData<T> where T : class
    {
        public int TotalRecords { get; set; }
        public List<T> Rows { get; set; }
    }
}
