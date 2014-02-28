jQuery(function($){

  window.Todo = Backbone.Model.extend({
    defaults: {
      done: false
    },

    toggle: function(){
      this.save({done: !this.get('done')})
    }
  })

  window.TodoList = Backbone.Collection.extend({
    model: Todo,

    localStorage: new Store('todos'),

    done: function(){
      return this.filter(function(todo){
        return todo.get('done')
      })
    },

    remaining: function(){
      return this.without.apply(this, this.done())
    }
  })

  window.Todos = new TodoList

  window.TodoView = Backbone.View.extend({

    tagName: 'li',

    template: _.template( $('#item-template').html()),

    events: {
      'change .check': 'toggleDone',
      'dblclick .todo-content': 'edit',
      'click .todo-destroy': 'destroy',
      'keypress .todo-input': 'updateOnEnter',
      'blur .todo-input': 'close'
    },

    initialize: function(){
      _.bindAll(this, 'render', 'close', 'remove', 'edit')
      this.model.bind('change', this.render)
      this.model.bind('destroy', this.remove)
    },

    render: function(){
      var element = this.template(this.model.toJSON())
      $(this.el).html(element)
      this.input = this.$('.todo-input')
      return this
    },

    toggleDone: function(){
      this.model.toggle()
    },

    edit: function(){
      this.$el.addClass('editing')
      this.input.focus()
    },

    close: function(e){
      this.model.save({content: this.input.val()})
      this.$el.removeClass('editing')
    },

    updateOnEnter: function(e){
      if(e.keyCode === 13) e.target.blur()
    },

    remove: function(){
      this.$el.remove()
    },

    destroy: function(){
      this.model.destroy()
    }
  })

  window.AppView = Backbone.View.extend({
    el: $('#todoapp'),

    template: _.template( $('#stats-template').html() ),

    events: {
      'keypress #new-todo': 'createOnEnter',
      'click .todo-clear a': 'clearCompleted'
    },

    initialize: function(){
      _.bindAll(this, 'addOne', 'addAll', 'render')

      this.input = this.$('#new-todo')

      Todos.bind('add', this.addOne)
      Todos.bind('refresh', this.addAll)
      Todos.bind('all', this.render)

      Todos.fetch()
    },

    render: function(){
      var done = Todos.done().length
      var element = this.template({
        total:      Todos.length,
        done:       Todos.done().length,
        remaining:  Todos.remaining().length
      })
      this.$('#todo-stats').html(element)
    },

    addOne: function(todo){
      var view = new TodoView({model: todo})
      this.$('#todo-list').append(view.render().el)
    },

    addAll: function(){
      Todos.each(this.addOne)
    },

    createOnEnter: function(e){
      if (e.keyCode != 13) return

      var value = this.input.val()
      if ( !value ) return
        
      Todos.create({content: value})
      this.input.val('')
    },

    clearCompleted: function(){
      _.each(Todos.done(), function(todo){
        todo.destroy()
      })

      return false
    }
  })

  window.App = new AppView
})