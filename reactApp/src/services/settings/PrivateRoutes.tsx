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
                <PrivateRoute exact path='/' component={HomePage} />
                <PrivateRoute path='/settings' component={SettingsView} />
                <PrivateRoute path='/test' component={ProductList} />
                <Redirect from ="*" to="/" />
            </Switch>
        </DashboardLayoutW>
    </>
    )
}

export default PrivateRoutes
