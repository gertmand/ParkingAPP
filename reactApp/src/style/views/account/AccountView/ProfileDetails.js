import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes, { checkPropTypes } from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import {UserCar} from '../../../../store/types/userType';
import { stringify } from 'querystring';
import { User } from 'react-feather';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { apiUrl } from '../../../../_helpers/apiUrl';

// const useStyles = makeStyles(() => ({
//   root: {}
// }));

// const ProfileDetails = ({ className, ...rest }) => {
  
//   // return (
//   //   <form
//   //     autoComplete="off"
//   //     noValidate
//   //     className={clsx(classes.root, className)}
//   //     {...rest}
//   //   >
//   //     {/* <Card>
//   //       <CardHeader
//   //         subheader=""
//   //         title="Sinu sõiduk"
//   //       />
//   //       <Divider />
//   //       <CardContent>
//   //         <Grid
//   //           container
//   //           spacing={3}
//   //         > */}
//   //           {/* <Grid
//   //             item
//   //             md={6}
//   //             xs={12}
//   //           >
//   //             <TextField
//   //               fullWidth
//   //               helperText=""
//   //               label="First name"
//   //               name="firstName"
//   //               onChange={handleChange}
//   //               required
//   //               value={userData.firstName}
//   //               variant="outlined"
//   //             />
//   //           </Grid>
//   //           <Grid
//   //             item
//   //             md={6}
//   //             xs={12}
//   //           >
//   //             <TextField
//   //               fullWidth
//   //               label="Last name"
//   //               name="lastName"
//   //               onChange={handleChange}
//   //               required
//   //               value={userData.lastName}
//   //               variant="outlined"
//   //             />
//   //           </Grid>
//   //           <Grid
//   //             item
//   //             md={6}
//   //             xs={12}
//   //           >
//   //             <TextField
//   //               fullWidth
//   //               label="Email Address"
//   //               name="email"
//   //               onChange={handleChange}
//   //               required
//   //               value={userData.email}
//   //               variant="outlined"
//   //             />
//   //           </Grid> */}
//   //           {/* <Grid
//   //             item
//   //             md={6}
//   //             xs={12}
//   //           >
//   //             <TextField
//   //               fullWidth
//   //               label="Numbrimärk"
//   //               name="regNr"
//   //               onChange={handleChange}
//   //               value={car.regNr}
//   //               variant="outlined"
//   //             />
//   //           </Grid> */}
//   //           {/* <Grid
//   //             item
//   //             md={6}
//   //             xs={12}
//   //           >
//   //             <TextField
//   //               fullWidth
//   //               label="Country"
//   //               name="country"
//   //               onChange={handleChange}
//   //               required
//   //               value={values.country}
//   //               variant="outlined"
//   //             />
//   //           </Grid>
//   //           <Grid
//   //             item
//   //             md={6}
//   //             xs={12}
//   //           >
//   //             <TextField
//   //               fullWidth
//   //               label="Select State"
//   //               name="state"
//   //               onChange={handleChange}
//   //               required
//   //               select
//   //               SelectProps={{ native: true }}
//   //               value={values.state}
//   //               variant="outlined"
//   //             >
//   //               {states.map((option) => (
//   //                 <option
//   //                   key={option.value}
//   //                   value={option.value}
//   //                 >
//   //                   {option.label}
//   //                 </option>
//   //               ))}
//   //             </TextField>
//   //           </Grid> */}
//   //         </Grid>
//   //       </CardContent>
//   //       <Divider />
//   //       <Box
//   //         display="flex"
//   //         justifyContent="flex-end"
//   //         p={2}
//   //       >
//   //         <Button
//   //           color="primary"
//   //           variant="contained"
//   //           onClick={ConfirmCar}
//   //         >
//   //           Salvesta
//   //         </Button>
//   //       </Box>
//   //     </Card>
//   //   </form>
//   );
// };

// ProfileDetails.propTypes = {
//   className: PropTypes.string
// };

// export default ProfileDetails;
