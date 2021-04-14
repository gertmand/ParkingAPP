import {
  Backdrop,
  Box,
  Button,
  CardMedia,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  Input,
  makeStyles,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Tooltip
} from '@material-ui/core';
import React, { FC, useState } from 'react';
import { XCircle } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../../store';
import {
  addParkingSpot,
  addParkingSpotPlan,
  deleteParkingSpot
} from '../../../../store/queries/enterpriseQueries';
import {
  ParkingSpot,
  ParkingSpotMainUserResponse
} from '../../../../store/types/enterpriseTypes';
import {
  SET_ERROR_ALERT,
  SET_SUCCESS_ALERT
} from '../../../common/siteActions';
import ParkingSpotTableComponent from './parkingSpotTableComponent';

type TableProps = {
  parkingSpots: ParkingSpot[];
  parkingSpotMainUsers: ParkingSpotMainUserResponse[];
  updateParkingSpots(): any;
};

const ParkingTable: FC<TableProps> = ({parkingSpots,parkingSpotMainUsers,updateParkingSpots}) => {

  const dispatch = useDispatch();
  const classes = useStyles();
  var formData = new FormData();
  let file: File;

  const [parkingSpotId, setParkingSpotId] = useState(0);
  const [parkingSpotIdForUserAdd, setParkingSpotIdForUserAdd] = useState(0);
  const [openParkingLotPlanModal, setParkingLotPlanModal] = React.useState(false);
  const [openParkingSpotAddModal, setParkingSpotAddModal] = React.useState(false);
  const [openParkingLotPlanAddModal,setParkingLotPlanAddModal] = React.useState(false);
  const [openDeleteConfirmationModal,setDeleteConfirmationModal] = React.useState(false);
  const [openParkingSpotMainUserAddModal,setParkingSpotMainUserAddModal] = React.useState(false);
  const [parkingSpotNr, setParkingSpotNr] = useState<number>(0);

  const enterpriseId = useSelector<AppState, number>(state => state.user.enterpriseData.id);

  const handleOpenParkingLotPlanModal = () => {setParkingLotPlanModal(true);};
  const handleCloseParkingLotPlanModal = () => {setParkingLotPlanModal(false);};
  
  const handleOpenDeleteConfirmationModal = () => {setDeleteConfirmationModal(true);};
  const handleCloseDeleteConfirmationModal = () => {setDeleteConfirmationModal(false);};

  const handleOpenAddParkingLotPlanModal = () => {setParkingLotPlanAddModal(true);};
  const handleCloseAddParkingLotPlanModal = () => {setParkingLotPlanAddModal(false);};

  const handleOpenAddParkingSpotAddModal = () => {setParkingSpotAddModal(true);};
  const handleCloseParkingSpotAddModal = () => {setParkingSpotAddModal(false);};

  const handleOpenParkingSpotMainUserAddModal = (parkingSpotIdForAdd: number) => {
    setParkingSpotIdForUserAdd(parkingSpotIdForAdd);
    setParkingSpotMainUserAddModal(true);
  };
  const handleCloseParkingSpotMainUserAddModal = () => {setParkingSpotMainUserAddModal(false);};

  const parkingSpotNumberChange = (e: any) => {
    setParkingSpotNr(+e.target.value);
    console.log(parkingSpotNr);
  };
  
  const submitParkingSpotAdd = () => {
    if (parkingSpotNr <= 0)
      return dispatch(
        SET_ERROR_ALERT({
          status: true,
          message: 'Palun sisesta 0-st suurem number!'
        })
      );
    parkingSpots
      .map(x => x.number)
      .forEach(number => {
        if (parkingSpotNr === number)
          return dispatch(
            SET_ERROR_ALERT({
              status: true,
              message: 'Sellise numbriga parkimiskoht on juba olemas!'
            })
          );
      });
    addParkingSpot({ number: parkingSpotNr }, enterpriseId).then(() => {
      setParkingSpotAddModal(false);
      updateParkingSpots();
      dispatch(
        SET_SUCCESS_ALERT({
          status: true,
          message: 'Parkimiskoht lisatud!'
        })
      );
    });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>): any => {
    if (e.target.files == null) {
      throw new Error('Error finding e.target.files');
    }
    file = e.target.files[0];
    formData.append('parkingLotPlan', file);
  };

  return (
    <>
      <Dialog
        open={openDeleteConfirmationModal}
        onClose={handleCloseDeleteConfirmationModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Kas oled kindel?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Kustutamine lisab parkimiskohale kustutamise kuupäeva kinnitamise
            hetke kellaajaga.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmationModal} color="primary">
            Loobu
          </Button>
          <Button
            onClick={() =>
              deleteParkingSpot(parkingSpotId)?.then(() => {
                setDeleteConfirmationModal(false);
                updateParkingSpots();
                dispatch(
                  SET_SUCCESS_ALERT({
                    status: true,
                    message: 'Parkimiskoht kustutatud!'
                  })
                );
              })
            }
          >
            Kustuta
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openParkingSpotMainUserAddModal}
        onClose={handleCloseParkingSpotMainUserAddModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Lisa või eemalda parkimiskoha peakasutajaid.'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Lisada saab vaid kasutajaid, kellel ei ole juba parkimiskohta.
          </DialogContentText>
          <Input
            disableUnderline
            type="file"
            onChange={onFileChange}
            id="input"
          />

          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Parkimiskoha peakasutajad:</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parkingSpotMainUsers
                  .filter(x => x.parkingSpotId === parkingSpotIdForUserAdd)
                  .map(row => (
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
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseParkingSpotMainUserAddModal}
            color="primary"
          >
            Loobu
          </Button>
          <Button>Lisa plaan</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openParkingLotPlanAddModal}
        onClose={handleCloseAddParkingLotPlanModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Vali fail ja kinnita.'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Uue plaani lisamisel kirjutatakse vanad väärtused üle.
          </DialogContentText>
          <Input
            disableUnderline
            type="file"
            onChange={onFileChange}
            id="input"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddParkingLotPlanModal} color="primary">
            Loobu
          </Button>
          <Button
            onClick={() =>
              addParkingSpotPlan(formData, enterpriseId).then(() => {
                handleCloseAddParkingLotPlanModal();
                dispatch(
                  SET_SUCCESS_ALERT({
                    status: true,
                    message: 'Parkla plaan lisatud!'
                  })
                );
              })
            }
            color="primary"
            variant="contained"
          >
            Lisa plaan
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openParkingSpotAddModal}
        onClose={handleCloseParkingSpotAddModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Sisesta uue parklakoha number'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sama numbriga parkimiskohta ei ole võimalik lisada.
          </DialogContentText>
          <Input
            placeholder="Sisesta number..."
            type="number"
            inputProps={{ min: 1 }}
            onChange={parkingSpotNumberChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseParkingSpotAddModal} color="primary">
            Loobu
          </Button>
          <Button
            onClick={submitParkingSpotAdd}
            color="primary"
            variant="contained"
          >
            Lisa parkimiskoht
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        className={classes.modal}
        open={openParkingLotPlanModal}
        onClose={handleCloseParkingLotPlanModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={openParkingLotPlanModal}>
          <div>
            <CardMedia
              component="img"
              src={
                process.env.PUBLIC_URL +
                '/images/Enterprise_' +
                enterpriseId +
                '.jpg'
              }
            />
          </div>
        </Fade>
      </Modal>

      <div style={{ width: '100%' }}>
        <Box display="flex" flexDirection="row" p={1} m={1}>
          <Box p={1}>
            <Button
              onClick={() => handleOpenAddParkingLotPlanModal()}
              color="primary"
              variant="contained"
            >
              Lisa uus parklaplaan
            </Button>
          </Box>
          <Box p={1}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleOpenParkingLotPlanModal}
            >
              Vaata parklaplaani
            </Button>
          </Box>
          <Box p={1}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleOpenAddParkingSpotAddModal}
            >
              Lisa parklakoht
            </Button>
          </Box>
        </Box>
      </div>

      <ParkingSpotTableComponent
        parkingSpots={parkingSpots}
        parkingSpotMainUsers={parkingSpotMainUsers}
        handleOpenDeleteConfirmationModal={handleOpenDeleteConfirmationModal}
        setParkingSpotId={setParkingSpotId}
        handleOpenParkingSpotMainUserAddModal={
          handleOpenParkingSpotMainUserAddModal
        }
      />
    </>
  );
};

export default ParkingTable;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '1200px',
      margin: 'auto'
    }
  })
);
