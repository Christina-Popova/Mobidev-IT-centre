define(['views/abstract-view'], function (AbstractView) {

    var FiltersView = AbstractView.extend({

        template: _.template($('#filter-template').html()),

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





