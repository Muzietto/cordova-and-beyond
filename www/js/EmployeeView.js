var EmployeeView = function(employee) {

  this.initialize = function() {
    this.$el = $('<div/>');
    this.$el.on('click', '.add-location-btn', this.addLocation);
    this.$el.on('click', '.add-contact-btn', this.addToContacts);
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

  this.addToContacts = function(event) {
    event.preventDefault();
    console.log('addToContacts');

    if (!navigator.contacts) {
        alert("Contacts API not supported", "Error");
        return;
    }

    var contact = navigator.contacts.create();

    if (!contact) {
        alert("Contacts API not supported", "Error");
        return;
    }

    contact.name = {givenName: employee.firstName, familyName: employee.lastName};
    var phoneNumbers = [];
    phoneNumbers[0] = new ContactField('work', employee.officePhone, false);
    phoneNumbers[1] = new ContactField('mobile', employee.cellPhone, true);
    contact.phoneNumbers = phoneNumbers;

    contact.save();

    return false;
  };

  this.initialize();
}
