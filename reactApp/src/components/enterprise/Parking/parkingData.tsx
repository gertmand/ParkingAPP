import { Card, CardContent, Grid, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { FC, useEffect, useState } from 'react';
import { ParkingSpot } from '../../../store/types/enterpriseTypes';
import GiveSpot from './giveSpot';
import SpotData from './spotData';
import SpotTable from './spotTable';


type SpotProps = {
    data: ParkingSpot,
}

const ParkingData: FC<SpotProps> = ({ data }) => {
    const classes = useStyles();
    const [giveSpotModal, setGiveSpotModal] = useState(false);
    const isCancelled = React.useRef(false);
    const [spotDataTable, setSpotDataTable] = useState([]);

    const handleGiveSpot = (e: any) => {
        setGiveSpotModal(!giveSpotModal);
    }

    const updateSpotTable = () => {
        console.log("updated");
    }

    useEffect(() => {
        //updateSpotTable();
        
        return () => {
            isCancelled.current = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
        <Grid container spacing={1} className={classes.height}>
            <Grid item xs={12}>
                <Card className={clsx(classes.card)}>
                    <CardContent>
                        <SpotData updateSpotData={updateSpotTable} handleGiveSpot={handleGiveSpot} giveSpotModal={giveSpotModal} spot={data} />
                    </CardContent>
                </Card>
            </Grid>
            { <Grid item xs={12}>
                <div style={{margin: 0, marginLeft: 7}}>
                    <SpotTable data={spotDataTable} updateSpotData={updateSpotTable} />
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