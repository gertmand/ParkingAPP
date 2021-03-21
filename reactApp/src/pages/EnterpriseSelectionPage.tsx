import { Container, Fab, Grid, makeStyles } from '@material-ui/core'
import React, { Component, useEffect, useState } from 'react'
import NavigationIcon from '@material-ui/icons/Navigation';
import { Enterprise } from '../store/types/enterpriseTypes';
import { ADD_ENTERPRISE_DATA } from '../store/actions/enterpriseActions';
import { useDispatch } from 'react-redux';
import Page from '../style/Page';
import { getUserEnterprises } from '../store/queries/enterpriseQueries';

const EnterpriseSelectionPage = (props: any) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [asd, setAsd] = useState<Enterprise[]>([])
    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);

    // useEffect(() => {
    //     if(localStorage.getItem('enterprise') != undefined) {
    //         //props.history.push("/");
    //     }
    //     if(enterprises != undefined || enterprises.enterprises != undefined) {
    //         setAsd(enterprises.enterprises);
    //     }
    // }, [enterprises])

    useEffect(() => {
        getEnterprises();
    }, [])

    const getEnterprises = async () => {
        await getUserEnterprises().then(async (result) => {
          await setEnterprises(result);
         })
      }

    const handleClick = (enterprise: Enterprise) => {
        localStorage.setItem("enterprise", enterprise.id.toString())
        dispatch(ADD_ENTERPRISE_DATA(enterprise))
        props.history.push("/");
    }

    return (
        <Page {...props.children}
        title="Esileht">
            <Container maxWidth={"md"} className={classes.height}>
                <Grid container spacing={10} justify={"center"} >
                    {enterprises != undefined && enterprises.map((data: Enterprise) => (
                        <Grid item key={data.id}>
                            <Fab id={data.id.toString()} variant="extended" color="primary" aria-label={data.description} className={classes.margin} onClick={() => handleClick(data)}>
                                <NavigationIcon className={classes.extendedIcon} />
                                {data.name}
                            </Fab>
                        </Grid>
                    ))}
                    <Grid item>
                        <Fab id="addNew" variant="extended" color="secondary" aria-label="add" className={classes.margin}>
                            <NavigationIcon className={classes.extendedIcon} />
                            Lisa uus
                        </Fab>
                    </Grid>
                </Grid>
            </Container>
        </Page>
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
}));

export default EnterpriseSelectionPage
