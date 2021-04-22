import { Container, Fab, Grid, makeStyles } from '@material-ui/core';
import NavigationIcon from '@material-ui/icons/Navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import EnterpriseAddModal from '../components/enterprise/enterpriseAddModal';
import { ADD_ENTERPRISE_DATA } from '../store/actions/enterpriseActions';
import { getEnterpriseParkingSpotData, getEnterpriseUserData, getUserEnterprises } from '../store/queries/enterpriseQueries';
import { Enterprise } from '../store/types/enterpriseTypes';
import TopBar from '../style/layouts/DashboardNavLayout/TopBar';
import Page from '../style/Page';

const EnterpriseSelectionPage = (props: any) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
    const [enterpriseAddModal, setEnterpriseAddModal] = useState(false);

    
    
    useEffect(() => {
        getEnterprises();

        //FIX FOR: Warning: Can't perform a React state update on an unmounted component. 
        return () => {setEnterprises([]);}
    },[])

    const updateEnterprises = () => {
        getEnterprises();
      }

    const getEnterprises = async () => {
        await getUserEnterprises().then(async (result) => {
          setEnterprises(result);
         })
      }

    const handleClick = (enterprise: Enterprise) => {
        localStorage.setItem("enterprise", enterprise.id.toString())
        getEnterpriseUserData(enterprise.id, dispatch, true);
        getEnterpriseParkingSpotData(enterprise.id, dispatch, true);
        dispatch(ADD_ENTERPRISE_DATA(enterprise))
        props.history.push("/");
    }

    return (
        <>
        <EnterpriseAddModal enterpriseAddModal={enterpriseAddModal} setEnterpriseAddModal={setEnterpriseAddModal} updateEnterprises={updateEnterprises}/>
        <div className={classes.root}>
        <TopBar className={"a"} />
        <div className={classes.wrapper}>
          <div className={classes.contentContainer}>
            <div className={classes.content}>
                <Page {...props.children}
                title="Esileht">
                    <Container maxWidth={"md"} className={classes.height}>
                        <Grid container spacing={10} justify={"center"} >
                            {enterprises !== undefined && enterprises.map((data: Enterprise) => (
                                <Grid item key={data.id}>
                                    <Fab id={data.id.toString()} variant="extended" color="primary" aria-label={data.description} className={classes.margin} onClick={() => handleClick(data)}>
                                        <NavigationIcon className={classes.extendedIcon} />
                                        {data.name}
                                    </Fab>
                                </Grid>
                            ))}
                            <Grid item>
                                <Fab onClick={() => setEnterpriseAddModal(!enterpriseAddModal)} id="addNew" variant="extended" color="secondary" aria-label="add" className={classes.margin}>
                                    <NavigationIcon className={classes.extendedIcon} />
                                    Lisa uus
                                </Fab>
                            </Grid>
                        </Grid>
                    </Container>
                </Page>
            </div>
          </div>
        </div>
      </div>
      </>
    )
}

const useStyles = makeStyles(theme => ({
    height: {
        marginTop: "200px"
    },
    card: {
        margin: 0,
        marginLeft: 7,
        color: theme.palette.text.secondary,
    },
    margin: {
        margin: theme.spacing(1),
      },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    root: {
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        width: '100%'
      },
      wrapper: {
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden',
        paddingTop: 64
      },
      contentContainer: {
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden'
      },
      content: {
        flex: '1 1 auto',
        height: '100%',
        overflow: 'auto'
      }
}));

export default EnterpriseSelectionPage
