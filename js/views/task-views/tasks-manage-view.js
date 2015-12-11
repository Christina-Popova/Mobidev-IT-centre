define([
    'collections/task-collection',
    'views/abstract-view',
    'views/task-views/task-form-view',
    'views/task-views/tasks-tools-view',
    'views/task-views/task-list-view',
    'views/task-views/tasks-filters-view',
    'views/user-views/user-logout-view',
    'jquery',
    'hammerjs', 'jqueryhammer'
], function (TaskList, AbstractView, TaskFormView, ToolsView, TaskListView, FiltersView, LogOutView, $, Hammer) {

    var ManageTasksView = AbstractView.extend({
        el: "#manage-block",

        initialize: function () {
            //this.$el.hammer();

            var mc = new Hammer.Manager(this.el);

            mc.add( new Hammer.Swipe({ direction: Hammer.DIRECTION_ALL, threshold:50, velocity:0.5}));

            mc.on("swipeup", this.showEl.bind(this));
            mc.on("swipedown", this.hideEl.bind(this));


            this.collection = new TaskList;
            this.taskFormView = new TaskFormView();
            this.toolsView = new ToolsView();
            this.taskListView = new TaskListView({collection: this.collection});
            this.filtersView =new FiltersView();
            this.logOutView = new LogOutView();
        },

        events: {
            //'panup': 'showEl'
            //'pandown': 'showEl'
        },

        render: function () {
            this.$el.append(this.logOutView.render().el);
            this.$el.append(this.filtersView.render().el);
            this.$el.append(this.toolsView.render().el);
            this.$el.append(this.taskListView.render().el);
            this.$el.append(this.taskFormView.render().el);
            return this;
        },

        showEl: function() {
            console.log('up');
            this.taskFormView.$el.css({height:42});
        },

        hideEl: function() {
            console.log('down');
            this.taskFormView.$el.css({height:0});
        }
    });

    return ManageTasksView;
});


