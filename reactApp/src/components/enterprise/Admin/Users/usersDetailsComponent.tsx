import {
    Avatar, Card,
    CardContent,


    Grid,

    makeStyles, TextField
} from '@material-ui/core';
import clsx from 'clsx';
import React, { FC } from 'react';
import { User } from '../../../../store/types/userType';
import UserCarsTableComponent from '../../../profile/userCarsTableComponent';
  
  const useStyles = makeStyles(() => ({
    root: {},
  }));

  type Props = {
   className: any
   userData: User
  };
  
  const UsersDetails: FC<Props> = ({ userData, className, ...rest }) => {
    const classes = useStyles();
    
  
  
    return (
      <form
        autoComplete="off"
        noValidate
        className={clsx(classes.root, className)}
        {...rest}
      >
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item  xs={12}>
              <Avatar
                style={{ margin: 'auto', width: 80, height: 80 }}
                src={'images/' + userData.avatar}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Eesnimi"
                  name="firstName"
                  value={userData.firstName || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Perekonnanimi"
                  name="lastName"
                  value={userData.lastName || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="E-mail"
                  name="email"
                  value={userData.email || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Telefon"
                  name="phone"
                  value={userData.phoneNr || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid item  xs={12}>
              <UserCarsTableComponent
                  dataForAdmin={true}
                  userData = {userData}
                  />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    );
  };
  
  export default UsersDetails;
  