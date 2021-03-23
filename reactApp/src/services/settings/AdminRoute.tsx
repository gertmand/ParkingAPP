import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { Redirect } from "react-router";
import { AppState } from "../../store";
import { getEnterpriseUserData } from "../../store/queries/enterpriseQueries";
import { User } from "../../store/types/userType";
import PrivateRoute from "./PrivateRoute";

const AdminRoute = (props:any) => {
  //const enterpriseUserData= useSelector(state => state.user.enterpriseUserData);
  const [userAdmin, setAdmin] = useState(false);

  if(!userAdmin) { return <Redirect to='/home' />}

  return <PrivateRoute {...props} />;
};

const mapStateToProps = (state: any) => {
  return {
      admin: state.user.enterpriseUserData
  };
}

export default connect(mapStateToProps)(AdminRoute);