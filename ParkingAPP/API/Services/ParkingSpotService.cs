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
using RIK_parkimise_rakendus.Helpers;

namespace API.Services
{
    public interface IParkingSpotService
    {
        ParkingSpotResponse GetById(int id);
        IEnumerable<ParkingSpotResponse> GetAll();
        IEnumerable<ReservationResponse> GetUserReservations(int enterpriseId, int userId);
        ParkingSpotResponse GetUserParkingSpot(int enterpriseId, int userId);
        ParkingSpotStatusType GetParkingSpotStatus(int id);
        ReleasedResponse ReleaseParkingSpot(ReleaseRequest request);
        ReservationResponse ReserveParkingSpot(ReservationRequest request);
        IEnumerable<ParkingSpotDataResponse> GetParkingSpotListData(int spotId);
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


        public ParkingSpotStatusType GetParkingSpotStatus(int id)
        {
            var spot = _context.ParkingSpots.Find(id);

            if (spot == null)
            {
                throw new KeyNotFoundException();
            }

            DateTime today = DateTime.Today.Date;

            var reservations = _context.Reservations.Where(x => x.ParkingSpotId == id && x.StartDate.Date <= today && x.EndDate.Date >= today).ToList();
            var released = _context.ReleasedSpots.Where(x => x.ParkingSpotId == id && x.StartDate.Date <= today && x.EndDate.Date >= today).ToList();

            released = DateUtil<ReleasedSpot>.RemoveDeletedDates(released);
            reservations = DateUtil<Reservation>.RemoveDeletedDates(reservations);

            if (reservations.Count > 0)
                return ParkingSpotStatusType.Reserved;
            if (released.Count > 0)
                return ParkingSpotStatusType.Released;

            return ParkingSpotStatusType.Active;
        }

        public IEnumerable<ParkingSpotDataResponse> GetParkingSpotListData(int spotId)
        {
            List<ParkingSpotDataResponse> requests = new List<ParkingSpotDataResponse>();
            int requestCount = 0;
            DateTime today = DateTime.Today.Date;

            var releases = _context.ReleasedSpots
                .Where(x => x.ParkingSpotId == spotId)
                .ToList();

            var reservations = _context.Reservations
                .Where(x => x.ParkingSpotId == spotId)
                .ToList();

            releases = DateUtil<ReleasedSpot>.RemoveDeletedDates(releases);
            reservations = DateUtil<Reservation>.RemoveDeletedDates(reservations);

            releases = RemoveReleasesIfReserved(releases, reservations);

            foreach (var reservation in reservations)
            {
                ParkingSpotDataResponse request = new ParkingSpotDataResponse();

                request.Id = requestCount;
                request.StartDate = reservation.StartDate.Date;
                request.EndDate = reservation.EndDate.Date;
                request.ReservationId = reservation.Id;
                request.ReserverAccountId = reservation.ReserverAccountId;
                request.ReserverName = GetAccountName(request.ReserverAccountId);
                request.ParkingSpotId = spotId;

                if (reservation.ReleasedSpotId != null)
                {
                    request.ReleasedId = reservation.ReleasedSpotId.Value;
                    request.Status = ParkingSpotStatusType.Reserved;
                }
                else
                {
                    request.ReleasedId = -1;
                    request.Status = ParkingSpotStatusType.Assigned;
                }

                requestCount++;

                requests.Add(request);
            }

            foreach (var release in releases)
            {
                ParkingSpotDataResponse request = new ParkingSpotDataResponse();

                request.Id = requestCount;
                request.StartDate = release.StartDate.Date;
                request.EndDate = release.EndDate.Date;
                request.ReleasedId = release.Id;
                request.ReservationId = -1;
                request.ReserverAccountId = -1; 
                request.Status = ParkingSpotStatusType.Released;
                request.ParkingSpotId = spotId;

                requestCount++;
                requests.Add(request);
            }

            return requests.OrderBy(x => x.StartDate).ThenByDescending(x => x.Status).ToList();
        }

        public ReleasedResponse ReleaseParkingSpot(ReleaseRequest request)
        {
            var spot = _context.ParkingSpots.Where(x => x.Id == request.ParkingSpaceId).FirstOrDefault();

            if (spot == null)
            {
                throw new KeyNotFoundException("Spot not found");
            }

            var releases = _context.ReleasedSpots.Where(x => x.ParkingSpotId == request.ParkingSpaceId && x.EndDate >= DateTime.Today.Date).ToList();
            var reservations = _context.Reservations.Where(x => x.ParkingSpotId == request.ParkingSpaceId && x.EndDate >= DateTime.Today.Date).ToList();

            releases = DateUtil<ReleasedSpot>.RemoveDeletedDates(releases);
            reservations = DateUtil<Reservation>.RemoveDeletedDates(reservations);

            if (!DateUtil<ReleasedSpot>.CheckDates(request.StartDate, request.EndDate, releases))
            {
                throw new AppException("Parkimiskoht kattub juba vabastatud kuupäevadega!");
            }
            if (!DateUtil<Reservation>.CheckDates(request.StartDate, request.EndDate, reservations))
            {
                throw new AppException("Aktiivne broneering kattub kuupäevadega!");
            }

            ReleasedSpot releasedSpot = new ReleasedSpot() { ParkingSpotId = request.ParkingSpaceId, StartDate = request.StartDate, EndDate = request.EndDate };

            _context.ReleasedSpots.Add(releasedSpot);
            _context.SaveChanges();

            return _mapper.Map<ReleasedResponse>(releasedSpot);
        }

        public ReservationResponse ReserveParkingSpot(ReservationRequest request)
        {
            var userReservations = _context.Reservations.Where(x => x.ReserverAccountId == request.ReserverAccountId).ToList();
            var spotReservations = _context.Reservations.Where(x => x.ParkingSpotId == request.ParkingSpotId).ToList();

            var spotAccount = _context.ParkingSpotAccounts
                .Include(x => x.Account)
                .Include(x => x.ParkingSpot)
                .FirstOrDefault(x => x.ParkingSpotId == request.ParkingSpotId);

            var requestedSpot = _context.ParkingSpots
                .Include(x => x.ParkingSpotAccounts)
                .ThenInclude(x => x.Account)
                .FirstOrDefault(x => x.Id == request.ParkingSpotId);

            if (!DateUtil<Reservation>.CheckDates(request.StartDate, request.EndDate, userReservations))
            {
                throw new AppException("Broneeringu kuupäevad kattuvad isikul olemasoleva broneeringuga" );
            }
            if (!DateUtil<Reservation>.CheckDates(request.StartDate, request.EndDate, spotReservations))
            {
                throw new AppException("Broneeringu kuupäevad kattuvad parkimiskohal olemasoleva broneeringuga" );
            }
            if (spotAccount?.AccountId == request.ReserverAccountId)
            {
                throw new AppException("Isikliku parkimiskohale pole võimalik broneeringut lisada!");
            }

            var bookingTargetUser = _context.Accounts.Find(request.ReserverAccountId);

            if (bookingTargetUser == null)
            {
                throw new AppException("Isikut ei leitud!");
            }

            var reservationDto = new Reservation()
            {
                ParkingSpotId = request.ParkingSpotId,
                ReserverAccountId = request.ReserverAccountId,
                SpotAccountId = spotAccount?.AccountId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
            };

            _context.Reservations.Add(reservationDto);
            _context.SaveChanges();

            var response = new ReservationResponse
            {
                ParkingSpotId = request.ParkingSpotId,
                ReserverAccountId = request.ReserverAccountId,
                //ReserverName = GetAccountName(request.ReserverAccountId),
                SpotAccountId = spotAccount?.AccountId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                ParkingSpotNumber = requestedSpot.Number,
                ParkingSpotOwner = spotAccount == null ? "-" : spotAccount.Account?.FirstName + " " + spotAccount.Account?.LastName
            };

            return response;
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

        private string GetAccountName(int userId)
        {
            var account = _context.Accounts.Find(userId);
            return account.FirstName + " " + account.LastName;
        }

        private List<ReleasedSpot> RemoveReleasesIfReserved(List<ReleasedSpot> releases, List<Reservation> reservations)
        {
            for (int i = reservations.Count - 1; i >= 0; i--)
            {
                if (reservations[i].ReleasedSpotId != null)
                {
                    for (int j = releases.Count - 1; j >= 0; j--)
                    {
                        if (reservations[i].ReleasedSpotId == releases[j].Id)
                        {
                            if (reservations[i].StartDate == releases[j].StartDate && reservations[i].EndDate == releases[j].EndDate)
                                releases.RemoveAt(j);
                        }
                    }
                }
            }

            return releases;
        }
    }
}