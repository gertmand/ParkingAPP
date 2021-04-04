import { Container, Grid, Paper } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React from 'react';
import ParkingTable from '../components/enterprise/Admin/Parking/parkingTable';
import Page from '../style/Page';


  export const AdminPage = (props: any) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
  
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
    };
  
    return (
      <Page {...props.children} className={classes.root} title="Admin">
        <Container maxWidth={false}>
          <Grid container spacing={1} className={classes.height}>
            <Grid item xs={12}>
              <div className={classes.root}>
                <Paper>
                  <AppBar position="static">
                    <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="off" aria-label="scrollable prevent tabs example">
                      <Tab label="Parklakohad"  aria-label="spots" {...a11yProps(0)} />
                      <Tab label="Liikmed" aria-label="members" {...a11yProps(1)} />
                      <Tab label="Seaded" aria-label="settings" {...a11yProps(2)} />
                    </Tabs>
                  </AppBar>
                  <TabPanel value={value} index={0}>
                    <ParkingTable />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    Item Two
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    Item Three
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