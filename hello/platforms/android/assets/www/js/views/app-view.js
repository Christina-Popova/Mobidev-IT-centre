define([
    'views/abstract-view',
    'views/user-views/user-login-view',
    'views/user-views/user-signup-view',
    'views/task-views/tasks-manage-view',
    'views/task-views/task-share-view',
    'views/task-views/task-share-view'
], function (AbstractView, LoginView, SignUp, ManageTasksView, ShareView) {

    var AppView = AbstractView.extend({

        el: ".content",

        pageList: {
            index: new LoginView,
            signup: new SignUp,
            todo:  new ManageTasksView,
            share: new ShareView
        },

        open: function(viewName){
            this.close();
            var view = this.pageList[viewName].render();
            view.$el.appendTo(this.$el).hide().fadeIn();

        },

        close: function (){
            _.each(this.pageList, function(page) {
                page.$el.detach();
            }, this);
        }
    });

    return AppView;
});


