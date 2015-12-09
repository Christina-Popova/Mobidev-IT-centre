define([
    'views/abstract-view',
    'views/user-views/user-login-view',
    'views/user-views/user-signup-view',
    'views/task-views/tasks-manage-view'
], function (AbstractView, LoginView, SignUp, ManageTasksView) {

    var AppView = AbstractView.extend({

        el: ".content",

        pageList: {
            index:  new LoginView,
            signup: new SignUp,
            todo:   new ManageTasksView
        },

        open: function(viewName){
            this.close();
            var view = this.pageList[viewName].render();
            view.$el.appendTo(this.$el).fadeIn(500);

        },

        close: function (){
            _.each(this.pageList, function(page) {
                page.$el.hide().detach();
            }, this);
        }
    });

    return AppView;
});


