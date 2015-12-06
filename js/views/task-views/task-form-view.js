define(['views/abstract-view'], function (AbstractView) {

    var TaskFormView = AbstractView.extend({

        //template: this.compileTemplate('form-template'),
        template: _.template($('#form-template').html()),

        events: {
            'submit': 'submit',
            'blur form' : 'blur'
        },

        render: function (){
            this.$el.html(this.template());
            return this;
        },

        submit: function(e) {
            e.preventDefault();
            this.hideError.bind(this)();
            this.readData();
            if(!this.isDataValid()){
                this.errorMessage(this.task);
            } else {
                Parse.Events.trigger('addNewTask', this.task);
            }
        },

        readData: function(){
            this.task = {title: this.$el.find('.task').val()};
            this.clear();
        },

        isDataValid: function(){
            return ($.trim(this.task.title));
        },

        errorMessage: function(task){
            var errors = {};
            errors.message = "Title can't be empty";
            this.showError.bind(this)(task, errors);
        },

        clear: function (){
            this.$el.find('.task').val("");
        },

        blur: function (){
            this.hideError.bind(this)();
        }
    });

    return TaskFormView;
});



