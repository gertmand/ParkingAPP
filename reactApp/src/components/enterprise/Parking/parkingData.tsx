import { Card, CardContent, Grid, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getEnterpriseParkingSpotData, getEnterpriseUserData } from '../../../store/queries/enterpriseQueries';
import { ParkingSpot, ParkingSpotListData, Reservation } from '../../../store/types/enterpriseTypes';
import BookSpotModal from './bookSpotModal';
import GiveSpot from './giveSpot';
import ReleaseSpot from './releaseSpot';
import SpotData from './spotData';
import SpotTable from './spotTable';
import Toolbar from './toolbar';


type SpotProps = {
    parkingSpot?: ParkingSpot,
    parkingSpotDataList?: ParkingSpotListData[],
    reservedSpot?: Reservation,
    addReservationButton: boolean,
    spotButtons: boolean
}

const ParkingData: FC<SpotProps> = ({ parkingSpot, parkingSpotDataList, reservedSpot, addReservationButton, spotButtons }) => {
    const classes = useStyles();
    const [giveSpotModal, setGiveSpotModal] = useState(false);
    const [releaseModal, setReleaseModal] = useState(false);
    const isCancelled = React.useRef(false);
    const dispatch = useDispatch();
    const enterpriseId = localStorage.getItem('enterprise')
    const [bookModal, setBookModal] = useState(false);

    const handleGiveSpot = (e: any) => {
        setGiveSpotModal(!giveSpotModal);
    }

    const handleRelease = (e: any) => {
        setReleaseModal(!releaseModal);
    }

    const updateSpotTable = () => {
        if(enterpriseId !== undefined) {            
            getEnterpriseUserData(parseInt(enterpriseId!), dispatch); 
            getEnterpriseParkingSpotData(parseInt(enterpriseId!), dispatch); 
        }
    }

    const handleBookModal = () => {
        setBookModal(!bookModal);
    }

    useEffect(() => {
        updateSpotTable();
        
        return () => {
            isCancelled.current = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enterpriseId])

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
                    <SpotTable data={parkingSpotDataList!} updateSpotData={updateSpotTable} /> 
                </div>
            </Grid> }
        </Grid>
        <GiveSpot updateSpotData={updateSpotTable} giveSpotModal={giveSpotModal} setGiveSpotModal={handleGiveSpot} />
        <ReleaseSpot updateSpotData={updateSpotTable} releaseModal={releaseModal} setReleaseModal={handleRelease} />
        <BookSpotModal bookModal={bookModal} setBookModal={handleBookModal} />
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