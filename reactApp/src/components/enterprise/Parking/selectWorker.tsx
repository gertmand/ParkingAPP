import React, { FC } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SelectedUser } from '../../../store/types/userType';

interface Workers {
  data: SelectedUser[],
  onUserChange(event: any, values: any): any
}

export const SelectWorker:FC<Workers> = ( { data, onUserChange }) => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<SelectedUser[]>([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if (active && data.length > 0) {
        setOptions(Object.keys(data).map((key: any) => data[key]) as SelectedUser[]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading, data]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="workers"
      style={{ maxWidth: 520 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.userId === value.userId }
      getOptionLabel={(option) => {
            //onUserChange(option.userId)
            return option.firstName + " " + option.lastName 
        } }
      loadingText={"Laen andmeid.."}
      options={options}
      loading={loading}
      onChange={onUserChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Valige kasutaja"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}

export default SelectWorker