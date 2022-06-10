import React from 'react';
import { LocalizationContext } from '../wrappers/withLocalization';

const PageNotFound = () => {
  const messages = React.useContext(LocalizationContext);
  return (
    <h1>{messages.pageNotFound.pageNotFound}</h1>
  );
};

export default PageNotFound;
