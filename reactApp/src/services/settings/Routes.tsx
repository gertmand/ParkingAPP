import React from "react"
import { Switch, Route, Redirect } from "react-router"
import HomePage from "../../pages/HomePage"
import GlobalStyles from "../../style/GlobalStyles"
import MainLayoutW from "../../style/layouts/MainLayout/MainLayoutW"

const Routes = () => {
    return(
        <>
        <GlobalStyles />
          <MainLayoutW>
            <Switch>
              <Route path='/' component={HomePage} />
            </Switch>
          </MainLayoutW>
        </>
    )
}

export default Routes