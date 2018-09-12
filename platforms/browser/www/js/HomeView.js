var HomeView = function(service) {
  var employeeListView;

  this.initialize = function() {
    this.$el = $('<div/>');
    this.$el.on('keyup', '.search-key', this.findByName)
    this.$el.on('click', '.the-button', function() {
      alert('Employee Directory v3.4');
    })

    employeeListView = new EmployeeListView();
    this.render;
  }

  this.findByName = function() {
    service.findByName($('.search-key', this.$el).val())
      .done(function (employees) {
          $('.content', this.$el)
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
