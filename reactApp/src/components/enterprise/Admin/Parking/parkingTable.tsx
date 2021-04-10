import {
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  CardMedia,
  createStyles,
  Fade,
  Input,
  InputAdornment,
  makeStyles,
  Modal,
  SvgIcon,
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
  addParkingSpotPlan,
  deleteParkingSpot
} from '../../../../store/queries/enterpriseQueries';
import { ParkingSpot } from '../../../../store/types/enterpriseTypes';
import { SET_SUCCESS_ALERT } from '../../../common/siteActions';

type TableProps = {
  parkingSpots: ParkingSpot[];
  updateParkingSpots(): any;
};

const ParkingTable: FC<TableProps> = ({ parkingSpots, updateParkingSpots }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  var formData = new FormData();
  let file: File;
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = React.useState(false);
  const enterpriseId = useSelector<AppState, number>(
    state => state.user.enterpriseData.id
  );
  function getParkingSpotId(params: GridValueGetterParams) {
    return `${params.getValue('id')}`;
  }
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
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
      headerAlign: 'center'
    },
    {
      field: 'carNumber',
      headerName: ' Auto reg. number',
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
                  deleteParkingSpot(+getParkingSpotId(params))?.then(() => {
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
    <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
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
            <Input type="file" onChange={onFileChange} id="input" />
          </Box>
          <Box p={1}>
            <Button
              onClick={() =>
                addParkingSpotPlan(formData, enterpriseId).then(() => {
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
              Lisa uus parklaplaan
            </Button>
          </Box>
          <Box p={1}>
            <Button color="primary" variant="contained" onClick={handleOpen}>
              Vaata parklaplaani
            </Button>
          </Box>
          <Box p={1}>
            <Button color="primary" variant="contained">
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
    }
  })
);
