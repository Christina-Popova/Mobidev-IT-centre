define([
    'views/abstract-view',
    'text!templates/share-template.tpl',
    'text!templates/success-share-template.tpl'
], function (AbstractView, ShareTemplate, SuccessShareTemplate) {

    var ShareView = AbstractView.extend({

        template: _.template(ShareTemplate),
        el:  '#share-block',

        events: {
            'submit': 'submit',
            'click .share-cancel': 'cancel',
            'click .btn-continue': 'cancel'
        },

        initialize: function(){
            Parse.Events.on('model:share', this.setModel, this);
        },

        setModel: function (model) {
            this.model = model;
        },

        render: function () {
            this.$el.html(this.template());
            return this;
        },

        submit: function (e) {
            e.preventDefault();
            this.hideError();

            var query = new Parse.Query(Parse.User);
            query.equalTo('email', this.$el.find('.email').val());
            query.first({
                success: function (result) {
                    return result ? this.successShare(result) : this.errorMessage('User with this email does not exist!');
                }.bind(this),
                error: this.showError.bind(this)
            });
        },

        errorMessage: function (mes) {
            var errors = {};
            errors.message = mes;
            this.showError(this.model, errors);
        },

        successShare: function (user) {
            this.user = user;
            if(this.userCheck()){
                return;
            }
            var relation = this.model.relation("share");
            relation.add(user);
            this.model.save('isShare', true);
            this.viewSuccessTemplate();
        },

        userCheck: function(){
            if(this.user.id === Parse.User.current().id){
                this.errorMessage("You can't share task for youself!");
                return true;
            }
        },

        viewSuccessTemplate: function(){
            this.template = _.template(SuccessShareTemplate);
            this.$el.html(this.template({user: this.user.get('username')}));
        },

        cancel: function () {
            Parse.history.navigate("/todo/" + Parse.User.current().id, true);
            this.template = _.template(ShareTemplate);
        }
    });

    return ShareView;
});


