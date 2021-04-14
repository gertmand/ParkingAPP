import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Input, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from '@material-ui/core';
import React, { FC } from 'react';
import { XCircle } from 'react-feather';
import { ParkingSpotMainUserResponse } from '../../../../store/types/enterpriseTypes';
import { SelectedUser } from '../../../../store/types/userType';
import SelectWorker from '../../Parking/selectWorker';

type Props = {
  open: boolean;
  inputFieldNumberBoolean?: boolean;
  inputFieldFileBoolean?: boolean;
  selectWorker? : boolean,
  existingUsers?: boolean,
  handleClose(): any;
  onSubmit(): any;
  inputOnChange?: any,
  dialogTitle: string,
  dialogContextText: string,
  confirmButton: string,
  parkingSpotMainUsers?: ParkingSpotMainUserResponse[];
  regularUsers? : SelectedUser[],
  onFileChange?(event: any, values: any) : any,
  selectedUserChange?(event: any, values: any) : any,
  parkingSpotIdForUserAdd?: number,
};

export const DialogComponent: FC<Props> = ({open,inputFieldNumberBoolean,selectWorker,inputFieldFileBoolean,onFileChange, selectedUserChange,parkingSpotIdForUserAdd, existingUsers, handleClose,onSubmit,inputOnChange, dialogTitle, dialogContextText, confirmButton, parkingSpotMainUsers, regularUsers}: any) => {

  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogContextText}
          </DialogContentText>
          {inputFieldNumberBoolean ? (
            <Input
              placeholder="Sisesta number..."
              type="number"
              inputProps={{ min: 1 }}
              onChange={inputOnChange}/>):''}

              {inputFieldFileBoolean? (<Input
              disableUnderline
              type="file"
              onChange={onFileChange}
              id="input"
            />):''}
        
          {selectWorker?(<SelectWorker data={regularUsers} onUserChange={selectedUserChange}/>) : ''}
          {existingUsers? (<TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Parkimiskoha peakasutajad:</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parkingSpotMainUsers
                  .filter((x: { parkingSpotId: any; }) => x.parkingSpotId === parkingSpotIdForUserAdd)
                  .map((row: { mainUserFullName: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {row.mainUserFullName}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Tooltip title="Eemalda kasutaja">
                          <Button>
                            <XCircle color="#e08d8d" />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>): ''}  
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Loobu
          </Button>
          <Button onClick={onSubmit} color="primary" variant="contained">
            {confirmButton}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogComponent;
