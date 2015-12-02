(function() {

    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Helper: {},
        Router: {}
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

    App.Helper.showError = function(model, error){
        this.$el.find('.error').html(error.message);
    };

    App.Helper.hideError =  function(){
        this.$el.find('.error').html("").show();
    };

    App.vent = _.extend({}, Parse.Events);


    //_______________________Models_____________________

    App.Models.Task =  Parse.Object.extend("Task", {
        defaults: {
            isComplete: false
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


    //_______________________Collections_____________________

    App.Collections.TaskList = Parse.Collection.extend({
        model: App.Models.Task,

        initialize: function() {
            App.vent.on('addNewTask', this.addTask, this);
            App.vent.on('login', this.reset, this);
        },

        addTask: function(task){
            console.log('add');
            task = new App.Models.Task(task);
            if(!task.isValid()){
                return;
            }
            task.save({user: Parse.User.current()});
            this.add(task);
        }
    });


    //______________________model View_____________________

    App.Views.TaskView = Parse.View.extend({
        tagName: "li",

        template: App.Helper.template('task-template'),

        initialize: function() {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
            this.model.on('error', App.Helper.showError, this);
        },

        events: {
            'click .status-toggle': 'toggleStatus',
            'click .edit': 'edit',
            'click .delete': 'destroy',
            'click .save': 'save',
            'click .edit-cancel': 'cancel',
            'click .share': 'share'
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.showStatus();
            this.showShareStatus();
            return this;
        },

        toggleStatus: function() {
            this.model.toggleStatus();
            this.showStatus();
        },

        showStatus: function (){
            this.model.get('isComplete') ? this.$el.addClass('complete') : this.$el.removeClass('complete');
        },

        showShareStatus: function(){
            this.model.get('share') ? this.$el.addClass('shared') : this.$el.removeClass('shared');
        },

        edit: function() {
            this.template = App.Helper.template('edit-template');
            this.render();
        },

        save: function() {
            App.Helper.hideError.bind(this)();
            var res = this.model.set({title: this.$el.find('input:text').val()}, {validate: true}, {silent:true});
            if(res){
                this.model.save();
                this.cancel();
            }
        },

        cancel: function() {
            this.template = App.Helper.template('task-template');
            this.render();
        },

        destroy: function() {
            this.model.destroy();
        },

        remove: function() {
            this.$el.remove();
        },

        share: function () {
            App.Helper.lockScreen();
            var shareView = new App.Views.Share({model: this.model});
            $(".content").append(shareView.render().el);
        }
    });


    //______________________collection View_____________________

    App.Views.TaskListView = Parse.View.extend({
        tagName: 'ul',
        id: 'tasks-list',

        initialize: function() {
            this.collection.on('add', this.addOne, this);
        },

        render: function() {
            var owner = new Parse.Query(App.Models.Task);
            owner.equalTo('user', Parse.User.current());
            var share = new Parse.Query(App.Models.Task);
            share.equalTo('share', Parse.User.current().id);
            var both = Parse.Query.or(owner, share);
            both.find({
                success: function(results) {
                    _.each(results, function(value) {
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
            App.Helper.hideError.bind(this)();
            this.readData();
            if(!this.isDataValid()){
                this.errorMessage(this.task);
            } else {
                App.vent.trigger('addNewTask', this.task);
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
            App.Helper.showError.bind(this)(task, errors);
        },

        clear: function (){
            this.$el.find('.task').val("");
        },

        blur: function (){
            App.Helper.hideError.bind(this)();
        }
    });


    //______________________logIn View_____________________

    App.Views.LogIn = Parse.View.extend({
        template: App.Helper.template('login-template'),
        el: "#login-block",

        events: {
            'submit #login-form': 'login',
            'click .signUp': 'signUp'
        },

        initialize: function () {
            App.vent.on('login', this.successLogin, this);
        },

        render: function (){
            this.$el.html(this.template());
            return this;
        },

        login: function(e) {
            e.preventDefault();
            App.Helper.hideError.bind(this)();
            this.readData();
            Parse.User.logIn(this.userName, this.password, {
                success: function (){
                    App.vent.trigger('login');
                }.bind(this),
                error:   App.Helper.showError.bind(this)
            });
        },

        readData: function(){
            this.userName = this.$el.find("#login-form").find('.login').val();
            this.password = this.$el.find("#login-form").find('.password').val();
        },

        signUp: function() {
            this.clear();
            App.Helper.lockScreen();
            var signUp = new App.Views.SignUp ();
            this.$el.append(signUp.render().el);
        },

        clear: function() {
            App.Helper.hideError.bind(this)();
            this.$el.find('input:not([type=submit])').val("");
        },

        successLogin: function(){
            console.log('LOGIN');
            Parse.history.navigate("/todo/" + Parse.User.current().id, true);
        }
    });


    //______________________signUp View_____________________

    App.Views.SignUp = Parse.View.extend({
        template: App.Helper.template('signUp-template'),
        className: 'signUp-mode',

        events: {
            'submit': 'signUp',
            'click .signup-cancel': 'cancel',
            'click .btn-login': 'login'
        },

        render: function (){
            this.$el.html(this.template());
            return this;
        },

        signUp: function(e) {
            App.Helper.hideError.bind(this)();
            e.preventDefault();
            this.setData();
            this.user.signUp(null, {
                success: function (){
                    this.template = App.Helper.template('successSignUp-template');
                    this.render();
                }.bind(this),
                error:   App.Helper.showError.bind(this)
            });
        },

        setData: function(){
            this.user = new Parse.User();
            this.user.set({
                username: this.$el.find("#signUp-form").find('.login').val(),
                password: this.$el.find("#signUp-form").find('.password').val(),
                email: this.$el.find("#signUp-form").find('.email').val()
            });
        },

        login: function(){
            this.cancel();
            App.vent.trigger('login');
        },

        cancel: function (){
            App.Helper.unlockScreen();
            this.$el.remove();
        }
    });


    //______________________share View_____________________

    App.Views.Share = Parse.View.extend({
        template: App.Helper.template('share-template'),
        className: 'share-mode',

        events: {
            'submit': 'submit',
            'click .share-cancel': 'cancel',
            'click .btn-continue': 'cancel'
        },

        render: function (){
            this.$el.html(this.template());
            return this;
        },

        submit: function(e) {
            e.preventDefault();
            App.Helper.hideError.bind(this);
            var query = new Parse.Query(Parse.User);
            query.equalTo('email', this.$el.find('.email').val());
            query.first({
                success: function(result) {
                    return result ?  this.successShare(result) :  this.errorMessage();
                }.bind(this),
                error:   App.Helper.showError.bind(this)
            });
        },

        errorMessage: function(){
            var errors= {};
            errors.message = 'User with this email does not exist!';
            App.Helper.showError.bind(this)(this.model, errors);
        },

        successShare: function(user){
            this.model.addUnique('share', user.id);
            this.model.save();
            this.template = App.Helper.template('successShare-template');
            this.$el.html(this.template({user: user.get('username')}));
        },

        cancel: function (){
            App.Helper.unlockScreen();
            this.$el.remove();
        }
    });


    //______________________logOut View_____________________

    App.Views.LogOut = Parse.View.extend({
        template: App.Helper.template('logout-template'),

        events: {
            'click .logOut': 'logOut'
        },

        render: function (){
            this.$el.html(this.template());
            return this;
        },

        logOut: function(){
            Parse.User.logOut();
            Parse.history.navigate("", true);
        }
    });


    //_______________ManageTodosView View_____________________

    App.Views.ManageTodosView = Parse.View.extend({
        template: App.Helper.template('app-template'),
        el: "#manage-block",

        initialize: function () {
            this.collection = new App.Collections.TaskList();
        },

        render: function () {

            this.$el.html(this.template());
            this.$el.append(new App.Views.AddNewTask().render().el);
            this.$el.append(new App.Views.TaskListView({collection:this.collection}).render().el);
            this.$el.append(new App.Views.LogOut().render().el);
            return this;
        }
    });


    //________________Content View_____________________

    App.Views.ContentView = Parse.View.extend({
        template: App.Helper.template('app-template'),
        el: ".content",

        pageList: {
            index:  new App.Views.LogIn(),
            todo: new App.Views.ManageTodosView()
        },

        open: function(viewName){
            this.close();
            var view = this.pageList[viewName].render();
            view.$el.appendTo(this.$el);
        },

        close: function (){
            _.each(this.pageList, function(page) {
                page.$el.detach();
            }, this);
        }
    });


    //_______________________Router_____________________

    App.Router.AppRouter = Parse.Router.extend({
        routes: {
            "": "index",
            'todo/:id' : 'todo'
        },

        index: function () {
            if(Parse.User.current()){
                App.vent.trigger('login');
                return;
            }
            content.open('index');
        },

        todo: function () {
            if(!Parse.User.current()){
                Parse.history.navigate("", true);
                return;
            }
            content.open('todo');
        }
    });

    var content = new App.Views.ContentView();
    new App.Router.AppRouter();

    Parse.history.start();

})();