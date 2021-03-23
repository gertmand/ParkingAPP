import React from 'react'
import { Redirect, Switch } from 'react-router'
import AdminPage from '../../pages/AdminPage'
import EnterpriseSelectionPage from '../../pages/EnterpriseSelectionPage'
import HomePage from '../../pages/HomePage'
import GlobalStyles from '../../style/GlobalStyles'
import DashboardLayout from '../../style/layouts/DashboardLayout/DashboardLayout'
import DashboardNavLayout from '../../style/layouts/DashboardNavLayout/DashboardNavLayout'
import ProfileDetails from '../../style/views/account/AccountView/ProfileDetails'
import ProductList from '../../style/views/product/ProductListView'
import SettingsView from '../../style/views/settings/SettingsView'
import PrivateRoute from './PrivateRoute'

const PrivateRoutes = (props: any) => {
    const enterprise = localStorage.getItem('enterprise');

        return(
            <>
                <GlobalStyles />
                    <Switch>
                            <PrivateRoute path='/enterprise' component={EnterpriseSelectionPage} />
                        <DashboardLayout> 
                            <PrivateRoute exact path='/' component={HomePage} />
                            <PrivateRoute exact path='/profile' component={ProfileDetails} />
                            <PrivateRoute path='/settings' component={SettingsView} />
                            <PrivateRoute path='/test' component={ProductList} />
                            <PrivateRoute path='/profile' component={ProfileDetails} />
                            <PrivateRoute path='/admin' component={AdminPage} />
                            <Redirect from="*" to='/' />
                            {/* {enterprise == null || enterprise == undefined ? <Redirect from="*" to='/enterprise' /> : <Redirect from="*" to='/' />} */}
                            </DashboardLayout>
                    </Switch>
            </>
            )
    // }
}

export default PrivateRoutes
