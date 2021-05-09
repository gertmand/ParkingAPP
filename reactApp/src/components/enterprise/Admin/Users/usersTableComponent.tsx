import {
  Avatar,
  Button,
  ButtonGroup,
  InputAdornment,
  SvgIcon,
  TextField,
  Tooltip
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {
  DataGrid,
  GridColumns,
  GridValueGetterParams
} from '@material-ui/data-grid';
import React, { FC, useState } from 'react';
import { Info, Search as SearchIcon } from 'react-feather';
import { User } from '../../../../store/types/userType';
import theme from '../../../../style/theme';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

type Props = {
  users: User[];
  handleOpenUserDetailsModal(id: number): any;
  handleOpenAddUsersModal(): any;
};

export const UsersTableComponent: FC<Props> = ({
  users,
  handleOpenUserDetailsModal,
  handleOpenAddUsersModal
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
      field: 'avatar',
      headerName: 'Avatar',
      width: 190,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridValueGetterParams) => (
        <Avatar
          style={{ margin: 'auto', width: 40, height: 40 }}
          src={'images/' + params.getValue('avatar')}
        />
      )
    },
    {
      field: 'fullName',
      headerName: 'Nimi',
      width: 190,
      align: 'center',
      flex: 75,
      headerAlign: 'center',
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`
    },
    {
      field: 'email',
      headerName: 'E-mail',
      width: 200,
      flex: 75,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'phoneNr',
      headerName: 'Telefoni nr',
      width: 200,
      flex: 75,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'accountCars',
      headerName: ' Auto reg. number',
      width: 200,
      flex: 75,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.accountCars.map((x: { regNr: string; }) => x.regNr).join(', ') || ''}`
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
            <Tooltip title="Detailid">
              <Button
                onClick={() =>
                  handleOpenUserDetailsModal(+getUserId(params))
                }
              >
                <Info color="#C0C0C0" />
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
      <Grid container justify="space-between" spacing={3} style={{ padding: theme.spacing(2) }}>
        <Grid item xs={6}>
          <TextField
            variant="standard"
            onChange={event => {
              setSearchTerm(event.target.value);
            }}
            placeholder="Otsi kasutajat..."
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
        </Grid>
        <Grid item xs={6}>
          <Button
            onClick={() =>
              handleOpenAddUsersModal()
            }
            color="primary" variant="contained" style={{float: "right"}}>
            Lisa liikmeid
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
        rows={users.filter(ps => {
          if (searchTerm === '') {
            return ps;
          } else if (
            (ps.firstName + ' ' + ps.lastName)
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

export default UsersTableComponent;
