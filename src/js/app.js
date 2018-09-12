import $ from 'jquery';
import { sampleConstants } from 'environment'

import '../assets/ratchet/css/ratchet.css'
import '../assets/css/styles.css'
import '../assets/css/pageslider.css'

import HomeView from './HomeView';
import EmployeeListView from './EmployeeListView';
import EmployeeView from './EmployeeView';
import router from './lib/router';
import PageSlider from './lib/pageslider';
import EmployeeService from './services/memory/EmployeeService';

//https://stackoverflow.com/questions/37313954/how-to-url-loader-multiple-images-in-webpack
//https://stackoverflow.com/questions/31419899/webpack-dynamic-require-with-loaders-in-require-statement/31436916#31436916
var requireContext = require.context('file-loader!../assets/pics', true, /^\.\/.*\.jpg$/);
requireContext.keys().map(requireContext);

console.log(`username is ${sampleConstants.username}`);

var slider = new PageSlider($('body'));
var service = new EmployeeService();

service.initialize().done(function () {
  router.addRoute('', function() {
      //$('body').html(new HomeView(service).render().$el);
      slider.slidePage(new HomeView(service).render().$el);
  });

  router.addRoute('employees/:id', function(id) {
      service.findById(parseInt(id)).done(function(employee) {
          //$('body').html(new EmployeeView(employee).render().$el);
          slider.slidePage(new EmployeeView(employee).render().$el);
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
