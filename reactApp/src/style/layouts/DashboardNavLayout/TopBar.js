import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  makeStyles,
  Toolbar,
  Button,
  Dialog,
  DialogActions, 
  DialogContent, 
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import InputIcon from '@material-ui/icons/Input';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Logo from '../../Logo';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    width: 60,
    height: 60
  },
  appBar: {
    color: "#fff",
    height:64,
    backgroundColor: "#1b262c"
  }
}));

const TopBar = ({ className, ...rest }) => {
  const classes = useStyles();
  const [enterpriseInvitations, setEnterpriseInvitations] = useState([]);
  const email = useSelector(state => state.user.userData.email);

  var test = {enterpriseId :1, email : email};
  


  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {setOpen(true);};
  const handleClose = () => {setOpen(false);};
  const [openEnterpriseApproveDialog, setOpenEnterpriseApproveDialog] = React.useState(false);
  const handleOpenEnterpriseApproveDialog = () => {setOpenEnterpriseApproveDialog(true);enterpriseInvitations.push(test);};
  const handleCloseEnterpriseApproveDialog = () => {setOpenEnterpriseApproveDialog(false);};

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(false);
  };

  return (
    <AppBar className={clsx(classes.root, classes.appBar)} elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to="/home">
          <Logo />
        </RouterLink>
        <Button onClick={handleOpen} style={{backgroundColor: "white"}}>Vajuta siia, et anda tagasisidet!</Button>
        <Box flexGrow={1} />
        <Hidden mdDown>
          <IconButton onClick={handleOpenEnterpriseApproveDialog}  color="inherit">
            <Badge
              badgeContent={enterpriseInvitations.length}
              color="error"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={() => handleLogout()}>
            <InputIcon />
          </IconButton>
        </Hidden>
      </Toolbar>

      <Dialog maxWidth={'lg'} onClose={handleCloseEnterpriseApproveDialog} aria-labelledby="simple-dialog-title" open={openEnterpriseApproveDialog}>
      <DialogTitle id="alert-dialog-title">Kinnita kutsed</DialogTitle>
        <DialogContent >
          <DialogContentText id="alert-dialog-description" ></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary">Loobu</Button>
          <Button color="primary" variant="contained">Kinnita</Button>
        </DialogActions>
      </Dialog>


      <Dialog maxWidth={'lg'} onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <iframe title="tagasiside" src="https://docs.google.com/forms/d/e/1FAIpQLScjWpLyGbnAWYspOVIsLkcCAp3B-r7ttWR3JSKTEF6kQiUNOQ/viewform?embedded=true" width="640" height="1172" frameborder="0" marginheight="0" marginwidth="0">Laadimine…</iframe>
        <Button onClick={handleClose} color="primary" variant="contained">Sulge</Button>
      </Dialog>

    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
};

export default TopBar;
