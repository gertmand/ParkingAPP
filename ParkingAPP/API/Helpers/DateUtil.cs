using System;
using System.Collections.Generic;
using API.Models.Common;

namespace RIK_parkimise_rakendus.Helpers
{
    public class DateUtil<T>
        where T : ParkingDateEntityData
    {
        public static bool CheckDates(DateTime startDate, DateTime endDate, List<T> list)
        {
            var dates = new List<DateTime>();

            if (list.Count == 0)
            {
                return true;
            }

            for (var dt = startDate; dt <= endDate; dt = dt.AddDays(1))
            {
                dates.Add(dt);
            }

            foreach (T res in list)
            {
                foreach (var date in dates)
                {
                    if (date.Date >= res.StartDate.Date && date.Date <= res.EndDate.Date)
                    {
                        return false;
                    }
                }
            }

            return true;
        }

        public static List<T> RemoveDeletedDates(List<T> list)
        {
            for (int i = list.Count - 1; i >= 0; i--)
            {
                if (list[i].DeletionDate != null)
                {
                    if (list[i].DeletionDate.Value < DateTime.Today.Date)
                    {
                        list.RemoveAll(x => x.Id == list[i].Id);
                    }
                }
            }

            return list;
        }

        public static List<T> ChangeDateTimeToDate(List<T> list)
        {
            foreach (T data in list)
            {
                data.EndDate = data.EndDate.Date;
                data.StartDate = data.StartDate.Date;
            }

            return list;
        }
    }
}