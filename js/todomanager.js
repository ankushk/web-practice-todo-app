$(document).ready(function() {

  // task-list: {"/id": {"desc": description, "completed": boolean}}
  // task-order: [];

  $('.sortable').sortable().bind('sortupdate', function(e, ui) {
    /*

    This event is triggered when the user stopped sorting and the DOM position has changed.

    ui.item contains the current dragged element.
    ui.item.index() contains the new index of the dragged element
    ui.oldindex contains the old index of the dragged element
    ui.startparent contains the element that the dragged item comes from
    ui.endparent contains the element that the dragged item was added to

    */
    console.log("Sort Update");
    var taskOrder = JSON.parse(localStorage['task-order']);
    taskOrder.splice(ui.item.index(), 0, taskOrder.splice(ui.oldindex, 1)[0]);
    console.log("New order:" + taskOrder);
    localStorage['task-order'] = JSON.stringify(taskOrder);
  });

  function escapeHTML(unsafeStr) {
    return unsafeStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&#39;');
  }

  function logDebug() {
    console.log('--------------localStorage --------------------');
    if (typeof localStorage['id-counter'] !== "undefined") {
      console.log('id: ', JSON.parse(localStorage['id-counter']));
    }
    if (typeof localStorage['task-list'] !== "undefined") {
      console.log('task-list: ', JSON.parse(localStorage['task-list']));
    }
    if (typeof localStorage['task-order'] !== "undefined") {
      console.log('task-order: ', JSON.parse(localStorage['task-order']));
    }
  }

  function bindEvent() {
    $("a").click(function(e) {
      taskId = parseInt($(this).parent().attr('task-id'));
      console.log(taskId);

      var taskOrder = JSON.parse(localStorage['task-order']);
      taskList = JSON.parse(localStorage['task-list']);

      var index = taskOrder.indexOf(taskId);
      if (index > -1) {
        taskOrder.splice(index, 1);
      }
      delete taskList[taskId];
      localStorage['task-list'] = JSON.stringify(taskList);
      localStorage['task-order'] = JSON.stringify(taskOrder);
      loadTasks();
      e.preventDefault();
    });

    $('input[type="checkbox"]').click(function(e) {
      taskId = parseInt($(this).parent().attr('task-id'));
      console.log(taskId);

      taskList = JSON.parse(localStorage['task-list']);
      if (taskList[taskId]['completed']) {
        taskList[taskId]['completed'] = false;
      } else {
        taskList[taskId]['completed'] = true;
      }
      localStorage['task-list'] = JSON.stringify(taskList);
      loadTasks();
      e.preventDefault();
    });

  }

  function loadTasks() {
    var taskOrder = JSON.parse(localStorage['task-order']);
    var taskList = JSON.parse(localStorage['task-list']);

    $('#task-ul').empty();
    for (var i = 0; i < taskOrder.length; ++i) {
      taskId = taskOrder[i];
      task = taskList[taskId];

      if (task['completed']) {
        $('#task-ul').append("<li class='list-group-item' task-id='" + taskId + "'>" + "<input type='checkbox' value='' class='cbox' checked><s>" + task.desc  + "</s><a href=#><span class='glyphicon glyphicon-remove pull-right' href='#'></a></span></li>");
      } else {
        $('#task-ul').append("<li class='list-group-item' task-id='" + taskId + "'>" + "<input type='checkbox' value='' class='cbox'>" + task.desc  + "<a href=#><span class='glyphicon glyphicon-remove pull-right' href='#'></a></span></li>");
      }
    }
    $('.sortable').sortable();
    bindEvent();
  }

  $('#create-task-form').submit(function(event) {
    if ($('#create-task-area').val() === '') {
      alert("Error: Empty task can't be created");
      return;
    }

    if (typeof localStorage['task-list'] === "undefined" || localStorage['task-list'] === null) {
      localStorage['id-counter'] = JSON.stringify({'id' : 0});

      var taskList = {};
      var taskOrder = [];

      var task = {};
      task['desc'] = escapeHTML($('#create-task-area').val());
      task['completed'] = false;

      counterObj = JSON.parse(localStorage['id-counter']);
      currentId = counterObj['id'];

      localStorage['id-counter'] = JSON.stringify({'id' : currentId + 1});
      taskList[currentId] = task;
      localStorage['task-list'] = JSON.stringify(taskList);
      taskOrder.push(currentId);
      localStorage['task-order'] = JSON.stringify(taskOrder);
    } else {
      var task = {};
      task['desc'] = escapeHTML($('#create-task-area').val());
      task['completed'] = false;

      counterObj = JSON.parse(localStorage['id-counter']);
      currentId = counterObj['id'];
      localStorage['id-counter'] = JSON.stringify({'id' : currentId + 1});

      var taskList = JSON.parse(localStorage['task-list']);
      taskList[currentId] = task;
      localStorage['task-list'] = JSON.stringify(taskList);

      var taskOrder = JSON.parse(localStorage['task-order']);
      taskOrder.unshift(currentId);
      localStorage['task-order'] = JSON.stringify(taskOrder);
    }
    // logDebug();
    loadTasks();
    $('#create-task-area').val('');
    event.preventDefault();
  });

  loadTasks();
});
