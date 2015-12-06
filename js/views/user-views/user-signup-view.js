define([
    'views/abstract-view'
], function (AbstractView) {

    var SignUp = AbstractView.extend({

        //template: this.compileTemplate('signUp-template'),
        template: _.template($('#signUp-template').html()),

        className: 'signUp-mode',

        events: {
            'submit': 'signUp',
            'click .signup-cancel': 'cancel',
            'click .btn-login': 'login'
        },

        render: function (){
            this.$el.html(this.template());
            return this;
        },

        signUp: function(e) {
            this.hideError.bind(this)();
            e.preventDefault();
            this.setData();
            this.user.signUp(null, {
                success: function (){
                    this.template = _.template($('#successSignUp-template').html());
                    //this.template = this.compileTemplate('successSignUp-template');
                    this.render();
                }.bind(this),
                error:   this.showError.bind(this)
            });
        },

        setData: function(){
            this.user = new Parse.User();
            this.user.set({
                username: this.$el.find("#signUp-form").find('.login').val(),
                password: this.$el.find("#signUp-form").find('.password').val(),
                email: this.$el.find("#signUp-form").find('.email').val()
            });
        },

        login: function(){
            this.cancel();
            Parse.history.navigate("/todo/" + Parse.User.current().id, true);
        },

        cancel: function (){
            this.unlockScreen();
            this.$el.remove();
        }
    });

    return SignUp;
});
