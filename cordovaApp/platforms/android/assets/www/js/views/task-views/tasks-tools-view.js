define(['views/abstract-view', 'text!templates/tools-template.tpl'], function (AbstractView, ToolsTemplate) {

    var ToolsView = AbstractView.extend({

        template: _.template(ToolsTemplate),
        id: 'tools',

        events: {
            'click .all-complete': 'allCompleted',
            'click .clear-completed': 'clearCompleted'
        },

        render: function (){
            this.$el.html(this.template());
            return this;
        },

        allCompleted: function(e){
            Parse.Events.trigger('allCompleted',  $(e.target).prop('checked'));
        },

        clearCompleted: function(){
            Parse.Events.trigger('clearCompleted')
        }
    });

    return ToolsView;
});

