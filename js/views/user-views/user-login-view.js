define([
    'views/abstract-view',
    'views/user-views/user-signup-view'
], function (AbstractView, SignUpView) {

    var LogInView = AbstractView.extend({

        //template: this.compileTemplate('login-template'),
        template: _.template($('#login-template').html()),
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
            this.hideError.bind(this)();
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
            this.clear();
            this.lockScreen();
            var signUp = new SignUpView;
            this.$el.append(signUp.render().el);
        },

        clear: function() {
            this.hideError.bind(this)();
            this.$el.find('input:not([type=submit])').val("");
        },

        successLogin: function(){
            Parse.history.navigate("/todo/" + Parse.User.current().id, true);
        }

    });

    return LogInView;
});




