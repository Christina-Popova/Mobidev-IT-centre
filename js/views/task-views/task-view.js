define([
    'views/abstract-view',
    'views/task-views/task-share-view'
], function (AbstractView, ShareView) {

    var TaskView = AbstractView.extend({

        tagName: "li",
        template: _.template($('#task-template').html()),

        initialize: function() {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
            this.model.on('error', this.showError, this);
            Parse.Events.on('clearCompleted', this.clearCompleted, this);
        },

        events: {
            'click .status-toggle': 'toggleStatus',
            'click .edit': 'edit',
            'click .delete': 'destroy',
            'click .save': 'save',
            'click .edit-cancel': 'cancel',
            'click .share': 'share',
            "keypress .item" : "updateOnEnter"
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.showStatus();
            this.showShareStatus();
            return this;
        },

        toggleStatus: function() {
            this.model.toggleStatus();
            this.showStatus();
        },

        showStatus: function (){
            this.model.get('isComplete') ? this.$el.addClass('complete') : this.$el.removeClass('complete');
        },

        showShareStatus: function(){
            this.model.get('isShare') ? this.$el.addClass('shared') : this.$el.removeClass('shared');
        },

        edit: function() {
            this.template = _.template($('#edit-template').html());
            this.render();
            this.$el.find('.item').focus();
        },

        save: function() {
            this.hideError.bind(this)();
            var res = this.model.set({title: this.$el.find('input:text').val()}, {validate: true}, {silent:true});
            if(res){
                this.model.save();
                this.cancel();
            }
        },

        cancel: function() {
            this.template = _.template($('#task-template').html());
            //this.template = this.compileTemplate('task-template');
            this.render();
        },

        updateOnEnter: function(e) {
            if (e.keyCode == 13) this.save();
        },

        destroy: function() {
            this.model.destroy();
        },

        remove: function() {
            this.$el.remove();
            Parse.Events.off('clearCompleted', this.clearCompleted, this);
        },

        share: function () {
            this.lockScreen();
            var shareView = new ShareView({model: this.model});
            $(".content").append(shareView.render().el);
        },

        clearCompleted:function () {
            return this.model.get('isComplete') ? this.destroy() : false;
        }
    });

    return TaskView;
});
