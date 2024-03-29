import { Avatar, Button, colors, Grid, Hidden, makeStyles, Typography } from '@material-ui/core'
import LocalParkingIcon from '@material-ui/icons/LocalParking'
import clsx from 'clsx'
import React, { FC } from 'react'
import { ParkingSpot, Reservation } from '../../../store/types/enterpriseTypes'

type Props = {
    spot: ParkingSpot,
    reservedSpot?: Reservation,
    giveSpotModal: boolean,
    handleGiveSpot(e: any): any,
    handleRelease(e: any): any,
    updateSpotData(): any,
}

const SpotData:FC<Props> = ({spot, reservedSpot, giveSpotModal, handleGiveSpot, updateSpotData, handleRelease}) => {
    const classes = useStyles();

    return (
        <Grid container justify="space-between" spacing={3}>
            <Grid item>
                <Typography color="textSecondary" gutterBottom variant="h3">
                    PARKIMISKOHT
                </Typography>
                <Typography color="textPrimary" variant="h4">
                    KOHT: {spot !== undefined ? spot.number : reservedSpot !== undefined ? reservedSpot.parkingSpotNumber : "Puudub"}
                </Typography>
                
                {spot !== undefined && 
                    <Typography color="textPrimary" style={{marginTop: 7}} variant="h4">STAATUS: 
                        {spot.status.toLowerCase() === "active" ? <p style={{display:"inline", color:"green"}}> AKTIIVNE!</p> : null}
                        {spot.status.toLowerCase() === "reserved" ? <p style={{display:"inline", color:"red"}}> BRONEERITUD!</p> : null}
                        {spot.status.toLowerCase() === "released" ? <p style={{display:"inline", color:"#a25900"}}> VABASTATUD!</p> : null}
                    </Typography>
                }

                {reservedSpot !== undefined && 
                    <Typography color="textPrimary" style={{marginTop: 7}} variant="h4">STAATUS: 
                        <p style={{display:"inline", color:"green"}}> BRONEERING!</p>
                    </Typography>
                }


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
                        <Button className={clsx(classes.detailButton)}  variant="contained" color="primary">
                            Detailid
                        </Button>
                    </Grid>
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
    detailButton: {
        float: "left",
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
