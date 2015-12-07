define([
    'views/abstract-view'
], function (AbstractView) {

    var ShareView = AbstractView.extend({

        template: _.template($('#share-template').html()),
        className: 'share-mode',

        events: {
            'submit': 'submit',
            'click .share-cancel': 'cancel',
            'click .btn-continue': 'cancel'
        },

        render: function () {
            this.$el.html(this.template());
            return this;
        },

        submit: function (e) {
            e.preventDefault();
            this.hideError.bind(this);

            var query = new Parse.Query(Parse.User);
            query.equalTo('email', this.$el.find('.email').val());
            query.first({
                success: function (result) {
                    return result ? this.successShare(result) : this.errorMessage();
                }.bind(this),
                error: this.showError.bind(this)
            });
        },

        errorMessage: function () {
            var errors = {};
            errors.message = 'User with this email does not exist!';
            this.showError.bind(this)(this.model, errors);
        },

        successShare: function (user) {
            var relation = this.model.relation("share");
            relation.add(user);
            this.model.set('isShare', true);
            this.model.save();
            this.template = _.template($('#successShare-template').html()),
            this.$el.html(this.template({user: user.get('username')}));
        },

        cancel: function () {
            this.unlockScreen();
            this.$el.remove();
        }
    });

    return ShareView;
});


