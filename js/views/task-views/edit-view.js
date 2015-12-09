define([
    'views/abstract-view',
    'text!templates/edit-template.tpl',
    'text!templates/share-template.tpl',
    'text!templates/success-share-template.tpl',
    'models/task-model'
], function (AbstractView, EditTemplate, ShareTemplate, SuccessShareTemplate, Task) {

    var EditView = AbstractView.extend({

        template: _.template(EditTemplate),
        className: 'edit-mode',

        events: {
            'click .save': 'save',
            'click .edit-cancel': 'cancel',
            'click .share': 'share',
            "keypress .item" : "updateOnEnter",
            'submit': 'submit',
            'click .share-cancel': 'cancel',
            'click .share-ok': 'saveShare'
        },

        render: function (){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        save: function() {
            this.hideError();
            var res = this.model.set({title: this.$el.find('input:text').val()}, {validate: true});
            if(res){
                this.model.save();
                this.cancel();
            }
        },

        cancel: function() {
            this.unlockScreen();
            this.$el.parents().removeClass('editing');
            this.$el.remove();
        },

        updateOnEnter: function(e) {
            if (e.keyCode == 13) this.save();
        },

        share: function () {
            this.template =  _.template(ShareTemplate);
            this.render();
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

        saveShare: function(){
            var relation =  this.model.relation("share");
            relation.add(this.user);
            this.model.save('isShare', true);
            this.cancel();
        }

    });

    return EditView;
});





