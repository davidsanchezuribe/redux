import React from 'react';
import { createRoot } from 'react-dom/client';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import withStyle from './wrappers/withStyle';
import withRedux from './wrappers/withRedux';
import { withLocalization } from './wrappers/withLocalization';
import RoutedApp from './RoutedApp';
import { userApiSlice } from './redux/usersSlice';
import store from './redux/store';
// @imports

// demostracion de como puedo traer datos a cache que permanecen durante
// toda la aplicacion sin estar dentro de un componente de react
// usando la funcion initiate que provee el endpoint
store.dispatch(userApiSlice.endpoints.getUsers.initiate());

const RoutedAppWithLocalization = withLocalization(RoutedApp);
const RoutedAppWithStyle = withStyle(RoutedAppWithLocalization);
const RoutedAppWithRedux = withRedux(RoutedAppWithStyle);

const rootElement = document.getElementById('root');
const root = createRoot(rootElement as Element);

root.render(
  <React.StrictMode>
    <RoutedAppWithRedux />
  </React.StrictMode>,
);
