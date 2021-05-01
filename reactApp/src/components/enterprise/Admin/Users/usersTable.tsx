import React, { useState } from 'react';
import { User } from '../../../../store/types/userType';
import AddUsersDialog from './addUsersDialog';
import UsersDialogComponent from './usersDialogComponent';
import UsersTableComponent from './usersTableComponent';
//import { createStyles, makeStyles, Theme } from '@material-ui/core';

type TableProps = {
    users: User[];
  };

const UsersTable: React.FC<TableProps> = ({users}) => {
    //const classes = useStyles();
    //const [searchTerm, setSearchTerm] = useState('');
    const [userIdForDetails, setUserIdForDetails] = useState<number>();
    const [openUserDetailsModal, setOpenUserDetailsModal] = React.useState(false);
    const [openAddUsersModal, setOpenAddUsersModal] = React.useState(false);

    const handleOpenUserDetailsModal = (userIdForDetails: number) => {
      setUserIdForDetails(userIdForDetails);
      setOpenUserDetailsModal(true);
    };
    const handleOpenAddUsersModal = () => {
      setOpenAddUsersModal(true);
    };

    const handleCloseUserDetailsModal = () => {setOpenUserDetailsModal(false);};

    const handleCloseAddUsersModal = () => {setOpenAddUsersModal(false);};

    return (
      <>
      {/* Kasutaja detailide modaal */}
      <UsersDialogComponent 
        open={openUserDetailsModal}
        userIdForDetails={userIdForDetails} 
        handleClose={handleCloseUserDetailsModal}
        dialogTitle='Kasutaja info'
        />

      {/* Kasutajate lisamise modaal */}
      <AddUsersDialog 
      open={openAddUsersModal}
      handleClose={handleCloseAddUsersModal}
      dialogTitle='Kasutajate lisamine'
      confirmButton='Lisa liikmed'
      dialogContextText='Mitme emaili korraga lisamiseks eraldage meilid tühikuga!'/>
      
      {/* Kasutajate tabel */}
      <UsersTableComponent handleOpenAddUsersModal={handleOpenAddUsersModal} handleOpenUserDetailsModal={handleOpenUserDetailsModal} users={users} />
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
