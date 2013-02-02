// Generated by CoffeeScript 1.4.0
(function() {

  $(document).ready(function() {
    var QuickTaskk, ViewModel, taskk_api;
    ko.validation.init();
    QuickTaskk = function() {
      var _this = this;
      this.api_key = ko.observable();
      this.default_list = ko.observable();
      this.task_estimate = ko.observable().extend({
        required: false,
        pattern: {
          message: "Incorrect format. Ex: 5m or 2h",
          params: "\d+(h\w*|m\w*)+"
        }
      });
      this.task_title = ko.observable().extend({
        required: true
      });
      this.username = ko.observable().extend({
        required: true
      });
      this.password = ko.observable().extend({
        required: true
      });
      this.show_login = ko.observable(false);
      this.show_create_task = ko.observable(false);
      this.lists = ko.mapping.fromJS([]);
      this.selected_list = ko.observable();
      this.check_key = function() {
        var ping;
        ping = taskk_api.ping();
        ping.success(function(data) {
          _this.show_login(false);
          _this.show_create_task(true);
          _this.load_lists();
        });
        ping.error(function(data) {
          $("#login_loader").hide();
          _this.show_login(true);
          $("#username").focus();
        });
      };
      this.load_lists = function() {
        var get_lists;
        get_lists = taskk_api.get_lists();
        get_lists.success(function(data) {
          ko.mapping.fromJS(data, _this.lists);
        });
        get_lists.error(function(data) {
          alert("uh oh! couldn't load your lists!");
        });
      };
      this.logged_in = function(key) {
        localStorage.api_key = key;
        _this.api_key = key;
        taskk_api.set_token(key);
        _this.check_key();
      };
    };
    ViewModel = new QuickTaskk;
    taskk_api = new TaskkAPI;
    ko.applyBindings(ViewModel);
    if (localStorage.api_key) {
      ViewModel.logged_in(localStorage.api_key);
    } else {
      $("#login_loader").hide();
      $("#username").focus();
      ViewModel.show_login(true);
    }
    $("#sign_in").submit(function() {
      var login, password, username;
      username = $("#username").val();
      password = $("#password").val();
      $("#username").attr("disabled", "disabled");
      $("#password").attr("disabled", "disabled");
      $("#submit").hide();
      $("#login_loader").show();
      login = taskk_api.login(username, password);
      login.success(function(data) {
        return ViewModel.logged_in(data.token);
      });
      login.error(function(data) {
        return alert("login failed dude");
      });
      return false;
    });
    $("#estimate").hide();
    $("#message").hide();
    $("#loader").hide();
    $(document).keypress(function(e) {
      var estimate, new_task, sel_list, title;
      if (e.which === 13) {
        if ($("#estimate").is(":visible")) {
          title = $("#task_title").val();
          estimate = $("#estimate").val();
          sel_list = ViewModel.selected_list;
          $("#estimate").hide();
          $("#loader").show();
          new_task = taskk_api.create_task(title, estimate, sel_list);
          new_task.success(function(data) {
            $("#loader").hide();
            $("#task_title").val('');
            $("#estimate").val('');
            $("#task_title").show();
            $('#task_title').focus();
            $("#message").text("Task created!");
            $("#message").fadeIn('fast').delay('2000').fadeOut('fast');
            return false;
          });
        } else if ($("#task_title").is(":visible")) {
          $("#task_title").hide();
          $("#estimate").show();
          $("#estimate").focus();
        }
      }
      return true;
    });
  });

}).call(this);
