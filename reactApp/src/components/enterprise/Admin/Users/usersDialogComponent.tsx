import { AppBar, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, Grid, makeStyles, Paper, Tab, Tabs, Theme } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../store';
import { getEnterpriseParkingSpotDataAdmin, getEnterpriseUserDataAdmin, getUserDetails, getUserLogs } from '../../../../store/queries/enterpriseQueries';
import { EnterpriseParkingSpotData, EnterpriseUserData, Log, ParkingSpotMainUserResponse } from '../../../../store/types/enterpriseTypes';
import { SelectedUser, User } from '../../../../store/types/userType';
import UserLogs from './UsersDialogTabComponents/userLogs';
import UsersDetails from './UsersDialogTabComponents/usersDetailsComponent';
import UsersParkingComponent from './UsersDialogTabComponents/usersParkingComponent';

type Props = {
  open: boolean;
  inputFieldNumberBoolean?: boolean;
  inputFieldFileBoolean?: boolean;
  selectWorker? : boolean,
  existingUsers?: boolean,
  handleClose(): any;
  onSubmit?(): any;
  inputOnChange?: any,
  dialogTitle?: string,
  dialogContextText?: string,
  confirmButton?: string,
  parkingSpotMainUsers?: ParkingSpotMainUserResponse[];
  regularUsers? : SelectedUser[],
  onFileChange?(event: any, values: any) : any,
  selectedUserChange?(event: any, values: any) : any,
  userIdForDetails: number | undefined
};

export const UsersDialogComponent: FC<Props> = ({userIdForDetails,open,inputFieldNumberBoolean,selectWorker,inputFieldFileBoolean,onFileChange, selectedUserChange,parkingSpotIdForUserAdd, existingUsers, handleClose,onSubmit,inputOnChange, dialogTitle, dialogContextText, confirmButton, parkingSpotMainUsers, regularUsers}: any) => {
  const [userData, setUserData] = useState<User>();
  const [userDataAdmin, setuserDataAdmin] = useState<EnterpriseUserData>();
  const [parkingSpotData, setparkingSpotData] = useState<EnterpriseParkingSpotData>();
  const [userLogData, setUserLogData] = useState<Log[]>();
  const [value, setValue] = React.useState(0);
  const enterpriseId = useSelector<AppState, number>(state => state.user.enterpriseData.id);
  const [maxWidth,] = React.useState<DialogProps['maxWidth']>('lg');

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const classes = useStyles();

  useEffect(() => {
    if (userIdForDetails !== undefined)
    {
    getUserDetails(userIdForDetails, enterpriseId)
    .then((result: any) => {
      setUserData(result);
      console.log(result)
    }).catch(err => {
      console.log(err)
    })
    getEnterpriseUserDataAdmin(enterpriseId, userIdForDetails)
    .then((result: any) => {
      setuserDataAdmin(result);
      console.log(result)
    }).catch(err => {
      console.log(err)
  })
    getEnterpriseParkingSpotDataAdmin(enterpriseId, userIdForDetails)
      .then((result: any) => {
        setparkingSpotData(result);
        console.log(result)
      }).catch(err => {
        console.log(err)
    })
    getUserLogs(enterpriseId, userIdForDetails)
      .then((result: any) => {
        setUserLogData(result);
      }).catch(err => {
        console.log(err)
    })
  }
}, [userIdForDetails, enterpriseId])

  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" classes={{ paper: classes.dialogPaper }} fullWidth={true} maxWidth={maxWidth} >
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent >
          <DialogContentText id="alert-dialog-description" >
            {dialogContextText}
          </DialogContentText>

          <Container maxWidth={false} >
          <Grid container spacing={1} >
            <Grid item xs={12}>
              <div className={classes.root}>
                <Paper>
                  <AppBar position="static">
                    <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="off" aria-label="scrollable prevent tabs example">
                      <Tab label="Kontaktandmed" aria-label="contact" {...a11yProps(0)} />
                      <Tab label="Broneeringud" aria-label="bron" {...a11yProps(1)} />
                      <Tab label="Logid" aria-label="logs" {...a11yProps(2)} />
                    </Tabs>
                  </AppBar>
                  <TabPanel value={value} index={0}>
                    {userData === undefined ? '' : 
                    <UsersDetails userData={userData} className=''/>}
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <UsersParkingComponent userData={userDataAdmin} parkingSpotData={parkingSpotData}/>
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    {userLogData !== undefined  && userData !== undefined? <UserLogs userName={userData.firstName + ' ' + userData.lastName} userLogs={userLogData}/> : ''}
                  </TabPanel>
                </Paper>
              </div>
            </Grid>
          </Grid>
        </Container>

    
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Loobu
          </Button>
          {confirmButton === undefined ? "" : 
          <Button onClick={onSubmit} color="primary" variant="contained">
          {confirmButton}
          </Button>
          }
          
        </DialogActions>
      </Dialog>
    
      
    </>
  );

  interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
  }
  
  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-prevent-tabpanel-${index}`}
        aria-labelledby={`scrollable-prevent-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <div>{children}</div>
          </Box>
        )}
      </div>
    );
  }
  
  function a11yProps(index: any) {
    return {
      id: `scrollable-prevent-tab-${index}`,
      'aria-controls': `scrollable-prevent-tabpanel-${index}`,
    };
  }
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    
    minHeight: '100%',
  paddingBottom: theme.spacing(3),
  paddingTop: theme.spacing(3)
  },
  height: {
      maxHeight: '25%',
      marginLeft: -12,
      margin: 0
  },
  card: {
      margin: 0,
      marginLeft: 7,
      color: theme.palette.text.secondary,
  },
  dialogPaper: {
    minHeight: "75vh",
    maxHeight: "75vh"
  }
}));

export default UsersDialogComponent;
