import React from 'react'
import { Redirect, Switch } from 'react-router'
import HomePage from '../../pages/HomePage'
import GlobalStyles from '../../style/GlobalStyles'
import DashboardLayoutW from '../../style/layouts/DashboardLayout/DashboardLayoutW'
import ProductList from '../../style/views/product/ProductListView'
import SettingsView from '../../style/views/settings/SettingsView'
import AdminRoute from './AdminRoute'
import PrivateRoute from './PrivateRoute'

const PrivateRoutes = () => {
    return(
    <>
        <GlobalStyles />
        <DashboardLayoutW>
            <Switch>
                <PrivateRoute exact path='/home' component={HomePage} />
                <PrivateRoute exact path='/settings' component={SettingsView} />
                <PrivateRoute exact path='/test' component={ProductList} />
            </Switch>
        </DashboardLayoutW>
    </>
    )
}

export default PrivateRoutes
