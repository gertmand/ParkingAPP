import React from "react";
import { Redirect, Route } from "react-router";

const PrivateRoute = (props:any) => {
  var isAuthUser = false;
  if (localStorage.getItem('email') != null) {
      isAuthUser = true;
  }
  if (!isAuthUser) return <Redirect to="/auth/login" />;

  return <Route {...props} />;
};


export default PrivateRoute;