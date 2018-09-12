var EmployeeListView = function() {
  var employees = [];

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
