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
  
  //TODO: pageLoading ei toimi hetkel korralikult. Lehe laadimisega probleemid. 
  //const [pageLoading, setPageLoading] = useState(false);

  const getDataQuery = async (enterpriseId: any) => {
    //setPageLoading(true);
    getUserData(dispatch).then(async () => {
      if(!isNaN(enterpriseId) && enterpriseId !== 0 && enterpriseId !== "0") {
        await getEnterpriseUserData(enterpriseId, dispatch, true);
        await getEnterpriseParkingSpotData(enterpriseId, dispatch, true);
        await getEnterprise(enterpriseId, dispatch);
        //setPageLoading(false);
      }
    }).catch(() => {
      localStorage.removeItem('token')
      //setPageLoading(false);
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
        {RenderView(/*pageLoading*/)}
      </ThemeProvider>
  );
};

export default App;