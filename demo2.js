
var App = {
	models : {},
	views : {},
	collections : {}
};
var template = function(id){
	return _.template($('#' + id).html());
};

App.models.Task = Backbone.Model.extend();
App.views.Tasks = Backbone.View.extend({
	initialize : function(){
		this.collection.on('add', this.addOne, this);
	},
	tagName : 'ul',
	render : function(){
		this.collection.each(this.addOne,this);
		return this;
	},
	addOne : function(task){
		var taskView = new App.views.Task({model : task});
		this.$el.append(taskView.render().el);
	}
});
App.views.Task = Backbone.View.extend({
	initialize : function(){
		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
	},
	template : template('taskTemplate'),
	tagName : 'li',
	events : {
		'click .edit' : 'edit',
		'click .delete' : 'destroy'
	},
	edit : function(){
		var temp = prompt('what ?', this.model.get('title'));
		if(!$.trim(temp)) return;
		this.model.set('title', temp);
	},
	destroy : function(){
		this.model.destroy();
	},
	remove : function(){
		this.$el.remove();
	},
	render : function(){
		var template = this.template(this.model.toJSON());
		this.$el.html(template);
		return this;
	}
});
App.collections.Task = Backbone.Collection.extend({
	model : App.models.Task
});

var taskCollection = new App.collections.Task([
	{
		title : 'go to school'
	},
	{
		title : 'go to bed'
	},
	{
		title : 'go to the lib'
	}
]);
var taskCollections = new App.views.Tasks({collection : taskCollection});

App.views.AddTask = Backbone.View.extend({
	el : '#form',
	events : {
		'submit' : 'submit'
	},
	submit : function(e){
		e.preventDefault();
		var taskTitle = $(e.target).find(':input').val();
		var task = new App.models.Task({title : taskTitle});
		this.collection.add(task);
	}
});
var newTask = new App.views.AddTask({collection : taskCollection});

$('.task').html(taskCollections.render().el);