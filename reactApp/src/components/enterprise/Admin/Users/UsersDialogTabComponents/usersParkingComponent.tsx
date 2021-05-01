import { CardContent } from '@material-ui/core';
import React, { FC } from 'react';
import { Card } from 'reactstrap';
import { EnterpriseParkingSpotData, EnterpriseUserData } from '../../../../../store/types/enterpriseTypes';
import ParkingData from '../../../Parking/parkingData';

type Props = {
userData?: EnterpriseUserData
parkingSpotData?: EnterpriseParkingSpotData
};

const UsersParkingComponent: FC<Props> = ({userData, parkingSpotData}) => {
    return (
        <Card>
          <CardContent>
              {/* <ParkingData 
              addReservationButton={false} 
              spotButtons={false}/> */}
              {userData !== undefined && parkingSpotData !== undefined && userData.parkingSpot !== null && userData.parkingSpot?.number !== undefined ? (
          <ParkingData isAdmin={true} parkingSpot={userData.parkingSpot} parkingSpotDataList={parkingSpotData.spotListData} addReservationButton={false} spotButtons={false} />
        ) : (userData !== undefined ? 
          <ParkingData isAdmin={true}/*reservedSpot={reservationSpot}*/ reservationList={userData.reservations} addReservationButton={false} spotButtons={false} /> : ''
        )}
          </CardContent>
        </Card>
    )
}

export default UsersParkingComponent

