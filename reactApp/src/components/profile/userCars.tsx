import { Divider, CardContent, TextField, FormControlLabel, Checkbox, Container, Grid, Box, Card, CardHeader, Button, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getUserCarsData } from '../../store/queries/userQueries'
import { Car } from '../../store/types/userType'
import UserCarsTableComponent from './userCarsTableComponent'

const UserCars = () => {
    const classes = useStyles();
    const [cars, setCars] = useState<Car[]>([]);
    const dispatch = useDispatch();

    useEffect(() => {
    getUserCarsData(dispatch)
    .then((result: any) => {
        setCars(result);
        console.log(result)
        }).catch(err => {
        console.log(err)
    })
    }, [cars])

    return (
        <div>
            <Container>
            <Grid container spacing={3}>
            <Grid item xs={6}>
              <Box className={clsx(classes.root)}>
                <UserCarsTableComponent cars={cars}/>

                {/* <Box className={clsx(classes.root)}><Card><CardHeader title="SÕIDUKI LISAMINE" />
                  <Divider /><CardContent><TextField
                    fullWidth
                    label="Numbrimärk"
                    name="lastName"
                    onChange={handleCarChange}
                    required
                    variant="outlined"
                  />
                    <FormControlLabel
                      control={<Checkbox checked={temporary} onChange={handleChange} name="temporary" />}
                      label="Ajutine?"
                    /></CardContent><Divider />
                  <Box display="flex" justifyContent="left" p={2}><Button
                    className={classes.autodeButton}
                    color="primary"
                    variant="contained"
                    onClick={ConfirmCar}

                  >
                    Lisa sõiduk
                </Button></Box></Card></Box> */}


              </Box></Grid></Grid></Container>
        </div>
    )
}
const useStyles = makeStyles(theme => ({
    root: {
      height: '100%',
      paddingTop: theme.spacing(1),
      maxWidth: '100%'
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
