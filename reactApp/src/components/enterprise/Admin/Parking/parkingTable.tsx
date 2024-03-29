import { Backdrop, Button, CardMedia, createStyles, Fade, Grid, InputAdornment, makeStyles, Modal, SvgIcon, TextField, Theme } from '@material-ui/core';
import React, { FC, useState } from 'react';
import { Search as SearchIcon } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../../store';
import { addParkingSpot, addParkingSpotMainUser, addParkingSpotPlan, deleteParkingSpot } from '../../../../store/queries/enterpriseQueries';
import { ParkingSpot, ParkingSpotMainUserResponse} from '../../../../store/types/enterpriseTypes';
import { SelectedUser, User } from '../../../../store/types/userType';
import theme from '../../../../style/theme';
import { SET_ERROR_ALERT, SET_SUCCESS_ALERT } from '../../../common/siteActions';
import DialogComponent from './dialogComponent';
import ParkingSpotTableComponent from './parkingSpotTableComponent';

type TableProps = {
  parkingSpots: ParkingSpot[];
  parkingSpotMainUsers: ParkingSpotMainUserResponse[];
  regularUsers : SelectedUser[],
  updateParkingSpots(): any;
  parkingSpotLoading: boolean;
  updateParkingSpotMainUsers(): any;
  updateSpotTable(): any;
  enterpriseUsers : User[]
};

const ParkingTable: FC<TableProps> = ({
  enterpriseUsers,
  parkingSpots,
  parkingSpotMainUsers,
  regularUsers,
  updateSpotTable,
  updateParkingSpotMainUsers, 
  updateParkingSpots, 
  parkingSpotLoading}) => {

  const dispatch = useDispatch();
  const classes = useStyles();
  var formData = new FormData();
  let file: File;

  const [searchTerm, setSearchTerm] = useState('');
  const [parkingSpotId, setParkingSpotId] = useState(0);
  const [parkingSpotIdForUserAdd, setParkingSpotIdForUserAdd] = useState(0);
  const [openParkingLotPlanModal, setParkingLotPlanModal] = React.useState(false);
  const [openParkingSpotAddModal, setParkingSpotAddModal] = React.useState(false);
  const [openParkingLotPlanAddModal,setParkingLotPlanAddModal] = React.useState(false);
  const [openDeleteConfirmationModal,setDeleteConfirmationModal] = React.useState(false);
  const [openParkingSpotMainUserAddModal,setParkingSpotMainUserAddModal] = React.useState(false);
  const [parkingSpotNr, setParkingSpotNr] = useState<number>(0);
  const [regularUserId, setRegularUserId] = useState<number>(0);
  const [checked, setChecked] = useState(false);
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
      updateParkingSpotMainUsers();
      updateSpotTable();
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
          message: 'Parklaplaan lisatud!'
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
    addParkingSpotMainUser({accountId:regularUserId,parkingSpotId:parkingSpotIdForUserAdd, canBook:checked}, enterpriseId).then(() => 
    {
      handleCloseParkingSpotMainUserAddModal();
      updateParkingSpotMainUsers();
      updateSpotTable();
      dispatch(
        SET_SUCCESS_ALERT({
          status: true,
          message: 'Peakasutaja lisatud!'
        })
      );
    });
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
    addParkingSpot({ number: parkingSpotNr}, enterpriseId ).then(() => {
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
        checked={checked}
        setChecked={setChecked}
        updateParkingSpotMainUsers={updateParkingSpotMainUsers}
        updateSpotTable={updateSpotTable}
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
        updateParkingSpots={updateParkingSpots} 
        setParkingSpotAddModal={setParkingSpotAddModal}
        checked={checked}
        setChecked={setChecked}
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
          <Button fullWidth onClick={() => handleOpenAddParkingLotPlanModal()} color="primary" variant="contained">Lisa parklaplaan</Button>
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
      

      <Grid container justify="space-between" direction="row" spacing={3} style={{ padding: theme.spacing(2) }} >
          <Grid item xs={12} sm={4} md={6}>
              <TextField
              className={classes.searchBox}
              variant="standard"
              onChange={event => {setSearchTerm(event.target.value);}}
              placeholder="Otsi.."
              InputProps={{startAdornment: (<InputAdornment position="start"><SvgIcon fontSize="small" color="action"><SearchIcon /></SvgIcon></InputAdornment>)}}
            />
          </Grid>
          <Grid item xs={12} sm={8} md={6}>
            <div className={classes.buttonGroup}>
                <Button className={classes.toolbarButton} onClick={handleOpenParkingLotPlanModal} >
                  Parklaplaan
                </Button>
                <Button className={classes.toolbarButton} color="primary" variant="contained" onClick={handleOpenAddParkingSpotAddModal} >
                  Lisa parklakoht
                </Button>
            </div>
          </Grid>
      </Grid>

      <ParkingSpotTableComponent
        enterpriseUsers ={enterpriseUsers}
        searchTerm={searchTerm}
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
      width: '1000px',
      margin: 'auto'
    },
    buttonGroup: {
      [theme.breakpoints.down('sm')]: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      },
      [theme.breakpoints.up('sm')]: {
        float: "right"
      },
    },
    toolbarButton: {
      [theme.breakpoints.down('sm')]: {
        marginLeft: "15px"
      },
      [theme.breakpoints.up('sm')]: {
        marginLeft: "15px"
      },
    },
    searchBox: {
      [theme.breakpoints.down('sm')]: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }
    }
  })
);
