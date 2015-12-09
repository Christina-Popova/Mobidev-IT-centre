define(['parse'], function (Parse) {

    var AbstractView = Parse.View.extend({

        lockScreen: function() {
            $("body").prepend("<div class='overlay'></div>");
            $(".overlay").css({
                "width": $(document).width(),
                "height": $(document).height()
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