import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  makeStyles,
  Toolbar,
  Theme,
  Typography
} from '@material-ui/core';
import InputIcon from '@material-ui/icons/Input';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Logo from '../../Logo';
import Link from '@material-ui/core/Link';
import { useSelector } from 'react-redux';
import { Enterprise } from '../../../store/types/enterpriseTypes'

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    width: 60,
    height: 60
  },
  appBar: {
    color: "#fff",
    height:64,
    backgroundColor: "#008bd0"
  },
  link: {
    margin: theme.spacing(1, 1.5),
    color: "white",
    '&:hover': {
      cursor: "pointer"
   },
  }
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
  const classes = useStyles();
  const [notifications] = useState(["asd", "asd"]);
  const enterprise = useSelector(state => state.user.enterpriseData);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(false);
  };

  const handleEnterprise = () => {
    localStorage.setItem('enterprise', "0")
    window.location.reload();
  };

  return (
    <AppBar className={clsx(classes.root, classes.appBar, className)} elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Box flexGrow={1} />
        <Hidden mdDown>
          <Link variant="button" color="textPrimary" className={classes.link} onClick={() => handleEnterprise()}>
            {Object.entries(enterprise).length != 0 ? <p>{enterprise.name}</p>  : <p>ENTERPRISE</p> }
          </Link>
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
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default TopBar;
