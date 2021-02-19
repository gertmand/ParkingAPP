import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles, Theme } from '@material-ui/core/styles';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store';
import { SET_SUCCESS_ALERT } from './siteActions';
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


const SuccessAlert = () => {
    const dispatch = useDispatch()
    const classes = useStyles();
    const successAlert = useSelector<AppState, SiteAlert>(state => state.site.successAlert);

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
        return;
        }
        dispatch(SET_SUCCESS_ALERT(false));
    };

    return (
            <div className={classes.root}>
                <Snackbar open={successAlert.status} autoHideDuration={3000} key={successAlert.message} onClose={handleClose} anchorOrigin={{horizontal: "right", vertical: "top"}}>
                    <Alert onClose={handleClose} severity="success">
                        {successAlert.message}
                    </Alert>
                </Snackbar>
            </div>
    );
}

export default SuccessAlert