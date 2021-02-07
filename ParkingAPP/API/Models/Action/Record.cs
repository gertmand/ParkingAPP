using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinuRaha.Models.Action
{
    public class Record
    {
        public string Id { get; set; }
        public Action Action { get; set; }
        public double Amount { get; set; }
        public string Description { get; set; }
        public DateTime RecordDate { get; set; }
        public string CategoryId { get; set; }
    }

    public enum Action
    {
        Income,
        Expense
    }
}