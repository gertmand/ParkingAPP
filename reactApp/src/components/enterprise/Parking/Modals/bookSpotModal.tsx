import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@material-ui/core'
import React, { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../../../store'
import { getAvailableSpotsForReservation } from '../../../../store/queries/enterpriseQueries'
import SelectBookDate from '../../../common/SelectBookDate'
import { SET_ERROR_ALERT } from '../../../common/siteActions'


type Props = {
    bookModal: boolean,
    setBookModal(): any,
    setSpotReservationModal(): any,
    setSpotsForReservation(data: any): any
}

const BookSpotModal:FC<Props> = ({bookModal, setBookModal, setSpotsForReservation, setSpotReservationModal}) => {
    const dispatch = useDispatch();

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [startDateSet, setStartDateSet] = useState(false);
    const [endDateSet, setEndDateSet] = useState(false);
    const enterpriseId = useSelector<AppState, number>(state => state.user.enterpriseData.id)

    const [buttonDisabled, setButtonDisabled] = useState(false)

    const changeStartDate = (e: any) => {
        setStartDate(e);
        setStartDateSet(true);
    }

    const changeEndDate = (e: any) => {
        setEndDate(e);
        setEndDateSet(true);
    }

    const handleDateReset = () => {
        setStartDate(null)
        setEndDate(null)
        setStartDateSet(false);
        setEndDateSet(false);
    }

    const submitSearch = () => {
        if(startDateSet && endDateSet && startDate && endDate && startDate <= endDate) {
            setButtonDisabled(true)
            getAvailableSpotsForReservation(startDate, endDate, enterpriseId).then(response => {
                setSpotsForReservation(response)
                if(response.length > 0) {
                    setSpotReservationModal()
                    setBookModal()
                } else {
                    setBookModal()
                    dispatch(SET_ERROR_ALERT({status: true, message: "Antud perioodil vabastatud kohta ei leitud!"}));
                }
                handleDateReset()
                setButtonDisabled(false)
            }).catch(err => {
                setButtonDisabled(false)
                handleDateReset()
                if(err.response)
                    dispatch(SET_ERROR_ALERT({ status: true, message: err.response.data.message}));
            }) 
        }
        
        else if(startDate != null && endDate != null) {
            if(startDate > endDate) dispatch(SET_ERROR_ALERT({ status: true, message: "Alguskuupäev ei tohi olla suurem lõppkuupäevast"}))
        }
        else if(!startDateSet && !endDateSet) dispatch(SET_ERROR_ALERT({ status: true, message: "Palun määra periood!"}))
        else if(!startDateSet) dispatch(SET_ERROR_ALERT({ status: true, message: "Palun määra alguskuupäev!"}))
        else if(!endDateSet) dispatch(SET_ERROR_ALERT({ status: true, message: "Palun määra lõppkuupäev!"}))
    }

    return (
        <Dialog open={bookModal} onClose={() => setBookModal()} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Otsi koht</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Koha otsimiseks sisestage periood
            </DialogContentText>
            { buttonDisabled 
            ? 
                <div style={{textAlign: "center"}}><CircularProgress /></div> 
            : 
                <Grid container spacing={1} justify="space-around">
                    <Grid item>
                        <SelectBookDate date={startDate} onDateChange={changeStartDate} label="Algus" />
                    </Grid>
                    <Grid item>
                        <SelectBookDate date={endDate} onDateChange={changeEndDate} label="Lõpp" />
                    </Grid>
                </Grid>
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setBookModal()} color="primary">
                Tühista
            </Button>
            <Button disabled={buttonDisabled} onClick={() => submitSearch()} color="primary">
                Otsi
            </Button>
        </DialogActions>
    </Dialog>
    )
}

export default BookSpotModal
