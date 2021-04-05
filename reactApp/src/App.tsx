import { ThemeProvider } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import RenderView from './services/settings/RenderView';
import './style/mixins/chartjs';
import theme from './style/theme';
import { getUserData } from './store/queries/userQueries';
import { useDispatch } from 'react-redux';
import { ADD_USER_DATA } from './store/userActions';
import { getEnterprise, getEnterpriseParkingSpotData, getEnterpriseUserData, getUserEnterprises } from './store/queries/enterpriseQueries';


const App = (props: any) => {
  const dispatch = useDispatch();
  const [, setEnterprises] = useState();
  const [enterprise, setEnterprise] = useState<string>("");

  const getDataQuery = async (enterpriseId: any) => {
    getUserData().then(async (result:any) => {
      dispatch(ADD_USER_DATA(result));
      if(!isNaN(enterpriseId) && enterpriseId !== 0 && enterpriseId !== "0") {
        await getEnterpriseUserData(enterpriseId, dispatch, true);
        await getEnterpriseParkingSpotData(enterpriseId, dispatch, true);
        await getEnterprise(enterpriseId, dispatch);
      }
    }).catch(() => {
      localStorage.removeItem('token')
      window.location.reload(false);})
  }

  const getEnterprises = async () => {
    await getUserEnterprises().then(async (result) => {
      await setEnterprises(result);
     })
  }

  useEffect(() => {
    //localStorage.setItem('enterprise', "2");
    const token = localStorage.getItem('token');
    const enterpriseToken = localStorage.getItem('enterprise');

    if(token != null) {
      if(enterpriseToken === undefined || enterpriseToken === null) {
        getEnterprises();
      }
      if(enterpriseToken !== null || enterpriseToken !== undefined) {
        setEnterprise(enterpriseToken!);
      }
      getDataQuery(parseInt(enterpriseToken!));
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem('token'), localStorage.getItem('enterprise')])

  return (
      <ThemeProvider theme={theme}>
        {RenderView(enterprise)}
      </ThemeProvider>
  );
};

export default App;