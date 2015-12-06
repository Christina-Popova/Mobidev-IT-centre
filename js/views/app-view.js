define([
    'views/abstract-view',
    'views/user-views/user-login-view',
    'views/task-views/tasks-manage-view'
], function (AbstractView, LoginView, ManageTasksView) {

    var AppView = AbstractView.extend({

        template: _.template($('#app-template').html()),
        el: ".content",

        pageList: {
            index: new LoginView,
            todo:  new ManageTasksView
        },

        open: function(viewName){
            this.close();
            var view = this.pageList[viewName].render();
            view.$el.appendTo(this.$el);
        },

        close: function (){
            _.each(this.pageList, function(page) {
                page.$el.detach();
            }, this);
        }
    });

    return AppView;
});


