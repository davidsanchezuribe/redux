import React from 'react';
import { Provider } from 'react-redux';
import store from '../redux/store';

const withRedux = (BaseApp: React.ComponentType) => () => (
  <Provider store={store}>
    <BaseApp />
  </Provider>
);

export default withRedux;
