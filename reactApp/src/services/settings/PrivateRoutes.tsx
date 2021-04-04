import React from 'react'
import { Redirect, Switch } from 'react-router'
import AdminPage from '../../pages/AdminPage'
import EnterpriseSelectionPage from '../../pages/EnterpriseSelectionPage'
import HomePage from '../../pages/HomePage'
import GlobalStyles from '../../style/GlobalStyles'
import DashboardLayout from '../../style/layouts/DashboardLayout/DashboardLayout'
import Account from '../../style/views/account/AccountView'
import ProductList from '../../style/views/product/ProductListView'
import SettingsView from '../../style/views/settings/SettingsView'
import PrivateRoute from './PrivateRoute'
import RouteWithLayout from './RouteWithLayout'

const PrivateRoutes = (props: any) => {
        return(
            <>
                <GlobalStyles />
                    <Switch>
                        <PrivateRoute path='/enterprise' component={EnterpriseSelectionPage} />
                        <RouteWithLayout layout={DashboardLayout} path='/home' component={HomePage} />
                        <RouteWithLayout layout={DashboardLayout} path='/profile' component={Account} />
                        <RouteWithLayout layout={DashboardLayout} path='/settings' component={SettingsView} />
                        <RouteWithLayout layout={DashboardLayout} path='/test' component={ProductList} />
                        <RouteWithLayout layout={DashboardLayout} exact path='/admin' component={AdminPage} />
                        <Redirect to='/home' />
                    </Switch>
            </>
            )
    // }
}

export default PrivateRoutes
