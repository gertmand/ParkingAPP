import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,

  makeStyles, TextField
} from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import UserCars from '../../../../components/profile/userCars';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, ...rest }) => {
  const classes = useStyles();
  const userData = useSelector(state => state.user.userData);
  const [values, setValues] = useState();
  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };



  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
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
                value={userData.firstName || ''}
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
                value={userData.lastName || ''}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="E-mail"
                name="email"
                onChange={handleChange}
                required
                value={userData.email || ''}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Telefoni nr"
                name="phone"
                onChange={handleChange}
                required
                value={userData.phoneNr || ''}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        
        
        
      </Card>
      <Card>
        <CardHeader title="Sõidukid" />
        
        <UserCars/>
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button color="primary" variant="contained">
            Salvesta andmed
          </Button>
        </Box>
        </Card>
    </form>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;
