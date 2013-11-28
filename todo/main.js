(function(){

var app = {
  Models: {},
  Views : {},
  Collections: {}
}
var template = function(ele){
  return _.template($('#' + ele).html())
}

app.Models.Person = Backbone.Model.extend({
  defaults: {
    name : 'John Doe',
    age  : 20,
    occupation: 'web developer'
  }
})

app.Views.Person = Backbone.View.extend({
  tagName : 'li',
  template: template('personTemp'),
  initialize: function(){
    this.render()
  },
  render: function(){
    this.$el.html( this.template(this.model.toJSON()) )
    return this
  }
})

app.Views.People = Backbone.View.extend({
  tagName : 'ul',
  initialize: function(){
    this.render()
  },
  render: function(){
    this.collection.each(function(person){
      var view = new app.Views.Person({model: person})
      this.$el.append(view.el)
    }, this)
    return this
  }
})

app.Collections.People = Backbone.Collection.extend({
  model: app.Models.Person
})

var peopleCollection = new app.Collections.People([
  {
    name : 'luck',
    age  : 19
  },
  {
    name : 'Lucy',
    age  : 20,
    occupation: 'graphic designer'
  },
  {
    name : 'lily',
    age  : 21,
    occupation: 'web designer'
  }
])

var peopleView = new app.Views.People({
  collection: peopleCollection
})

$(document).ready(function(){
  $(document.body).append(peopleView.el)
})

}())