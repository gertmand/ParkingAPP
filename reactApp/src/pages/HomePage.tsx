import { Container, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import ParkingData from '../components/enterprise/Parking/parkingData';
import { AppState } from '../store';
import { EnterpriseParkingSpotData, EnterpriseUserData, Reservation } from '../store/types/enterpriseTypes';
import Page from '../style/Page';

const HomePage = (props: any) => {
  const classes = useStyles();
  const userData = useSelector<AppState, EnterpriseUserData>(state => state.user.enterpriseUserData);
  const parkingSpotData = useSelector<AppState, EnterpriseParkingSpotData>(state => state.user.enterpriseParkingSpotData);
  const [reservationSpot, setReservationSpot] = useState<Reservation>()

  useEffect(() => {
    if (userData.reservations !== undefined) {
      if (userData.reservations[0] !== undefined) {
        const start = new Date(userData.reservations[0].startDate);
        const now = new Date();
        //console.log("Start:" + start.getDate() + ", Now: " + now.getDate())
        if (start.getDate() <= now.getDate()) {
          if (userData.reservations[0].parkingSpotNumber !== undefined) {
            setReservationSpot(userData.reservations[0]);
          }
          if (userData.reservations.length > 1) {
            if (userData.reservations[1] !== undefined) {
              setReservationSpot(userData.reservations[1]);
            }
          }
        } else {
        }
      }
    }
  }, [userData])

  if (localStorage.getItem('enterprise') === "0" || localStorage.getItem('enterprise') === null) {
    return <Redirect to='/enterprise' />
  }

  return (
    <Page
      {...props.children}
      className={classes.root}
      title="Parking Solutions - Esileht">
      {/* {successAlert.status ? <SuccessAlert /> : null}
      {errorAlert.status ? <ErrorAlert /> : null} */}
      <Container maxWidth={false}>
        {userData.parkingSpot !== null && userData.parkingSpot?.number !== undefined ? (
          <ParkingData isAdmin={false} parkingSpot={userData.parkingSpot} reservationList={userData.reservations} parkingSpotDataList={parkingSpotData.spotListData} addReservationButton={false} spotButtons={true} />
        ) : (
          <ParkingData isAdmin={false} reservedSpot={reservationSpot} reservationList={userData.reservations} addReservationButton={true} spotButtons={false} />
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