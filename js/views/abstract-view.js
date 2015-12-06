define([], function () {

    var AbstractView = Parse.View.extend({

        compileTemplate: function(id){
            return _.template($('#' + id).html());
        },

        lockScreen: function() {
            $("body").prepend("<div class='overlay'></div>");
            $(".overlay").css({
                "position": "absolute",
                "width": $(document).width(),
                "height": $(document).height(),
                "z-index": 2,
                "background-color": "grey",
                "opacity": 0.4
            }).hide().fadeIn();
        },

        unlockScreen:function() {
            $("body").find('.overlay').remove();
        },

        showError: function(model, error){
            this.$el.find('.error').html(error.message);
        },

        hideError: function(){
            this.$el.find('.error').html("").show();
        }
    });

    return AbstractView;

});