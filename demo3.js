
var template = function(id){
	return _.template($('#'+id).html());
};
var Model = Backbone.Model.extend();
var CollectionView = Backbone.View.extend({
	initialize : function(){
		this.collection.on('add', this.addOne,this);
	},
	tagName : 'ul',
	render : function(){
		this.collection.each(this.addOne, this);
		return this;
	},
	addOne : function(model){
		var view = new View({model : model});
		this.$el.append(view.render().el);
	}
})
var View = Backbone.View.extend({
	initialize : function(){
		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
	},
	template : template('taskTemplate'),
	tagName : 'li',
	events :{
		'click .edit' : 'edit',
		'click .delete' : 'destroy'
	},
	destroy : function(){
		this.model.destroy();
	},
	remove : function(){
		this.$el.remove();
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

var Collection = Backbone.Collection.extend({
	model : Model
});

var collection = new Collection([
	{
		'title' : 'go to the store'
	},
	{
		'title' : 'go to the lab'
	},
	{
		'title' : 'go to school'
	},
	{
		'title' : 'go to bed'
	}
]);
var collectionView = new CollectionView({collection : collection});

$('.task').html(collectionView.render().el);

var Forms = Backbone.View.extend({
	el : '#form',
	events : {
		'submit' : 'submit'
	},
	submit : function(e){
		e.preventDefault();
		var title = $(e.target).find(':input').val();
		var model = new Model({title : title});
		this.collection.add(model);
		this.el.reset();
		console.log(this.el)
	}
});
var form = new Forms({collection : collection});