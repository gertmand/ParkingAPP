import React, { useState } from 'react'
import {
    Box,
    Button,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField
  } from '@material-ui/core';
  import { useDispatch, useSelector } from 'react-redux';
import { User } from '../../store/types/userType';
import { AppState } from '../../store';
import { editAccount, getUserData } from '../../store/queries/userQueries';
import { SET_ERROR_ALERT, SET_SUCCESS_ALERT } from '../common/siteActions';

const UserDetails = () => {
    const userData = useSelector<AppState, User>(state => state.user.userData);
    const dispatch = useDispatch();
    
    const [state, setState] = useState({
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNr: userData.phoneNr,
      });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [event.target.name]: event.target.value });
      };

    const confirmEditUser = () => {
        if (state.firstName.length > 30 || state.firstName === '' ||
            state.lastName.length > 30 || state.lastName === '' ||
            state.phoneNr.length > 30 || state.phoneNr === '')
            return dispatch(
                SET_ERROR_ALERT({
                status: true,
                message: 'Väljad peavad olema täidetud!'
                })
            );
        editAccount({firstName: state.firstName, lastName: state.lastName, phoneNr: state.phoneNr})?.then(() => {
            getUserData(dispatch, false)
            dispatch(
              SET_SUCCESS_ALERT({
                status: true,
                message: 'Kasutaja andmed uuendatud!'
              })
            );
          }).catch((err: any) => {
            console.log(err)
          })
        }

    return (
        <div>
        <CardHeader subheader="Andmeid on võimalik muuta" title="Profiil" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                //helperText="Palun täpsustage eesnimi"
                label="Eesnimi"
                name="firstName"
                onChange={handleChange}
                required
                value={state.firstName || ''}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Perekonnanimi"
                name="lastName"
                onChange={handleChange}
                required
                value={state.lastName || ''}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Telefoni nr"
                name="phoneNr"
                onChange={handleChange}
                required
                value={state.phoneNr || ''}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button color="primary" variant="contained"
          onClick={() => confirmEditUser()}>
            Salvesta andmed
          </Button>
        </Box>
        </div>        
    )
}
export default UserDetails
