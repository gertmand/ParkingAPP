import { Avatar, Button, colors, Grid, Hidden, makeStyles, Typography } from '@material-ui/core'
import LocalParkingIcon from '@material-ui/icons/LocalParking'
import clsx from 'clsx'
import React, { FC, useState } from 'react'
import { useSelector } from 'react-redux'
import { ParkingSpot } from '../../../store/types/enterpriseTypes'
import ReleaseSpot from './releaseSpot'

type Props = {
    spot: ParkingSpot,
    giveSpotModal: boolean,
    handleGiveSpot(e: any): any,
    updateSpotData(): any,
}

const SpotData:FC<Props> = ({spot, giveSpotModal, handleGiveSpot, updateSpotData}) => {
    const classes = useStyles();
    // const spotStatus = useSelector<AppState, string>(state => state.parkingSpace.spotStatus);
    const [spotStatus, setSpotStatus] = useState("active");
    const [releaseModal, setReleaseModal] = useState(false);

    const handleRelease = (e: any) => {
        setReleaseModal(!releaseModal);
    }

    return (
        <Grid container justify="space-between" spacing={3}>
            <Grid item>
                <Typography color="textSecondary" gutterBottom variant="h3">
                    PARKIMISKOHT
                </Typography>
                <Typography color="textPrimary" variant="h4">
                    KOHT: {spot.number}
                </Typography>
                
                <Typography color="textPrimary" style={{marginTop: 7}} variant="h4">STAATUS: 
                {spot.status.toLowerCase() === "active" ? <p style={{display:"inline", color:"green"}}> AKTIIVNE!</p> : ""}
                {spot.status.toLowerCase() === "reserved" ? <p style={{display:"inline", color:"red"}}> BRONEERITUD!</p> : ""}
                {spot.status.toLowerCase() === "released" ? <p style={{display:"inline", color:"#a25900"}}> VABASTATUD!</p> : ""}
                </Typography>
                {/* <Typography style={{marginTop: 7, display: 'inline-block'}} color="textPrimary" variant="h4">
                    AUTO NUMBER: {cars.map(car => (
                        <span className={clsx(classes.ulParent)} key={car.id}>{car.regNr} </span>
                        )
                    )}
                </Typography> */}
            </Grid>
            <Hidden only={['xs']}>
                <Grid item>     
                    <Avatar className={classes.avatar}>
                        <LocalParkingIcon />
                    </Avatar>
                </Grid>
            </Hidden>
            
            <Grid container item justify="space-between" spacing={1}>
                <Typography color="textSecondary" variant="caption" className={clsx(classes.parkingSpotCard)} >
                    <Grid item>
                        <Button className={clsx(classes.buttonGiveSpot)} onClick={() => handleGiveSpot(!giveSpotModal)} variant="contained" color="primary">
                            Laena koht kolleegile
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button className={clsx(classes.buttonRelease)} onClick={() => setReleaseModal(true)} variant="contained" color="primary">
                            Vabasta koht
                        </Button>
                    </Grid>
                { <ReleaseSpot updateSpotData={updateSpotData} releaseModal={releaseModal} setReleaseModal={handleRelease}/> }
                </Typography>
            </Grid>
        </Grid>
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        margin: 0
    },
    avatar: {
        flex: '1 0 auto',
        backgroundColor: colors.red[500],
        height: 56,
        width: 56
    },
    parkingSpotCard: {
        flex: '1 0 auto',
        [theme.breakpoints.down('xs')]: {
            flex: 'auto',
            clear: "both",
        },
    },
    buttonGiveSpot: {
        float: "left",
        [theme.breakpoints.down('xs')]: {
            float: "none",
        },
    },
    buttonRelease: {
        float: "right",
        [theme.breakpoints.down('xs')]: {
            float: "none",
            marginTop: "5px",
        },
    },
    ulParent: {
        listStyle: "none",
        width: "100%",
        height: "90px",
        margin: 0,
        padding: 0,
        whiteSpace: 'nowrap',
        overflowX: 'auto',
        overflowY: 'hidden',
        "& li": {
            display: "inline-block",
            width: "50%",
            height: "100%",
            backgroundColor: "red"
        }
    }
}));


export default SpotData
