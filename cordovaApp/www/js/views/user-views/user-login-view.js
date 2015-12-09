define([
    'views/abstract-view',
    'views/user-views/user-signup-view',
    'text!templates/login-template.tpl'
], function (AbstractView, SignUpView, LoginTemplate) {

    var LogInView = AbstractView.extend({

        template: _.template(LoginTemplate),
        el: "#login-block",

        events: {
            'submit #login-form': 'login',
            'click .signUp': 'signUp'
        },

        render: function (){
            this.$el.html(this.template());
            return this;
        },

        login: function(e) {
            e.preventDefault();
            this.hideError();
            this.readData();
            Parse.User.logIn(this.userName, this.password, {
                success: function (){
                    Parse.history.navigate("/todo/" + Parse.User.current().id, true);
                }.bind(this),
                error:   this.showError.bind(this)
            });
        },

        readData: function(){
            this.userName = this.$el.find("#login-form").find('.login').val();
            this.password = this.$el.find("#login-form").find('.password').val();
        },

        signUp: function() {
            Parse.history.navigate("signup", true);
        },

        successLogin: function(){
            Parse.history.navigate("/todo/" + Parse.User.current().id, true);
        }

    });

    return LogInView;
});




