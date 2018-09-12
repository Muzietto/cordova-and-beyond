var EmployeeView = function(employee) {

  this.initialize = function() {
    this.$el = $('<div/>');
    this.$el.on('click', '.add-location-btn', this.addLocation);
  }

  this.render = function() {
    this.$el.html(this.template(employee));
    return this;
  }

  this.addLocation = function(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(
        function(position) {
            alert(position.coords.latitude + ',' + position.coords.longitude);
        },
        function(err) {
            alert('Error getting location: ' + JSON.stringify(err));
        },
        { timeout: 10 }
    );
    return false;
  };

  this.initialize();
}
