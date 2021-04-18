import { ThemeProvider } from '@material-ui/core';
import React, { useEffect } from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import ErrorAlert from './components/common/errorAlert';
import SuccessAlert from './components/common/successAlert';

import RenderView from './services/settings/RenderView';
import { AppState } from './store';
import { getEnterprise, getEnterpriseParkingSpotData, getEnterpriseUserData } from './store/queries/enterpriseQueries';
import { getUserData } from './store/queries/userQueries';
import { SiteAlert } from './store/types/siteTypes';
import './style/mixins/chartjs';
import theme from './style/theme';

const App = (props: any) => {
  const dispatch = useDispatch();

  const successAlert = useSelector<AppState, SiteAlert>(state => state.site.successAlert);
  const errorAlert = useSelector<AppState, SiteAlert>(state => state.site.errorAlert);

  const getDataQuery = async (enterpriseId: any) => {
    getUserData(dispatch).then(async () => {
      if(!isNaN(enterpriseId) && enterpriseId !== 0 && enterpriseId !== "0") {
        await getEnterpriseUserData(enterpriseId, dispatch, true);
        await getEnterpriseParkingSpotData(enterpriseId, dispatch, true);
        await getEnterprise(enterpriseId, dispatch);
      }
    }).catch(() => {
      localStorage.removeItem('token')
      window.location.reload(false);})
  }


  useEffect(() => {
    const token = localStorage.getItem('token');
    const enterpriseToken = localStorage.getItem('enterprise');

    if(token != null) {
      getDataQuery(parseInt(enterpriseToken!));
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem('token'), localStorage.getItem('enterprise')])

  return (
    <ThemeProvider theme={theme}>
      {successAlert.status ? <SuccessAlert /> : null}
      {errorAlert.status ? <ErrorAlert /> : null}
        {RenderView()}
      </ThemeProvider>
  );
};

export default App;