(function(window){
window.App = {
	models : {},
	views : {},
	collections : {}
};
var template = function (id){
	return _.template($('#' + id).html());
};
App.models.Task = Backbone.Model.extend();
App.views.Tasks = Backbone.View.extend({
	tagName : 'ul',
	initialize : function(){
		this.collection.on('add',this.addOne, this);
	},
	render : function(){
		this.collection.each(this.addOne,this);
		return this;
	},
	addOne : function(task){
		var taskview = new App.views.Task({model : task});
		this.$el.append(taskview.render().el);
	}
});
App.views.Task = Backbone.View.extend({
	template : template('taskTemplate'),
	tagName : 'li',
	initialize : function (){
		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
	},
	events : {
		'click .edit' : 'edit',
		'click .delete' : 'destroy'
	},
	destroy : function(){
		this.model.destroy();
	},
	remove : function(){
		this.el.parentNode.removeChild(this.el);
	},
	edit : function(){
		var tmp = prompt('what ?', this.model.get('title'));
		if(!$.trim(tmp)) return;
		this.model.set('title', tmp);
	},
	render : function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});
App.collections.Task = Backbone.Collection.extend({
	model : App.models.Task
});
var taskCollection = new App.collections.Task([
	{
		'title' : 'go to lib'
	},
	{
		'title' : 'go to lab'
	},
	{
		'title' : 'go to dinner'
	}
]);
App.views.addTask = Backbone.View.extend({
	el : '#form',
	initialize : function(){
	},
	events : {
		'submit' : 'submit'
	},
	submit : function(e){
		e.preventDefault();
		var titles = $(e.target).find('input').val();
		var task = new App.models.Task({title : titles});
		this.collection.add(task);
	}
});

var addnew = new App.views.addTask({collection: taskCollection});

window.taskCollections = new App.views.Tasks({collection : taskCollection});

$('.task').html(taskCollections.render().el);
})(window);