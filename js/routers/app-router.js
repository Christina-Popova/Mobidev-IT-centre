define([
    'views/app-view'
], function (AppView) {

    var AppRouter = Parse.Router.extend({
        routes: {
            "": "index",
            'todo/:id' : 'todo'
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

        todo: function () {
            if(!Parse.User.current()){
                Parse.history.navigate("", true);
                return;
            }
            this.contentView.open('todo');
        }
    });

    return AppRouter;
});






