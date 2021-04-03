using API.Models.Entities;

namespace API.Models.JoinedEntities
{
    public class EnterpriseAccount
    {
        public int AccountId { get; set; }
        public int EnterpriseId { get; set; }
        public bool IsAdmin { get; set; } = false;
        public bool CanBook { get; set; } = false;

        public Account Account { get; set; }
        public Enterprise Enterprise { get; set; }
    }
}
