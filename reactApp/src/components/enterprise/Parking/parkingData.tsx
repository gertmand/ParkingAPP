import { Card, CardContent, Grid, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store';
import { getAccountsWithoutSpot, getEnterpriseParkingSpotData, getEnterpriseUserData } from '../../../store/queries/enterpriseQueries';
import { AvailableDates, AvailableDatesResponse, ParkingSpot, ParkingSpotListData, Reservation } from '../../../store/types/enterpriseTypes';
import BookingModal from './Modals/BookingModal';
import BookSpotModal from './Modals/bookSpotModal';
import GiveSpot from './Modals/giveSpot';
import ReleaseSpot from './Modals/releaseSpot';
import SpotData from './spotData';
import SpotTable from './spotTable';
import Toolbar from './toolbar';


type SpotProps = {
    parkingSpot?: ParkingSpot,
    parkingSpotDataList?: ParkingSpotListData[],
    reservationList?: Reservation[],
    reservedSpot?: Reservation,
    addReservationButton: boolean,
    spotButtons: boolean
}

const ParkingData: FC<SpotProps> = ({ parkingSpot, parkingSpotDataList, reservationList, reservedSpot, addReservationButton, spotButtons }) => {
    const classes = useStyles();
    const [giveSpotModal, setGiveSpotModal] = useState(false);
    const [releaseModal, setReleaseModal] = useState(false);
    const [regularUsers, setRegularUsers] = useState([]);
    //const isCancelled = React.useRef(false);
    const dispatch = useDispatch();
    const enterpriseId = useSelector<AppState, number>(state => state.user.enterpriseData.id)
    const [bookModal, setBookModal] = useState(false);
    const [bookReservationModal, setBookReservationModal] = useState(false)
    
    const [availableSpots, setAvailableSpots] = useState<AvailableDatesResponse[]>([])

    const handleGiveSpot = (e: any) => {
        if(regularUsers.length === 0 && enterpriseId !== undefined)
            getAccountsWithoutSpot(enterpriseId).then(data => setRegularUsers(data));
        setGiveSpotModal(!giveSpotModal);
    }

    const handleRelease = (e: any) => {
        setReleaseModal(!releaseModal);
    }

    const updateSpotTable = () => {
        if(enterpriseId !== undefined) {            
            getEnterpriseUserData(enterpriseId, dispatch, false); 
            getEnterpriseParkingSpotData(enterpriseId, dispatch, false); 
        }
    }

    const handleBookModal = () => {
        setBookModal(!bookModal);
    }

    const handleResetAvailable = () => {
        setAvailableSpots([])
    }

    const handleBookReservationModal = () => {
        setBookModal(false)
        setBookReservationModal(true)
    }

    const handleAvailableReservations = (e: AvailableDates[]) => {
        e.forEach(aDate => {
            setAvailableSpots(prevState => [...prevState, {id: aDate.id, startDate: aDate.startDate, endDate: aDate.endDate, days: aDate.days, parkingSpotNumber: aDate.parkingSpotNumber, checked: false}])
        });
    }

    return (
        <>
        <Toolbar addReservationButton={addReservationButton} handleGiveSpot={handleGiveSpot} handleRelease={handleRelease} handleBook={handleBookModal} spotButtons={spotButtons} />
        <Grid container spacing={1} className={classes.height}>
            <Grid item xs={12}>
                <Card className={clsx(classes.card)}>
                    <CardContent>
                        <SpotData handleRelease={handleRelease} updateSpotData={updateSpotTable} handleGiveSpot={handleGiveSpot} giveSpotModal={giveSpotModal} spot={parkingSpot!} reservedSpot={reservedSpot} />
                    </CardContent>
                </Card>
            </Grid>
            { <Grid item xs={12}>
                <div style={{margin: 0, marginLeft: 7}}>
                    <SpotTable spotData={parkingSpotDataList!} reservationData={reservationList!} updateSpotData={updateSpotTable} /> 
                </div>
            </Grid> }
        </Grid>
        <GiveSpot updateSpotData={updateSpotTable} giveSpotModal={giveSpotModal} setGiveSpotModal={handleGiveSpot} regularUsers={regularUsers} />
        <ReleaseSpot updateSpotData={updateSpotTable} releaseModal={releaseModal} setReleaseModal={handleRelease} />
        <BookSpotModal setSpotReservationModal={handleBookReservationModal} setSpotsForReservation={handleAvailableReservations} bookModal={bookModal} setBookModal={handleBookModal} />
        <BookingModal availableData={availableSpots} modal={bookReservationModal} setModal={setBookReservationModal} resetData={handleResetAvailable} />
        </>
    )
}


const useStyles = makeStyles(theme => ({
    height: {
        maxHeight: '25%',
        marginLeft: -12,
        margin: 0
    },
    card: {
        margin: 0,
        marginLeft: 7,
        color: theme.palette.text.secondary,
    }
}));

export default ParkingData