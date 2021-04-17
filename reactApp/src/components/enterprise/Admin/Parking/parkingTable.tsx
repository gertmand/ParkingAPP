import { Backdrop, Button, CardMedia, createStyles, Fade, Grid, makeStyles, Modal, Theme } from '@material-ui/core';
import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../../store';
import { addParkingSpot, addParkingSpotMainUser, addParkingSpotPlan, deleteParkingSpot } from '../../../../store/queries/enterpriseQueries';
import { ParkingSpot, ParkingSpotMainUserResponse } from '../../../../store/types/enterpriseTypes';
import { SelectedUser } from '../../../../store/types/userType';
import { SET_ERROR_ALERT, SET_SUCCESS_ALERT } from '../../../common/siteActions';
import DialogComponent from './dialogComponent';
import ParkingSpotTableComponent from './parkingSpotTableComponent';

type TableProps = {
  parkingSpots: ParkingSpot[];
  parkingSpotMainUsers: ParkingSpotMainUserResponse[];
  regularUsers : SelectedUser[],
  updateParkingSpots(): any;
  parkingSpotLoading: boolean;
};

const ParkingTable: FC<TableProps> = ({parkingSpots,parkingSpotMainUsers,regularUsers, updateParkingSpots, parkingSpotLoading}) => {

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
  const [regularUserId, setRegularUserId] = useState<number>(0);

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

  const parkingSpotNumberChange = (e: any) => {setParkingSpotNr(+e.target.value);};

  const confirmDeleteParkingSpot = () => {
    deleteParkingSpot(parkingSpotId, enterpriseId)?.then(() => {
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

  const confirmAddParkingSpotPlan = () => {
    addParkingSpotPlan(formData, enterpriseId).then(() => {
      handleCloseParkingLotPlanModal();
      handleCloseAddParkingLotPlanModal();
      dispatch(
        SET_SUCCESS_ALERT({
          status: true,
          message: 'Parkla plaan lisatud!'
        })
      );
    })
  }

  const selectedUserChange = (event: any, values: any) => {
    if (values) {
      setRegularUserId(values.id);
    }
  }

  const addMainUser = () => {
    addParkingSpotMainUser({accountId:regularUserId,parkingSpotId:parkingSpotIdForUserAdd}, enterpriseId);
  }
  
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
    console.log(e.target.files[0])
  };

  return (
    <>
      {/* Parkimiskoha kustutamise modaal */}
      <DialogComponent
        open={openDeleteConfirmationModal}
        handleClose={handleCloseDeleteConfirmationModal}
        onSubmit={confirmDeleteParkingSpot}
        dialogTitle="Kas oled kindel?"
        dialogContextText="Kustutamine lisab parkimiskohale kustutamise kuupäeva kinnitamise hetke kellaajaga."
        confirmButton="Kustuta"
      />
      {/* Parkimiskoha peakasutaja lisamise/eemaldamise modaal */}
      <DialogComponent
        open={openParkingSpotMainUserAddModal}
        handleClose={handleCloseParkingSpotMainUserAddModal}
        onSubmit={addMainUser}
        dialogTitle="Lisa või eemalda parkimiskoha peakasutajaid"
        dialogContextText="Lisada saab vaid kasutajaid, kellel ei ole juba parkimiskohta."
        confirmButton="Lisa peakasutaja"
        selectWorker
        existingUsers
        parkingSpotMainUsers={parkingSpotMainUsers}
        regularUsers={regularUsers}
        selectedUserChange={selectedUserChange}
        parkingSpotIdForUserAdd={parkingSpotIdForUserAdd}
      />
      {/* Parkimismaja plaani lisamise modaal */}
      <DialogComponent
        open={openParkingLotPlanAddModal}
        handleClose={handleCloseAddParkingLotPlanModal}
        onSubmit={confirmAddParkingSpotPlan}
        inputOnChange={parkingSpotNumberChange}
        inputFieldFileBoolean
        onFileChange={onFileChange}
        dialogTitle="Vali fail ja kinnita."
        dialogContextText="Uue plaani lisamisel kirjutatakse vanad väärtused üle."
        confirmButton="Lisa plaan"
      />
      {/* Parkimiskoha lisamise modaal */}
      <DialogComponent
        open={openParkingSpotAddModal}
        handleClose={handleCloseParkingSpotAddModal}
        onSubmit={submitParkingSpotAdd}
        inputOnChange={parkingSpotNumberChange}
        inputFieldNumberBoolean
        dialogTitle="Sisesta uue parklakoha number"
        dialogContextText="Sama numbriga parkimiskohta ei ole võimalik lisada."
        confirmButton="Lisa parkimiskoht"
      />

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
          <Button fullWidth onClick={() => handleOpenAddParkingLotPlanModal()} color="primary" variant="contained">Lisa uus parklaplaan</Button>
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

      <Grid container justify="flex-end" spacing={1}>
        <Grid item>
          <Button color="primary" variant="contained" onClick={handleOpenParkingLotPlanModal}>
            Vaata parklaplaani
          </Button>
        </Grid>
        <Grid item>
          <Button color="primary" variant="contained" onClick={handleOpenAddParkingSpotAddModal}>
            Lisa parklakoht
          </Button>
        </Grid>
      </Grid>

      <ParkingSpotTableComponent
        parkingSpots={parkingSpots}
        parkingSpotMainUsers={parkingSpotMainUsers}
        handleOpenDeleteConfirmationModal={handleOpenDeleteConfirmationModal}
        setParkingSpotId={setParkingSpotId}
        handleOpenParkingSpotMainUserAddModal={handleOpenParkingSpotMainUserAddModal}
        parkingSpotLoading={parkingSpotLoading}
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
    },
  })
);
