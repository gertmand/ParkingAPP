import React from "react"
import { Switch, Route, Redirect } from "react-router"
import LoginPage from "../../pages/auth/LoginPage"
import HomePage from "../../pages/HomePage"
import GlobalStyles from "../../style/GlobalStyles"
import MainLayout from "../../style/layouts/MainLayout/MainLayout"

const Routes = () => {
    return(
        <>
        <GlobalStyles />
          <MainLayout>
            <Switch>
              <Route path='/login' component={LoginPage} />
              <Redirect to='/login'/>
            </Switch>
          </MainLayout>
        </>
    )
}

export default Routes