import { Avatar, Box, Divider, Drawer, Hidden, List, makeStyles, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { BarChart as BarChartIcon, BookOpen, Cast, Compass, LogOut, Tablet, User } from 'react-feather';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import NavItem from './NavItem';

const items = [
  {
    href: '/1',
    icon: BarChartIcon,
    title: 'Esileht'
  },
  {
    href: '/home',
    icon: Compass,
    title: 'Parkimiskoht'
  },
  {
    href: '/2',
    icon: Tablet,
    title: 'Broneeringud'
  },
  {
    href: '/profile',
    icon: User,
    title: 'Profiil'
  },
];

const adminItems = [
  {
    href: '/admin',
    icon: BookOpen,
    title: 'Admin'
  }
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 123px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64,
  },
  name: {
    marginTop: 10
  },
  title: {
    fontSize: 400
  }
}));

const NavBar = ({ onMobileClose, openMobile }, props) => {
  const userData = useSelector(state => state.user.userData);
  const enterpriseUserData = useSelector(state => state.user.enterpriseUserData);
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(false);
  };

  const content = (
    <Box height="100%" display="flex" flexDirection="column" >
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar className={classes.avatar} component={RouterLink} src={"images/" + userData.avatar} to="/profile"/>
        <Typography className={classes.name} color="textPrimary" variant="h5">
          {userData.firstName} {userData.lastName}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {userData.email}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map(item => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
        <Box flexGrow={1} />
        <Box pr={2} pl={2} pb={2}>
                { enterpriseUserData.isAdmin && 
                  <>
                    {adminItems.map(item => (
                      <NavItem
                        href={item.href}
                        key={item.title}
                        title={item.title}
                        icon={item.icon} />
                    ))}
                  </>
                }
                { openMobile === true && onMobileClose ? 
                <>
                  <NavItem
                    href='/enterprise'
                    title='Enterprise'
                    icon={Cast} 
                    onClick={() => localStorage.setItem('enterprise', "0")} />
                  <NavItem
                    href='/logout'
                    title='Logi Välja'
                    icon={LogOut} 
                    onClick={() => handleLogout()} /></> : null
                }
        </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};


export default NavBar;