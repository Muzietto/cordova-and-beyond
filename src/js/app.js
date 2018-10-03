import React from 'react';
import ReactDOM from 'react-dom';

import { sampleConstants } from 'environment'

import 'assets/ratchet/css/ratchet.css'
import 'assets/css/styles.css'

import navigateTo from 'app/js/services/routing/navigation'

//https://stackoverflow.com/questions/37313954/how-to-url-loader-multiple-images-in-webpack
//https://stackoverflow.com/questions/31419899/webpack-dynamic-require-with-loaders-in-require-statement/31436916#31436916
var requireContext = require.context('file-loader!assets/pics', true, /^\.\/.*\.jpg$/);
requireContext.keys().map(requireContext);

console.log(`standard username is ${sampleConstants.username}`);

service.initialize().then(function () {
  navigateTo('/'); // render the current URL
});

console.log('Service initialized');

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
