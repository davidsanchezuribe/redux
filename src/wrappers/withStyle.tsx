import React from 'react';

const withStyle = (BaseApp: React.ComponentType) => () => (
  <BaseApp />
);

export default withStyle;
