import { Box, Button, makeStyles } from '@material-ui/core';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../store';

type Props = {
    addReservationButton: boolean,
    handleGiveSpot(e: any): any,
    handleRelease(e: any): any,
    handleBook(e: any): any,
    spotButtons: boolean
}

const Toolbar:FC<Props> = ({addReservationButton, handleGiveSpot, handleRelease, handleBook, spotButtons}) => {
    const classes = useStyles();
    const canBook = useSelector<AppState, boolean>(state => state.user.enterpriseUserData.canBook)

    return (
        <div style={{marginBottom: "15px"}}>
            <Box display="flex" justifyContent="flex-end" >
            {spotButtons === true && 
                <Button className={classes.importButton} onClick={() => handleGiveSpot(true)}>
                    LAENA KOHT
                </Button>
            }
            {spotButtons === true && 
                <Button className={classes.exportButton} onClick={() => handleRelease(true)}>
                    VABASTA KOHT
                </Button>
            }
                {addReservationButton === true || canBook === true ? 
                    <Button color="primary" variant="contained" onClick={() => handleBook(true)}>
                        OTSI KOHTA
                    </Button> : null
                }
            </Box>
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {},
    importButton: {
      marginRight: theme.spacing(1)
    },
    exportButton: {
      marginRight: theme.spacing(1)
    }
  }));

export default Toolbar
