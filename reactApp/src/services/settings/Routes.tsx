import React from "react"
import { Switch, Route, Redirect } from "react-router"
import LoginPage from "../../pages/auth/LoginPage"
import HomePage from "../../pages/HomePage"
import GlobalStyles from "../../style/GlobalStyles"
import MainLayoutW from "../../style/layouts/MainLayout/MainLayoutW"

const Routes = () => {
    return(
        <>
        <GlobalStyles />
          <MainLayoutW>
            <Switch>
              <Route path='/login' component={LoginPage} />
              <Redirect to='/login'/>
            </Switch>
          </MainLayoutW>
        </>
    )
}

export default Routes