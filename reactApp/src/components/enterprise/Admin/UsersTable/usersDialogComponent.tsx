import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Input, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from '@material-ui/core';
import React, { FC } from 'react';
import { XCircle } from 'react-feather';
import { ParkingSpotMainUserResponse } from '../../../../store/types/enterpriseTypes';
import { SelectedUser } from '../../../../store/types/userType';
import ProfileDetails from '../../../../style/views/account/AccountView/ProfileDetails';
import SelectWorker from '../../Parking/selectWorker';

type Props = {
  open: boolean;
  inputFieldNumberBoolean?: boolean;
  inputFieldFileBoolean?: boolean;
  selectWorker? : boolean,
  existingUsers?: boolean,
  handleClose(): any;
  onSubmit?(): any;
  inputOnChange?: any,
  dialogTitle: string,
  dialogContextText?: string,
  confirmButton?: string,
  parkingSpotMainUsers?: ParkingSpotMainUserResponse[];
  regularUsers? : SelectedUser[],
  onFileChange?(event: any, values: any) : any,
  selectedUserChange?(event: any, values: any) : any,
  parkingSpotIdForUserAdd?: number,
};

export const UsersDialogComponent: FC<Props> = ({open,inputFieldNumberBoolean,selectWorker,inputFieldFileBoolean,onFileChange, selectedUserChange,parkingSpotIdForUserAdd, existingUsers, handleClose,onSubmit,inputOnChange, dialogTitle, dialogContextText, confirmButton, parkingSpotMainUsers, regularUsers}: any) => {

  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogContextText}
          </DialogContentText>
          <ProfileDetails className=''/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Loobu
          </Button>
          {confirmButton === undefined ? "" : 
          <Button onClick={onSubmit} color="primary" variant="contained">
          {confirmButton}
          </Button>
          }
          
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersDialogComponent;
