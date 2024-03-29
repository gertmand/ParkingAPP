import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import React from 'react';
import Page from '../../../Page';

import Profile from './Profile';

import ProfilePage from '../../../../pages/ProfilePage';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Account = () => {
  const classes = useStyles();
  return (
    <Page
      className={classes.root}
      title="Parking Solutions - Profiil"
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} >
          <Grid item lg={4} md={6}  xs={12} >
            <Profile />
          </Grid>
          <Grid item lg={8} md={6} xs={12} >
            <ProfilePage />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Account;
