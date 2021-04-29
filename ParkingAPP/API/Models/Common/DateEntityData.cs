using System;

namespace API.Models.Common
{
    public class DateEntityData : UniqueEntityData
    {
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
        public DateTime? DeletionDate { get; set; }
    }
}