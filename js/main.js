



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

    App.Helper.lockScreen = function() {
        $("body").prepend("<div class='overlay'></div>");
        $(".overlay").css({
            "position": "absolute",
            "width": $(document).width(),
            "height": $(document).height(),
            "z-index": 2,
            "background-color": "grey",
            "opacity": 0.4

        }).hide().fadeIn();
    };
    App.Helper.unlockScreen = function() {
        $("body").find('.overlay').remove();
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
            this.set('isComplete', !this.get('isComplete'));
            this.save();
        }
    });



    //_______________________Collections_____________________


    App.Collections.TaskList = Parse.Collection.extend({
        model: App.Models.Task,
        initialize: function() {
            App.vent.on('addNewTask', this.addTask, this);
            App.vent.on('logout', this.reset, this);
            App.vent.on('login', this.setUser, this);
        },

        setUser: function(user){
            this.user = user;
        },

        addTask: function(task){
            task = new App.Models.Task(task);
            this.add( task.set({user: this.user}));
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
            'click .edit-cancel': 'cancel',
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.showStatus();
            return this;
        },

        showErrors: function(model, error) {
            this.$el.append("<div class='error'>"+ error + "</div>");
        },

        hideErrors: function(){
            this.$el.find('.error').remove();
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
            this.collection.on('add', this.addOne, this);
            App.vent.on('login', this.login, this);
            App.vent.on('logout', this.logout, this);
        },

        login: function(user){
            this.render(user);
            this.$el.show();
        },

        logout: function(){
            this.$el.hide();
        },

        clear: function (){
            this.$el.empty();
        },

        render: function(user) {
            if(!user){
                return this;
            }

            this.clear();
            var query = new Parse.Query(App.Models.Task);
            query.equalTo('user', user);
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
            this.$el.prepend(taskList.render().el);
        }

    });


    //______________________new task View_____________________

    App.Views.AddNewTask = Parse.View.extend({
        template: App.Helper.template('form-template'),


        initialize: function() {
            this.$el.hide();
            App.vent.on('login', this.toggleShow, this);
            App.vent.on('logout', this.toggleShow, this);
        },

        events: {
            'submit': 'submit'
        },

        render: function (){
            this.$el.html(this.template());
            return this;
        },

        submit: function(e) {
            e.preventDefault();
            var task = {title: this.$el.find('.task').val()};
            App.vent.trigger('addNewTask', task);
            this.clear();
        },

        toggleShow:function(){
            this.$el.toggle();
        },

        clear: function (){
            this.$el.find('.task').val("");
        }

    });


    //______________________signUp View_____________________

    App.Views.SignUp = Parse.View.extend({
        template: App.Helper.template('signUp-template'),

        events: {
            'submit': 'signUp',
            'click .signup-cancel': 'cancel',
            'click .btn-login': 'login',
            'blur input': 'hideErrors'
        },

        render: function (){
            this.$el.addClass('signUp-mode');
            this.$el.html(this.template());
            return this;
        },

        signUp: function(e) {
            e.preventDefault();
            this.user = new Parse.User();
            this.user.set({
                username: this.$el.find("#signUp-form").find('.login').val(),
                password: this.$el.find("#signUp-form").find('.password').val()
            });
            this.user.signUp(null, {
                success: function (){
                    this.template = App.Helper.template('successSignUp-template');
                    this.render();
                }.bind(this),
                error:   this.showError.bind(this)
            });
        },

        login: function(){
            this.cancel();
            App.vent.trigger('login', this.user);
        },

        cancel: function (){
            App.Helper.unlockScreen();
            this.$el.remove();
        },

        showError: function(user, error){
            this.$el.append("<div class='error'>"+ error.message + "</div>");
        },

        hideErrors: function(){
            this.$el.find('.error').remove();
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
            App.vent.on('login', this.successLogin, this);

            if(Parse.User.current()){
                App.vent.trigger('login', Parse.User.current());
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
                    App.vent.trigger('login', Parse.User.current());
                }.bind(this),
                error:   this.showError.bind(this)
            });
        },

        signUp: function(e) {
            App.Helper.lockScreen();
            var signUp = new App.Views.SignUp ();
            $(".container").append(signUp.render().el);
        },

        logOut: function(){
            Parse.User.logOut();
            App.vent.trigger('logout');

            this.template = App.Helper.template('login-template');
            this.render();

        },

        successLogin: function(){
            this.template = App.Helper.template('logout-template');
            this.render();
        },

        showError: function(user, error){
            this.$el.append("<div class='error'>"+ error.message + "</div>");
        },

        hideErrors: function(){
            this.$el.find('.error').remove();
        }

    });


    //__________________________________________



    var taskList = new App.Collections.TaskList();
    var taskListView = new App.Views.TaskListView({collection: taskList});
    var addNewTaskView = new App.Views.AddNewTask();

    $('.container').append(addNewTaskView.render().el);
    $('.container').append(taskListView.render().el);

    var loginForm = new App.Views.LogInOutForm();
    $('.container').append(loginForm.el);

})();