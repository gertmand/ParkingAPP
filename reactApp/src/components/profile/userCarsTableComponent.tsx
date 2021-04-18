import {
    Avatar,
    Button,
    ButtonGroup,
    InputAdornment,
    SvgIcon,
    TextField,
    Tooltip
  } from '@material-ui/core';
  import DeleteIcon from '@material-ui/icons/Delete';
  import Grid from '@material-ui/core/Grid';
  import {
    DataGrid,
    GridColumns,
    GridValueGetterParams
  } from '@material-ui/data-grid';
  import React, { FC, useState } from 'react';
import { Car } from '../../store/types/userType';
  
  type Props = {
    cars: Car[];
    //handleOpenUserDetailsModal(id: number): any;
  };
  
  export const UserCarsTableComponent: FC<Props> = ({
    cars
    //handleOpenUserDetailsModal
  }) => {
    const [searchTerm, setSearchTerm] = useState('');
  
    function getUserId(params: GridValueGetterParams) {
      return `${params.getValue('id')}`;
    }
    //   const handleDeleteButtonClick = (params: GridValueGetterParams) => {
    //     setParkingSpotId(+getParkingSpotId(params));
    //     handleOpenDeleteConfirmationModal();
    //   };
  
    const columns: GridColumns = [
      { field: 'id', headerName: '', hide: true },
      {
        field: 'regNr',
        headerName: 'Reg Nr',
        width: 190,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'temporary',
        headerName: 'Ajutine?',
        width: 190,
        align: 'center',
        flex: 75,
        headerAlign: 'center',
      },
      {
        field: 'tegevused',
        headerName: 'Tegevused',
        sortable: false,
        width: 150,
        disableClickEventBubbling: true,
        headerAlign: 'center',
        flex: 75,
        valueGetter: getUserId,
        renderCell: (params: GridValueGetterParams) => {
          return (
            <ButtonGroup style={{ margin: 'auto' }}>
              <Tooltip title="Kustuta">
                <Button>
                  <DeleteIcon/>
                </Button>
              </Tooltip>
              {/* <Tooltip title="Kustuta parkimiskoht">
                <Button onClick={() => handleDeleteButtonClick(params)}>
                  <XCircle color="#e08d8d" />
                </Button>
              </Tooltip> */}
            </ButtonGroup>
          );
        }
      }
    ];
  
    return (
      <>
        <DataGrid
          disableColumnMenu
          localeText={{
            noRowsLabel: 'Andmed puuduvad!',
            footerRowSelected: count => `${count.toLocaleString()} rida valitud`
          }}
          autoHeight
          rows={cars}
          columns={columns}
          pageSize={10}
        />
      </>
    );
  };
  
  export default UserCarsTableComponent;
  