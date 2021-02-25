import { ThemeProvider } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import RenderView from './services/settings/RenderView';
import './style/mixins/chartjs';
import theme from './style/theme';
import jwt_decode from "jwt-decode";
import { getUserData } from './store/queries/userQueries';
import { useDispatch } from 'react-redux';
import { ADD_USER_DATA } from './store/userActions';


const App = (props: any) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if(token != null) {
      getUserData().then((result:any) => {
        console.log(result)
        dispatch(ADD_USER_DATA(result));
      }).catch((err) => {
        localStorage.clear()
        window.location.reload(false);
      }
      )
    }
  }, [])

  return (
      <ThemeProvider theme={theme}>
        {RenderView(props)}
      </ThemeProvider>
  );
};


export default App;