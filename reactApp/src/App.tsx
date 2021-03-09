import { ThemeProvider } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import RenderView from './services/settings/RenderView';
import './style/mixins/chartjs';
import theme from './style/theme';
import { getUserData } from './store/queries/userQueries';
import { useDispatch } from 'react-redux';
import { ADD_USER_DATA } from './store/userActions';
import { getEnterpriseUserData } from './store/queries/enterpriseQueries';


const App = (props: any) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if(token != null) {
      getUserData().then((result:any) => {
        dispatch(ADD_USER_DATA(result));
      }).catch(() => {
        localStorage.clear()
        window.location.reload(false);})}

      getEnterpriseUserData(1, dispatch);
    }, [localStorage.getItem('token')])

  return (
      <ThemeProvider theme={theme}>
        {RenderView(props)}
      </ThemeProvider>
  );
};


export default App;