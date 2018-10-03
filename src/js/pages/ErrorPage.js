import React from 'react';
import Link from 'app/js/services/routing/Link';

export default ({status}) => (
  <div className='page page__error'>
    <h1>error <span>{status}</span></h1>
    <br/>
    <Link href='/'>Home</Link>
  </div>
);
