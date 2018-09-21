import React from 'react';
import { hot } from 'react-hot-loader'

const TableViewCell = ({ href, children }) => (
  <li className="table-view-cell media">
    <a href={href} className="push-right">
      <span className="media-object pull-left icon icon-call"></span>
      <div className="media-body">
        {children}
      </div>
    </a>
  </li>
)

const EmployeeView = ({ employee }) => (
  <React.Fragment>
    <header className="bar bar-nav">
      <a className="btn btn-link btn-nav pull-left" href="#">
        <span className="icon icon-left-nav"></span>
      </a>
      <h1 className="title">Employee</h1>
    </header>
    <div className="content">
      <div className="card">
        <ul className="table-view">
          <li className="table-view-cell media">
            <img className="media-object pull-left emp-pic" src={`assets/pics/${employee.pic}`} />
            <div className="media-body">
              {employee.firstName} {employee.lastName}
              <p>{employee.title}</p>
            </div>
          </li>
          <TableViewCell href={`tel:${employee.officePhone}`}>
            Call Office
            <p>{employee.officePhone}</p>
          </TableViewCell>
          <TableViewCell href={`tel:${employee.cellPhone}`}>
            Call Cell
            <p>{employee.cellPhone}</p>
          </TableViewCell>
          <TableViewCell href={`sms:${employee.cellPhone}`}>
            SMS
            <p>{employee.cellPhone}</p>
          </TableViewCell>
          <TableViewCell href={`mailto:${employee.email}`}>
            Email
            <p>{employee.email}</p>
          </TableViewCell>
          <li className="table-view-cell media">
            <a href="#" className="push-right add-location-btn" onClick={addLocation}>
              <span className="media-object pull-left"></span>
              <div className="media-body">
                Add location
              </div>
            </a>
          </li>
          <li className="table-view-cell media">
            <a href="#" className="push-right add-contact-btn" onClick={addToContacts}>
              <span className="media-object pull-left"></span>
              <div className="media-body">
                Add to contacts
              </div>
            </a>
          </li>
          <li className="table-view-cell media">
            <a href="#" className="push-right change-pic-btn" onClick={changePicture}>
              <span className="media-object pull-left"></span>
              <div className="media-body">
                Change Picture
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </React.Fragment>
);

export default hot(module)(EmployeeView);

function addLocation(event) {
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
}

function addToContacts(event) {
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
}

function changePicture(event) {

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
      document.getElementsByClassName('media-object emp-pic')[0]
        .src = 'data:image/jpeg;base64,' + imgData;
    },
    function() {
      alert('Error taking picture', 'Error');
    },
    options
  );

  return false;
}
