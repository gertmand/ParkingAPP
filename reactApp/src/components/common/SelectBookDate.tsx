import 'date-fns';
import React, { FC } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import estLocale from 'date-fns/locale/et'

type DateType = {
    date: any,
    label: string,
    onDateChange(e: any): any,
    excludeDates?: any
}

export const SelectBookDate:FC<DateType> = ( {date, onDateChange, label, excludeDates}) => {

  const handleDateChange = (date: Date | null) => {
    onDateChange(date);
  };


  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={estLocale}>
        <KeyboardDatePicker
          disableToolbar
          disablePast
          variant="inline"
          format="dd.MM.yyyy"
          margin="normal"
          id={ "select-date-" + label}
          label={label}
          value={date}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'muuda',
          }}
          autoOk={true}
          helperText={''}
        />
    </MuiPickersUtilsProvider>
  );
}

export default SelectBookDate