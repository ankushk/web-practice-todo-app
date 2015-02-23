$(document).ready(function(){
  console.log("In TODO app");

  // task-list: {"/id": {"desc": description, "completed": boolean}}
  // task-order: [];

  var testObject = { 'one': 1, 'two': 2, 'three': 3 };

  // Put the object into storage
  localStorage.setItem('testObject', JSON.stringify(testObject));

  // Retrieve the object from storage
  var retrievedObject = localStorage.getItem('testObject');

  console.log('retrievedObject: ', JSON.parse(retrievedObject));

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
    task_order = JSON.parse(localStorage['task-order']);
    console.log("Old order:" + task_order);
    task_order.splice(ui.item.index(), 0, task_order.splice(ui.oldindex, 1)[0]);
    console.log("New order:" + task_order);
    localStorage['task-order'] = JSON.stringify(task_order);
  });

  function escapeHTML(unsafe_str) {
    return unsafe_str
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
      task_id = parseInt($(this).parent().attr('task-id'));
      console.log(task_id);

      task_order = JSON.parse(localStorage['task-order']);
      task_list = JSON.parse(localStorage['task-list']);

      var index = task_order.indexOf(task_id);
      if (index > -1) {
        task_order.splice(index, 1);
      }
      delete task_list[task_id];
      localStorage['task-list'] = JSON.stringify(task_list);
      localStorage['task-order'] = JSON.stringify(task_order);
      loadTasks();
      e.preventDefault();
    });

    $('input[type="checkbox"]').click(function(e) {
      task_id = parseInt($(this).parent().attr('task-id'));      
      console.log(task_id);

      task_list = JSON.parse(localStorage['task-list']);
      if (task_list[task_id]['completed']) {
        task_list[task_id]['completed'] = false;
      } else {
        task_list[task_id]['completed'] = true;
      }
      localStorage['task-list'] = JSON.stringify(task_list);
      loadTasks();
      e.preventDefault();
    });

  }

  function loadTasks() {
    task_order = JSON.parse(localStorage['task-order']);
    task_list = JSON.parse(localStorage['task-list']);

    var i;
    $('#task-ul').empty();
    for (i = 0; i < task_order.length; ++i) {
      task_id = task_order[i];
      task = task_list[task_id];

      if(task['completed']) {
        $('#task-ul').append("<li class='list-group-item' task-id='" + task_id + "'>" + "<input type='checkbox' value='' class='cbox' checked><s>" + task.desc  + "</s><a href=#><span class='glyphicon glyphicon-remove pull-right' href='#'></a></span></li>");
      } else {
        $('#task-ul').append("<li class='list-group-item' task-id='" + task_id + "'>" + "<input type='checkbox' value='' class='cbox'>" + task.desc  + "<a href=#><span class='glyphicon glyphicon-remove pull-right' href='#'></a></span></li>");
      }
    }
    $('.sortable').sortable();
    bindEvent();
  }

  $('#create-task-form').submit(function(event) {
    console.log("Task crete function");
    if ($('#create-task-area').val() === '') {
      alert("Error: Empty task can't be created");
      return;
    }

    if(typeof localStorage['task-list'] === "undefined" || localStorage['task-list'] == null) {
      console.log('Task list is null');
      localStorage['id-counter'] = JSON.stringify({'id' : 0});
      // localStorage['task-list'] = JSON.stringify({});
      // var task-order = [];

      var task_list = {};
      var task_order = [];
      
      task = {};
      task['desc'] = escapeHTML($('#create-task-area').val());
      task['completed'] = false;

      id_obj = JSON.parse(localStorage['id-counter']);
      current_id = id_obj['id'];

      localStorage['id-counter'] = JSON.stringify({'id' : current_id + 1});
      task_list[current_id] = task;
      localStorage['task-list'] = JSON.stringify(task_list);
      task_order.push(current_id);     
      localStorage['task-order'] = JSON.stringify(task_order);
    } else {
      console.log("Else loop");
      task = {};
      task['desc'] = escapeHTML($('#create-task-area').val());
      task['completed'] = false;

      id_obj = JSON.parse(localStorage['id-counter']);
      current_id = id_obj['id'];
      localStorage['id-counter'] = JSON.stringify({'id' : current_id + 1});

      task_list = JSON.parse(localStorage['task-list']);
      task_list[current_id] = task;
      localStorage['task-list'] = JSON.stringify(task_list);

      task_order = JSON.parse(localStorage['task-order']);
      task_order.unshift(current_id);     
      localStorage['task-order'] = JSON.stringify(task_order);

    }
    // logDebug();
    loadTasks();
    $('#create-task-area').val('');
    event.preventDefault();
  });

  loadTasks();
});