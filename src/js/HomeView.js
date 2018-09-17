import $ from 'jquery';
import Handlebars from 'handlebars';
import EmployeeListView from 'app/js/EmployeeListView';

const homeTpl = `
<header class="bar bar-nav">
    <h1 class="title">Directory</h1>
</header>
<div class="bar bar-standard bar-header-secondary">
    <input type="button" class="the-button" value="CLICK" />
    <input class='search-key' type="search"/>
</div>
<div class="content"></div>
`

var HomeView = function(service) {
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