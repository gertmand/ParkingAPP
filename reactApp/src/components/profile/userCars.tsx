import { Box, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'
import UserCarsTableComponent from './userCarsTableComponent'

const UserCars = () => {
    const classes = useStyles();
    // const [cars, setCars] = useState<Car[]>([]);
    const handleOpenDeleteConfirmationModal = () => {setDeleteConfirmationModal(true);};
    const handleCloseDeleteConfirmationModal = () => {setDeleteConfirmationModal(false);};
    const [openDeleteConfirmationModal,setDeleteConfirmationModal] = React.useState(false);

    return (
        <div>
            
              <Box className={clsx(classes.root)}>
                <UserCarsTableComponent handleOpenDeleteConfirmationModal={handleOpenDeleteConfirmationModal}/>

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
