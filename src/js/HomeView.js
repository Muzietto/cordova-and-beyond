import React, { Component } from 'react';
import { hot } from 'react-hot-loader'

import EmployeeListView from 'app/js/EmployeeListView';

class HomeView extends Component {

  constructor({ service }) {
    super();
    this.state = {
      employees: [],
    };
    this.service = service;
  }

  render() {
    return (
      <React.Fragment>
        <header className="bar bar-nav">
          <h1 className="title">Directory</h1>
        </header>
        <div className="bar bar-standard bar-header-secondary">
          <input type="button" className="the-button" value="CLICK ME softly!" onClick={alerter.bind(this)} />
          <input className='search-key' type="search" onKeyUp={findByName(this, this.service)} />
        </div>
        <div className="content">
          <EmployeeListView employees={this.state.employees} />
        </div>
      </React.Fragment>
    )
  }
}

export default hot(module)(HomeView);

function alerter() { alert('Employee Directory v3.4'); };

function findByName(context, service) {
  return ev => {
    service.findByName(ev.target.value)
      .then(employees => {
        context.setState({employees})
      });
  }
}
