import React from 'react';
import ReactDOM from 'react-dom';

import { sampleConstants } from 'environment'

import 'assets/ratchet/css/ratchet.css'
import 'assets/css/styles.css'

import HomeView from 'app/js/HomeView';
import EmployeeView from 'app/js/EmployeeView';
import router from 'app/js/lib/router';
import EmployeeService from 'app/js/services/memory/EmployeeService';

//https://stackoverflow.com/questions/37313954/how-to-url-loader-multiple-images-in-webpack
//https://stackoverflow.com/questions/31419899/webpack-dynamic-require-with-loaders-in-require-statement/31436916#31436916
var requireContext = require.context('file-loader!assets/pics', true, /^\.\/.*\.jpg$/);
requireContext.keys().map(requireContext);

console.log(`username is ${sampleConstants.username}`);

var service = new EmployeeService();

service.initialize().done(function () {
  router.addRoute('', function() {
    ReactDOM.unmountComponentAtNode(document.getElementById('REACT_ROOT'))
    ReactDOM.render(
      <HomeView service={service} />,
      document.getElementById('REACT_ROOT')
    );
  });

  router.addRoute('employees/:id', function(id) {
      service.findById(parseInt(id)).done(function(employee) {
          ReactDOM.render(
            <EmployeeView employee={employee} />,
            document.getElementById('REACT_ROOT')
          );
      });
  });

  router.start();
  console.log("Service initialized");
});

/* --------------------------------- Event Registration -------------------------------- */
document.addEventListener('deviceready', function () {
  if (navigator.platform === 'Linux x86_64') return;
  if (navigator.notification) { // Override default HTML alert with native dialog
    window.alert = function (message) {
      navigator.notification.alert(
        message,    // message
        null,       // callback
        "Workshop", // title
        'OK'        // buttonName
      );
    };
  }
}, false);
