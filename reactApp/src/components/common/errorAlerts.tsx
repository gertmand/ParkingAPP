import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles, Theme } from '@material-ui/core/styles';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store';
import { SET_ERROR_ALERT } from './siteActions';
import { SiteAlert } from './siteTypes';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));


const ErrorAlerts = () => {
    const dispatch = useDispatch()
    const classes = useStyles();
    const errorAlerts = useSelector<AppState, SiteAlert[]>(state => state.site.errorAlerts);

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
        return;
        }
        dispatch(SET_ERROR_ALERT(false));
    };

    errorAlerts.map(errorAlert => {
      return <>(
          <div key={errorAlert.message} className={classes.root}>
              <Snackbar open={errorAlert.status} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{horizontal: "right", vertical: "top"}}>
                  <Alert key={errorAlert.message} onClose={handleClose} severity="error">
                      {errorAlert.message}
                  </Alert>
              </Snackbar>
          </div>
      )</>;
    })
}

export default ErrorAlerts