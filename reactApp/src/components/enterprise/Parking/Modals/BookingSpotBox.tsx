import { Checkbox, CheckboxProps, Grid, Paper, Typography, withStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import Moment from 'moment';
import React, { FC, useState } from 'react';
import { AvailableDatesResponse } from '../../../../store/types/enterpriseTypes';

type SpotProps = {
    Spot: AvailableDatesResponse,
    onSpotClick(e: any, id: number): any
}

const BookingSpotBox: FC<SpotProps> = ({ Spot, onSpotClick }) => {
    const [checked, setChecked] = useState(Spot.checked)

    const handleClick = (e: any) => {
        setChecked(!checked)
        onSpotClick(e, Spot.id)
    }

    return (
        <>
            <Paper elevation={3} style={{ marginTop: "24px", marginBottom: "24px", padding: "12px" }} onClick={(e) => handleClick(e)} >
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item xs={3}>
                        <GreenCheckbox onClick={(e) => handleClick(e)} onChange={(e) => handleClick(e)} checked={checked} name="checked" />
                    </Grid>
                    <Grid container item xs={9} spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h3" component="span">
                                Parkimiskoht: {Spot?.parkingSpotNumber} 
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h5" component="span">
                                Algus: {getDayLabel(Moment(Spot?.startDate).format('dddd'))} {Moment(Spot?.startDate).format('DD.MM.yyyy')}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h5" component="h6">
                                Lõpp: {getDayLabel(Moment(Spot?.endDate).format('dddd'))} {Moment(Spot?.endDate).format('DD.MM.yyyy')}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}

const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);


const getDayLabel = (day: string) => {
    if(day === "Monday")
        return "E"
    if(day === "Tuesday")
        return "T"
    if(day === "Wednesday")
        return "K"
    if(day === "Thursday")
        return "N"
    if(day === "Friday")
        return "R"
    if(day === "Saturday")
        return "L"
    if(day === "Sunday")
        return "P"
    return null
}

export default BookingSpotBox
