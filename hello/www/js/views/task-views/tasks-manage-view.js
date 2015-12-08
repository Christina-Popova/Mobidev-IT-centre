define([
    'collections/task-collection',
    'views/abstract-view',
    'views/task-views/task-form-view',
    'views/task-views/tasks-tools-view',
    'views/task-views/task-list-view',
    'views/task-views/tasks-filters-view',
    'views/user-views/user-logout-view'
], function (TaskList, AbstractView, TaskFormView, ToolsView, TaskListView, FiltersView, LogOutView) {

    var ManageTasksView = AbstractView.extend({
        el: "#manage-block",

        initialize: function () {
            this.collection = new TaskList;
            this.taskFormView = new TaskFormView();
            this.toolsView = new ToolsView();
            this.taskListView = new TaskListView({collection: this.collection});
            this.filtersView =new FiltersView();
            this.logOutView = new LogOutView();
        },

        render: function () {
            this.$el.append(this.taskFormView.render().el);
            this.$el.append(this.toolsView.render().el);
            this.$el.append(this.taskListView.render().el);
            this.$el.append(this.filtersView.render().el);
            this.$el.append(this.logOutView.render().el);
            return this;
        }
    });

    return ManageTasksView;
});


