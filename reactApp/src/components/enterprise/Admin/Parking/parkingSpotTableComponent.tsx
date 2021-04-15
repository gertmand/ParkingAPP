import {InputAdornment,SvgIcon,TableCell,TableBody,Table,TextField,Tooltip,Button,ButtonGroup, TableRow} from '@material-ui/core';
import {DataGrid,GridColumns,GridValueGetterParams} from '@material-ui/data-grid';
import React, { FC, useState } from 'react';
import { PlusCircle, Search as SearchIcon, XCircle } from 'react-feather';
import {ParkingSpot,ParkingSpotMainUserResponse} from '../../../../store/types/enterpriseTypes';

type Props = {
  parkingSpotMainUsers: ParkingSpotMainUserResponse[];
  parkingSpots: ParkingSpot[];
  handleOpenParkingSpotMainUserAddModal(id: number): any;
  handleOpenDeleteConfirmationModal(): any;
  setParkingSpotId(parkingSpotId: number): any;
  parkingSpotLoading: boolean
};

export const ParkingSpotTableComponent: FC<Props> = ({parkingSpotMainUsers,parkingSpots,handleOpenParkingSpotMainUserAddModal,handleOpenDeleteConfirmationModal,setParkingSpotId, parkingSpotLoading}) => {
  const [searchTerm, setSearchTerm] = useState('');

  function getParkingSpotId(params: GridValueGetterParams) {
    return `${params.getValue('id')}`;
  }
  const handleDeleteButtonClick = (params: GridValueGetterParams) => {
    setParkingSpotId(+getParkingSpotId(params));
    handleOpenDeleteConfirmationModal();
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
      renderCell: (params: GridValueGetterParams) => {
        return (
          <Table>
            <TableBody>
              <TableRow>
              <TableCell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {parkingSpotMainUsers
                  .filter(x => x.parkingSpotId === +getParkingSpotId(params))
                  .map(x => x.mainUserFullName)}
              </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        );
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
              <Button
                onClick={() =>
                  handleOpenParkingSpotMainUserAddModal(
                    +getParkingSpotId(params)
                  )
                }
              >
                <PlusCircle color="#77d18f" />
              </Button>
            </Tooltip>
            <Tooltip title="Kustuta parkimiskoht">
              <Button onClick={() => handleDeleteButtonClick(params)}>
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
      <TextField
        variant="standard"
        onChange={event => {setSearchTerm(event.target.value);}}
        placeholder="otsi parkimiskohta..."
        InputProps={{startAdornment: (<InputAdornment position="start"><SvgIcon fontSize="small" color="action"><SearchIcon /></SvgIcon></InputAdornment>)}}
      />

      <DataGrid
        disableColumnMenu
        loading={parkingSpotLoading}
        disableSelectionOnClick
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

export default ParkingSpotTableComponent;