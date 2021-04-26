import {
    Card
  } from '@material-ui/core';
  import React from 'react';
import UserCars from '../components/profile/userCars';
import UserDetails from '../components/profile/userDetails';

export const ProfilePage = () => {
    
    return (
        <form
        autoComplete="off"
        noValidate
      >
        <Card>
          <UserDetails />
        </Card>
        <Card>
          <UserCars />
        </Card>
      </form>
    );
  }

export default ProfilePage;