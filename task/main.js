
(function(){
var App = {
  Models : {},
  Views : {},
  Collections : {}
}

var template = function(id){
  return _.template( $('#' + id).html() )
}


App.Models.Task = Backbone.Model.extend({
  initialize: function(){
    this.on('invalid', function(model, error, options){
      console.log(options)
    })
  },
  validate: function(attrs){
    if(! $.trim(attrs.title)){
      return 'invalide input'
    }
  }
})
App.Views.Task = Backbone.View.extend({
  tagName: 'li',
  initialize: function(){
    this.model.on('change', this.render, this)
    this.model.on('destroy', this.remove, this)
  },
  events: {
    'click .edit': 'edit',
    'click .delete': 'destroy'
  },
  destroy: function(){
    this.model.destroy()
  },
  remove: function(){
    this.$el.remove()
  },
  edit: function(){
    var taskTitle = prompt('what task title?', this.model.get('title'))
    this.model.set({'title': taskTitle},{validate: true})
  },

  template: template('taskTemplate'),

  render: function(){
    this.$el.html( this.template(this.model.toJSON()) )
    return this
  }
})

App.Views.Tasks = Backbone.View.extend({
  tagName: 'ul',
  initialize: function(){
    this.collection.on('add', this.addOne, this)
  },
  render: function(){
    this.collection.each(this.addOne, this)
    return this
  },
  addOne: function(task){
    var taskView = new App.Views.Task({model: task})
    this.$el.append(taskView.render().el)
  }
})

App.Collections.Task = Backbone.Collection.extend({
  model: App.Models.Task
})
window.tasksCollection = new App.Collections.Task([
  {
    title : 'go to the store',
    priority: 4
  },
  {
    title : 'go to the mall',
    priority: 3
  },
  {
    title : 'go to the party',
    priority: 5
  }
])

var tasksView = new App.Views.Tasks({collection: tasksCollection})

$('.task').html(tasksView.render().el)

App.Views.AddTask = Backbone.View.extend({
  el: '#addTask',
  events: {
    'submit': 'addTask'
  },
  addTask: function(e){ e.preventDefault()

    var title = this.$el.find('input').val()

    if( ! $.trim(title) ) return
    var task = new App.Models.Task({title: title})

    this.collection.add(task)
  }
})
var addTask = new App.Views.AddTask({collection: tasksCollection})

}())