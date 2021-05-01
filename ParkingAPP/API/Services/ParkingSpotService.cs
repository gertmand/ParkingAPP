﻿using System;
using System.Collections.Generic;
using System.Linq;
using API.DAL;
using API.Helpers;
using API.Models.Entities;
using API.Models.JoinedEntities;
using API.Models.ParkingSpotDtos;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using API.Helpers;

namespace API.Services
{
    public interface IParkingSpotService
    {
        ParkingSpotResponse GetById(int id);
        ParkingSpotResponse GetUserParkingSpot(int enterpriseId, int userId);
        ReleasedResponse ReleaseParkingSpot(ReleaseRequest request);
        ReservationResponse ReserveParkingSpot(ReservationRequest request);
        IEnumerable<ReservationResponse> GetUserReservations(int enterpriseId, int userId);
        IEnumerable<ParkingSpotResponse> GetAll(int enterpriseId);
        IEnumerable<ParkingSpotDataResponse> GetParkingSpotListData(int spotId);
        List<AvailableDatesResponse> GetAvailableDatesForReservation(AvailableDatesRequest request, int enterpriseId, int accountId);
        ParkingSpotStatusType GetParkingSpotStatus(int id);
        ParkingSpotResponse DeleteParkingSpot(int id);
        ParkingSpotResponse AddParkingSpot(ParkingSpotRequest request, int enterpriseId);
        IEnumerable<ParkingSpotMainUserResponse> GetParkingSpotsMainUsers (int enterpriseId);
        ParkingSpotMainUserResponse AddParkingSpotMainUser(ParkingSpotMainUserRequest request);
        ParkingSpotMainUserResponse DeleteParkingSpotMainUser(int accountId, int parkingSpotId);
        void AddParkingSpotArray(ParkingSpotRequest[] request, int enterpriseId);
    }

    public class ParkingSpotService : IParkingSpotService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IAccountService _accountService;
        private readonly IEmailService _emailService;
        private readonly ILogService _logService;

        public ParkingSpotService(DataContext context, IMapper mapper, ILogService logService)
        {
            _context = context;
            _mapper = mapper;
            _logService = logService;
            _accountService = new AccountService(_context,_mapper,_emailService,_logService);
        }

        public IEnumerable<ParkingSpotResponse> GetAll(int enterpriseId)
        {
            var parkingspots = getAllParkingSpots(enterpriseId);
            var responses = _mapper.Map<IList<ParkingSpotResponse>>(parkingspots);

            foreach (var response in responses)
            {
                response.Status = GetParkingSpotStatus(response.Id);
                switch (response.Status)
                {
                    case ParkingSpotStatusType.Active:
                        response.Staatus = "Aktiivne";
                        break;
                    case ParkingSpotStatusType.Assigned:
                        response.Staatus = "Laenatud";
                        break;
                    case ParkingSpotStatusType.Reserved:
                        response.Staatus = "Broneeritud";
                        break;
                    case ParkingSpotStatusType.Released:
                        response.Staatus = "Vabastatud";
                        break;
                    default:
                        response.Staatus = "katki";
                        break;
                }
            }

            return responses;
        }

        public ParkingSpotResponse GetById(int id)
        {
            ParkingSpot ps = getById(id);
            
            var data = _mapper.Map<ParkingSpotResponse>(ps);

            data.Status = GetParkingSpotStatus(data.Id);

            switch (data.Status)
            {
                case ParkingSpotStatusType.Active:
                    data.Staatus = "Aktiivne";
                    break;
                case ParkingSpotStatusType.Assigned:
                    data.Staatus = "Laenatud";
                    break;
                case ParkingSpotStatusType.Reserved:
                    data.Staatus = "Broneeritud";
                    break;
                case ParkingSpotStatusType.Released:
                    data.Staatus = "Vabastatud";
                    break;
                default:
                    data.Staatus = "katki";
                    break;
            }

            return data;
        }

        public IEnumerable<ReservationResponse> GetUserReservations(int enterpriseId, int userId)
        {
            var reservations = getReservationsByUserId(enterpriseId, userId);

            return _mapper.Map<IList<ReservationResponse>>(reservations);
        }

        public ParkingSpotResponse GetUserParkingSpot(int enterpriseId, int userId)
        {
            var parkingSpot = getParkingSpotByUserId(enterpriseId, userId);

            if (parkingSpot == null)
                return null;

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
                request.ReserverName = "-";
                request.Status = ParkingSpotStatusType.Released;
                request.ParkingSpotId = spotId;

                requestCount++;
                requests.Add(request);
            }

            return requests.OrderBy(x => x.StartDate).ThenByDescending(x => x.Status).ToList();
        }

        public ReleasedResponse ReleaseParkingSpot(ReleaseRequest request)
        {
            request.StartDate = request.StartDate.ToUniversalTime();
            request.EndDate = request.EndDate.ToUniversalTime();
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

        public List<AvailableDatesResponse> GetAvailableDatesForReservation(AvailableDatesRequest request, int enterpriseId, int accountId)
        {
            List<AvailableDatesResponse> availableForReservation = new List<AvailableDatesResponse>();


            var releasedSpots = _context.ReleasedSpots
                .Include(x => x.ParkingSpot)
                .ThenInclude(x => x.Enterprise)
                .Where(x => (x.EndDate.Date >= DateTime.Today.Date && x.StartDate.Date <= request.EndDate.Date) && x.ParkingSpot.EnterpriseId == enterpriseId).ToList();

            var reservations = _context.Reservations
                .Include(x => x.ParkingSpot)
                .ThenInclude(x => x.Enterprise)
                .Where(x => (x.EndDate.Date >= DateTime.Today.Date && x.StartDate.Date <= request.EndDate.Date) && x.ParkingSpot.EnterpriseId == enterpriseId).ToList();

            releasedSpots = DateUtil<ReleasedSpot>.RemoveDeletedDates(releasedSpots);
            reservations = DateUtil<Reservation>.RemoveDeletedDates(reservations);

            foreach (ReleasedSpot releasedSpot in releasedSpots)
            {
                var releasedSpotReservations = reservations.Where(x => x.ReleasedSpotId == releasedSpot.Id || x.ParkingSpotId == releasedSpot.ParkingSpotId).ToList();
                List<DateTime> datesToReserve = new List<DateTime>();

                // Adding all the dates to list and removing all the reserved dates
                datesToReserve = RemoveReservedDates(releasedSpotReservations, releasedSpot, datesToReserve);

                // Removing all the dates, which are not between input
                datesToReserve.RemoveAll(x => x.Date < request.StartDate.Date || x.Date > request.EndDate.Date);

                if (getParkingSpotByUserId(enterpriseId, accountId).Id != releasedSpot.ParkingSpotId)
                {
                    availableForReservation.AddRange(GetPossibleDates(datesToReserve, releasedSpot.ParkingSpotId, releasedSpot.Id));
                }
            }

            return availableForReservation;
        }

        // ADMIN METHODS
        public ParkingSpotResponse AddParkingSpot(ParkingSpotRequest request, int enterpriseId)
        {
            if (!checkExistingParkingSpotNr(request.Number, enterpriseId))
            {
                throw new AppException("Sellise numbriga parkimiskoht on juba olemas!");
            }
            ParkingSpot ps = new ParkingSpot() {EnterpriseId = enterpriseId, Created = DateTime.UtcNow, Number = request.Number,};
            _context.ParkingSpots.Add(ps);
            _context.SaveChanges();

            return _mapper.Map<ParkingSpotResponse>(ps);
        }

        public void AddParkingSpotArray(ParkingSpotRequest[] request, int enterpriseId)
        {
            List<ParkingSpot> spots = new List<ParkingSpot>();
            foreach (var spot in request)
            {
                if (!_context.ParkingSpots.Where(x=>x.EnterpriseId==enterpriseId).Select(x => x.Number).Contains(spot.Number))
                {
                    spots.Add(new ParkingSpot { EnterpriseId = enterpriseId, Number = spot.Number, Created = DateTime.UtcNow });
                }
            }
            _context.ParkingSpots.AddRange(spots);
            _context.SaveChanges();
        }
        public ParkingSpotResponse DeleteParkingSpot(int id)
        {
            return _mapper.Map<ParkingSpotResponse>(deleteParkingSpot(id));

        }

        public IEnumerable<ParkingSpotMainUserResponse> GetParkingSpotsMainUsers(int enterpriseId)
        {
            List<ParkingSpotMainUserResponse> psmu = new List<ParkingSpotMainUserResponse>();
            List<int> ps_id_s = new List<int>();
            ps_id_s.AddRange(_context.ParkingSpots.Where(x=>x.EnterpriseId == enterpriseId).Select(x=>x.Id));
            List<ParkingSpotAccount> psas = new List<ParkingSpotAccount>();
            psas.AddRange(_context.ParkingSpotAccounts);

            foreach (int ps_id in ps_id_s)
            {
                foreach (var psa in psas)
                {
                    if (psa.ParkingSpotId == ps_id)
                    {
                        Account a = _context.Accounts.Include(x=>x.EnterpriseAccounts).FirstOrDefault(x => x.Id == psa.AccountId);
                        psmu.Add(new ParkingSpotMainUserResponse()
                        {
                            MainUserFullName = a.FirstName + " " + a.LastName, 
                            ParkingSpotId = ps_id, 
                            AccountId = a.Id, 
                            CanBook = a.EnterpriseAccounts.FirstOrDefault(x=>x.AccountId == a.Id).CanBook, 
                            EnterpriseId = enterpriseId, 
                            AccountCars = _accountService.GetCarsByAccountId(a.Id)
                        });
                    }
                }
            }

            return psmu;
        }

        public ParkingSpotMainUserResponse AddParkingSpotMainUser(ParkingSpotMainUserRequest request)
        {
            return _mapper.Map<ParkingSpotMainUserResponse>(addParkingSpotMainUser(request));
        }

        public ParkingSpotMainUserResponse DeleteParkingSpotMainUser(int accountId, int parkingSpotId)
        {
            return _mapper.Map<ParkingSpotMainUserResponse>(deleteParkingSpotMainUser(accountId, parkingSpotId));
        }

        // helper methods

        private List<DateTime> AddPeriodDatesToList(List<DateTime> datesToReserve, ReleasedSpot releasedSpot)
        {
            for (var dt = releasedSpot.StartDate; releasedSpot.DeletionDate != null ? dt <= releasedSpot.DeletionDate : dt <= releasedSpot.EndDate; dt = dt.AddDays(1))
            {
                datesToReserve.Add(dt.Date);
            }

            return datesToReserve;
        }

        private List<AvailableDatesResponse> GetPossibleDates(List<DateTime> datesToReserve, int parkingSpotId, int releasedSpotId)
        {
            List<AvailableDatesResponse> responses = new List<AvailableDatesResponse>();
            DateTime dStartDate = new DateTime();
            DateTime dEndDate = new DateTime();
            int daysCount = 0;

            for (int i = 0; i <= datesToReserve.Count - 1; i++)
            {
                daysCount++;
                if (i != datesToReserve.Count - 1 && datesToReserve[i].AddDays(1).Date == datesToReserve[i + 1].Date)
                {
                    if (dStartDate == new DateTime())
                    {
                        dStartDate = datesToReserve[i].Date;
                    }
                }
                else
                {
                    if (dStartDate == new DateTime())
                    {
                        dStartDate = datesToReserve[i].Date;
                    }
                    dEndDate = datesToReserve[i].Date;

                    AvailableDatesResponse response = new AvailableDatesResponse { Id = parkingSpotId * daysCount + 15, StartDate = dStartDate, EndDate = dEndDate, ParkingSpotNumber = GetById(parkingSpotId).Number, Days = daysCount };
                    responses.Add(response);

                    dStartDate = new DateTime();
                    dEndDate = new DateTime();
                    daysCount = 0;
                }
            }

            return responses;
        }

        private List<DateTime> RemoveReservedDates(List<Reservation> releasedSpotReservations, ReleasedSpot releasedSpot, List<DateTime> datesToReserve)
        {
            datesToReserve = AddPeriodDatesToList(datesToReserve, releasedSpot);

            foreach (Reservation reservation in releasedSpotReservations)
            {
                // Kui reservationil ReleaseSpotId = antud releaseSpotiga või tegemist on sama parklakohaga, siis eemalda reservedDates listist reserveeritud ajad
                if (reservation.ReleasedSpotId.HasValue || reservation.ParkingSpotId == releasedSpot.ParkingSpotId)
                {
                    if (reservation.ReleasedSpotId == releasedSpot.Id || reservation.ParkingSpotId == releasedSpot.ParkingSpotId)
                    {
                        for (int i = datesToReserve.Count - 1; i >= 0; i--)
                        {
                            if (datesToReserve[i].Date >= reservation.StartDate.Date && datesToReserve[i].Date <= reservation.EndDate.Date)
                            {
                                if (reservation.DeletionDate != null && datesToReserve[i].Date > reservation.DeletionDate.Value.Date)
                                {
                                    continue;
                                }

                                datesToReserve.RemoveAt(i);
                            }
                        }
                    }
                }
            }

            return datesToReserve;
        }

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

        private List<ParkingSpot> getAllParkingSpots(int enterpriseId)
        {
            var parkingspots = _context.ParkingSpots.Where(x => x.EnterpriseId == enterpriseId && x.DeletionDate == null).ToList();
            return parkingspots;
        }

        private ParkingSpot getParkingSpotByUserId(int enterpriseId, int userId)
        {
            var parkingSpot = _context.ParkingSpots
                .Include(x => x.ParkingSpotAccounts)
                .ThenInclude(x => x.Account)
                .FirstOrDefault(x => x.EnterpriseId == enterpriseId && x.ParkingSpotAccounts.Any(x => x.AccountId == userId));

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

        private ParkingSpot deleteParkingSpot(int id)
        {
            List<ParkingSpotAccount> psa = new List<ParkingSpotAccount>();
            psa.AddRange(_context.ParkingSpotAccounts.Where(x=>x.ParkingSpotId==id));
            foreach (var item in psa)
            {
                var temp = _context.ParkingSpotAccounts.Find(item.AccountId,item.ParkingSpotId);
                _context.ParkingSpotAccounts.Remove(temp);
            }
            ParkingSpot ps = _context.ParkingSpots.Find(id);
            ps.DeletionDate = DateTime.UtcNow;
            _context.SaveChanges();
            return ps;
        }

        private ParkingSpot getById(int id)
        {
            ParkingSpot ps = _context.ParkingSpots.Find(id);
            return ps;
        }

        private ParkingSpotMainUserResponse addParkingSpotMainUser(ParkingSpotMainUserRequest request)
        {
            ParkingSpotAccount temp = new ParkingSpotAccount()
            {
                AccountId = request.AccountId,
                ParkingSpotId = request.ParkingSpotId,
            };
            _context.EnterpriseAccounts.FirstOrDefault(x => x.AccountId == request.AccountId).CanBook = request.CanBook;
            _context.ParkingSpotAccounts.Add(temp);
            _context.SaveChanges();
            Account account = _context.Accounts.Find(temp.AccountId);
            ParkingSpotMainUserResponse response = new ParkingSpotMainUserResponse()
            {
                ParkingSpotId = temp.ParkingSpotId,
                MainUserFullName = account.FirstName + " " + account.LastName,
                CanBook = request.CanBook,
            };
            return response;
        }

        private ParkingSpotMainUserResponse deleteParkingSpotMainUser(int accountId, int parkingSpotId)
        {
            ParkingSpotAccount psa = _context.ParkingSpotAccounts.Find(accountId,parkingSpotId);
            _context.ParkingSpotAccounts.Remove(psa);
            _context.SaveChanges();
            Account account = _context.Accounts.Find(accountId);
            ParkingSpotMainUserResponse response = new ParkingSpotMainUserResponse()
            {
                ParkingSpotId = parkingSpotId,
                MainUserFullName = account.FirstName + " " + account.LastName,
            };
            return response;
        }

        private bool checkExistingParkingSpotNr(int nr, int enterpriseId)
        {
            foreach (var ps in _context.ParkingSpots.Where(x=>x.EnterpriseId==enterpriseId))
            {
                if (ps.Number == nr && ps.DeletionDate == null ) return false;
            }

            return true;
        }
    }
}