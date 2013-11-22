
var Person = Backbone.Model.extend({
  defaults: {
    name : 'Doe',
    age: 28,
    occupation: 'worker'
  }
})


var PersonView = Backbone.View.extend({
  tagName: 'li',
  
  template: _.template($('#personTemp').html()),

  initialize: function(){
    this.render()
  },

  render: function(){
    this.$el.html(this.template(this.model.toJSON()))
  }
})

var person = new Person
var personView = new PersonView({
  model : person
})