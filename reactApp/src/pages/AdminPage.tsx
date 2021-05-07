import { Container, Grid, Paper, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ParkingTable from '../components/enterprise/Admin/Parking/parkingTable';
import UsersTable from '../components/enterprise/Admin/Users/usersTable';
import EnterpriseLogs from '../components/enterprise/enterpriseLogs';
import { AppState } from '../store';
import { getAccountsWithoutSpot, getEnterpriseParkingSpotData, getEnterpriseParkingSpots, getEnterpriseUserData, getEnterpriseUsers, getParkingSpotMainUsers } from '../store/queries/enterpriseQueries';
import { Enterprise } from '../store/types/enterpriseTypes';
import Page from '../style/Page';


  export const AdminPage = (props: any) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [value, setValue] = React.useState(1);
    const [enterpriseUsers, setEnterpriseUsers] = useState([]);
    const [parkingSpotMainUsers, setParkingSpotMainUsers] = useState([]);
    const [enterpriseParkingSpots, setEnterpriseParkingSpots] = useState([]);
    const [regularUsers, setRegularUsers] = useState([]);
    const enterpriseId = useSelector<AppState, number>(state => state.user.enterpriseData.id)
    const enterpriseData = useSelector<AppState, Enterprise>(state => state.user.enterpriseData)
    const [parkingLoading, setParkingLoading] = useState(true)
  
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
    };
  
    useEffect(() => {
      if (enterpriseUsers !== undefined && enterpriseUsers.length === 0 && parkingSpotMainUsers !== undefined && parkingSpotMainUsers.length === 0 && regularUsers.length === 0 && enterpriseId !== undefined)
      {
        updateParkingSpots()
        getEnterpriseUsers(enterpriseId).then(result => {
          setEnterpriseUsers(result);
        })
        getParkingSpotMainUsers(enterpriseId).then(result => {
          setParkingSpotMainUsers(result);
        })
        getAccountsWithoutSpot(enterpriseId).then(data => setRegularUsers(data));
        
      }
      // eslint-disable-next-line
    }, [enterpriseUsers,parkingSpotMainUsers, regularUsers, enterpriseId])

    const updateSpotTable = () => {
      if(enterpriseId !== undefined) {            
          getEnterpriseUserData(enterpriseId, dispatch, false); 
          getEnterpriseParkingSpotData(enterpriseId, dispatch, false); 
      }
    }

    const updateParkingSpots = async () => {
      setParkingLoading(true)
      if (enterpriseParkingSpots !== undefined && enterpriseId !== undefined)
      {
        await getEnterpriseParkingSpots(enterpriseId).then(async result => {
          await setEnterpriseParkingSpots(result);
          setParkingLoading(false)
        }).catch((e: any) => {
          console.log(e)
          setParkingLoading(false)
        })
      }
    }

    const updateParkingSpotMainUsers = async () => {
      setParkingLoading(true)
      if (parkingSpotMainUsers !== undefined && regularUsers!==undefined && enterpriseId !== undefined)
      {
        await getParkingSpotMainUsers(enterpriseId).then(async result => {
          await setParkingSpotMainUsers(result);
          setParkingLoading(false)
        }).catch((e: any) => {
          console.log(e)
          setParkingLoading(false)
        })

        await getAccountsWithoutSpot(enterpriseId).then(async result => {
          await setRegularUsers(result);
          setParkingLoading(false)
        }).catch((e: any) => {
          console.log(e)
          setParkingLoading(false)
        })
      }
    }
    
    return (
      <Page {...props.children} className={classes.root} title="Parking Solutions - Admin">
        <Container maxWidth={false}>
          <Grid container spacing={1} className={classes.height}>
            <Grid item xs={12}>
              <div className={classes.root}>
                <Paper>
                  <AppBar position="static">
                    <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="off" aria-label="scrollable prevent tabs example">
                      <Tab label="Uudised" aria-label="news" {...a11yProps(0)} />
                      <Tab label="Parklakohad"  aria-label="spots" {...a11yProps(1)} />
                      <Tab label="Liikmed" aria-label="members" {...a11yProps(2)} />
                      <Tab label="Seaded" aria-label="settings" {...a11yProps(3)} />
                      <Tab label="Logid" aria-label="logs" {...a11yProps(4)} />
                    </Tabs>
                  </AppBar>
                  <TabPanel value={value} index={0}>
                    <Typography>Uudised</Typography>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <ParkingTable enterpriseUsers={enterpriseUsers} parkingSpotLoading={parkingLoading} updateSpotTable={updateSpotTable} updateParkingSpotMainUsers={updateParkingSpotMainUsers} parkingSpots = {enterpriseParkingSpots} parkingSpotMainUsers= {parkingSpotMainUsers} regularUsers={regularUsers} updateParkingSpots={updateParkingSpots}/>
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <UsersTable users = {enterpriseUsers}/>
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    <Typography>Seaded</Typography>
                  </TabPanel>
                  <TabPanel value={value} index={4}>
                    {enterpriseId !== undefined && enterpriseUsers !== undefined? <EnterpriseLogs enterpriseUsers={enterpriseUsers} enterpriseId={enterpriseId} enterpriseName={enterpriseData.name} /> : ''} 
                  </TabPanel>
                </Paper>
              </div>
            </Grid>
          </Grid>
        </Container>
      </Page>
    );
  }

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
    }
  }));

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

export default AdminPage;