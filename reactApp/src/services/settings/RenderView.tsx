import { CircularProgress } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../store';
import { User } from '../../store/types/userType';
import GlobalStyles from '../../style/GlobalStyles';
import PrivateRoutes from './PrivateRoutes';
import Routes from './Routes';

const RenderView = (enterprise: any) => {
    const UserData = useSelector<AppState, User>(state => state.user.userData);
    const userDataFetching = useSelector<AppState, boolean>(state => state.user.enterpriseUserDataFetching);
    const parkingSpotFetching = useSelector<AppState, boolean>(state => state.user.enterpriseParkingSpotDataFetching);

    if (UserData && !userDataFetching && !parkingSpotFetching) {
        if (!localStorage.getItem('token')) {
        return (
            <>
                <Routes />
            </>
        );
        } else {
            return (
                <>
                    <PrivateRoutes enterprise={enterprise} />
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