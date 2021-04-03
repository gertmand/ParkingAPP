import React from "react"
import { Redirect, Route, Switch } from "react-router"
import LoginPage from "../../pages/auth/LoginPage"
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