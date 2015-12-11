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
            this.$el.hammer({threshold:50, velocity:0.5});
        },

        events: {
            'click .status-toggle': 'toggleStatus',
            'click span': 'edit',
            'swiperight': 'destroy',
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
            //this.$el.addClass('editing');
            var editView = new EditView({model: this.model});
            this.$el.append(editView.render().el);
        },

        destroy: function() {

            var endTransition = function(){
                this.model.destroy();
            };
            this.$el.css({height:0, left: $(".wrapper").outerWidth()});
            this.el.addEventListener( 'webkitTransitionEnd', endTransition.bind(this) , false);
            this.el.addEventListener( 'transitionend',  endTransition.bind(this), false);
            this.el.addEventListener( 'OTransitionEnd', endTransition.bind(this), false);
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
