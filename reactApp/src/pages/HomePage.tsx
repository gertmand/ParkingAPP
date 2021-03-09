import { Container, makeStyles } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import ErrorAlert from '../components/common/errorAlert';
import { SiteAlert } from '../components/common/siteTypes';
import SuccessAlert from '../components/common/successAlert';
import ParkingData from '../components/enterprise/parkingData';
import { AppState } from '../store';
import { ParkingSpot } from '../store/types/enterpriseTypes';
import Page from '../style/Page';

const HomePage = (props: any) => {
  const classes = useStyles();
  const parkingSpot = useSelector<AppState, ParkingSpot>(state => state.user.enterpriseUserData.parkingSpot);
  const successAlert = useSelector<AppState, SiteAlert>(state => state.site.successAlert);
  const errorAlert = useSelector<AppState, SiteAlert>(state => state.site.errorAlert);

  return (
    <Page
    {...props.children}
     className={classes.root} 
     title="Esileht">
      {successAlert.status ? <SuccessAlert /> : ""}
      {errorAlert.status ? <ErrorAlert /> : ""}
      <Container maxWidth={false}>
        {parkingSpot != null && parkingSpot.number != undefined ? (
          <ParkingData data={parkingSpot} />
        ) : (
          "a"
        )}
      </Container>
    </Page>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  card: {
    margin: 0,
    marginLeft: 7,
    color: theme.palette.text.secondary
  }
}));

export default HomePage;
