import { Tooltip, Button, makeStyles, InputAdornment, SvgIcon, TextField, ButtonGroup, Theme, Avatar } from '@material-ui/core'
import React from 'react'
import { User } from '../../../../store/types/userType';
import { Info, PlusCircle, Search as SearchIcon } from 'react-feather';
import { useState } from 'react';
import { DataGrid, GridColumns, GridValueGetterParams } from '@material-ui/data-grid';
import { createStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import theme from '../../../../style/theme';
import UsersTableComponent from './usersTableComponent';
import UsersDialogComponent from './usersDialogComponent';
type TableProps = {
    users: User[];
  };

const UsersTable: React.FC<TableProps> = ({users}) => {
    const classes = useStyles();
    const [searchTerm, setSearchTerm] = useState('');
    const [userIdForDetails, setUserIdForDetails] = useState(0);
    const [openUserDetailsModal,setOpenUserDetailsModal] = React.useState(false);
    const handleOpenUserDetailsModal = (userId: number) => {
      setUserIdForDetails(userIdForDetails);
      setOpenUserDetailsModal(true);
    };
    const handleCloseUserDetailsModal = () => {setOpenUserDetailsModal(false);};

    return (
      <>
      {/* Parkimiskoha kustutamise modaal */}
      <UsersDialogComponent 
        open={openUserDetailsModal} 
        handleClose={handleCloseUserDetailsModal}
        //onSubmit={confirmDeleteParkingSpot} 
        dialogTitle='Kasutaja info'
        //dialogContextText="Tere tere vana kere!"
        //confirmButton="Tagasi"
        />

      <UsersTableComponent
       handleOpenUserDetailsModal={handleOpenUserDetailsModal}
       users={users}
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
  })
);
export default UsersTable
