import React from 'react';
import navigateTo from 'app/js/services/routing/navigation'

const transition = event => {
  event.preventDefault();
  const path = event.currentTarget.pathname;
  navigateTo(path);
};

export default ({ href, children }) => (
  <React.Fragment>
    <a href={href} onClick={transition}>{children}</a>
    <br/>
  </React.Fragment>
);
