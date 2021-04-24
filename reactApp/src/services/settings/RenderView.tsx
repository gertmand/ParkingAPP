import { CircularProgress } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../store';
import GlobalStyles from '../../style/GlobalStyles';
import PrivateRoutes from './PrivateRoutes';
import Routes from './Routes';


//TODO: vaheldumisi ei lae ära login/home page
// const RenderView = (pageLoading: boolean) => {
//     if (!pageLoading) {


const RenderView = () => {
    const userDataFetching = useSelector<AppState, boolean>(state => state.user.userDataFetching);
    const enterpriseUserDataFetching = useSelector<AppState, boolean>(state => state.user.enterpriseUserDataFetching);
    const enterpriseParkingDataFetching = useSelector<AppState, boolean>(state => state.user.enterpriseParkingSpotDataFetching);
    
    if (!userDataFetching && !enterpriseUserDataFetching && !enterpriseParkingDataFetching) {
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