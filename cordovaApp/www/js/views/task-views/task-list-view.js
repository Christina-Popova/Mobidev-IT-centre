define([
    'views/abstract-view',
    'views/task-views/task-view',
    'models/task-model'
], function (AbstractView, TaskView, Task) {

    var TaskListView = AbstractView.extend({

        tagName: 'ul',
        id: 'tasks-list',

        initialize: function() {
            this.collection.on('add', this.addOne, this);
            Parse.Events.on('change: filter', this.filter, this);
        },

        render: function() {
            this.reset();
            this.getData();
            return this;
        },

        reset: function(){
            this.$el.empty();
            this.collection.reset();
        },

        getData:function (){
            var query = this.createQuery();
            query.find({
                success: function(results) {
                    _.each(results, function(value) {
                        this.collection.add(value);
                    }, this);
                }.bind(this)
            });
        },

        createQuery: function () {
            var user = new Parse.Query(Task);
            user.equalTo('user', Parse.User.current());
            var share = new Parse.Query(Task);
            share.equalTo("share", Parse.User.current());
            return Parse.Query.or(user, share);
        },

        filter: function (filter){
            this.$el.empty();
            if (filter === "all") {
                this.addSome(this.collection.models);
                return;
            }
            var flag = filter === "completed" ;
            var filteredCollection = _.filter(this.collection.models, function(item){
                return item.get('isComplete') === flag;
            });
            this.addSome(filteredCollection);
        },

        addSome: function(filteredCollection) {
            _.each(filteredCollection, function(item){
                this.addOne(item)
            }, this);
        },

        addOne: function(task) {
            var taskList = new TaskView({ model: task });
            this.$el.prepend(taskList.render().el);
        }
    });

    return TaskListView;
});



