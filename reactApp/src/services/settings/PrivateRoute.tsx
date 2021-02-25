import React, { Component } from "react";
import { Redirect, Route } from "react-router";

const PrivateRoute = (props:any, {roles}: any) => {
    var isAuthUser = false;

    if (localStorage.getItem('token') != null) {
        isAuthUser = true;
    }

    if (!isAuthUser) return <Redirect to="/login" />;
  
    return <Route {...props} />;
  };


export default PrivateRoute;