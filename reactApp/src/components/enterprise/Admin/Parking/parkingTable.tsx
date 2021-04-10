import { Backdrop, Box, Button, ButtonGroup, CardMedia, createStyles, Fade, Input, InputAdornment, makeStyles, Modal, SvgIcon, TextField, Theme, Tooltip } from '@material-ui/core';
import { DataGrid, GridColumns, GridValueGetterParams } from '@material-ui/data-grid';
import React, { FC, useState } from 'react';
import { PlusCircle, Search as SearchIcon, XCircle } from 'react-feather';
import { useDispatch, useSelector} from 'react-redux';
import { AppState } from '../../../../store';
import { addParkingSpotPlan, deleteParkingSpot } from '../../../../store/queries/enterpriseQueries';
import { ParkingSpot } from '../../../../store/types/enterpriseTypes';
import { SET_SUCCESS_ALERT } from '../../../common/siteActions';

type TableProps = {
    parkingSpots: ParkingSpot[],
    updateParkingSpots():any
  };

const ParkingTable:FC<TableProps>  = ({parkingSpots, updateParkingSpots}) => {
    const dispatch = useDispatch();
    const[searchTerm, setSearchTerm] = useState('')
    const enterpriseId = useSelector<AppState, number>(state => state.user.enterpriseData.id)
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
  var formData=new FormData();
  let file : File;
const onFileChange = (e: React.ChangeEvent<HTMLInputElement>):any => {
   if ( e.target.files == null ) {
      throw new Error("Error finding e.target.files"); 
   }
   file = e.target.files[0];
 }

 const upload = () =>{

  formData.append('parkingLotPlan',file);
  addParkingSpotPlan(formData, enterpriseId);
 } 





    return (
      <>
        <Input 
          className="inputFieldWidth margins"
          type="file"
          name="enterprise_"
          onChange={onFileChange}
          id="input"
        />
        <Button onClick={upload} onSubmit={(e)=>e.preventDefault()} color="primary" variant="contained">Lisa plaan</Button>
        <div style={{ width: '100%'}}>
        </div>
        <Box display="flex" justifyContent="flex-end"><Button color="primary" variant="contained">Lisa parklakoht</Button></Box>
        <Box display="flex" justifyContent="flex-end"><Button color="primary" variant="contained" onClick={handleOpen} >Parklaplaan</Button></Box>
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
            <CardMedia component="img" src={process.env.PUBLIC_URL + '/images/Enterprise_' + enterpriseId +'.jpg'} /> 
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
