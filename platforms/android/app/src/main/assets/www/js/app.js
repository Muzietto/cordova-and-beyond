// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

  /* ---------------------------------- Local Variables ---------------------------------- */
  HomeView.prototype.template = Handlebars.compile($("#home-tpl").html());
  EmployeeListView.prototype.template = Handlebars.compile($("#employee-list-tpl").html());
  var service = new EmployeeService();
  service.initialize().done(function () {
    $('body').html(new HomeView(service).render().$el);
    new HomeView().render();
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

  /* ---------------------------------- Local Functions ---------------------------------- */

}());
