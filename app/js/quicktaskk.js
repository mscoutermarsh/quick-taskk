// Generated by CoffeeScript 1.4.0
(function() {

  window.QuickTaskk = function() {
    var _this = this;
    this.task_title = ko.observable().extend({
      required: true
    });
    this.task_estimate = ko.observable().extend({
      pattern: {
        message: 'format: 5m or 2h',
        params: /^\d+([.,]\d+)?(([mM](in)?s?)?|[hH](our)?s?)?$/
      }
    });
    this.username = ko.observable('');
    this.password = ko.observable('');
    this.show_login = ko.observable(false);
    this.show_loader = ko.observable(false);
    this.show_estimate = ko.observable(false);
    this.show_title = ko.observable(true);
    this.show_create_task = ko.observable(false);
    this.lists = ko.mapping.fromJS([]);
    this.selected_list = ko.observable();
    this.set_token = function(key) {
      return taskk_api.set_token(key);
    };
    this.check_key = function() {
      var ping;
      ping = taskk_api.ping();
      ping.success(function(data) {
        _this.show_login(false);
        _this.show_create_task(true);
        _this.load_lists();
      });
      ping.error(function(data) {
        _this.log_out();
      });
    };
    this.log_out = function() {
      $("#login_loader").hide();
      _this.show_create_task(false);
      _this.show_login(true);
      $("#username").focus();
      $("#username").removeAttr('disabled');
      $("#password").removeAttr('disabled');
      localStorage.removeItem("api_key");
      localStorage.removeItem("selected_list");
    };
    this.load_lists = function() {
      var get_lists;
      get_lists = taskk_api.get_lists();
      get_lists.success(function(data) {
        ko.mapping.fromJS(data, _this.lists);
        $("#select_list").trigger("liszt:updated");
      });
      get_lists.error(function(data) {
        alert("uh oh! couldn't load your lists!");
      });
    };
    this.log_in = function() {
      var login, password, username;
      username = $("#username").val();
      password = $("#password").val();
      $("#username").attr("disabled", "disabled");
      $("#password").attr("disabled", "disabled");
      $("#submit").hide();
      $("#login_loader").show();
      login = taskk_api.login(username, password);
      login.success(function(data) {
        localStorage.api_key = data.token;
        taskk_api.set_token(data.token);
        _this.show_login(false);
        _this.show_create_task(true);
        _this.load_lists();
      });
      login.error(function(data) {
        $("#submit").show();
        $("#login_loader").hide();
        $("#username").removeAttr('disabled');
        $("#password").removeAttr('disabled');
        $("#message_login").fadeIn('fast').delay('2000').fadeOut('fast');
      });
    };
  };

}).call(this);