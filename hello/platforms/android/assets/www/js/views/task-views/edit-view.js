define([
    'views/abstract-view',  'text!templates/edit-template.tpl'], function (AbstractView, EditTemplate) {

    var EditView = AbstractView.extend({

        template: _.template(EditTemplate),
        className: 'edit-mode',

        events: {
            'click .save': 'save',
            'click .edit-cancel': 'cancel',
            'click .share': 'share',
            "keypress .item" : "updateOnEnter"
        },

        render: function (){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        save: function() {
            this.hideError();
            var res = this.model.set({title: this.$el.find('input:text').val()}, {validate: true}, {silent:true});
            if(res){
                this.model.save();
                this.cancel();
            }
        },

        cancel: function() {
            this.unlockScreen();
            this.$el.remove();
        },

        share: function () {
            this.cancel();
            Parse.Events.trigger('model:share', this.model);
            Parse.history.navigate("share", true);
        },

        updateOnEnter: function(e) {
            if (e.keyCode == 13) this.save();
        }


    });

    return EditView;
});





