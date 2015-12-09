define([
    'views/abstract-view',
    'text!templates/signup-template.tpl',
    'text!templates/success-signup-template.tpl'
], function (AbstractView, SignUp, SuccessSignUpTemplate) {

    var SignUpView = AbstractView.extend({

        template: _.template(SignUp),
        el: "#signup-block",

        //className: 'signUp-mode',

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
            this.hideError();
            e.preventDefault();
            this.setData();
            this.user.signUp(null, {
                success: function (){
                    this.template = _.template(SuccessSignUpTemplate);
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
            Parse.history.navigate("", true);
        }
    });

    return SignUpView;
});
