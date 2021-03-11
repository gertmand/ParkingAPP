import { Dialog, DialogTitle, DialogContent, DialogContentText, Grid, DialogActions, Button } from '@material-ui/core';
import React, { FC } from 'react'
import SelectBookDate from '../../common/SelectBookDate';
import { SelectWorker } from './selectWorker';

type ModalProps = {
    open: boolean,
    setModal(e: boolean): any,
    startDate: any,
    endDate: any,
    setStartDate(e: any): any,
    setEndDate(e: any): any,
    submit(): any,
    regularUsers: any,
    changeSelectedUser(v: any, e: any): any
}

const GiveModal:FC<ModalProps> = ({open, setModal, startDate, endDate, setStartDate, setEndDate, submit, regularUsers, changeSelectedUser}: any) => {
    const handleClose = () => {
        setModal(false);
    };

    const changeStartDate = (e: any) => {
        setStartDate(e);
        console.log(startDate);
    }

    const changeEndDate = (e: any) => {
        setEndDate(e);
    }

    const handleSubmit = () => {
        submit();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Loovuta koht</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Vali töötaja ja periood, kellele koht loovutatakse
                    </DialogContentText>
                    <Grid container spacing={1} justify={"space-between"}>
                        <Grid item xs={12}>
                            <SelectWorker data={regularUsers} onUserChange={changeSelectedUser} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <SelectBookDate date={startDate} onDateChange={changeStartDate} label="Algus"/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <SelectBookDate date={endDate} onDateChange={changeEndDate} label="Lõpp" />
                        </Grid>
                    </Grid>
                    </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Tühista
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Loovuta
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default GiveModal
