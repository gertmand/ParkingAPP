import { Container, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ErrorAlert from '../components/common/errorAlert';
import { SiteAlert } from '../components/common/siteTypes';
import SuccessAlert from '../components/common/successAlert';
import ParkingData from '../components/enterprise/Parking/parkingData';
import { AppState } from '../store';
import { EnterpriseParkingSpotData, EnterpriseUserData, Reservation } from '../store/types/enterpriseTypes';
import Page from '../style/Page';

const HomePage = (props: any) => {
  const classes = useStyles();
  const userData = useSelector<AppState, EnterpriseUserData>(state => state.user.enterpriseUserData);
  const parkingSpotData = useSelector<AppState, EnterpriseParkingSpotData>(state => state.user.enterpriseParkingSpotData);
  //const enterprise = useSelector<AppState, Enterprise>(state => state.user.enterpriseData);
  const successAlert = useSelector<AppState, SiteAlert>(state => state.site.successAlert);
  const errorAlert = useSelector<AppState, SiteAlert>(state => state.site.errorAlert);
  const [reservationSpot, setReservationSpot] = useState<Reservation>()

  useEffect(() => {
    if (localStorage.getItem('enterprise') === "0") {
      props.history.push('/enterprise')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (userData.reservations !== undefined) {
      if (userData.reservations[0] !== undefined) {
        const start = new Date(userData.reservations[0].startDate);
        const now = new Date();
        if (start <= now) {
          if (userData.reservations[0].parkingSpotNumber !== undefined) {
            setReservationSpot(userData.reservations[0]);
          }
          if (userData.reservations.length > 1) {
            if (userData.reservations[1] !== undefined) {
              setReservationSpot(userData.reservations[1]);
              //setFirstReservation(userData.reservations[1].startDate);
            }
          }
        } else {
          //setFirstReservation(userData.reservations[0].startDate);
        }
      }
    }
  }, [userData])

  return (
    <Page
      {...props.children}
      className={classes.root}
      title="Parking Solutions - Esileht">
      {successAlert.status ? <SuccessAlert /> : null}
      {errorAlert.status ? <ErrorAlert /> : null}
      <Container maxWidth={false}>
        {userData.parkingSpot !== null && userData.parkingSpot?.number !== undefined ? (
          <ParkingData parkingSpot={userData.parkingSpot} parkingSpotDataList={parkingSpotData.spotListData} addReservationButton={false} spotButtons={true} />
        ) : (
          <ParkingData reservedSpot={reservationSpot} reservationList={userData.reservations} addReservationButton={true} spotButtons={false} />
        )}
      </Container>
    </Page>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100%',
    paddingBottom: theme.spacing(6),
    paddingTop: theme.spacing(3)
  },
  card: {
    margin: 0,
    marginLeft: 7,
    color: theme.palette.text.secondary
  }
}));

export default HomePage;
