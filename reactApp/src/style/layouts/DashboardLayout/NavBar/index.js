import { Avatar, Box, Divider, Drawer, Hidden, List, makeStyles, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import {
  BarChart as BarChartIcon,
  BookOpen
} from 'react-feather';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import NavItem from './NavItem';

const user = {
  avatar: '/static/images/avatars/avatar_unknown.jpg',
  jobTitle: 'gertmand1@gmail.com',
  name: 'Gert Mänd'
};

const items = [
  {
    href: '/1',
    icon: BarChartIcon,
    title: 'Esileht'
  },
  {
    href: '/home',
    icon: BarChartIcon,
    title: 'Parkimiskoht'
  },
  {
    href: '/2',
    icon: BarChartIcon,
    title: 'Broneeringud'
  },
  {
    href: '/profile',
    icon: BarChartIcon,
    title: 'Profiil'
  },
  {
    href: '/test',
    icon: BarChartIcon,
    title: 'Test'
  },
  {
    href: '/settings',
    icon: BarChartIcon,
    title: 'Test2'
  },
  // {
  //   href: '/userDetails',
  //   icon: UserIcon,
  //   title: 'Profiil',
  // },
  // {
  //   href: '/broneeringud',
  //   icon: Calendar,
  //   title: 'Broneeringud'
  // }
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
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
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

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar className={classes.avatar} component={RouterLink} src={user.avatar} to="/profile"/>
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

      {enterpriseUserData.isAdmin && 
      <><Box flexGrow={1} />
          <Box p={2}>
            <List>
              {adminItems.map(item => (
                <NavItem
                  href={item.href}
                  key={item.title}
                  title={item.title}
                  icon={item.icon} />
              ))}
            </List>
          </Box></> 
      }
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