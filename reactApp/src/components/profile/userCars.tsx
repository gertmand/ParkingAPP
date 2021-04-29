import { Box, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../store'
import { addCar, deleteCar, getUserData } from '../../store/queries/userQueries'
import { User } from '../../store/types/userType'
import { SET_ERROR_ALERT, SET_SUCCESS_ALERT } from '../common/siteActions'
import DialogComponent from '../enterprise/Admin/Parking/dialogComponent'
import UserCarsTableComponent from './userCarsTableComponent'

const UserCars = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const userData = useSelector<AppState, User>(state => state.user.userData);
    const handleOpenDeleteConfirmationModal = () => {setDeleteConfirmationModal(true);};
    const handleCloseDeleteConfirmationModal = () => {setDeleteConfirmationModal(false);};

    const handleOpenAddCarModal = () => {setAddCarModal(true);};
    const handleCloseAddCarModal = () => {setAddCarModal(false);};

    const handleCarChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      setAddCarRegNr(event.target.value as string);
    };

    const handleAddCarTemporaryChange = (e: any) => {setChecked(e.target.checked);};

    const [openAddCarModal,setAddCarModal] = React.useState(false);
    const [openDeleteConfirmationModal,setDeleteConfirmationModal] = React.useState(false);
    const [carId, setCarId] = useState<number>(0);
    const [regNr, setCarRegNr] = useState<string>('');
    const [addRegNr, setAddCarRegNr] = useState<string>('');
    const [checked, setChecked] = useState(false);

    const confirmDeleteCar = () => {
      deleteCar({id: carId, regNr: regNr})?.then(() => {
        setDeleteConfirmationModal(false);
        getUserData(dispatch, false)
        dispatch(
          SET_SUCCESS_ALERT({
            status: true,
            message: 'Sõiduk numbrimärgiga ' + regNr + ' kustutatud!'
          })
        );
      })
    }

    const confirmAddCar = () => {
      if (addRegNr.length > 10 || addRegNr === '')
      return dispatch(
        SET_ERROR_ALERT({
          status: true,
          message: 'Palun sisestage korrektne numbrimärk!'
        })
      );
      addCar({regNr: addRegNr, temporary: checked})?.then(() => {
        setAddCarModal(false);
        getUserData(dispatch, false)
        dispatch(
          SET_SUCCESS_ALERT({
            status: true,
            message: 'Sõiduk lisatud!'
          })
        );
      }).catch((err: any) => {
        console.log(err)
      })
    }

    return (
        <div>
              {/* Sõiduki kustutamise modaal */}
              <DialogComponent
                open={openDeleteConfirmationModal}
                handleClose={handleCloseDeleteConfirmationModal}
                onSubmit={confirmDeleteCar}
                dialogTitle="Kas oled kindel?"
                dialogContextText={"Kas olete kindel, et soovite kustutada sõidukit numbrimärgiga " + regNr + "?"}
                confirmButton="Kustuta"
                checked={checked}
                setChecked={setChecked}
              />
              {/* Sõiduki lisamise modaal */}
              <DialogComponent
                open={openAddCarModal}
                handleClose={handleCloseAddCarModal}
                onSubmit={confirmAddCar}
                dialogTitle="Sõiduki lisamine"
                dialogContextText={"Sisestage oma sõiduki andmed"}
                confirmButton="Lisa sõiduk"
                checked={checked}
                setChecked={setChecked}
                handleAddCarTemporaryChange={handleAddCarTemporaryChange}
                openAddCarModal={openAddCarModal}
                inputOnChange={handleCarChange}
              />
              {/* Sõidukite tabel */}
              <Box className={clsx(classes.root)}>
                <UserCarsTableComponent
                  dataForAdmin={false}
                  userData = {userData}
                  setCarId={setCarId}
                  setCarRegNr={setCarRegNr}
                  handleOpenDeleteConfirmationModal={handleOpenDeleteConfirmationModal}
                  handleOpenAddCarModal={handleOpenAddCarModal}
                  />
              </Box>
        </div>
    )
}
const useStyles = makeStyles(theme => ({
    root: {
      height: '100%',
      paddingTop: theme.spacing(0),
      maxWidth: '100%',
      margin: theme.spacing(2)
    },
    formControl: {
      margin: theme.spacing(0),
      minWidth: '100%',
    },
    LisamiseButton: {
      marginRight: theme.spacing(1)
    },
    autodeButton: {
      paddingTop: theme.spacing(1)
    },
  }));

export default UserCars
