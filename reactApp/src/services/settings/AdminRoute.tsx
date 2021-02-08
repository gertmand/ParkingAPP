import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { Redirect } from "react-router";
import PrivateRoute from "./PrivateRoute";

const AdminRoute = (props:any) => {
  // const userAdmin= useSelector<AppState, User>(state => state.user.userAdmin);
  const [userAdmin, setAdmin] = useState(false);

  if(!userAdmin) { return <Redirect to='/home' />}

  return <PrivateRoute {...props} />;
};

const mapStateToProps = (state: any) => {
  return {
      admin: state.user.userAdmin
  };
}

export default connect(mapStateToProps)(AdminRoute);