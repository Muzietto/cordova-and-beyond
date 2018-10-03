import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import './transitions.css'

const Layout = ({children}) => (
  <CSSTransitionGroup
    component='div'
    className='container'
    transitionName='page_slide'
    transitionEnterTimeout={500}
    transitionLeaveTimeout={500}
    >
    <div key={Math.random()} className='content'>
      {children}
    </div>
  </CSSTransitionGroup>
);

export default Layout;
