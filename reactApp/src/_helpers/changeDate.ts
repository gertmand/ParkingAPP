import Moment from 'moment';
import 'moment/locale/et';

export function changeDate(dateValue: Date, showWeekDay?: boolean) {
    Moment.locale("et")
    var weekday = new Array(7);
    weekday[0] = "Esmaspäev";
    weekday[1] = "Teisipäev";
    weekday[2] = "Kolmapäev";
    weekday[3] = "Neljapäev";
    weekday[4] = "Reede";
    weekday[5] = "Laupäev";
    weekday[6] = "Pühapäev";

    var date = dateValue.toString().slice(0, 10).split("-");

    if(showWeekDay === true) {
        return Moment(dateValue).locale('et').format('dddd')[0].toUpperCase() + " " + date[2] + "." + date[1] + "." + date[0];
    }
    
    return date[2] + "." + date[1] + "." + date[0];
}