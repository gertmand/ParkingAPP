import { ThemeProvider } from '@material-ui/core';
import React, { useEffect } from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import RenderView from './services/settings/RenderView';
import './style/mixins/chartjs';
import theme from './style/theme';


const App = (props: any) => {

  return (
      <ThemeProvider theme={theme}>
        {RenderView()}
      </ThemeProvider>
  );
};


export default App;