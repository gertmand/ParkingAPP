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
import { useSelector } from 'react-redux';
import { AppState } from '../../store';
import { User } from '../../store/types/userType';
import { XCircle } from 'react-feather';
  
type Props = {
  handleOpenDeleteConfirmationModal(): any;
  handleOpenAddCarModal(): any;
  setCarId: any;
  setCarRegNr: any;
};

  export const UserCarsTableComponent: FC<Props> = ({handleOpenDeleteConfirmationModal, handleOpenAddCarModal, setCarId, setCarRegNr}) => {
    const userData = useSelector<AppState, User>(state => state.user.userData);
    function getCarId(params: GridValueGetterParams) {
      return `${params.getValue('id')}`;
    }
      const handleDeleteButtonClick = (params: GridValueGetterParams) => {
        setCarId(+getCarId(params));
        setCarRegNr(`${params.getValue('regNr')}`)
        handleOpenDeleteConfirmationModal();
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
              <Tooltip title="Kustuta">
              <Button onClick={() => handleDeleteButtonClick(params)}>
                <XCircle color="#e08d8d" />
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
      <Grid container>
        <Grid item xs={6}>
        <CardHeader title="Sõidukid" />
        </Grid>
        <Grid item xs={6}>
          <Button color="primary" variant="contained" style={{float: "right"}}
          onClick={() => handleOpenAddCarModal()}>
            Lisa sõiduk
          </Button>
        </Grid>
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
  