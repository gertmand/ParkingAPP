import React, { useState } from 'react';
import { User } from '../../../../store/types/userType';
import UsersDialogComponent from './usersDialogComponent';
import UsersTableComponent from './usersTableComponent';
//import { createStyles, makeStyles, Theme } from '@material-ui/core';

type TableProps = {
    users: User[];
  };

const UsersTable: React.FC<TableProps> = ({users}) => {
    //const classes = useStyles();
    //const [searchTerm, setSearchTerm] = useState('');
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

      <UsersTableComponent handleOpenUserDetailsModal={handleOpenUserDetailsModal} users={users} />
      </>
    )
}
// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     modal: {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       width: '1200px',
//       margin: 'auto'
//     },
//   })
// );

export default UsersTable
