using System.ComponentModel.DataAnnotations;

namespace API.Models.EnterpriseDtos
{
    public class EnterpriseCreateRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public EnterpriseType type { get;set; }
        [Range(typeof(bool), "true", "true")]
        public bool AcceptTerms { get; set; }

        public int UserId { get; set; }
    }
}