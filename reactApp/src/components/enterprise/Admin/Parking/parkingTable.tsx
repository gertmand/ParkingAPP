import { Backdrop, Box, Button, ButtonGroup, CardMedia, createStyles, Fade, InputAdornment, makeStyles, Modal, SvgIcon, TextField, Theme, Tooltip } from '@material-ui/core';
import { DataGrid, GridColumns, GridValueGetterParams } from '@material-ui/data-grid';
import React, { FC, useState } from 'react';
import { PlusCircle, Search as SearchIcon, XCircle } from 'react-feather';
import { useDispatch} from 'react-redux';
import { deleteParkingSpot } from '../../../../store/queries/enterpriseQueries';
import { ParkingSpot } from '../../../../store/types/enterpriseTypes';
import { SET_SUCCESS_ALERT } from '../../../common/siteActions';

type TableProps = {
    parkingSpots: ParkingSpot[],
    updateParkingSpots():any
  };

const ParkingTable:FC<TableProps>  = ({parkingSpots, updateParkingSpots}) => {
    const dispatch = useDispatch();
    const[searchTerm, setSearchTerm] = useState('')

    function getParkingSpotId(params: GridValueGetterParams) {
      return `${params.getValue('id')}`;
    }

    const columns: GridColumns = [
        { field: 'id', headerName : '', hide : true},
        { field: 'number', headerName: 'Parklakoha number', width: 190, align : 'center', headerAlign : 'center'},
        { field: 'mainUser', headerName: 'Peakasutaja(d)', width:200, headerAlign : 'center' },
        { field: 'carNumber', headerName: ' Auto reg. number', width: 200, headerAlign : 'center'},
        { field: "tegevused", headerName: "Tegevused", sortable: false, width: 150, disableClickEventBubbling: true, headerAlign : 'center', valueGetter:getParkingSpotId,
            renderCell: (params : GridValueGetterParams) => {
              return <ButtonGroup>
                <Tooltip title="Lisa peakasutaja"><Button><PlusCircle color="#77d18f"/></Button></Tooltip>
                <Tooltip title="Kustuta parkimiskoht"><Button onClick={() => deleteParkingSpot(+getParkingSpotId(params))?.then(()=>{updateParkingSpots(); dispatch(SET_SUCCESS_ALERT({status:true, message: "Parkimiskoht kustutatud!"}));})}><XCircle color="#e08d8d"/></Button></Tooltip>
                    </ButtonGroup>;
            }
          },
      ];

      const useStyles = makeStyles((theme: Theme) =>
      createStyles({
        modal: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          margin: 'auto',
        }
      }),
    );

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => { setOpen(true);};
  const handleClose = () => { setOpen(false);};

    return (
      <>
        <div style={{ width: '100%'}}>
        </div>
        <Box display="flex" justifyContent="flex-end"><Button color="primary" variant="contained" />Lisa parklakoht</Box>
        <Box display="flex" justifyContent="flex-end"><Button color="primary" variant="contained" onClick={handleOpen} />Parklaplaan</Box>
        <Modal
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div>
                <CardMedia component="img" image="https://bosch.io/wp-content/uploads/parking-lot-monitoring.jpg" />
            </div>
          </Fade>
        </Modal>

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
              noRowsLabel:'Andmed puuduvad!',
              footerRowSelected: (count) =>
                `${count.toLocaleString()} rida valitud`
            }}
            autoHeight
            rows={ parkingSpots.filter(ps => {
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
}

export default ParkingTable
