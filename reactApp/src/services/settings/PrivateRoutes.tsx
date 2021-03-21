import React from 'react'
import { Redirect, Switch } from 'react-router'
import EnterpriseSelectionPage from '../../pages/EnterpriseSelectionPage'
import HomePage from '../../pages/HomePage'
import GlobalStyles from '../../style/GlobalStyles'
import DashboardLayout from '../../style/layouts/DashboardLayout/DashboardLayout'
import DashboardNavLayout from '../../style/layouts/DashboardNavLayout/DashboardNavLayout'
import ProfileDetails from '../../style/views/account/AccountView/ProfileDetails'
import ProductList from '../../style/views/product/ProductListView'
import SettingsView from '../../style/views/settings/SettingsView'
import PrivateRoute from './PrivateRoute'

const PrivateRoutes = (enterprises: any) => {
    const enterprise = localStorage.getItem('enterprise');

    // if(enterprise == undefined) {
    //     return(
    //         <>
    //         <GlobalStyles />
    //         <DashboardNavLayout>
    //             <Switch>
    //                 <PrivateRoute exact path='/enterprise' component={() => <EnterpriseSelectionPage enterprises={enterprises} />} />
    //                 <Redirect from ="*" to="/enterprise" />
    //             </Switch>
    //         </DashboardNavLayout>
    //     </>
    //     )
    // } else {
        return(
            <>
                <GlobalStyles />
                    <DashboardLayout> 
                        <Switch>
                            <PrivateRoute exact path='/' component={HomePage} />
                            <PrivateRoute exact path='/profile' component={ProfileDetails} />
                            <PrivateRoute path='/settings' component={SettingsView} />
                            <PrivateRoute path='/test' component={ProductList} />
                            <PrivateRoute path='/profile' component={ProfileDetails} />
                            <PrivateRoute path='/enterprise' component={EnterpriseSelectionPage} />
                            {enterprise == null || enterprise == undefined ? <Redirect from="*" to='/enterprise' /> : <Redirect from="*" to='/' />}
                        </Switch>
                    </DashboardLayout>
            </>
            )
    // }
}

export default PrivateRoutes
