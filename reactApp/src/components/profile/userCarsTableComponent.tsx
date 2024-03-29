import {
  Button,
  ButtonGroup,



  CardHeader,



  Grid,



  Tooltip
} from '@material-ui/core';
import {
  DataGrid,
  GridColumns,
  GridValueGetterParams
} from '@material-ui/data-grid';
import React, { FC } from 'react';
import { XCircle } from 'react-feather';
  
type Props = {
  handleOpenDeleteConfirmationModal?(): any;
  handleOpenAddCarModal?(): any;
  setCarId?: any;
  setCarRegNr?: any;
  userData: any;
  dataForAdmin: boolean;
};

  export const UserCarsTableComponent: FC<Props> = ({dataForAdmin, userData, handleOpenDeleteConfirmationModal, handleOpenAddCarModal, setCarId, setCarRegNr}) => {
    function getCarId(params: GridValueGetterParams) {
      return `${params.getValue('id')}`;
    }
      const handleDeleteButtonClick = (params: GridValueGetterParams) => {
        if (handleOpenDeleteConfirmationModal !== undefined)
        {
        setCarId(+getCarId(params));
        setCarRegNr(`${params.getValue('regNr')}`)
        handleOpenDeleteConfirmationModal();
        }
      };
      
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
        hide: dataForAdmin,
        field: 'tegevused',
        headerName: 'Tegevused',
        sortable: false,
        width: 150,
        disableClickEventBubbling: true,
        headerAlign: 'center',
        flex: 75,
        valueGetter: getCarId,
        renderCell: (params: GridValueGetterParams) => {
          return (
            <ButtonGroup style={{ margin: 'auto' }}>
              {!dataForAdmin ? 
              <Tooltip title="Kustuta">
              <Button onClick={() => handleDeleteButtonClick(params)}>
                <XCircle color="#e08d8d" />
              </Button>
              </Tooltip>
             : ''}
             </ButtonGroup>
          );
        }
      }
    ];
    console.log(userData)
    console.log(userData.accountCars)
    return (
      <>
      <Grid container>
        <Grid item xs={6}>
        <CardHeader title="Sõidukid" />
        </Grid>
        {!dataForAdmin ?
        <Grid item xs={6}>
          <Button color="primary" variant="contained" style={{float: "right"}}
          onClick={() => {handleOpenAddCarModal !== undefined ? handleOpenAddCarModal() : setCarId()}
            }>
            Lisa sõiduk
          </Button>
        </Grid> : ''}
      </Grid>
        <DataGrid
          disableColumnMenu
          localeText={{
            noRowsLabel: 'Andmed puuduvad!',
            footerRowSelected: count => `${count.toLocaleString()} rida valitud`
          }}
          autoHeight
          rows={userData.accountCars === undefined ? [] : userData.accountCars}
          columns={columns}
          pageSize={10}
        />
      </>
    );
  };
  
  export default UserCarsTableComponent;
  