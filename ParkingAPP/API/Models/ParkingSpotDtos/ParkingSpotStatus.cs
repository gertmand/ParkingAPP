namespace API.Models.ParkingSpotDtos
{
    public enum ParkingSpotStatusType
    {
        Active, // Spot is active
        Released, // Spot is released, to be reserved by another user
        Reserved, // Spot is reserved by another user
        Assigned, // Spot was given to another user by owner
        Maintenence
    }
}
