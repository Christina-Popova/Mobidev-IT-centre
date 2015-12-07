define(['parse'], function (Parse) {

    var Task =  Parse.Object.extend("Task", {
        defaults: {
            isComplete: false,
            isShare: false
        },

        validate: function(attrs) {
            var errors = {};
            if (!($.trim(attrs.title))) {
                errors.message = "Title can't be empty";
                return errors;
            }
        },

        toggleStatus: function() {
            this.save('isComplete', !this.get('isComplete'));
        }
    });

    return Task;
});


