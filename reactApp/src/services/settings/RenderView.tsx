import { CircularProgress } from '@material-ui/core';
import React from 'react';
import GlobalStyles from '../../style/GlobalStyles';
import PrivateRoutes from './PrivateRoutes';
import Routes from './Routes';

const RenderView = (pageLoading: boolean) => {
    if (!pageLoading) {
        if (!localStorage.getItem('token')) {
        return (
            <>
                <Routes />
            </>
        );
        } else {
            return (
                <>
                    <PrivateRoutes />
                </>
            )}
    } else {
        return (
        <div style={{textAlign:'center', marginTop:'300px'}}>
            <GlobalStyles />
            <CircularProgress />
        </div>
        )
    }
}

export default RenderView