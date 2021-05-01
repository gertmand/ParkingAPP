﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.Entities
{
    public class Log
    { 
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public int AccountId { get; set; }

        public IDictionary<string, string>? ChangedValues { get; set; }
        public int? ToAccountId { get; set; }
        public int? AdminId { get; set; }
        public int? EnterpriseId { get; set; }
    }
}
