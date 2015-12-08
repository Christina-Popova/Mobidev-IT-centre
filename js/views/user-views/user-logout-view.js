define(['views/abstract-view', 'text!templates/logout-template.tpl'], function (AbstractView, LogOutTemplate) {

    var LogOut = AbstractView.extend({

        template: _.template(LogOutTemplate),

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

