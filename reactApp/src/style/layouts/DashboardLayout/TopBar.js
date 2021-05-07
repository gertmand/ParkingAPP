import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
  Button,
  Dialog
} from '@material-ui/core';
import InputIcon from '@material-ui/icons/Input';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import Logo from '../../Logo';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    width: 60,
    height: 60
  },
  appBar: {
    color: "#fff",
    height:64,
    backgroundColor: "#1b262c"
  },
  link: {
    margin: theme.spacing(1, 1.5),
    color: "white",
    '&:hover': {
      cursor: "pointer",
      textDecoration: "underline"
   },
  }
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
  const classes = useStyles();
  const [notifications] = useState(["asd", "asd", "asd"]);
  const enterprise = useSelector(state => state.user.enterpriseData);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {setOpen(true);};
  const handleClose = () => {setOpen(false);};

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(false);
  };

  return (
    
    <AppBar className={clsx(classes.root, classes.appBar, className)} elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to="/home">
          <Logo />
        </RouterLink> 
        <Button onClick={handleOpen} style={{backgroundColor: "white"}}>Vajuta siia, et anda tagasisidet!</Button>
        <Box flexGrow={1} />
        <Hidden mdDown>
          <RouterLink to="/enterprise" onClick={() => localStorage.setItem('enterprise', "0")}>
            {Object.entries(enterprise).length !== 0 ? <Typography variant="button" display="block" className={classes.link}>{enterprise.name}</Typography>  : <Typography variant="button" display="block" className={classes.link}>ENTERPRISE</Typography> }
          </RouterLink>
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="error"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={() => handleLogout()}>
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>

      <Dialog maxWidth={'lg'} onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <iframe title="tagasiside" src="https://docs.google.com/forms/d/e/1FAIpQLScjWpLyGbnAWYspOVIsLkcCAp3B-r7ttWR3JSKTEF6kQiUNOQ/viewform?embedded=true" width="640" height="1172" frameborder="0" marginHeight="0" marginWidth="0">Laadimine…</iframe>
        <Button onClick={handleClose} color="primary" variant="contained">Sulge</Button>
      </Dialog>

    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default TopBar;
