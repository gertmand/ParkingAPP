import { Card, CardContent, Grid, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getEnterpriseUserData, getEnterpriseParkingSpotData } from '../../../store/queries/enterpriseQueries';
import { ParkingSpot, ParkingSpotListData, Reservation } from '../../../store/types/enterpriseTypes';
import GiveSpot from './giveSpot';
import SpotData from './spotData';
import SpotTable from './spotTable';


type SpotProps = {
    parkingSpot?: ParkingSpot,
    parkingSpotDataList?: ParkingSpotListData[],
    reservedSpot?: Reservation
}

const ParkingData: FC<SpotProps> = ({ parkingSpot, parkingSpotDataList, reservedSpot }) => {
    const classes = useStyles();
    const [giveSpotModal, setGiveSpotModal] = useState(false);
    const isCancelled = React.useRef(false);
    const dispatch = useDispatch();
    const enterpriseId = localStorage.getItem('enterprise')

    const handleGiveSpot = (e: any) => {
        setGiveSpotModal(!giveSpotModal);
    }

    const updateSpotTable = () => {
        if(enterpriseId != undefined) {            
            getEnterpriseUserData(parseInt(enterpriseId!), dispatch); 
            getEnterpriseParkingSpotData(parseInt(enterpriseId!), dispatch); 
        }
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
        <Grid container spacing={1} className={classes.height}>
            <Grid item xs={12}>
                <Card className={clsx(classes.card)}>
                    <CardContent>
                        <SpotData updateSpotData={updateSpotTable} handleGiveSpot={handleGiveSpot} giveSpotModal={giveSpotModal} spot={parkingSpot!} reservedSpot={reservedSpot} />
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