import $ from 'jquery';
import Handlebars from 'handlebars';

const employeeListTpl = `
<ul class="table-view">
    {{#each this}}
    <li class="table-view-cell media">
      <a href="#employees/{{ id }}">
          <img class="media-object pull-left" src="src/assets/pics/{{pic}}">
          <div class="media-body">
              {{firstName}} {{lastName}}
              <p>{{title}}</p>
          </div>
      </a>
    </li>
    {{/each}}
</ul>
`

var EmployeeListView = function() {
  var employees = [];

  this.template = Handlebars.compile(employeeListTpl);

  this.initialize = function() {
    this.$el = $('<div/>');
    this.render();
  }

  this.setEmployees = function(emps) {
    this.employees = emps;
    this.render();
  }

  this.render = function() {
    this.$el.html(this.template(this.employees));
    return this;
  }

  this.initialize();
}

export default EmployeeListView;
