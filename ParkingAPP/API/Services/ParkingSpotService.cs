using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Helpers;
using API.Models.Entities;
using API.Models.ParkingSpotDtos;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Math.EC.Rfc7748;

namespace API.Services
{
    public interface IParkingSpotService
    {
        ParkingSpotResponse GetById(int id);
        IEnumerable<ParkingSpotResponse> GetAll();
        IEnumerable<ReservationResponse> GetUserReservations(int enterpriseId, int userId);
        ParkingSpotResponse GetUserParkingSpot(int enterpriseId, int userId);
    }

    public class ParkingSpotService : IParkingSpotService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ParkingSpotService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public IEnumerable<ParkingSpotResponse> GetAll()
        {
            throw new NotImplementedException();
        }

        public ParkingSpotResponse GetById(int id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ReservationResponse> GetUserReservations(int enterpriseId, int userId)
        {
            var reservations = getReservationsByUserId(enterpriseId, userId);

            return _mapper.Map<IList<ReservationResponse>>(reservations);
        }

        public ParkingSpotResponse GetUserParkingSpot(int enterpriseId, int userId)
        {
            var parkingSpot = getParkingSpotByUserId(enterpriseId, userId);

            return _mapper.Map<ParkingSpotResponse>(parkingSpot);
        }

        // helper methods

        // WHERE RESERVER ID == USERID
        private IEnumerable<Reservation> getReservationsByUserId(int enterpriseId, int userId) 
        {
            var reservations = _context.Reservations
                .Include(x => x.SpotAccount)
                .Include(x => x.ReserverAccount)
                .Include(x => x.ParkingSpot)
                .Include(x => x.ReleasedSpot)
                .Where(x => x.ReserverAccountId == userId && x.ParkingSpot.EnterpriseId == enterpriseId).ToList();

            return reservations;
        }

        private ParkingSpot getParkingSpotByUserId(int enterpriseId, int userId)
        {
            var parkingSpot = _context.ParkingSpots
                .Include(x => x.ParkingSpotAccounts)
                .ThenInclude(x => x.Account)
                .Where(x => x.EnterpriseId == enterpriseId && x.ParkingSpotAccounts.Any(x => x.AccountId == userId)).SingleOrDefault();

            return parkingSpot;
        }
    }
}