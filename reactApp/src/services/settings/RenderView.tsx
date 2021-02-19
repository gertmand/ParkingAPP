import { CircularProgress } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../store';
import GlobalStyles from '../../style/GlobalStyles';
import PrivateRoutes from './PrivateRoutes';
import Routes from './Routes';

const RenderView = () => {
    const fetchingUserData = useSelector<AppState, boolean>(state => state.user.userDataFetching);
    // const fetchingParkingSpaceData = useSelector<AppState, boolean>(state => state.parkingSpace.dataFetching);
    // const fetchingCarData = useSelector<AppState, boolean>(state => state.car.dataFetching);
    const hasError = useSelector<AppState, boolean>(state => state.user.userFetchError);

    if (!fetchingUserData && !hasError /*&& !fetchingParkingSpaceData && !fetchingCarData*/) {
        if (!localStorage.getItem('email')) {
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