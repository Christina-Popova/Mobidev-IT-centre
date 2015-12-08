define([
    'views/abstract-view',
    'text!templates/form-template.tpl'
], function (AbstractView, FormTemplate) {

    var TaskFormView = AbstractView.extend({

        template: _.template(FormTemplate),

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
            this.hideError();
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
            this.showError(task, errors);
        },

        clear: function (){
            this.$el.find('.task').val("");
        },

        blur: function (){
            this.hideError();
        }
    });

    return TaskFormView;
});



