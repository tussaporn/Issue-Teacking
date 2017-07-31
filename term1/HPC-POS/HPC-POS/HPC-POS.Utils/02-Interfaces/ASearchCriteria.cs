using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Utils.Interfaces
{
    public abstract class ASearchCriteria
    {
        public int page { get; set; }
        public int paging { get; set; }

        public string sorting { get; set; }
        public bool? isAssending { get; set; }

        public int OffsetRow
        {
            get
            {
                int offset = ((this.page - 1) * this.paging);
                return offset;
            }
        }
        public int NextRowCount
        {
            get
            {
                return this.paging;
            }
        }
    }
}
