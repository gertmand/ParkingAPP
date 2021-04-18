import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useEffect, useState } from 'react';
import { AvailableDatesResponse } from '../../../../store/types/enterpriseTypes';
import BookingSpotBox from './BookingSpotBox';


const data = 
[
    {
        id: 1,
        parkingSpotNumber: 1,
        days: 5,
        startDate: new Date(2021, 3, 1),
        endDate: new Date(2021, 3, 3),
        checked: false
    },
    {
        id: 2,
        parkingSpotNumber: 2,
        days: 5,
        startDate: new Date(2021, 3, 4),
        endDate: new Date(2021, 3, 6),
        checked: false
    },
    {
        id: 3,
        parkingSpotNumber: 3,
        days: 5,
        startDate: new Date(2021, 3, 7),
        endDate: new Date(2021, 3, 9),
        checked: false
    },
    {
        id: 4,
        parkingSpotNumber: 4,
        days: 5,
        startDate: new Date(2021, 3, 10),
        endDate: new Date(2021, 3, 12),
        checked: false
    },
    {
        id: 5,
        parkingSpotNumber: 1,
        days: 5,
        startDate: new Date(2021, 3, 1),
        endDate: new Date(2021, 3, 3),
        checked: false
    },
    {
        id: 6,
        parkingSpotNumber: 2,
        days: 5,
        startDate: new Date(2021, 3, 4),
        endDate: new Date(2021, 3, 6),
        checked: false
    },
    {
        id: 7,
        parkingSpotNumber: 3,
        days: 5,
        startDate: new Date(2021, 3, 7),
        endDate: new Date(2021, 3, 9),
        checked: false
    },
    {
        id: 8,
        parkingSpotNumber: 4,
        days: 5,
        startDate: new Date(2021, 3, 10),
        endDate: new Date(2021, 3, 12),
        checked: false
    },
]

const BookingModal = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [scroll] = React.useState<DialogProps['scroll']>('paper');
    const [maxWidth] = React.useState<DialogProps['maxWidth']>('sm');
    const [parkingData, setParkingData] = useState(data)

    const [uniqueDates] = useState<Date[]>([])

    const [activatedSpots, setActivatedSpots] = useState<AvailableDatesResponse[]>([])

    const [, setDays] = useState(0)

    const handleClose = () => {
        setOpen(false);
    };

    const handleSpotClick = async (e: any, id: number) => {
        let spots = parkingData

        spots.forEach(async spot => {
            if(spot.id === id) {
                spot.checked = !spot.checked
                if(spot.checked === true) {
                    await setActivatedSpots(prevState => [...prevState, spot])
                } else {
                    await setActivatedSpots(activatedSpots.filter(item => item.id !== spot.id))
                }
            }
        })

        setParkingData(spots)
    }

    useEffect(() => {
        handleDaysCount()
        // eslint-disable-next-line
    }, [activatedSpots])

    const handleDaysCount = () => {
        const temporaryDates = JSON.parse(JSON.stringify(activatedSpots))
        uniqueDates.splice(0, 100)
        setDays(uniqueDates.length)

        temporaryDates.forEach((x: AvailableDatesResponse) => {
            var diff = Math.floor(( Date.parse(x.endDate.toString()) - Date.parse(x.startDate.toString()) ) / 86400000); 
            var tempStartDate = new Date(JSON.parse(JSON.stringify(x.startDate)))
            
            for(var start = 0; start <= diff; start = start + 1) {
                if(uniqueDates.includes(JSON.parse(JSON.stringify(tempStartDate))) === false) {
                    uniqueDates.push(JSON.parse(JSON.stringify(tempStartDate)))
                }
                tempStartDate.setDate(tempStartDate.getDate() + 1)
            }
            setDays(uniqueDates.length)
        })
    }

    return (
        <Dialog open={open} disableBackdropClick={true} onClose={handleClose} scroll={scroll} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description" fullWidth={true} maxWidth={maxWidth} >
            {activatedSpots.length > 0 ? 
                <DialogTitle className={classes.dialogTitle} id="scroll-dialog-title">Päevade arv: { uniqueDates.length } </DialogTitle> 
                :
                <DialogTitle id="scroll-dialog-title">Leitud parklakohad</DialogTitle> 
            }
            <DialogContent dividers={scroll === 'paper'}>
                {parkingData.map(
                    (row):any => <BookingSpotBox key={row.id} Spot={row} onSpotClick={handleSpotClick} />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Tühista
          </Button>
                <Button disabled={uniqueDates.length > 0 ? false : true} onClick={handleClose} color="primary">
                    Broneeri
          </Button>
            </DialogActions>
        </Dialog>
    );
}

const useStyles = makeStyles(theme => ({
    dialogTitle: {
        backgroundColor: green[600],
        color: "white",
        fontSize: "24",
        animation: "fadeIn .2s ease-in-out"
    },
}));


export default BookingModal