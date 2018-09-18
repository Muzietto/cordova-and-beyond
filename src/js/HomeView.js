import React, { Component } from 'react';

import $ from 'jquery';
import Handlebars from 'handlebars';
import EmployeeListView from 'app/js/EmployeeListView';

const clickHandler = () => {
  alert('Employee Directory v3.4: ' + JSON.stringify(this.state.employees[0]));
}

class HomeView extends Component {

  constructor({ employeeService }) {
    super();
    this.state = {
      employees: [],
    };
    this.employeeService = employeeService;
    this.clickHandler = clickHandler.bind(this);
    this.keyUpHandler = this.keyUpHandler.bind(this);
  }

  keyUpHandler(ev) {
    const self = this;
    this.employeeService.findByName(ev.target.value)
      .done(function (employees) {
        self.setState({ employees });
      });
  }

  render(props) {

    return (
      <React.Fragment>
        <header className='bar bar-nav'>
            <h1 className='title'>Directory</h1>
        </header>
        <div className='bar bar-standard bar-header-secondary'>
            <input
              type='button'
              className='the-button'
              value='CLICK'
              onClick={clickHandler}
            />
            <input
              className='search-key'
              type='search'
              onKeyUp={this.keyUpHandler}
            />
        </div>
        <div className='content'>
          <pre>{JSON.stringify(this.state.employees)}</pre>
        </div>
      </React.Fragment>
    )
  }

}

const HomeViewz = function(service) {
  var employeeListView;

  this.template = Handlebars.compile(homeTpl);

  this.initialize = function() {
    this.$el = $('<div/>');
    this.$el.on('keyup', '.search-key', this.findByName)
    this.$el.on('click', '.the-button', function() {
      alert('Employee Directory v3.4');
    })

    employeeListView = new EmployeeListView();
    this.render();
  }

  this.findByName = function() {
    const self = this;
    service.findByName($('.search-key', this.$el).val())
      .done(function (employees) {
          $('.content', self.$el)
            .html(employeeListView.setEmployees(employees));
      });
  }

  this.render = function() {
      this.$el.html(this.template());
      $('.content', this.$el).html(employeeListView.$el);
      return this;
    }

  this.initialize();
}

export default HomeView;
