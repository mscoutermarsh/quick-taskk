// Generated by CoffeeScript 1.4.0
(function() {

  $(document).ready(function() {
    var enter_estimate, enter_title, reset_fields,
      _this = this;
    reset_fields = function() {
      ViewModel.show_loader(false);
      ViewModel.task_title('');
      ViewModel.task_estimate('');
      ViewModel.show_title(true);
      return $('#task_title').focus();
    };
    enter_title = function() {
      if (ViewModel.task_title.isValid()) {
        ViewModel.show_title(false);
        ViewModel.show_estimate(true);
        $("#estimate").focus();
      } else {
        $("#message_error").text("This is required");
        $("#message_error").fadeIn('fast').delay('2750').fadeOut('fast');
      }
    };
    enter_estimate = function() {
      var new_task;
      if (ViewModel.task_estimate.isValid()) {
        ViewModel.show_estimate(false);
        ViewModel.show_loader(true);
        new_task = taskk_api.create_task(ViewModel.task_title, ViewModel.task_estimate, ViewModel.selected_list);
        localStorage.selected_list = ViewModel.selected_list;
        new_task.success(function(data) {
          reset_fields();
          $("#message").text("Task created!");
          $("#message").fadeIn('fast').delay('2000').fadeOut('fast');
          $("#task_title").focus();
          return false;
        });
        new_task.error(function(data) {
          reset_fields();
          $("#message_error").text("Error! Task couldn't be created!");
          $("#message_error").fadeIn('fast').delay('2750').fadeOut('fast');
          return false;
        });
      } else {
        $("#message_error").text("format: 5m or 2h");
        $("#message_error").fadeIn('fast').delay('2750').fadeOut('fast');
      }
    };
    window.ViewModel = new QuickTaskk;
    window.taskk_api = new TaskkAPI;
    ko.validation.configure({
      registerExtenders: true,
      messagesOnModified: false,
      insertMessages: false,
      messageTemplate: null
    });
    $("#message").hide();
    $("#message_login").hide();
    $("#message_error").hide();
    $(".chzn-select").chosen();
    ko.applyBindings(ViewModel);
    if (localStorage.api_key) {
      ViewModel.set_token(localStorage.api_key);
      ViewModel.check_key();
    } else {
      $("#login_loader").hide();
      $("#username").focus();
      ViewModel.show_login(true);
    }
    if (localStorage.selected_list) {
      ViewModel.selected_list = localStorage.selected_list;
    }
    $(document).keypress(function(e) {
      if (e.which === 13) {
        if (ViewModel.show_title()) {
          enter_title();
        } else if (ViewModel.show_estimate()) {
          enter_estimate();
        }
      }
    });
  });

}).call(this);
