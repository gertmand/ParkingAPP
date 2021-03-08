import { CircularProgress } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../store';
import { User } from '../../store/types/userType';
import GlobalStyles from '../../style/GlobalStyles';
import PrivateRoutes from './PrivateRoutes';
import Routes from './Routes';

const RenderView = ({history, match}: any) => {
    const UserData = useSelector<AppState, User>(state => state.user.userData);

    if (UserData) {
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