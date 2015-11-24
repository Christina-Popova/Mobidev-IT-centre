



(function() {


    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Helper: {}
    };


    Parse.initialize("kbGqvtthGHcJtxulUtMXwHvULR1ORorGCCci8i4O", "61EgD1NeVAKFuE8IZwe6Vd1cXTigNl1cExolTYbB");



    //_______________________Helpers_____________________

    App.Helper.template = function(id){
        return _.template($('#' + id).html());
    };

    App.vent = _.extend({}, Parse.Events);



    //_______________________Models_____________________

    App.Models.Task =  Parse.Object.extend("Task", {
        defaults: {
            isComplete: false
        },

        validate: function(attrs) {
            if (!($.trim(attrs.title))) {
                return "Title can't be empty";
            }
        },

        toggleStatus: function() {
            this.get('isComplete') ? this.set('isComplete', false) : this.set('isComplete', true);
            this.save();
        }
    });



    //_______________________Collections_____________________


    App.Collections.TaskList = Parse.Collection.extend({
        model: App.Models.Task,
        initialize: function() {
            App.vent.on('addNewTask', this.addTask, this);
            //App.vent.on('logout', this.reset, this);
            App.vent.on('login', this.setUser, this);
        },

        setUser: function(user){
            this.user = user;
        },

        addTask: function(task){
            var task = new App.Models.Task(task);
            task.set({user: this.user});
            this.add(task);
            task.save();
        }
    });



    //______________________model View_____________________

    App.Views.TaskView = Parse.View.extend({
        tagName: "li",

        template: App.Helper.template('task-template'),

        initialize: function() {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
            this.model.on('error', this.showErrors, this);
        },

        events: {
            'click .status-toggle': 'toggleStatus',
            'click .edit': 'edit',
            'click .delete': 'destroy',
            'click .save': 'save',
            'click .cansel': 'cancel'
        },

        showErrors: function(model, error) {
            this.$el.append("<div class='error'>"+ error + "</div>");
        },

        hideErrors: function(){
            this.$el.find('.error').text('');
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.showStatus();
            return this;
        },

        toggleStatus: function() {
            this.model.toggleStatus();
            this.showStatus();
        },

        showStatus: function (){
            this.model.get('isComplete') ? this.$el.addClass('complete') : this.$el.removeClass('complete');
        },

        edit: function() {
            this.template = App.Helper.template('edit-template');
            this.render();
        },

        save: function(e) {
            this.hideErrors();
            var res = this.model.set({title: this.$el.find('input:text').val()}, {validate: true});

            if(res){
                this.model.save();
                this.cancel();
            }
        },

        cancel: function(e) {
            this.template = App.Helper.template('task-template');
            this.render();
        },

        destroy: function() {
            this.model.destroy();
        },

        remove: function() {
            this.$el.remove();
        }

    });


    //______________________collection View_____________________

    App.Views.TaskListView = Parse.View.extend({
        tagName: 'ul',
        id: 'tasks-list',

        initialize: function() {
            this.$el.hide();
            this.collection.on('add', this.addOne, this);
            App.vent.on('login', this.login, this);
            App.vent.on('logout', this.logout, this);
        },

        login: function(user){
            this.user = user;
            this.collection.reset();
            this.render();
            this.toggle();

        },

        logout: function(user){
            this.toggle();
        },

        toggle:function(){
            this.$el.toggle();
        },

        clear: function (){
            this.$el.empty();
        },

        render: function() {
            this.clear();
            console.log(this.user);
            if(!this.user){
                return this;
            }

            var query = new Parse.Query(App.Models.Task);
            query.equalTo('user', this.user);

            query.find({
                success: function(results) {
                    _.each(results, function(value, key) {
                        this.collection.add(value);
                    }, this);
                }.bind(this)
            });
            return this;
        },

        addOne: function(task) {
            var taskList = new App.Views.TaskView({ model: task });
            this.$el.append(taskList.render().el);
        }

    });


    //______________________new task View_____________________

    App.Views.AddNewTask = Parse.View.extend({
        template: App.Helper.template('form-template'),


        initialize: function() {
            this.$el.hide();
            App.vent.on('login', this.toggle, this);
            App.vent.on('logout', this.toggle, this);
        },

        toggle:function(){
            this.$el.toggle();
        },

        events: {
            'submit': 'submit'
        },

        render: function (){
            this.$el.html(this.template());
            return this;
        },

        clear: function (){
            this.$el.find('.task').val("");
        },

        submit: function(e) {
            e.preventDefault();
            var task = {title: this.$el.find('.task').val()};
            App.vent.trigger('addNewTask', task);
            this.clear();
        }

    });


    //______________________signUp View_____________________

    App.Views.SignUp = Parse.View.extend({
        template: App.Helper.template('signUp-template'),

        events: {
            'submit': 'signUp'
        },

        render: function (){
            this.$el.addClass('signUp-mode');
            this.$el.html(this.template());
            return this;
        },

        signUp: function(e) {
            e.preventDefault();
            this.hideErrors();

            var user = new Parse.User();
            user.set({
                username: this.$el.find("#signUp-form").find('.login').val(),
                password: this.$el.find("#signUp-form").find('.password').val()});

            user.signUp(null, {
                success: function (){
                    alert('Resgistration success!');
                    this.$el.remove();
                    Parse.User.logOut();
                }.bind(this),
                error:   this.showError.bind(this)
            });

        },

        showError: function(user, error){
            this.$el.append("<div class='error'>"+ error.message + "</div>");
        },

        hideErrors: function(){
            this.$el.find('.error').text('');
        }
    });


    //______________________logIn, logOut View_____________________

    App.Views.LogInOutForm = Parse.View.extend({
        template: App.Helper.template('login-template'),

        events: {
            'submit #login-form': 'login',
            'click .logOut': 'logOut',
            'click .signUp': 'signUp',
            'blur input': 'hideErrors'

        },

        initialize: function () {
            App.vent.on('login', this.render, this);
            App.vent.on('logout', this.render, this);

            if(Parse.User.current()){
                this.successLogin(Parse.User.current());
            } else this.render();
        },

        render: function (){
            this.$el.html(this.template());
            return this;
        },


        login: function(e) {
            e.preventDefault();
            this.hideErrors();

            var login = this.$el.find("#login-form").find('.login').val();
            var password = this.$el.find("#login-form").find('.password').val();

            Parse.User.logIn(login, password, {
                success: function (){
                    var user = Parse.User.current();
                    this.successLogin(user);
                }.bind(this),
                error:   this.showError.bind(this)
            });
        },

        signUp: function(e) {
            //lockScreen();
            var signUp = new App.Views.SignUp ();
            $(".wrapper").append(signUp.render().el);
        },

        successLogin: function(user){
            this.template = App.Helper.template('logout-template');
            App.vent.trigger('login', user);
        },

        showError: function(user, error){
            this.$el.append("<div class='error'>"+ error.message + "</div>");
        },

        hideErrors: function(){
            this.$el.find('.error').text('');
        },

        logOut: function(){
            Parse.User.logOut();
            this.template = App.Helper.template('login-template');
            App.vent.trigger('logout');
        }
    });



    //__________________________________________



    var taskList = new App.Collections.TaskList();
    var taskListView = new App.Views.TaskListView({collection: taskList});
    var addNewTaskView = new App.Views.AddNewTask();

    $('.wrapper').append(addNewTaskView.render().el);
    $('.wrapper').append(taskListView.render().el);

    var loginForm = new App.Views.LogInOutForm();
    $('.wrapper').append(loginForm.el);

})();