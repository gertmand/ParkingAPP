import { Container, Grid, Paper, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ParkingTable from '../components/enterprise/Admin/Parking/parkingTable';
import UsersTable from '../components/enterprise/Admin/UsersTable/usersTable';
import { AppState } from '../store';
import { getEnterpriseUsers } from '../store/queries/enterpriseQueries';
import Page from '../style/Page';


  export const AdminPage = (props: any) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [enterpriseUsers, setEnterpriseUsers] = useState([]);
    const enterpriseId = useSelector<AppState, number>(state => state.user.enterpriseData.id)
  
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
    };
  
    useEffect(() => {
      if (enterpriseUsers !== undefined && enterpriseUsers.length === 0 && enterpriseId !== undefined)
      {
        console.log(enterpriseId)
        getEnterpriseUsers(enterpriseId).then(result => {
          setEnterpriseUsers(result);
          console.log("Great success")
          console.log(result)
        })
      }
    }, [enterpriseUsers, enterpriseId])
    
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
                    <ParkingTable />
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <UsersTable users = {enterpriseUsers}/>
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    <Typography>Seaded</Typography>
                  </TabPanel>
                  <TabPanel value={value} index={4}>
                    <Typography>Logid</Typography>
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