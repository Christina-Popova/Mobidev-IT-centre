define([
    'models/task-model',
    "3p/parse"
], function (Task) {

    var TaskList = Parse.Collection.extend({
        model: Task,

        initialize: function() {
            Parse.Events.on('addNewTask', this.addTask, this);
            Parse.Events.on('allCompleted', this.allCompleted, this);
        },

        allCompleted: function (flag){
            this.each(function(task){
                task.save({isComplete: flag})
            }, this)
        },

        addTask: function(task){
            task = new Task(task);
            if(!task.isValid()){
                return;
            }
            task.save({user: Parse.User.current()});
            this.add(task);
        }
    });

    return TaskList;
});



