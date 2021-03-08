using System;

namespace API.Models.EnterpriseDtos
{
    public class EnterpriseResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public EnterpriseType Type { get; set; }
        public bool Active { get; set; }
        public DateTime Created { get; set; }
    }
}