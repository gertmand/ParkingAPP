import React from 'react'
import PrivateRoute from './PrivateRoute';

function RouteWithLayout({layout, component, ...rest}: any){
    return (
      <PrivateRoute {...rest} render={(props: any) =>
        React.createElement( layout, props, React.createElement(component, props))
      }/>
    );
  }

export default RouteWithLayout
