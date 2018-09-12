import $ from 'jquery';
import Handlebars from 'handlebars';

const employeeTpl = `
<header class="bar bar-nav">
    <a class="btn btn-link btn-nav pull-left" href="#">
        <span class="icon icon-left-nav"></span>
    </a>
    <h1 class="title">Employee</h1>
</header>
<div class="content">
    <div class="card">
        <ul class="table-view">
            <li class="table-view-cell media">
                <img class="media-object pull-left emp-pic" src="src/assets/pics/{{pic}}">
                <div class="media-body">
                    {{ firstName }} {{ lastName }}
                    <p>{{ title }}</p>
                </div>
            </li>
            <li class="table-view-cell media">
                <a href="tel:{{ officePhone }}" class="push-right">
                    <span class="media-object pull-left icon icon-call"></span>
                    <div class="media-body">
                        Call Office
                        <p>{{ officePhone }}</p>
                    </div>
                </a>
            </li>
            <li class="table-view-cell media">
                <a href="tel:{{ cellPhone }}" class="push-right">
                    <span class="media-object pull-left icon icon-call"></span>
                    <div class="media-body">
                        Call Cell
                        <p>{{ cellPhone }}</p>
                    </div>
                </a>
            </li>
            <li class="table-view-cell media">
                <a href="sms:{{ cellPhone }}" class="push-right">
                    <span class="media-object pull-left icon icon-sms"></span>
                    <div class="media-body">
                        SMS
                        <p>{{ cellPhone }}</p>
                    </div>
                </a>
            </li>
            <li class="table-view-cell media">
                <a href="mailto:{{ email }}" class="push-right">
                    <span class="media-object pull-left icon icon-mail"></span>
                    <div class="media-body">
                        Email
                        <p>{{ email }}</p>
                    </div>
                </a>
            </li>
            <li class="table-view-cell media">
              <a href="#" class="push-right add-location-btn">
                  <span class="media-object pull-left"></span>
                  <div class="media-body">
                      Add location
                  </div>
              </a>
            </li>
            <li class="table-view-cell media">
                <a href="#" class="push-right add-contact-btn">
                    <span class="media-object pull-left"></span>
                    <div class="media-body">
                        Add to contacts
                    </div>
                </a>
            </li>
            <li class="table-view-cell media">
              <a href="#" class="push-right change-pic-btn">
                  <span class="media-object pull-left"></span>
                  <div class="media-body">
                      Change Picture
                  </div>
              </a>
            </li>
        </ul>
    </div>
</div>
`

var EmployeeView = function(employee) {

  this.template = Handlebars.compile(employeeTpl);

  this.initialize = function() {
    this.$el = $('<div/>');
    this.$el.on('click', '.add-location-btn', this.addLocation);
    this.$el.on('click', '.add-contact-btn', this.addToContacts);
    this.$el.on('click', '.change-pic-btn', this.changePicture);
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

  this.changePicture = function(event) {
    const self = this;

    event.preventDefault();

    if (!navigator.camera) {
      alert("Camera API not supported", "Error");
      return;
    }
    var options =   {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: 0,      // 0:Photo Library, 1=Camera, 2=Saved Album
      encodingType: 0     // 0=JPG 1=PNG
    };

    navigator.camera.getPicture(
      function(imgData) {
        $('.media-object', self.$el).attr('src', "data:image/jpeg;base64,"+imgData);
      },
      function() {
        alert('Error taking picture', 'Error');
      },
      options
    );

    return false;
  };

  this.initialize();
}

export default EmployeeView;
