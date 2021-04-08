import { Box, Button, ButtonGroup, InputAdornment, SvgIcon, TextField, Tooltip } from '@material-ui/core';
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


    function getFullName(params: GridValueGetterParams) {
      return `${params.getValue('id')}`;
    }

    const columns: GridColumns = [
        { field: 'id', headerName : '', hide : true},
        { field: 'number', headerName: 'Parklakoha number', width: 190, align : 'center', headerAlign : 'center'},
        { field: 'mainUser', headerName: 'Peakasutaja(d)', width:200, headerAlign : 'center' },
        { field: 'carNumber', headerName: ' Auto reg. number', width: 200, headerAlign : 'center'},
        { field: "tegevused", headerName: "Tegevused", sortable: false, width: 150, disableClickEventBubbling: true, headerAlign : 'center', valueGetter:getFullName,
            renderCell: (params : GridValueGetterParams) => {
              return <ButtonGroup>
                <Tooltip title="Lisa peakasutaja"><Button><PlusCircle color="#77d18f"/></Button></Tooltip>
                <Tooltip title="Kustuta parkimiskoht"><Button onClick={() => deleteParkingSpot(+getFullName(params))?.then(()=>{updateParkingSpots(); dispatch(SET_SUCCESS_ALERT({status:true, message: "Parkimiskoht kustutatud!"}));})}><XCircle color="#e08d8d"/></Button></Tooltip>
                    </ButtonGroup>;
            }
          },
      ];


    return (
      <>
        <div style={{ width: '100%'}}>
        </div>
        <Box display="flex" justifyContent="flex-end">
          <Button color="primary" variant="contained">
            Lisa parklakoht
          </Button>
        </Box>
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
