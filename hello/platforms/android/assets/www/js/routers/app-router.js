define([
    'views/app-view'
], function (AppView) {

    var AppRouter = Parse.Router.extend({
        routes: {
            ""         : "index",
            'signup'   : 'signup',
            'todo/:id' : 'todo',
            'share'    : 'share'
        },

        initialize: function(){
            this.contentView = new AppView;
        },

        index: function () {
            if(Parse.User.current()){
                Parse.history.navigate("/todo/" + Parse.User.current().id, true);
                return;
            }
            this.contentView.open('index');
        },

        signup: function () {
            this.contentView.open('signup');
        },

        todo: function () {
            if(!Parse.User.current()){
                Parse.history.navigate("", true);
                return;
            }
            this.contentView.open('todo');
        },

        share: function(){
            this.contentView.open('share');
        }
    });

    return AppRouter;
});






