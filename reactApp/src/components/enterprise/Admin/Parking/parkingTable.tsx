import {
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  CardMedia,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  Input,
  InputAdornment,
  makeStyles,
  Modal,
  SvgIcon,
  TableCell,
  TextField,
  Theme,
  Tooltip
} from '@material-ui/core';
import {
  DataGrid,
  GridColumns,
  GridValueGetterParams
} from '@material-ui/data-grid';
import React, { FC, useState } from 'react';
import { PlusCircle, Search as SearchIcon, XCircle } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../../store';
import {
  addParkingSpot,
  addParkingSpotPlan,
  deleteParkingSpot
} from '../../../../store/queries/enterpriseQueries';
import { ParkingSpot, ParkingSpotMainUserResponse } from '../../../../store/types/enterpriseTypes';
import { SET_ERROR_ALERT, SET_SUCCESS_ALERT } from '../../../common/siteActions';

type TableProps = {
  parkingSpots: ParkingSpot[];
  parkingSpotMainUsers: ParkingSpotMainUserResponse[];
  updateParkingSpots(): any;
};

const ParkingTable: FC<TableProps> = ({ parkingSpots, parkingSpotMainUsers, updateParkingSpots }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  var formData = new FormData();
  let file: File;
  const [searchTerm, setSearchTerm] = useState('');
  const [parkingSpotId, setParkingSpotId] = useState(0);
  const [openParkingLotPlanModal, setParkingLotPlanModal] = React.useState(false);
  const [openParkingSpotAddModal, setParkingSpotAddModal] = React.useState(false);
  const [openParkingLotPlanAddModal, setParkingLotPlanAddModal] = React.useState(false);
  const [openDeleteConfirmationModal, setDeleteConfirmationModal] = React.useState(false);
  const [parkingSpotNr, setParkingSpotNr] = useState<number>(0);
  const enterpriseId = useSelector<AppState, number>(
    state => state.user.enterpriseData.id
  );
  
  function getParkingSpotId(params: GridValueGetterParams) {
    return `${params.getValue('id')}`;
  }
  const handleOpenParkingLotPlanModal = () => {
    setParkingLotPlanModal(true);
  };
  const handleCloseParkingLotPlanModal = () => {
    setParkingLotPlanModal(false);
  };
  const handleOpenDeleteConfirmationModal = () => {
    setDeleteConfirmationModal(true);
  };
  const handleCloseDeleteConfirmationModal = () => {
    setDeleteConfirmationModal(false);
  };

  const handleOpenAddParkingLotPlanModal = () => {
    setParkingLotPlanAddModal(true);
  };
  const handleCloseAddParkingLotPlanModal = () => {
    setParkingLotPlanAddModal(false);
  };

  const handleOpenAddParkingSpotAddModal = () => {
    setParkingSpotAddModal(true);
  };
  const handleCloseParkingSpotAddModal = () => {
    setParkingSpotAddModal(false);
  };

  const parkingSpotNumberChange = (e: any) => {
    setParkingSpotNr(+e.target.value);
    console.log(parkingSpotNr);
  }
  const submitParkingSpotAdd = () => {
    if(parkingSpotNr <= 0) return dispatch(SET_ERROR_ALERT({status: true, message: "Palun sisesta 0-st suurem number!"}));
    parkingSpots.map(x=>x.number).forEach((number) => {
    if(parkingSpotNr === number) return dispatch(SET_ERROR_ALERT({status: true, message: "Sellise numbriga parkimiskoht on juba olemas!"}));
    });

    addParkingSpot({number: parkingSpotNr}, enterpriseId).then(() => {
      setParkingSpotAddModal(false);
      updateParkingSpots();
      dispatch(
        SET_SUCCESS_ALERT({
          status: true,
          message: 'Parkimiskoht lisatud!'
        })
      );
    });
  }
  
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>): any => {
    if (e.target.files == null) {
      throw new Error('Error finding e.target.files');
    }
    file = e.target.files[0];
    formData.append('parkingLotPlan', file);
  };
  const columns: GridColumns = [
    { field: 'id', headerName: '', hide: true },
    {
      field: 'number',
      headerName: 'Parklakoha number',
      width: 190,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'mainUser',
      headerName: 'Peakasutaja(d)',
      width: 200,
      flex: 75,
      headerAlign: 'center',
      valueGetter: getParkingSpotId,
      renderCell:(params: GridValueGetterParams)=>{
        return <TableCell style={{whiteSpace: "normal",wordWrap: "break-word"}}>
                  {parkingSpotMainUsers.filter(x=>x.parkingSpotId === +getParkingSpotId(params)).map(x=>x.mainUserFullName)}
               </TableCell>;
      }
    },
    {
      field: 'carNumber',
      headerName: ' Auto reg. number',
      width: 200,
      flex: 75,
      headerAlign: 'center'
    },
    {
      field: 'reservationStatus',
      headerName: ' Staatus',
      width: 200,
      headerAlign: 'center'
    },
    {
      field: 'tegevused',
      headerName: 'Tegevused',
      sortable: false,
      width: 150,
      disableClickEventBubbling: true,
      headerAlign: 'center',
      valueGetter: getParkingSpotId,
      renderCell: (params: GridValueGetterParams) => {
        return (
          <ButtonGroup>
            <Tooltip title="Lisa peakasutaja">
              <Button>
                <PlusCircle color="#77d18f" />
              </Button>
            </Tooltip>
            <Tooltip title="Kustuta parkimiskoht">
              <Button
                onClick={() =>
                  {setParkingSpotId(+getParkingSpotId(params)); handleOpenDeleteConfirmationModal();}
                }
              >
                <XCircle color="#e08d8d" />
              </Button>
            </Tooltip>
          </ButtonGroup>
        );
      }
    }
  ];

  return (
    <>




      <Dialog
        open={openDeleteConfirmationModal}
        onClose={handleCloseDeleteConfirmationModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Kas oled kindel?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Kustutamine lisab parkimiskohale kustutamise kuupäeva kinnitamise hetke kellaajaga.
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
              >Kustuta
              </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={openParkingLotPlanAddModal}
        onClose={handleCloseAddParkingLotPlanModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Vali fail ja kinnita."}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Uue plaani lisamisel kirjutatakse vanad väärtused üle. 
          </DialogContentText>
          <Input disableUnderline type="file" onChange={onFileChange} id="input" />
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
              >Lisa plaan
              </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openParkingSpotAddModal}
        onClose={handleCloseParkingSpotAddModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Sisesta uue parklakoha number"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sama numbriga parkimiskohta ei ole võimalik lisada. 
          </DialogContentText>
          <Input placeholder="Sisesta number..." type="number" inputProps={{min:1}} onChange={parkingSpotNumberChange}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseParkingSpotAddModal} color="primary">
            Loobu
          </Button>
          <Button
                onClick={submitParkingSpotAdd}
                color="primary"
                variant="contained"
              >Lisa parkimiskoht
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
              onClick={() =>
                handleOpenAddParkingLotPlanModal()
              }
              color="primary"
              variant="contained"
            >
              Lisa uus parklaplaan
            </Button>
          </Box>
          <Box p={1}>
            <Button color="primary" variant="contained" onClick={handleOpenParkingLotPlanModal}>
              Vaata parklaplaani
            </Button>
          </Box>
          <Box p={1}>
            <Button color="primary" variant="contained" onClick={handleOpenAddParkingSpotAddModal}>
              Lisa parklakoht
            </Button>
          </Box>
        </Box>
      </div>


      <TextField
        variant="standard"
        onChange={event => {
          setSearchTerm(event.target.value);
        }}
        placeholder="otsi parkimiskohta..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SvgIcon fontSize="small" color="action">
                <SearchIcon />
              </SvgIcon>
            </InputAdornment>
          )
        }}
      />
      <DataGrid
        disableColumnMenu
        localeText={{
          noRowsLabel: 'Andmed puuduvad!',
          footerRowSelected: count => `${count.toLocaleString()} rida valitud`
        }}
        autoHeight
        
        rows={parkingSpots.filter(ps => {
          if (searchTerm === '') {
            return ps;
          } else if (
            ps.number
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          ) {
            return ps;
          }
          return null;
        })}
        columns={columns}
        pageSize={10}
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
    rows: {
      whiteSpace: 'normal',
      wordBreak: 'break-word'
    }
  })
);
