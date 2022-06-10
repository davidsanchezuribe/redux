import React from 'react';
import messages from './messages';

export const LocalizationContext = React.createContext(messages);

export const withLocalization = (BaseApp: React.ComponentType) => () => (
  <LocalizationContext.Provider value={messages}>
    <BaseApp />
  </LocalizationContext.Provider>
);
