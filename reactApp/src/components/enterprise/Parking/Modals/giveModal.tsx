import { Dialog, DialogTitle, DialogContent, DialogContentText, Grid, DialogActions, Button } from '@material-ui/core';
import React, { FC } from 'react'
import SelectBookDate from '../../../common/SelectBookDate';
import { SelectWorker } from './../selectWorker';

type ModalProps = {
    open: boolean,
    setModal(e: boolean): any,
    startDate: any,
    endDate: any,
    setStartDate(e: any): any,
    setEndDate(e: any): any,
    submit(): any,
    regularUsers: any,
    changeSelectedUser(v: any, e: any): any,
    buttonDisabled: boolean,
}

const GiveModal:FC<ModalProps> = ({open, setModal, startDate, endDate, setStartDate, setEndDate, submit, regularUsers, changeSelectedUser, buttonDisabled}: any) => {
    const handleClose = () => {
        setModal(false);
    };

    const changeStartDate = (e: any) => {
        setStartDate(e);
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
                        Vali kasutaja ja periood, kellele koht loovutatakse
                    </DialogContentText>
                    <Grid container spacing={1} justify={"space-around"}>
                        <Grid item xs={12}>
                            <SelectWorker data={regularUsers} onUserChange={changeSelectedUser} />
                        </Grid>
                        <Grid item>
                            <SelectBookDate date={startDate} onDateChange={changeStartDate} label="Algus"/>
                        </Grid>
                        <Grid item>
                            <SelectBookDate date={endDate} onDateChange={changeEndDate} label="Lõpp" />
                        </Grid>
                    </Grid>
                    </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Tühista
                    </Button>
                    <Button disabled={buttonDisabled} onClick={handleSubmit} color="primary">
                        Loovuta
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default GiveModal
