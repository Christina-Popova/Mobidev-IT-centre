define([
    'views/abstract-view',
    'views/task-views/edit-view',
    'text!templates/task-template.tpl',
    'jquery',
    'hammerjs', 'jqueryhammer'

], function (AbstractView, EditView, TaskTemplate, $) {

    var TaskView = AbstractView.extend({

        tagName: "li",
        className: 'task-item',
        template: _.template(TaskTemplate),

        initialize: function() {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
            this.model.on('error', this.showError, this);
            Parse.Events.on('clearCompleted', this.clearCompleted, this);
            this.$el.on( 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', this.destroy.bind(this));
            this.$el.hammer({threshold:50, velocity:0.5});
        },

        events: {
            'click .status-toggle': 'toggleStatus',
            'click span': 'edit',
            'swiperight': 'animate'
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
            this.$el.after(editView.render().el);
        },

        animate: function() {
            console.log('swiperight')
            this.$el.css({height:0, left: this.$el.width()});
        },

        destroy:function() {
            console.log('destroy');
            this.model.destroy();
        },

        remove: function() {
            this.$el.remove();
            Parse.Events.off('clearCompleted', this.clearCompleted, this);
        },

        clearCompleted:function () {
            return this.model.get('isComplete') ? this.animate() : false;
        }
    });

    return TaskView;
});
