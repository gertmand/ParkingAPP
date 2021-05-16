import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { FC } from 'react';
import SelectBookDate from '../../../common/SelectBookDate';

type ModalProps = {
    open: boolean,
    setModal(e: boolean): any,
    startDate: any,
    endDate: any,
    setStartDate(e: any): any,
    setEndDate(e: any): any,
    submit(): any,
    buttonDisabled: boolean,
}

const ReleaseModal:FC<ModalProps> = ({open, setModal, startDate, endDate, setStartDate, setEndDate, submit, buttonDisabled}: any) => {
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
                <DialogTitle id="form-dialog-title">Vabasta koht</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Vali periood, mis ajaks koht vabastatakse teistele broneerimiseks
                    </DialogContentText>
                    <Grid container spacing={1} justify="space-around">
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
                    <Button  disabled={buttonDisabled} onClick={handleSubmit} color="primary">
                        Vabasta
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ReleaseModal