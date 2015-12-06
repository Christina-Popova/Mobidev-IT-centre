define(['views/abstract-view'], function (AbstractView) {

    var LogOut = AbstractView.extend({

        //template: this.compileTemplate('logout-template'),
        template: _.template($('#logout-template').html()),

        events: {
            'click .logOut': 'logOut'
        },

        render: function (){
            this.$el.html(this.template());
            return this;
        },

        logOut: function(){
            Parse.User.logOut();
            Parse.history.navigate("", true);
        }
    });

    return LogOut;
});

