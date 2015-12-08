define([
    'views/abstract-view',
    'views/task-views/task-share-view',
    'views/task-views/edit-view',
    'text!templates/task-template.tpl'
    //'text!templates/edit-template.tpl'
], function (AbstractView, ShareView, EditView, TaskTemplate) {

    var TaskView = AbstractView.extend({

        tagName: "li",
        template: _.template(TaskTemplate),

        initialize: function() {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
            this.model.on('error', this.showError, this);
            Parse.Events.on('clearCompleted', this.clearCompleted, this);
        },

        events: {
            'click .status-toggle': 'toggleStatus',
            'click .edit': 'edit',
            'click .delete': 'destroy'
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
            this.lockScreen();
            var editView = new EditView({model: this.model});
            console.log(this.el);
            this.$el.append(editView.render().el);
        },

        destroy: function() {
            this.model.destroy();
        },

        remove: function() {
            this.$el.remove();
            Parse.Events.off('clearCompleted', this.clearCompleted, this);
        },

        clearCompleted:function () {
            return this.model.get('isComplete') ? this.destroy() : false;
        }
    });

    return TaskView;
});
