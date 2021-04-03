import React from 'react'
import { Redirect, Switch } from 'react-router'
import AdminPage from '../../pages/AdminPage'
import EnterpriseSelectionPage from '../../pages/EnterpriseSelectionPage'
import HomePage from '../../pages/HomePage'
import GlobalStyles from '../../style/GlobalStyles'
import DashboardLayout from '../../style/layouts/DashboardLayout/DashboardLayout'
import ProfileDetails from '../../style/views/account/AccountView/ProfileDetails'
import ProductList from '../../style/views/product/ProductListView'
import SettingsView from '../../style/views/settings/SettingsView'
import PrivateRoute from './PrivateRoute'

const PrivateRoutes = (props: any) => {
        return(
            <>
                <GlobalStyles />
                    <Switch>
                            <PrivateRoute path='/enterprise' component={EnterpriseSelectionPage} />
                        <DashboardLayout> 
                            <PrivateRoute path='/home' component={HomePage} />
                            <PrivateRoute path='/profile' component={ProfileDetails} />
                            <PrivateRoute path='/settings' component={SettingsView} />
                            <PrivateRoute path='/test' component={ProductList} />
                            <PrivateRoute path='/profile' component={ProfileDetails} />
                            <PrivateRoute path='/admin' component={AdminPage} />
                            <Redirect from="*" to='/home' />
                            {/* {enterprise == null || enterprise == undefined ? <Redirect from="*" to='/enterprise' /> : <Redirect from="*" to='/' />} */}
                            </DashboardLayout>
                    </Switch>
            </>
            )
    // }
}

export default PrivateRoutes
