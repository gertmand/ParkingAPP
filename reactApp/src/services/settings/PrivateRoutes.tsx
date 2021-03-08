import React from 'react'
import { Redirect, Switch } from 'react-router'
import HomePage from '../../pages/HomePage'
import GlobalStyles from '../../style/GlobalStyles'
import DashboardLayout from '../../style/layouts/DashboardLayout/DashboardLayout'
import ProductList from '../../style/views/product/ProductListView'
import SettingsView from '../../style/views/settings/SettingsView'
import PrivateRoute from './PrivateRoute'

const PrivateRoutes = () => {
    return(
    <>
        <GlobalStyles />
        <DashboardLayout>
            <Switch>
                <PrivateRoute exact path='/' component={HomePage} />
                <PrivateRoute path='/settings' component={SettingsView} />
                <PrivateRoute path='/test' component={ProductList} />
                <Redirect from ="*" to="/" />
            </Switch>
        </DashboardLayout>
    </>
    )
}

export default PrivateRoutes