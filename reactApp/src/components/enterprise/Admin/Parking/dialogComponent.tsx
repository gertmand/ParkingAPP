import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Input, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@material-ui/core';
import React, { FC } from 'react';
import { XCircle } from 'react-feather';
import { useDispatch } from 'react-redux';
import { changeCanBook, deleteParkingSpotMainUser } from '../../../../store/queries/enterpriseQueries';
import { ParkingSpotMainUserResponse } from '../../../../store/types/enterpriseTypes';
import { SelectedUser } from '../../../../store/types/userType';
import { ExcelReader } from '../../../../_helpers/excelReader';
import { SET_SUCCESS_ALERT } from '../../../common/siteActions';
import SelectWorker from '../../Parking/selectWorker';

type Props = {
  open: boolean;
  checked?: boolean;
  setChecked?:any
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
  onFileChange?(event: any) : any,
  selectedUserChange?(event: any, values: any) : any,
  parkingSpotIdForUserAdd?: number,
  updateParkingSpotMainUsers?() : any,
  updateSpotTable?(): any,
  redButton?: boolean,
  enterpriseId?: number,
  updateParkingSpots?(): any,
  setParkingSpotAddModal?(e : any) : any,
  openAddCarModal?: boolean,
  handleAddCarTemporaryChange?: any
};

export const DialogComponent: FC<Props> = ({
  open,
  checked,
  setChecked,
  updateSpotTable,
  updateParkingSpotMainUsers, 
  inputFieldNumberBoolean,
  selectWorker,
  inputFieldFileBoolean,
  onFileChange, 
  selectedUserChange,
  parkingSpotIdForUserAdd, 
  existingUsers, 
  handleClose,
  onSubmit,
  inputOnChange, 
  dialogTitle, 
  dialogContextText, 
  confirmButton, 
  parkingSpotMainUsers,
  regularUsers,
  redButton,
  enterpriseId,
  updateParkingSpots,
  setParkingSpotAddModal,
  openAddCarModal,
  handleAddCarTemporaryChange
}) => {

  const dispatch = useDispatch();

  const handleBookingRight = async (enterpriseId:number, accountId: number) => {
      changeCanBook(enterpriseId, accountId).then(()=>{
        updateParkingSpotMainUsers!();
        updateSpotTable!();
        dispatch(
          SET_SUCCESS_ALERT({
            status: true,
            message: 'Kasutaja õigus broneerida muudetud!'
          })
        );

      });
  }

  const removeParkingSpotMainUser = (enterpriseId:number, accountId: number, parkingSpotId:number) => {
    deleteParkingSpotMainUser(enterpriseId,accountId, parkingSpotId).then(()=>{
      updateParkingSpotMainUsers!();
      updateSpotTable!();
      dispatch(
        SET_SUCCESS_ALERT({
          status: true,
          message: 'Peakasutaja eemaldatud!'
        })
      );
    });

  }


  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogContextText}
          </DialogContentText>

          {inputFieldNumberBoolean ? (
            <div>
            <Input
            style={{width: "100%"}}
              placeholder="Sisesta parklakoha number..."
              type="number"
              inputProps={{ min: 1 }}
              onChange={inputOnChange}/>
              <p> </p>
            <DialogContentText id="alert-dialog-description">
            Või lisa kohad exceli tabelist. NB! Failis peab parkimiskohtade numbrite tulba pealkiri olema "Number"
            </DialogContentText>  
            <ExcelReader updateParkingSpots={updateParkingSpots!} setParkingSpotAddModal={setParkingSpotAddModal!} /> 
              </div>):''}
          
          {inputFieldFileBoolean? (<Input disableUnderline type="file" onChange={onFileChange!} id="input"/>):''}
        
          {selectWorker?(
          <>  
          <SelectWorker data={regularUsers!} onUserChange={selectedUserChange!}/>
          <FormControlLabel
          value="end"
          control={<Checkbox color="primary" checked={checked} onChange={() => setChecked(!checked)}/>}
          label="Kasutajale lisatakse broneerimisõigus"
          labelPlacement="end"
          /></> ) : ''}

          {existingUsers? (
            <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Broneerimisõigus</TableCell>
                  <TableCell>Parkimiskoha peakasutaja(d):</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parkingSpotMainUsers && parkingSpotMainUsers
                  .filter(x => x.parkingSpotId === parkingSpotIdForUserAdd)
                  .map(row => (
                    <TableRow key={row.accountId}>
                      <TableCell>
                        <Checkbox defaultChecked={row.canBook} disableRipple onChange={()=>handleBookingRight(row.enterpriseId, row.accountId)}/>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.mainUserFullName}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Tooltip title="Eemalda kasutaja">
                          <Button onClick={()=>removeParkingSpotMainUser(row.enterpriseId,row.accountId,row.parkingSpotId)}>
                            <XCircle color="#e08d8d" />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
                  </TableContainer>): ''}  
          
            {openAddCarModal ? (
            <div>
              <TextField
                fullWidth
                label="Numbrimärk"
                name="regNr"
                onChange={inputOnChange}
                required
                variant="outlined"
              />
                <p></p>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleAddCarTemporaryChange}
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label="Ajutine?"
                  />
            </div>
            ):''}

        </DialogContent>
        <DialogActions>
          <Button onClick={()=>handleClose()} color="primary">
            Sulge
          </Button>
          { redButton ? 
            <Button style={{backgroundColor: "#F40B0B"}} onClick={onSubmit} color="primary" variant="contained">
              {confirmButton}
            </Button> 
          : 
            <Button onClick={onSubmit} color="primary" variant="contained">
              {confirmButton}
            </Button>}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogComponent;

