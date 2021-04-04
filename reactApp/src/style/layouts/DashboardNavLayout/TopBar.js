import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  makeStyles,
  Toolbar
} from '@material-ui/core';
import InputIcon from '@material-ui/icons/Input';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Logo from '../../Logo';

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
  const [notifications] = useState(["asd", "asd"]);

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
        <Box flexGrow={1} />
        <Hidden mdDown>
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
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
};

export default TopBar;
