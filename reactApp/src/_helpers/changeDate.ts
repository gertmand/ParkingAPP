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

    var dayValueMoment = new Date(Moment(dateValue).locale("et").format())

    console.log(Moment(dateValue).locale('et'))
    console.log(Moment(dateValue).locale('et').format('dddd'))
    console.log(Moment(dateValue).format('dddd'))
    console.log("")

    //var dayValue = new Date(dateValue);
    //dayValue.getDate()

    if(showWeekDay === true) {
        return weekday[dayValueMoment.getUTCDay()] + " " + date[2] + "." + date[1] + "." + date[0];
    }
    
    return weekday[dayValueMoment.getUTCDay()][0] + " " + date[2] + "." + date[1] + "." + date[0];
}