import { TableHead, TableRow, TableCell, TableBody, Table, Tooltip, Button, makeStyles, Box, InputAdornment, SvgIcon, TextField, ButtonGroup, Theme, Avatar } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'
import { User } from '../../../../store/types/userType';
import { PlusCircle, Search as SearchIcon, XCircle } from 'react-feather';
import { useState } from 'react';
import { DataGrid, GridColumns, GridValueGetterParams } from '@material-ui/data-grid';
import { createStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import theme from '../../../../style/theme';
import { count } from 'node:console';
import { Link as RouterLink, useLocation } from 'react-router-dom';
type TableProps = {
    users: User[];
  };

const UsersTable: React.FC<TableProps> = ({users}) => {
    const classes = useStyles();
    const [searchTerm, setSearchTerm] = useState('');
    // function getAvatar(params: GridValueGetterParams) {
    //   return `${params.getValue('avatar') || ''}`;
    // }
    const columns: GridColumns = [
        { field: 'id', headerName: '', hide: true },
        {
          field: 'Avatar',
          headerName: '',
          width: 190,
          align: 'center',
          headerAlign: 'center',
          // valueGetter: getAvatar,
          // renderCell: (params: GridValueGetterParams) => {
          //   return (
          //     <Avatar className={classes.avatar} component={RouterLink} src={"images/" + {getAvatar(Avatar)}} to="/profile"/>
          //   );
          // },
          renderCell: (params: GridValueGetterParams) => (
              <Avatar className={classes.avatar} style={{ margin: 'auto' }} src={"images/" + params.getValue('avatar')} />
          ),
        },
        {
            field: 'fullName',
            headerName: 'Nimi',
            width: 190,
            align: 'center',
            headerAlign: 'center',
            valueGetter: (params: GridValueGetterParams) =>
            `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
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
            field: 'carNumber',
            headerName: ' Auto reg. number',
            width: 200,
            flex: 75,
            headerAlign: 'center'
          },
        {
          field: 'tegevused',
          headerName: 'Tegevused',
          sortable: false,
          width: 150,
          disableClickEventBubbling: true,
          headerAlign: 'center',
        //   valueGetter: getParkingSpotId,
          renderCell: (params: GridValueGetterParams) => {
            return (
              <ButtonGroup>
                <Tooltip title="Lisa peakasutaja">
                  <Button>
                    <PlusCircle color="#77d18f" />
                  </Button>
                </Tooltip>
                {/* <Tooltip title="Kustuta parkimiskoht">
                  <Button
                    onClick={() =>
                      {setParkingSpotId(+getParkingSpotId(params)); handleOpenDeleteConfirmationModal();}
                    }
                  >
                    <XCircle color="#e08d8d" />
                  </Button>
                </Tooltip> */}
              </ButtonGroup>
            );
          }
        }
      ];
    return (
        <><Grid container spacing={3} style={{padding: theme.spacing(2)}}>
            <Grid item xs={11}>
        
        <TextField
        variant="standard"
        onChange={event => {
          setSearchTerm(event.target.value);
        }}
        placeholder="Otsi liiget..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SvgIcon fontSize="small" color="action">
                <SearchIcon />
              </SvgIcon>
            </InputAdornment>
          )
        }}
      /></Grid>
      <Grid item xs={1}>
            <Button color="primary" variant="contained">
                Lisa liige
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
    )
}
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
    },
    root: {
        marginTop: "15px"
      },
      avatar: {
        cursor: 'pointer',
        width: 40,
        height: 40,
      }
  })
);
export default UsersTable
