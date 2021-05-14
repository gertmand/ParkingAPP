import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../../store';
import { deleteUser, getEnterpriseUsers } from '../../../../store/queries/enterpriseQueries';
import { User } from '../../../../store/types/userType';
import { SET_SUCCESS_ALERT } from '../../../common/siteActions';
import DialogComponent from '../Parking/dialogComponent';
import AddUsersDialog from './addUsersDialog';
import UsersDialogComponent from './usersDialogComponent';
import UsersTableComponent from './usersTableComponent';
//import { createStyles, makeStyles, Theme } from '@material-ui/core';

type TableProps = {
    users: User[];
    setEnterpriseUsers(res: any): any
  };

const UsersTable: React.FC<TableProps> = ({users, setEnterpriseUsers}) => {
    //const classes = useStyles();
    //const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const [userIdForDetails, setUserIdForDetails] = useState<number>();
    const [openUserDetailsModal, setOpenUserDetailsModal] = React.useState(false);
    const [openAddUsersModal, setOpenAddUsersModal] = React.useState(false);
    const [openDeleteConfirmationModal,setDeleteConfirmationModal] = React.useState(false);
    const enterpriseId = useSelector<AppState, number>(state => state.user.enterpriseData.id);

    const handleOpenUserDetailsModal = (userIdForDetails: number) => {
      setUserIdForDetails(userIdForDetails);
      setOpenUserDetailsModal(true);
    };
    const handleOpenAddUsersModal = () => {
      setOpenAddUsersModal(true);
    };

    const handleCloseUserDetailsModal = () => {setOpenUserDetailsModal(false);};

    const handleCloseAddUsersModal = () => {setOpenAddUsersModal(false);};

    const handleOpenDeleteConfirmationModal = () => {setDeleteConfirmationModal(true);};
    const handleCloseDeleteConfirmationModal = () => {setDeleteConfirmationModal(false);};

    const confirmDeleteUser = () => {
      if (userIdForDetails !== undefined)
      deleteUser(userIdForDetails, enterpriseId)?.then(() => {
        setDeleteConfirmationModal(false);
        getEnterpriseUsers(enterpriseId).then(
          result => setEnterpriseUsers(result)
        )
        dispatch(
          SET_SUCCESS_ALERT({
            status: true,
            message: 'Liige eemaldatud asutuse nimekirjast!'
          })
        );
      })
    }

    return (
      <>
      {/* Kasutaja detailide modaal */}
      <UsersDialogComponent 
        open={openUserDetailsModal}
        userIdForDetails={userIdForDetails} 
        handleClose={handleCloseUserDetailsModal}
        />

      {/* Kasutajate lisamise modaal */}
      <AddUsersDialog 
      open={openAddUsersModal}
      handleClose={handleCloseAddUsersModal}
      dialogTitle='Kasutajate lisamine'
      confirmButton='Lisa liikmed'
      />

      {/* Kasutaja kustutamise modaal */}
      <DialogComponent
        open={openDeleteConfirmationModal}
        handleClose={handleCloseDeleteConfirmationModal}
        onSubmit={confirmDeleteUser}
        dialogTitle="Kas oled kindel?"
        dialogContextText={'Kas olete kindel, et soovite liikme ' + users.find(x => x.id == userIdForDetails)?.firstName + ' ' + users.find(x => x.id == userIdForDetails)?.lastName + ' eemaldada asutuse nimekirjast?'}
        confirmButton="Eemalda"
      />

      {/* Kasutajate tabel */}
      <UsersTableComponent 
      handleOpenAddUsersModal={handleOpenAddUsersModal} 
      handleOpenUserDetailsModal={handleOpenUserDetailsModal}
      setUserIdForDetails={setUserIdForDetails} 
      handleOpenDeleteConfirmationModal={handleOpenDeleteConfirmationModal}
      users={users} />
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
