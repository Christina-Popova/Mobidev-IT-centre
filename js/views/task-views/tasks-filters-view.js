define([
    'views/abstract-view', 'text!templates/filter-template.tpl'], function (AbstractView, FilterTemplate) {

    var FiltersView = AbstractView.extend({

        template: _.template(FilterTemplate),

        id: 'filter',

        events: {
            'click ': 'changeFilter'
        },

        render: function (){
            this.$el.html(this.template());
            return this;
        },

        changeFilter: function(e){
            $(e.target).parent().children().removeClass('selected');
            $(e.target).addClass('selected');
            Parse.Events.trigger('change: filter',  $(e.target).attr("id"))
        }
    });

    return FiltersView;
});





