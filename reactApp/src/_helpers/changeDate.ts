import Moment from 'moment';
import 'moment/locale/et';

export function changeDate(dateValue: Date, showWeekDay?: boolean) {
    var date = dateValue.toString().slice(0, 10).split("-");

    if(showWeekDay === true) {
        return Moment(dateValue).locale('et').format('dddd')[0].toUpperCase() + " " + date[2] + "." + date[1] + "." + date[0];
    }
    
    return date[2] + "." + date[1] + "." + date[0];
}