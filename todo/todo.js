// global namespace
var App = {
	view : {},
	model: {},
	collection:{},
	helper:{},
	total : 0,
	undone : 0
};
App.helper.template = function(id){
	return _.template($('#'+id).html());
};
App.helper.vent = _.extend({}, Backbone.Events);


//	model
App.model.todo = Backbone.Model.extend();

//	ul view
App.view.ul = Backbone.View.extend({
	tagName : 'ul',
	initialize : function(){
		this.collection.on('add', this.addOne, this);
		App.helper.vent.on('checkall', this.checkall, this);
	},
	render : function(){
		this.collection.each(this.addOne, this);
		return this;
	},
	addOne : function(todo){
		var view = new App.view.li({model: todo});
		this.$el.append(view.render().el);
		App.helper.vent.trigger('add');
	},
	checkall : function(bool){
		this.collection.each(function(todo){
			todo.trigger((bool ? '' : 'un') + 'done');
		},this);
	}
});

//	li view
App.view.li = Backbone.View.extend({
	initialize : function(){
		_.bindAll(this, 'remove', 'done', 'undone');
		this.model.on('destroy', this.remove);
		this.model.on('done', this.done);
		this.model.on('undone', this.undone);
	},
	tagName : 'li',
	events : {
		'click a' : 'destroy',
		'click input' : 'check'
	},
	check : function(){
		this.checkbox = this.$('input');
		var bool = this.checkbox.prop('checked');
		if(bool){
			this.model.trigger('done');
			App.helper.vent.on('done');
		} else {
			this.model.trigger('undone');
			App.helper.vent.on('undone');
		}
	},
	done : function(){
		this.$('input').prop('checked', true);
		this.$('p').addClass('del');
		App.helper.vent.trigger('done');
	},
	undone : function(){
		this.$('input').prop('checked', false);
		this.$('p').removeClass('del');
		App.helper.vent.trigger('undone');
	},
	destroy : function(){
		this.model.destroy();
		App.helper.vent.trigger('remove');
	},
	remove : function(){
		this.$el.remove();
	},
	template : App.helper.template('todoTemplate'),
	render : function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

//	collection
App.collection.list = Backbone.Collection.extend({
	model : App.model.todo
});


//	formview
App.model.formview = Backbone.View.extend({
	el : '#form',
	events : {
		'submit' : 'addTask'
	},
	addTask : function(e){
		e.preventDefault();
		var title = this.$('input').val();
		if($.trim(title)){
			var todo = new App.model.todo({title : title});
			this.collection.add(todo);
		}
		this.el.reset();
	}
});

//	viewer
App.view.viewer = Backbone.View.extend({
	el : '#viewer',
	initialize : function(){
		App.helper.vent.on('add', this.show, this);
		App.helper.vent.on('remove', this.hide, this);
	},
	show : function(){
		var num = this.collection.length;
		num === 1 && this.$el.show();
	},
	hide : function(){
		var num = this.collection.length;
		!num && this.$el.hide();
	},
	events : {
		'click' : 'checkall'
	},
	checkall : function(){
		var bool = this.$('input').prop('checked');
		App.helper.vent.trigger('checkall', bool);
	}
});

//	total
App.view.total = Backbone.View.extend({
	el : '#total',
	initialize : function(){
		App.helper.vent.on('add', this.show, this);
		App.helper.vent.on('remove', this.hide, this);
		App.helper.vent.on('done', this.done, this);
		App.helper.vent.on('undone', this.undone, this);
	},
	show : function(){
		var num = this.collection.length;
		num === 1 && this.$el.show();
		App.total ++;
		App.undone ++;
		this.$('.total').text(App.total);
	},
	hide : function(){
		var num = this.collection.length;
		!num && this.$el.hide();
		this.$('.total').text(App.total);
	},
	done : function(){
		App.undone --;
		this.$('.undone').text(App.undone);
	},
	undone : function(){
		App.undone ++;
		this.$('.undone').text(App.undone);
	}
});


//	create instance
var list = new App.collection.list;
var ul = new App.view.ul({collection : list});
var viewer = new App.view.viewer({collection : list});
var total = new App.view.total({collection : list});
var formview = new App.model.formview({collection : list});
$('#list').html(ul.render().el);
